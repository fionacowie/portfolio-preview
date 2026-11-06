/* ==========================================================================================
   Postcard from Edinburgh · Play section · Fiona Cowie
   A shooting star writes the visitor's message over the Edinburgh skyline; three skies; share by link or video.

   How it fits the site
   - Everything lives inside one function, so nothing leaks into the page (no globals, no clashes with script.js).
   - The markup is built into <div data-postcard> (the snippet in index.html and postcard.html).
   - It builds its controls straight away (cheap, so the layout never jumps), but does the heavy set-up
     (stars, glow, Milky Way) only when the card is about a screen away, and pauses whenever it's off screen.
   - On postcard.html (data-share-view) a shared link (?postcard=<message>&sky=<1–3>) opens the postcard-only view.
   ========================================================================================== */
(() => {
  'use strict';
  const mount = document.querySelector('[data-postcard]');
  if (!mount) return;

  /* ------------------------------ settings ------------------------------ */
  // The page shared links open (relative to this page, so it works on the live site and when testing locally).
  // On the live site this becomes https://fionacowie.github.io/postcard.html
  const SHARE_PAGE = 'postcard.html';

  const SKY = {
    words: { greeting: 'Greetings from Edinburgh', budget: 'Greetings from Edinburgh!!', maxChars: 40 },
    twinkle: { speed: 3.2, shrink: .5, dim: .35, steady: .55, bySize: true, fps: 30 },
    faint:   { count: 900 },
    write:   { speed: 3.4 / 94, trail: 15, after: 30 },   // seconds per degree of Fiona's circle; dot trail after the words; how far the star flies on
    meteors: { every: 7, pairChance: 1/6, curve: 1, firstAfter: [.8, 1.6] },
    // the star writes the message again every time the postcard comes back into view after being completely out of
    // view, once at least half of it is showing. Never while someone is typing or sharing, never with reduced motion.
    replay:  { inView: .5 },
    grain:   { on: true, amount: .2, size: .5, roughness: 1 },
    milkyWay: { on: true, strength: .7 },
    tints:    { on: true, share: .33 },
    lowStars: { on: true, count: 150 },
    // 3:2 on desktop (all of Fiona's drawing plus a little sky), 2:3 on phones (trimmed round the Old Town)
    // letterPx: smallest capital height on screen, [landscape postcard, portrait (phone) postcard]
    view: { crop: 'city', skyTop: 37, maxHeight: 1152, belowDetail: 18, narrowGround: 1, letterPx: [20, 16], spiral: true },
    // pale light low behind the buildings: a wide soft ellipse centred on the city, just above the roofs (artboard units)
    paleGlow: { on: true, amount: .45, size: 210, whiten: .15, x: 800, y: 900, rx: 980 },
    // the three round buttons (chosen 6 Nov). Shared links carry only the button number, so change colours here.
    palettes: [
      { name: 'Night', top: '#063560', bottom: '#88CEC6', glow: '#ADFFE5', dark: '#004B91', land: '#002344' },
      { name: 'Lilac', top: '#16448A', bottom: '#E89DF5', glow: '#F7D5FF', dark: '#2B3E92', land: '#1F2448' },
      { name: 'Peach', top: '#491E82', bottom: '#E68E9E', glow: '#FFCACE', dark: '#3A3399', land: '#221D4A' }
    ]
  };

  // The card behind the postcard: a diagonal gradient (two colours) that shifts a little with the sky, plus grain.
  // Each style has a base pair and one pair per sky; `follow` (0–1) is how far the card moves from base towards the sky's pair.
  const CARD = {
    style: 'sky', follow: 1, grain: .3, grainSize: 160, frame: true,
    styles: {
      // Fiona's choice (6 Nov): pale, sky-tinted top-left into a bright blue, following the postcard's colours
      sky:      { name: 'Sky',       base: ['#F5FDFF', '#4D82FF'], skies: [['#CFEDEB', '#6AA8F7'], ['#F0DBFC', '#809BFF'], ['#F0D6DD', '#8298F0']] },
      cream:    { name: 'Cream',     base: ['#FBF9F5', '#F6F3EF'], skies: [['#EEF5F2', '#F8F6F1'], ['#F4EEF8', '#F8F5F4'], ['#FBEDE8', '#F9F5F1']] },
      peach:    { name: 'Peach',     base: ['#FFB9AE', '#FCE6E0'], skies: [['#FFB0A4', '#FDE4DC'], ['#FAB2D0', '#FCE3EE'], ['#FFC09A', '#FDE6D4']] },
      coral:    { name: 'Coral',     base: ['#FF8C7A', '#FFC9C7'], skies: [['#FF8F7E', '#FFD2CA'], ['#F790BE', '#FDD0E4'], ['#FF9A72', '#FFD4BE']] },
      lilac:    { name: 'Lilac-blue', base: ['#C79BF2', '#86A2EC'], skies: [['#A9A8F2', '#7DB4E6'], ['#D49AF0', '#9C9EEE'], ['#DC9CD6', '#9F9BE8']] },
      original: { name: 'Original',  base: ['#BEC7E3', '#C3D1DC'], skies: [['#BEC7E3', '#C3D1DC'], ['#C9C3E6', '#CBCCE0'], ['#D3C6DE', '#D1CCDC']] }
    }
  };

  const COPY = {
    placeholder: 'Type your own message in the sky',
    help: 'Up to 40 characters',
    received: 'Someone sent you a postcard from Edinburgh',
    writeOwn: 'Write your own',
    label: 'Postcard: a night sky over the Edinburgh skyline, where a shooting star writes',
    videoName: 'postcard-from-edinburgh',
    // on postcard.html only, under the postcard: who made it, and the way into the portfolio
    byline: 'A postcard by Fiona Cowie, product designer',
    portfolio: 'See my portfolio',
    portfolioHref: 'index.html'
  };

  // The web address, printed small on the dark ground like the credit line on a real postcard.
  // Only on the versions that travel: the video, and postcard.html (where shared links land). Not on the home page.
  const CREDIT = { text: 'fionacowie.github.io', inVideo: true, onSharePage: true, onScreen: false, opacity: .6 };

  // Fiona's skyline (artboard 1512 × 982), plus flat ground beyond her drawing on both sides
  const SKYLINE = 'M-237 378C-225.5 378-116.2 399.6-60 416.5C-56.9 417.4-51.1 421.1-43 427.1L-40.3 427.3L-37.2 428.3L-32.4 430.7L-22.4 437.3L-6.4 450.1L0.4 455.1L2.4 456L8.3 457L26.2 457.4L38.2 458.1L50.6 460L58.3 462L64.4 464.3L70.4 467.3L76.1 471L80.8 474.9L86 475.1L93.1 477L99.7 480.3L106.2 484L110.5 485.8L116.5 486.8L139.7 489.4L144.2 490.5L148.6 492.2L157.5 497.9L163.5 503L166.4 505.9L168.2 508.9L170.3 513.7L178 518.6L189 526.3L191.4 528.7L194.8 534L198.3 540.7L202.2 550.1L204.4 556.5L207.3 567.9L208.9 573L213.5 583.6L217.5 591.4L225.8 605.9L235.4 621L238.9 623.9L240.8 626.4L249.5 643L255.8 654.1L258.9 656.3L269.2 662L283.4 669.2L289.1 671.8L302.9 679.2L312.3 685.9L320.2 689.8L331.1 694.6L355.3 704.1L377.1 716.2L380.8 718.6L381.1 719.7L381.2 723.5L380.2 733L379.2 737.9L379.8 745.9L380.9 748.7L389.9 752.2L405.2 757.5L428.9 769.2L438.2 776.8L446 783.8L451.8 765.7L450.6 764.5L450 762.8L450.3 762.1L451.1 761.5L452.2 761.3L483.5 777.3L513.2 795L514 796L515 797.5L513 799L512.5 800.5L508 815.2L510.1 816.2L508.7 821.2L509.1 822.1L525.7 830.3L531.3 832.6L532.4 830.8L533.2 826.7L532.1 825.8L532.1 824.6L532.8 823.8L534.6 824.6L537.9 820.9L540.5 818.8L543.8 817.2L546.7 816.7L551.5 817.6L552.9 815.2L553.4 814.8L554.5 815.2L554.6 817.3L554.1 818.7L558.2 823.3L560.5 826.7L562.2 830.6L562.6 832.7L562 836.7L564.3 838.1L564.3 839.2L563.7 840.1L562.8 840.2L561.7 839.7L559.5 846.4L563.4 848.5L567.6 850.1L570.9 847.9L572.4 847.4L585.2 853.1L585.6 852.6L586.1 849.8L586.5 849.1L601.2 854.2L601.8 853.3L602.6 849.9L607.1 851.6L608.2 852.3L606.8 856.6L611.6 858.8L615.7 856L623.3 861.5L637.2 864.5L637.3 868.7C638.6 868.5 640.1 868.5 641.4 868.8C642.2 869.1 640.7 871.8 641.4 872.2C643.3 872.5 645.6 872.4 647.5 872.2C647.7 872.2 647.4 869.1 647.5 868.8C648.5 868.3 651.2 869.3 652.2 869.6C652.4 871.7 652 873.8 652.2 875.9C653.1 876.1 660.1 877.2 660.5 875.9C660.6 875.6 660.6 871.1 660.5 866.4C660.5 861.1 659 854.1 660.5 848.9C661.1 847.1 662.3 849.5 662.7 848.9C663.1 847 662 840.8 665.5 842.5L666.2 840C667.8 838.9 670.8 839.4 671.8 838.4C672.4 837.2 672.3 833 674.4 833.9C674 832 674.4 829.7 674.4 827.9C674.5 825.8 674.3 823.1 675.2 821.1C675.7 820.5 676.1 823.1 676.1 823.2C676.6 826.7 676.5 830.3 676.5 833.9C679 832.8 677.4 838.1 678.6 838.1C680.4 838.1 682.1 838.7 683.6 839.6C684.7 840.3 684.2 842.9 685.5 842.4C688.7 840.7 686.2 850.5 687.4 850.4C688.4 850.4 688.9 848.5 690.1 848.5C691.1 848.5 690 869.8 690.5 870.5C692.2 871.6 697.7 871.5 699.1 870.5C700.4 869.1 701.6 867.6 702.6 866C702.6 864 702.3 861.9 702.6 859.9C702.8 859 705.1 859.7 705.6 859.9C705.7 860.7 705 865 705.6 865.3C707.7 866.7 710.9 874.2 714.3 871.5C714.6 869.8 713.4 866.8 714.3 865.3C714.9 864.4 717.1 865 717.9 865.3C718.6 866 717.6 869.4 717.9 870.5C718.7 870.7 723.9 871.8 724.3 870.5C724.4 868.6 725.6 857.1 723.5 856.9C721.6 856.7 722.2 854.2 723.9 854.4C724.7 849.1 727.8 843.3 733.8 842.9C734.9 841.2 735 840 736.1 842.9C741.2 843.3 743 849 743 853.3C743.8 853.3 744.5 853 744.9 853.9C745.4 855 744.4 855.9 743.3 855.8C743.3 855.9 742.4 863 743 863.7C743.4 864.1 745.5 864.2 746.4 864.2C746.3 855.6 746.3 843.7 746.3 836.3C745.1 835.6 743.1 834.8 741.8 835.6C741.6 835.8 741 836.8 740.9 836.8C740.3 836.8 740.8 831.1 741 830.5C742.7 829.1 744.5 831.8 746.4 831.1C746.4 829.9 746.7 825 747.6 825C749.5 825 748.8 861.1 748.6 864.1C749.6 864.2 750.5 864 751.4 863.7C753.6 861.6 749.7 855.5 752.7 853.5C753.8 853.1 759.7 852 760.3 853.5C760.7 856.9 760.4 860.3 760.9 863.7C761.5 864.6 764.7 864 765.6 863.7C766.4 863 765.5 857.8 765.6 856.5C765.9 856.2 767 856.8 767 856.5C767.1 854.7 765.8 849.6 767 848.9C768.6 848.7 770.1 848.7 771.7 848.7C771.6 844.2 771.5 835.9 771.6 830.4C770.4 829.6 768.4 828.5 767.1 829.4C766.9 829.6 766.3 830.5 766.2 830.5C765.7 830.5 766.2 825.2 766.3 824.6C768 823.3 769.8 825.9 771.7 825.3C771.8 824.7 771.9 823.4 772.7 823.4C775.6 823.4 774.1 846.5 774 848.7C774.9 848.6 775.8 848.7 776.7 848.9C778 850.2 775.4 854.3 776.7 855.6C777.8 856.2 779.5 855.8 780.6 855.6C780.6 853.5 780.7 849 782 847.3C783 846 786 847.4 787.3 846.6C787.1 841.7 788.7 836.8 791.8 832.9C793.8 830.4 796.3 828.8 798.8 826.9C799 826.6 799 825.1 798.9 823.3C798.9 821.2 798.3 818.8 799.2 816.7C799.7 815.7 802.8 813.1 802.7 812.2C802.6 810.8 801.5 802 804 802C805.7 802 805.5 810.9 805.7 812.2C806.9 813.9 808.7 814.9 809.8 816.7C810.3 818 808.8 826.6 809.8 826.9C810.2 827 812 829.7 813.7 832.7C814.7 834.5 817.1 838.8 817.2 840.9C817.4 843.2 817.5 845.5 817.5 847.8C817.6 849.5 817.6 850.8 817.6 851C817.8 851.5 821.1 851.5 821.3 851C821.5 848.9 821.2 846.8 821.4 844.7C823 844.3 825.3 844.1 826.9 844.7C827.2 847.9 826.7 851.1 826.9 854.3C827.4 855.2 830 854.6 830.7 854.3C830.9 852 830.5 849.6 830.7 847.3C831.5 846.9 834.3 846.3 834.8 847.3C835.2 847.9 834.9 860.3 834.8 862.8V867.2H839.5V1272H-235.5V1271.8H-288V378H-237ZM734.5 858.5C730 858.5 731.3 865.1 732 867.7C733.4 868.3 735.2 868.2 736.6 867.7C738.6 866.4 739 858.5 734.5 858.5ZM677.3 844.3C677.2 843.3 674.9 841.2 674.9 841.5C672.2 841.6 672.7 848.5 672.6 850.1C672.6 852.3 672.8 853.8 673.1 854.1C674 854.8 676.6 855.3 677.3 854.1C678.3 851.1 677.9 847.4 677.3 844.3ZM682.7 847.7C682.5 847.2 681.4 845.9 681.6 846.5C679.3 846.5 679.8 852.9 680.1 854.3C680.5 854.8 682.9 854.6 683 854C683.4 852 683.4 849.7 682.7 847.7ZM670 847.7C669.7 847.2 668.6 845.9 668.8 846.5C666.5 846.5 667 852.7 667.4 854C667.8 854.3 670.1 854.7 670.3 854C670.6 852 670.7 849.7 670 847.7ZM506.5 798.8L503.2 808.2L501.7 813.9L504.5 815.7L505.1 815.5L510.1 800.1L508.3 799L507.4 798.6L506.5 798.8ZM500.1 795.7L496.2 806.9L495.3 810.8L497.3 812.3L498.8 812.4L503.7 797.1L501.9 795.9L500.9 795.5L500.1 795.7ZM488.9 807.5L489.6 808.4L491.2 809.1L491.7 809L496.9 792.7L495.5 791.7L494 791.5L488.9 807.5ZM488.3 788.2L485.8 794.9L482.9 804.9L483.7 805.6L485.2 806.5L485.8 806.2L491.1 789.3L489.8 788.2L489 788L488.3 788.2ZM476.7 797.4L475.8 801.3L478.2 802.8L479.6 803.1L485.1 786L482.8 784.5L481.3 784.1L476.7 797.4ZM469.8 798.3L470.7 799.2L472.4 799.6L477.9 782.4L476.5 781.4L475.3 781.1L469.8 798.3ZM465.2 795.9L466.8 797L467.2 796.9L472.7 779.9L471.7 779L470.6 778.8L465.2 795.9ZM459.2 792.9L459.7 793.4L462.2 794.4L467.7 777.3L466.1 776.1L464.7 775.8L459.2 792.9ZM457.4 772L451.9 789.1L454.3 790.6L455.9 791.1L461.4 773.9L460 772.7L458.3 772L457.4 772ZM1701.5 652.1C1708.5 650.6 1798 661.1 1798 661.1V1271.5H684V895.7H688.1C688.1 893.6 686.9 889.1 688.1 887.4C688.7 886.6 692.2 886.6 692.7 887.4C693.7 888.8 692.6 892.1 692.7 893.8C693 894.5 696.1 894.7 696.3 893.8C696.4 893.4 696.4 890.2 696.3 887.2C696.3 884 696.2 881 696.3 880.8C696.7 880.1 699.2 880.6 699.8 880.8C700 883 699.6 885.2 699.8 887.4C700.2 887.9 703.6 886.2 704.1 886C704.3 885.7 704.1 880.8 704.1 880.8C708.4 880.8 712.8 881.2 717.1 880.8C719.2 877 719.1 871 724.7 870.5C725.2 870.4 725 867.8 726 867.6C729.1 867.1 728.1 870.9 729.1 871C734.3 871.6 732.9 877.4 734.3 880.8C734.9 881 737.2 881.5 737.7 880.8C737.9 879 737.5 877.3 737.7 875.6C739.1 875.2 740.7 875.3 742.1 875.6C742.3 877.3 741.8 879 742.1 880.8C743.4 882.4 744.4 884.3 745.7 886C747.5 886.2 749.3 886.2 751.1 886C751.3 884.2 750.9 882.5 751.1 880.7C752 879.8 756.1 881.8 756.8 880.7C757.3 878.7 757.4 876.5 757.9 874.5C758.3 874 760.8 874.5 761.4 874.5C762 874.5 762.5 873.8 762.9 873.5C765 871.8 768.8 868.5 769 868.1C769.1 866 768.7 864 769 862C769.7 861.7 772.9 861 773.4 862C773.6 864 773.2 866 773.4 868.1C773.7 869 777 868.3 777.6 868.1C778.4 867 779.6 863.2 780.8 863.2C782 863.2 783.9 867.1 784.8 868.1C786.7 868.6 789 868.4 790.9 868.1C791.9 867.6 790 864.4 790.9 864C792.2 863.6 793.8 864 795 864.3C795.8 864.6 795 869.3 795 870.4C795.3 871 799.9 871 800.2 870.4C801.9 866.8 803.4 856 806.9 854.5C807.9 854 809.6 863.7 810.8 864.3C811.8 864.9 813.1 859.1 814.1 859.1C814.7 859.1 815.7 863.6 816.2 864.3C817.7 864.6 819.2 864.7 820.7 864.8C822.1 864.8 825.4 864.6 826.5 865.5C827.8 866.4 827.7 868.9 828.2 870.4C828.4 871.3 833.7 870.5 834.3 870.4C834.5 868.8 834.1 867.1 834.3 865.5C835.3 865.2 840.7 866.2 840.9 865.5C841 865 841.3 857.2 840.9 856.8C840.1 856 838.7 854.8 840.9 854.5C841.1 853.3 842.5 843.5 843.5 843.5C845.4 843.5 845.8 854.6 847.3 854.6C847.9 854.6 849.1 851.3 849.5 851.6C850.4 853.2 850.8 855.1 851.7 856.8C852.4 857 853.9 852.8 854.6 853.4C855.7 856.2 856 859.2 857 862C860.8 862.8 864.8 861.8 868.7 861.8C868.7 860.1 868.7 856.5 868.7 851.6C868.7 845.9 868.7 840.6 868.7 840.2C868.7 839.4 870.3 839.7 870.3 839.2C870.3 838.9 870.3 832.2 870.3 831.7C870.2 831.3 868.9 831.5 869 831.3C869.8 830.1 870.4 824.6 871.5 824.6C872.2 824.6 872.8 830.2 873.1 831.3C873.3 831.8 872.8 831.5 872.6 831.5C871.9 831.7 872.4 835.8 872.4 836.4C872.6 836.9 875 836.6 875.2 836.3C875.4 834.9 875.4 833.4 875.1 831.9C875 831.7 873.7 832.3 873.9 831.7C874.1 831.1 876 826.1 876.5 826.1C878.4 826.1 879 832.3 877.2 831.7V835.3C877.5 835.3 879.6 835.8 879.7 835.3C879.9 834 879.9 832.6 879.7 831.2C879.6 831 879 831.6 879.1 831.3C879.2 830.7 880.5 826.5 880.9 826.4C881.5 826.4 882.5 830.6 882.5 831.3C882.5 831.5 881.6 831.3 881.5 831.3C881.5 831.3 881.3 835.1 881.5 835.3C881.9 835.5 883.6 835.9 884 835.3C884 835.2 884.2 831.5 884 831.3C883.8 831.1 883.1 831.5 883.2 831.3C883.7 830 883.9 824.6 885.3 824.6C886.1 824.6 886.6 830.3 886.8 831.3C886.8 831.5 885.7 831.3 885.6 831.5C885.2 834.3 884.9 837.5 885.3 840.2C885.3 840.5 886.4 840.1 886.5 840.1C887 840.1 886.7 851.4 886.8 851.5C887.1 852.1 893.2 852 893.3 851.5C894.1 847.6 892 843.1 893.3 839.2C893.5 838.6 893.7 839.3 893.9 839.3C894 839.3 894.2 832.9 894 832.3C893.8 831.8 891.8 832.7 891.8 832.2C892.1 831.1 894 824.1 895 824.1C896.1 824.1 896.9 830.5 897.5 832.3C897.5 832.4 896.4 832.1 896.3 832.3C896.2 834 896.2 835.7 896.3 837.4C896.6 838 898.7 837.5 899.1 837.4C899.3 837.2 899.1 832.3 899.1 832.3C899.1 832.1 898.2 832.4 898.1 832.3C897.2 830.3 898.4 826.2 900.6 826.1C900.9 826.1 902.2 831.5 902.3 832C902.4 832.4 901.1 831.9 901 832.2C900.9 833.6 900.9 835 901 836.4C901.3 836.9 903 836.5 903.4 836.4C904.1 835.8 903.3 832.8 903.4 831.9C903.4 831.7 902.6 832.2 902.8 831.9C903.2 830.9 904.2 826.4 904.9 826.4C905.6 826.5 906.7 831.2 906.7 831.9C906.7 832.1 905.5 831.7 905.4 831.9C905 833.1 905.2 835.1 905.4 836.4C906.1 836.7 907.1 836.6 907.9 836.4C908 834.9 908 833.4 907.9 831.9C907.8 831.7 907.3 832 907.2 831.9C907 831.7 907.5 830.7 907.6 830.4C907.7 829.7 909.6 823.5 909.6 823.5C910.2 824.1 910.8 831.1 910.8 831.5C910.8 831.7 910.1 831.5 909.9 831.7C909.7 834.1 909.6 837.2 910.3 839.5C910.4 840 912.1 838.9 911.8 839.5C911.7 839.9 911.6 846.1 911.6 852.8C911.6 855.8 911.6 865.7 911.8 866.1C912 866.5 915.3 866.5 918 866.5C918.3 866.5 918.5 866.5 918.8 866.5V869.3C922 869.2 924.6 869.1 924.8 869C926.1 868.6 926.1 863.8 927.5 863.8C928.5 863.8 929.7 869.4 930.2 870.5C931 870.9 933.6 871.6 934.2 870.5C935.1 868.8 934 865.7 934.2 863.8C934.4 863.2 936.1 864 936.5 864C937.3 864 936.6 849.4 936.8 848.2C937 846.8 938.4 850.1 938.9 850.1C940.1 850.1 937.9 830.9 939.3 830.8C940.5 830.8 940.6 834.2 941.8 834.2C943 834.2 943.6 825.2 943.7 824.4C944.1 821.9 946.2 797.7 948.9 797.5C949.8 797.5 950.2 802.3 950.3 802.9C950.9 806.8 953.1 833.9 953.5 834C954.6 834 954.8 830.3 956 830.3C957.3 830.3 955.7 850 956.4 850C957.2 850 957.3 847.4 958.3 847.3C960.3 847.4 958.3 862.1 959 862.1C959.4 862.1 959.9 861.4 960.3 861.3C961.3 861.3 960.6 867.1 960.7 868.1C960.8 868.4 961.4 868.5 962.1 868.5L964.1 867L975.4 863.7V858.4L981 853.5L989.8 859.3H992V854.8L995.6 855.1L993.6 845.1L1000.4 845.6L1001.2 849.4L1003.4 849.6L1000.9 837.8L997 837L996.2 837.9L995.4 833.1L1000.4 833.8L1000.6 832.8L1001.7 833L1005.7 849.6L1006.8 849.7L1007.4 853L1012.5 853.2L1011.2 846.1L1008.4 845L1010.6 843.4L1011.4 839L1014.1 838L1014.9 836L1016 837.8L1018.7 839L1021.4 843.3L1024.2 845.3L1023.1 846.5L1024.1 851.4L1027.6 851.5L1034.4 844L1048.6 853.3L1049.7 852.8L1048.9 848.7L1054.3 848.7L1055.3 853.8L1059 853.8L1063.6 846.5L1063.4 845L1065.3 844.6L1071.9 854.2L1094.4 849.3L1093.4 844.4L1099.7 844L1100.3 848.2L1106.8 847.8L1106.2 844.5L1111.2 844.2L1112.3 850.3L1129.7 839.9L1126.6 824.4L1133.4 823.8L1130.7 810.4L1134.2 805.1L1131.9 793.6L1135.2 793.2L1136 797.1L1139.9 796.9L1139.1 792.8L1142.2 792.3L1144.5 803.8L1149 803.3L1146.2 789.5L1150.7 789L1151.5 793L1154.7 792.5L1153.9 788.5L1157 788.6L1158.2 792L1160.6 791.7L1157.9 778L1170.9 775.9L1170.1 771.9L1174.7 771.1L1175.5 775.2L1178.8 774.6L1176.9 765L1173.7 765.6L1171.9 756.9L1174.4 752.5L1177.4 756L1178.7 762.3L1182.8 761.6L1182 757.8L1187.2 756.9L1188.4 763L1196.2 761.5L1194.5 753.4L1193 753.2L1192.2 751.7L1192.8 750.6L1196.2 749.7L1194.4 741.2L1191.9 741L1190.1 742.6L1189.2 737.3L1193.7 736.4L1194.2 735.2L1195.1 735.7L1197.8 749.3L1201.9 748.8L1202.5 750.4L1201.7 751.7L1200.9 751.5L1202.1 758L1208.7 756.6L1212.3 749.3L1217.7 754.7L1227.5 752.5L1231.6 755.6L1230.4 749.6L1235.2 748.5L1236.8 756L1243.7 754.4L1242.8 750L1247.3 749.1L1248.7 755.8L1271.1 749.8L1273.2 760L1281.5 757.6L1280.3 751.4L1285.5 749.9L1286.7 756.1L1301 751.8L1299.7 745.6L1303 744.6L1301.7 738.1L1306.7 736.5L1307.6 741.1L1310.9 740.1L1312 736.6L1323.7 732.7L1323 729.5L1331.4 726.5L1332.1 729.8L1335.2 728.7L1334.6 725.5L1340.8 723.2L1341.5 726.5L1344.2 725.5L1343.5 722.2L1347.9 720.6L1349.1 726.7L1355.2 724.5L1354.6 721.6L1358.4 720.1L1360 728L1365.5 725.9L1368.4 740.2L1373.4 738.2L1375.7 745.6L1383.8 743.3L1384.6 747.4L1392 744.3L1391.4 741.3L1389.6 741.7L1393.3 738.1L1397.6 738.2L1395.7 739.8L1397.6 749.4L1402.9 747.2L1403.8 751.8L1409.4 749.3L1410.5 754.7L1418.6 749.4L1424.7 743.4L1428 741.9L1433 743.1L1442.6 734L1449.1 733.5L1457.3 729.5L1461 729L1483.3 737.9L1490.2 735.6L1494.3 736.1L1500.1 739.4L1505.3 736.4L1508.8 736.4L1514.2 733.2L1520.6 734.1L1527.2 731.2L1531 730.9L1534.1 725.6L1539.5 727.5L1541.9 722.1L1545.4 723.5L1549.5 721C1549.8 717.2 1594.1 684.6 1602 682.1C1610 679.6 1618.5 677.6 1625 676.1C1631.5 674.6 1694.5 653.6 1701.5 652.1Z'
    + 'M-3200 378.5H-236V1400H-3200ZM1797 661.2H4700V1400H1797Z';

  const MOON = 'M178.5 345C170.283 345 166 351.48 166 359.697C166 367.914 172.662 374.576 180.879 374.576C186.558 374.576 191.493 371.394 194 366.716C191.634 368.816 188.521 370.092 185.108 370.092C177.707 370.092 171.707 364.092 171.707 356.691C171.707 351.671 174.469 347.295 178.556 345C178.537 345 178.519 345 178.5 345Z';
  const MOON_BOX = { x: 166, y: 345, width: 28, height: 29.58 };

  /* ------------------------------ colour helpers ------------------------------ */
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const rgb = c => `rgb(${c.map(Math.round).join(',')})`;
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const paleOf = p => mix(hex(p.glow), [255, 255, 255], SKY.paleGlow.whiten);
  const toPal = p => ({ b1: hex(p.top), y1: p.y1 ?? 185, b2: hex(p.bottom), y2: p.y2 ?? 851, lift: 531,
    glow: hex(p.glow), glowAmt: .5, pale: paleOf(p), paleAmt: SKY.paleGlow.on ? SKY.paleGlow.amount : 0, dark: hex(p.dark), land: hex(p.land) });
  const mixPal = (a, b, e) => Object.fromEntries(Object.keys(a).map(k => [k, Array.isArray(a[k]) ? mix(a[k], b[k], e) : a[k] + (b[k] - a[k]) * e]));
  // the sky's colour straight up the middle at height y (for the round buttons)
  function colourAt(p, y){
    const P = toPal(p), seg = (y0, y1) => Math.min(1, Math.max(0, (y - y0) / (y1 - y0)));
    return rgb(mix(mix(P.b1, P.b2, seg(P.y1, P.y2)), [255, 255, 255], .2 * seg(P.lift, 982)));
  }
  function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ==========================================================================================
     1. Markup: built straight away so the card has its final size from the start
     ========================================================================================== */
  const card = mount.closest('.pc-card') || mount;
  const shareView = mount.hasAttribute('data-share-view');
  const query = new URLSearchParams(location.search);
  const sharedText = shareView ? (query.get('postcard') || '').replace(/\s+/g, ' ').trim().slice(0, SKY.words.maxChars) : '';
  const sharedSky = shareView ? +query.get('sky') : 0;
  if (sharedText) card.classList.add('pc-viewer');

  const ICON_SEND = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5.5 14.5 14 6M7.5 5.5H14.5V12.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_SHARE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10M6 6.5 10 3l4 3.5M4.5 11v4.5a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5V11" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const fadeStops = Array.from({ length: 13 }, (_, i) => { const u = i / 12, e = u * u * (3 - 2 * u), v = Math.round(255 * (1 - e)); return `<stop offset="${u.toFixed(3)}" stop-color="rgb(${v},${v},${v})"/>`; }).join('');

  mount.innerHTML = `
    <div class="pc-postcard" title="Tap to replay">
      <div class="pc-layer pc-base" aria-hidden="true"></div>
      <div class="pc-layer pc-lift" aria-hidden="true"></div>
      <div class="pc-layer pc-pale" aria-hidden="true"></div>
      <canvas class="pc-layer pc-glow" aria-hidden="true"></canvas>
      <canvas class="pc-layer pc-band" aria-hidden="true"></canvas>
      <div class="pc-layer pc-dark" aria-hidden="true"></div>
      <canvas class="pc-layer pc-stars" aria-hidden="true"></canvas>
      <svg class="pc-layer pc-art" viewBox="0 0 1512 982" preserveAspectRatio="none" role="img" aria-label="${COPY.label} “${SKY.words.greeting}”." xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="pc-skyline" d="${SKYLINE}"/>
          <filter id="pc-moon-glow" x="158" y="337" width="44" height="45.5762" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="bg"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/><feGaussianBlur stdDeviation="4"/><feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0"/>
            <feBlend mode="normal" in2="bg" result="shadow"/><feBlend mode="normal" in="SourceGraphic" in2="shadow" result="shape"/>
          </filter>
          <linearGradient id="pc-dark-fade-grad" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="742" y2="982">${fadeStops}</linearGradient>
          <mask id="pc-dark-fade" maskUnits="userSpaceOnUse" x="-1600" y="-800" width="4800" height="2400"><rect x="-1600" y="-800" width="4800" height="2400" fill="url(#pc-dark-fade-grad)"/></mask>
          <radialGradient id="pc-sky-dark-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(756 736.5) rotate(90) scale(746.5 1149.4)"><stop stop-color="#fff" stop-opacity="0"/><stop id="pc-sky-dark-stop" offset="1" stop-color="#004B91"/></radialGradient>
        </defs>
        <path id="pc-moon" d="${MOON}" fill="#fff" filter="url(#pc-moon-glow)"/>
        <g id="pc-words"></g>
        <use id="pc-land" href="#pc-skyline" fill="#002344"/>
        <use href="#pc-skyline" fill="url(#pc-sky-dark-grad)" style="mix-blend-mode:multiply" mask="url(#pc-dark-fade)"/>
        <g id="pc-front"></g>
      </svg>
      <canvas class="pc-layer pc-fly" aria-hidden="true"></canvas>
      <div class="pc-layer pc-grain" aria-hidden="true"></div>
      <p class="pc-credit">${CREDIT.text}</p>
    </div>
    <form class="pc-controls" autocomplete="off">
      <div class="pc-swatches" role="group" aria-label="Sky colour"></div>
      <div class="pc-field">
        <label class="pc-sr" for="pc-msg">Your message</label>
        <div class="pc-field-row">
          <input id="pc-msg" name="msg" maxlength="${SKY.words.maxChars}" placeholder="${COPY.placeholder}" spellcheck="false" enterkeyhint="send" aria-describedby="pc-help">
          <button type="submit" class="pc-send" aria-label="Send it up to the sky" title="Send" disabled>${ICON_SEND}</button>
        </div>
        <div class="pc-help pc-quiet" id="pc-help"><span>${COPY.help}</span><span class="pc-count"></span></div>
      </div>
      <button type="button" class="pc-share" aria-label="Share your postcard" title="Share">
        ${ICON_SHARE}
        <svg class="pc-ring" viewBox="0 0 50 50" aria-hidden="true"><circle cx="25" cy="25" r="23" fill="none" stroke="#141414" stroke-width="2.5" stroke-dasharray="144.5" stroke-dashoffset="144.5"/></svg>
      </button>
    </form>
    <div class="pc-viewer-bar">
      <p>${COPY.received}</p>
      <a class="pc-btn pc-own" href="${SHARE_PAGE}">${COPY.writeOwn}</a>
    </div>${shareView ? `
    <p class="pc-byline">${COPY.byline} · <a href="${COPY.portfolioHref}" target="_blank" rel="noopener">${COPY.portfolio} <span aria-hidden="true">→</span><span class="pc-sr"> (opens in a new tab)</span></a></p>` : ''}`;

  // the share sheet goes straight into <body>: the site's <main> has a transform, which would trap a fixed overlay
  const sheet = document.createElement('div');
  sheet.className = 'pc-sheet'; sheet.hidden = true;
  sheet.innerHTML = `
    <div class="pc-sheet-card" role="dialog" aria-modal="true" aria-labelledby="pc-sheet-title">
      <h3 id="pc-sheet-title">Share your postcard</h3>
      <p class="pc-sheet-sub">Link</p>
      <div class="pc-linkrow">
        <input class="pc-link" readonly aria-label="Link to your postcard">
        <button type="button" class="pc-btn pc-copy">Copy link</button>
      </div>
      <p class="pc-sheet-note pc-link-note" aria-live="polite"></p>
      <p class="pc-sheet-sub">Video</p>
      <div class="pc-sheet-media"></div>
      <div class="pc-sheet-actions">
        <button type="button" class="pc-btn pc-close">Close</button>
        <button type="button" class="pc-btn pc-share-video" hidden disabled>Share video</button>
        <button type="button" class="pc-btn pc-save" disabled>Download video</button>
      </div>
      <p class="pc-sheet-note pc-video-note"></p>
    </div>`;
  document.body.appendChild(sheet);

  const $ = s => mount.querySelector(s), $s = s => sheet.querySelector(s);
  const el = {
    postcard: $('.pc-postcard'), form: $('.pc-controls'), swatches: $('.pc-swatches'), input: $('#pc-msg'), send: $('.pc-send'),
    help: $('.pc-help'), count: $('.pc-count'), share: $('.pc-share'), ring: $('.pc-ring circle'), own: $('.pc-own'),
    link: $s('.pc-link'), copy: $s('.pc-copy'), linkNote: $s('.pc-link-note'), media: $s('.pc-sheet-media'),
    close: $s('.pc-close'), shareVideo: $s('.pc-share-video'), save: $s('.pc-save'), videoNote: $s('.pc-video-note')
  };
  el.form.addEventListener('submit', e => e.preventDefault());   // never a real form submit, even before the postcard wakes

  // sky colour buttons, each showing its own gradient (pure colour maths, so they appear straight away)
  let skyIndex = sharedSky >= 1 && sharedSky <= SKY.palettes.length ? sharedSky - 1 : 0;
  SKY.palettes.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pc-swatch'; b.setAttribute('aria-label', p.name + ' sky'); b.title = p.name;
    b.style.background = `linear-gradient(to bottom, ${colourAt(p, 180)}, ${colourAt(p, 860)})`;
    b.setAttribute('aria-pressed', i === skyIndex);
    el.swatches.appendChild(b);
  });

  // the card's colours follow the sky (crossfaded in CSS), with a still grain tile over them
  function applyCard(i = skyIndex){
    const st = CARD.styles[CARD.style] || CARD.styles.sky, sky = st.skies[i] || st.base;
    [0, 1].forEach(n => card.style.setProperty(`--pc-bg${n + 1}`, rgb(mix(hex(st.base[n]), hex(sky[n]), CARD.follow))));
    card.style.setProperty('--pc-grain', CARD.grain);
    card.style.setProperty('--pc-grain-size', CARD.grainSize + 'px');
    card.classList.toggle('pc-framed', CARD.frame);
  }
  (() => {
    const T = 256, c = document.createElement('canvas'); c.width = c.height = T;
    const x = c.getContext('2d'), img = x.createImageData(T, T), r = rng(1312);
    for (let i = 0; i < img.data.length; i += 4){
      const v = Math.round(255 * Math.min(1, Math.max(0, .5 + (r() - .5) * 1.6)));
      img.data[i] = img.data[i+1] = img.data[i+2] = v; img.data[i+3] = 255;
    }
    x.putImageData(img, 0, 0);
    card.style.setProperty('--pc-card-grain', `url(${c.toDataURL()})`);
  })();
  applyCard();
  const creditEl = mount.querySelector('.pc-credit');
  function applyCredit(){
    creditEl.textContent = CREDIT.text;
    creditEl.style.opacity = CREDIT.opacity;
    creditEl.hidden = !(CREDIT.onScreen || (shareView && CREDIT.onSharePage));
  }
  applyCredit();

  /* ==========================================================================================
     2. Wake up about a screen before the card scrolls into view
     ========================================================================================== */
  let P = null;
  const idle = window.requestIdleCallback ? fn => requestIdleCallback(fn, { timeout: 300 }) : fn => setTimeout(fn, 0);
  function wake(){ if (P) return; P = engine(el.postcard); controls(P); }
  // for trying settings from the console or a playground page (nothing on the site uses it)
  mount.postcard = { CARD, SKY, CREDIT, applyCard: () => applyCard(skyIndex), applyCredit, letters: px => P && P.letters(px) };
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)){ io.disconnect(); idle(wake); } }, { rootMargin: '100% 0px' });
    io.observe(mount);
  } else wake();

  /* ==========================================================================================
     3. The engine: sky, stars, Milky Way, glow, lettering on the circle, shooting stars, video frames.
        Everything is in artboard units (1512 × 982) and scales with the postcard.
     ========================================================================================== */
  function engine(root){
    const W = 1512, H = 982, NS = 'http://www.w3.org/2000/svg';
    const q = s => root.querySelector(s);
    const art = q('.pc-art'), cv = q('.pc-stars'), ctx = cv.getContext('2d');
    const words = q('#pc-words'), front = q('#pc-front'), moonEl = q('#pc-moon');
    const glowCv = q('.pc-glow'), bandCv = q('.pc-band'), grainEl = q('.pc-grain');
    const layer = { base: q('.pc-base'), lift: q('.pc-lift'), pale: q('.pc-pale'), dark: q('.pc-dark') };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR_CAP = 2;
    const skyline = new Path2D(SKYLINE);
    const hit = document.createElement('canvas').getContext('2d');

    // the circle the words and trails follow. Fiona's composition (…0 values) is used whenever it fits; on narrow
    // shapes a circle is fitted to the view (fitCircle). Timings and angles are written for her circle and converted
    // by arc length (A, D), so speeds and spacings look the same on screen.
    const CX0 = 740.82, CY0 = 811.87, R0 = 405.6, GAP0 = 6.6, CAP0 = 25.5, TEXT0 = -141.7;
    let CX = CX0, CY = CY0, R_PATH = R0, R_BASE = R0 - GAP0, CAP = CAP0, TEXT_START = TEXT0, DOT_STEP = .32, EXIT = 25, WEND = -60, BUDGET = 500;
    const DOT_R = .44;
    const D = d => d * R0 / R_PATH;
    const A = a => TEXT_START + D(a - TEXT0);
    const rad = a => a * Math.PI / 180;
    let GROW = 0, SPA = 999;
    const rp = a => R_PATH + (a > SPA ? GROW * (a - SPA) * (a - SPA) : 0);
    const at = (a, r) => { r = r ?? rp(a); return [CX + r * Math.cos(rad(a)), CY + r * Math.sin(rad(a))]; };
    const at0 = (a, r) => [CX0 + r * Math.cos(rad(a)), CY0 + r * Math.sin(rad(a))];
    const smooth = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
    // nothing of the skyline is above y 378, so most points skip the (slow) exact test
    const onSkyline = (x, y) => y >= 377 && hit.isPointInPath(skyline, x, y);

    /* ---------- glow round the skyline: blurred once per size at 1/8 resolution ---------- */
    let PAL = toPal(SKY.palettes[0]);
    const GLOW = { blur: 100, res: 1 / 8, pad: 320 };
    let glowA = null, glowImg = null;
    function drawGlow(){
      const s = GLOW.res, P = GLOW.pad;
      const w = Math.ceil((V.w + 2 * P) * s), h = Math.ceil((V.h + 2 * P) * s);
      const off = document.createElement('canvas'); off.width = w; off.height = h;
      const o = off.getContext('2d');
      o.setTransform(s, 0, 0, s, (P - V.x) * s, (P - V.y) * s); o.fillStyle = '#000'; o.fill(skyline);
      const img = o.getImageData(0, 0, w, h), a = new Float32Array(w * h);
      for (let i = 0; i < a.length; i++) a[i] = img.data[i * 4 + 3] / 255;
      blurAlpha(a, w, h, GLOW.blur * s);
      const x0 = Math.round(P * s), y0 = Math.round(P * s), cw = Math.max(1, Math.round(V.w * s)), ch = Math.max(1, Math.round(V.h * s));
      glowA = { a, w, x0, y0, cw, ch }; glowCv.width = cw; glowCv.height = ch; glowImg = glowCv.getContext('2d').createImageData(cw, ch);
      tintGlow();
    }
    function tintGlow(){
      if (!glowA) return;
      const { a, w, x0, y0, cw, ch } = glowA, d = glowImg.data, [R, G, B] = PAL.glow;
      for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++){
        const k = (j * cw + i) * 4, v = a[(j + y0) * w + i + x0] || 0;
        d[k] = R; d[k+1] = G; d[k+2] = B; d[k+3] = Math.round(255 * PAL.glowAmt * v);
      }
      glowCv.getContext('2d').putImageData(glowImg, 0, 0);
    }
    // three box blurs ≈ a Gaussian blur, on an alpha array (glow and Milky Way)
    function blurAlpha(a, w, h, sigma){
      const r = Math.max(1, Math.round((Math.sqrt(12 * sigma * sigma / 3 + 1) - 1) / 2)), tmp = new Float32Array(a.length);
      const pass = (src, dst, horiz) => {
        const n = horiz ? w : h, m = horiz ? h : w, k = 1 / (2 * r + 1);
        for (let j = 0; j < m; j++){
          let acc = 0; const at = i => horiz ? j * w + i : i * w + j;
          for (let i = -r; i <= r; i++) acc += src[at(Math.min(n - 1, Math.max(0, i)))];
          for (let i = 0; i < n; i++){ dst[at(i)] = acc * k; acc += src[at(Math.min(n - 1, i + r + 1))] - src[at(Math.max(0, i - r))]; }
        }
      };
      for (let p = 0; p < 3; p++){ pass(a, tmp, true); pass(tmp, a, false); }
    }

    /* ---------- Milky Way: drawn once per size into its own still canvas ---------- */
    const BAND = { r: 640, a0: -174, a1: -6, sigma: 40, stars: 1100 };
    const bandNoise = a => { const raw = .5 + .5 * Math.sin(a * .085 + 1.3) * Math.sin(a * .21 + .4) * (.6 + .4 * Math.sin(a * .53 + 2.1)); const u = (a - BAND.a0) / (BAND.a1 - BAND.a0); return raw * Math.pow(Math.sin(Math.PI * u), .8); };
    const bandDust = (() => {
      const r = rng(640), gauss = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()), out = [], mb = MOON_BOX;
      let guard = 0;
      while (out.length < BAND.stars && guard++ < 40000){
        const a = BAND.a0 + r() * (BAND.a1 - BAND.a0), n = bandNoise(a);
        if (r() > .3 + .7 * n) continue;
        const off = gauss() * BAND.sigma * (.7 + .6 * n), [x, y] = at0(a, BAND.r + off);
        if (x < 0 || x > W || y < 0 || onSkyline(x, y)) continue;
        if (x > mb.x - 20 && x < mb.x + mb.width + 20 && y > mb.y - 20 && y < mb.y + mb.height + 20) continue;
        out.push([x, y, .3 + r() * .4, (.06 + r() * .18) * (.4 + .6 * n), r() < .25 ? '#E6EFFF' : '#fff']);
      }
      return out;
    })();
    function drawBand(){
      const M = SKY.milkyWay, b = root.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
      bandCv.width = Math.round(b.width * d); bandCv.height = Math.round(b.height * d);
      const g = bandCv.getContext('2d'), k = bandCv.width / V.w;
      g.clearRect(0, 0, bandCv.width, bandCv.height);
      if (!M.on) return;
      const s = 1 / 6, w = Math.ceil(V.w * s), h = Math.ceil(V.h * s), off = document.createElement('canvas'); off.width = w; off.height = h;
      const o = off.getContext('2d'); o.setTransform(s, 0, 0, s, -V.x * s, -V.y * s); o.fillStyle = '#fff';
      for (let a = BAND.a0; a <= BAND.a1; a += .6){
        const n = bandNoise(a), [x, y] = at0(a, BAND.r);
        o.globalAlpha = .012 + .05 * n * n;
        o.beginPath(); o.arc(x, y, BAND.sigma * (.8 + 1.1 * n), 0, 6.2832); o.fill();
      }
      o.setTransform(1, 0, 0, 1, 0, 0);
      const img = o.getImageData(0, 0, w, h), al = new Float32Array(w * h);
      for (let i = 0; i < al.length; i++) al[i] = img.data[i * 4 + 3] / 255;
      blurAlpha(al, w, h, 9);
      for (let i = 0; i < al.length; i++){ img.data[i*4] = 222; img.data[i*4+1] = 236; img.data[i*4+2] = 255; img.data[i*4+3] = Math.round(255 * Math.min(1, al[i] * .9 * M.strength)); }
      o.putImageData(img, 0, 0);
      g.imageSmoothingQuality = 'high';
      g.drawImage(off, 0, 0, w, h, 0, 0, w / s * k, h / s * k);
      g.setTransform(k, 0, 0, k, -V.x * k, -V.y * k);
      for (const [x, y, r, a, c] of bandDust){
        g.globalAlpha = Math.min(1, a * M.strength); g.fillStyle = c;
        g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
      }
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
    }

    /* ---------- stars on one canvas ---------- */
    const RAW = [287,254,4,1,244.5,223.5,2.5,1,280.5,314.5,2.5,1,341.5,443.5,2.5,1,257,197,2,1,269.5,204.5,1.5,1,262,212,1,1,89,171,3,1,48.5,132.5,3.5,1,102,156,1,1,120,180,2,1,125,187,1,1,99,191,1,1,522.5,163.5,3.5,1,431.5,204.5,3.5,1,317.5,147.5,3.5,1,252,173,5,1,226,162,5,1,112.5,156.5,4.5,1,48,77,3,1,58,68,3,1,77,287,5,1,111.5,305.5,3.5,1,708,101,6,1,562,143,2,1,510.5,136.5,1.5,1,253,257,2,1,257,226,2,1,234,236,1,1,267,248,3,1,216.5,273.5,2.5,1,204,272,2,1,218,263,3,1,1388,599,2,1,18,421,2,1,75.5,407.5,1.5,1,74.5,375.5,1.5,1,349,181,2,1,384,155,2,1,423,185,2,1,245,125,2,1,152,109,2,1,84,82,2,1,115,51,2,1,72,17,2,1,59,23,2,1,43,53,2,1,284,150,1,1,173,247,2,1,156,269,2,1,43,228,2,1,71,305,1,1,94,255,2,1,151,242,3,1,176,82,3,1,188.5,87.5,2.5,1,393,337,4,1,353,169,4,1,285.5,82.5,2.5,1,300.5,88.5,1.5,1,374,178,5,1,402,154,5,1,343.5,114.5,3.5,1,332.5,196.5,3.5,1,45.5,351.5,2.5,1,39.5,385.5,3.5,1,66.5,366.5,3.5,1,1466.5,555.5,2.5,1,1435.5,572.5,1.5,1,425,312,3,1,1088,154,4,1,1276.5,314.5,2.5,1,1284.5,352.5,2.5,1,1106,151,2,1,1067.5,119.5,1.5,1,765,152,1,1,769,240,3,1,648.5,135.5,3.5,1,1431,408,1,1,472,77,2,1,1182,217,1,1,967,301,1,1,1103.5,168.5,3.5,1,1152.5,257.5,3.5,1,980.5,194.5,3.5,1,1025,192,5,1,1206.5,219.5,4.5,1,748,132,5,1,769,74,3,1,751,45,3,1,723.5,42.5,2.5,1,1260.5,246.5,3.5,1,1286,208,4,1,1348.5,344.5,3.5,1,1381,144,5,1,1456,154,3,1,1216,214,2,1,1280.5,145.5,1.5,1,1322,78,2,1,1001,221,2,1,588,306,1,1,1049,144,3,1,1156,319,2,1,1236,241,2,1,1221.5,269.5,1.5,1,1218.5,278.5,1.5,1,1184.5,273.5,1.5,1,1190,276,1,1,1147,281,1,1,1160,280,1,1,1160,264,1,1,1164,266,1,1,1189,259,1,1,1189,259,1,1,1127,179,2,1,1064,173,2,1,1111,117,2,1,979,92,2,1,595,210,2,1,832,84,1,1,1318,148,2,1,1355,241,2,1,1158,136,2,1,1256,260,1,1,1455,337,2,1,1211,279,3,1,623,83,3,1,607.5,8.5,1.5,1,659.5,120.5,2.5,1,1328,134,4,1,1096,259,4,1,1131.5,227.5,2.5,1,891.5,149.5,1.5,1,1104,229,5,1,971.5,155.5,5.5,1,983,160,3,1,930.5,220.5,3.5,1,915,576,3,1,842.5,139.5,3.5,1,405,63,4,1,318,13,4,1,463.5,210.5,2.5,1,390.5,39.5,2.5,1,461,158,2,1,445.5,146.5,1.5,1,489,257,1,1,686.5,273.5,3.5,1,553.5,305.5,3.5,1,343.5,247.5,3.5,1,451,242,5,1,406,239,5,1,1172,250,4,1,787,209,2,1,1257.5,199.5,1.5,1,1298.5,198.5,1.5,1,237,525,2,1,498,191,2,1,357,623,1,1,256,547,3,1,516,213,2,1,482,171,2,1,470,224,2,1,377,254,2,1,443,196,1,1,457,192,2,1,481.5,229.5,1.5,1,475,204,1,1,568,71,4,1,517,39,3,1,468,199,4,1,422.5,236.5,2.5,1,426.5,251.5,1.5,1,1125,282,5,1,1114.5,248.5,5.5,1,437.5,176.5,3.5,1,247.5,377.5,3.5,1,1192,175,3,1,1204,97,3,1,1199.5,72.5,4.5,1,1186,80,3,1,1218.5,81.5,3.5,1,1269,89,4,1,1278,94,3,1,1249,93,2,1,1144,77,3,1,953,32,3,1,942,18,2,1,985,25,2,1,1222.5,87.5,1.5,1,1225.5,75.5,1.5,1,1212.5,78.5,1.5,1,1207,81,1,1,1228,83,1,1,1231.5,86.5,1.5,1,1178,66,2,1,1243,76,2,1,1172.5,76.5,1.5,1,1163.5,77.5,1.5,1,1097.5,152.5,1.5,1,1209.5,62.5,2.5,1,1072,385,4,1,1255,303,2,1,1405.5,376.5,1.5,1,1362.5,365.5,1.5,1,1244.5,517.5,1.5,1,1364.5,358.5,1.5,1,1343,336,2,1,1125,261,1,1,1033,72,3,1,452.5,219.5,3.5,1,429.5,227.5,3.5,1,438,246,2,1,420.5,259.5,2.5,1,525.5,205.5,3.5,1,528,277,2,1,1305,604,1,1,1288,331,1,1,1196.5,254.5,3.5,1,1405.5,501.5,3.5,1,1470.5,453.5,4.5,1,1338.5,515.5,1.5,1,1275.5,292.5,3.5,1,1235,309,5,1,1263.5,474.5,2.5,1,1351.5,659.5,2.5,1,1247,280,5,1,1193,125,2,1,1262,42,2,1,1297,31,2,1,711,693,1,1,1192,269,3,1,1307,396,2,1,1066,258,2,1,1070,233,4,1,1062,225,2,1,1076,225,2,1,1071.5,219.5,1.5,1,1075,214,1,1,1197,287,2,1,1234,504,2,1,1153,276,2,1,791,331,2,1,1083,241,1,1,1378,319,2,1,759,220,3,1,361.5,432.5,3.5,1,233,271,6,1,511,367,2,1,402.5,354.5,1.5,1,897,135,4,1,1232,113,2,1,876.5,100.5,1.5,1,586,271,1,1,547,325,3,1,697.5,453.5,3.5,1,464,361,2,1,912.5,149.5,3.5,1,789.5,175.5,3.5,1,833,172,4,1,847,275,5,1,590,193,3,1,1174,311,3,1,651.5,348.5,2.5,1,810,202,2,1,864,134,3,1,1219,148,2,1,885,105,2,1,1128,69,2,1,788,73,2,1,1018,262,2,1,653,203,1,1,575,389,3,1,717.5,341.5,2.5,1,1084,275,4,1,1184.5,411.5,2.5,1,891.5,384.5,1.5,1,912,209,4,1,1129,327,3,1,1149.5,302.5,3.5,1,676.5,245.5,3.5,1,442.5,396.5,2.5,1,491,296,2,1,496,683,1,1,1194.5,326.5,3.5,1,1417,422,3,1,608,328,2,1,304,412,2,1,458,347,2,1,460,401,2,1,362,529,2,1,538,626,2,1,460.5,334.5,2.5,1,436,358,3,1,437,371,4,1,365,224,6,1,1373,357,4,1,1307,504,3,1,1328,501,2,1,1094,739,1,1,842,53,3,1,328.5,373.5,3.5,1,1212,312,2,1,892,222,1,1,580,339,3,1,828.5,314.5,2.5,1,1449,252,4,1,1438.5,238.5,2.5,1,1475.5,164.5,1.5,1,1457,196,1,1,1490,327,1,1,1166.5,261.5,1.5,1,1177,340,5,1,1194.5,303.5,5.5,1,1168.5,292.5,3.5,1,1171.5,274.5,3.5,1,1382.5,254.5,3.5,1,1430.5,80.5,2.5,1,1342,142,3,1,513.5,400.5,2.5,0.5,473,355,3,0.5,268,273,3,0.5,176.5,416.5,1.5,0.5,207.5,332.5,1.5,0.5,195.5,318.5,1.5,0.5,281.5,205.5,3.5,0.5,693.5,244.5,3.5,0.5,684,230,4,0.5,695.5,223.5,2.5,0.5,662.5,214.5,2.5,0.5,683,201,2,0.5,734.5,219.5,1.5,0.5,694,195,1,0.5,688,188,1,0.5,712.5,196.5,0.5,0.5,1097.5,295.5,3.5,0.5,1215,326,4,0.5,1161.5,360.5,2.5,0.5,1128.5,351.5,2.5,0.5,1149,338,2,0.5,1157.5,342.5,1.5,0.5,1160,332,1,0.5,1154,325,1,0.5,1178.5,333.5,0.5,0.5,1482.5,402.5,3.5,0.5,1404,273,4,0.5,1404.5,248.5,2.5,0.5,1451.5,372.5,2.5,0.5,1472,359,2,0.5,1480.5,363.5,1.5,0.5,1391,208,1,0.5,1477,346,1,0.5,1502,355,1,0.5,151.5,154.5,3.5,0.5,345,228,4,0.5,141.5,129.5,2.5,0.5,140.5,190.5,2.5,0.5,139,152,2,0.5,424.5,439.5,1.5,0.5,525,406,1,0.5,597,510,1,0.5,605,506,1,0.5,1420.5,103.5,3.5,0.5,990,95,4,0.5,980.5,146.5,2.5,0.5,1309.5,138.5,2.5,0.5,1276.5,86.5,2.5,0.5,1261.5,82.5,2.5,0.5,1216.5,99.5,2.5,0.5,1246.5,79.5,1.5,0.5,1103,14,1,0.5,1479,186,2,0.5,1410.5,89.5,1.5,0.5,1211,84,1,0.5,1194,81,1,0.5,1194,91,1,0.5,1233,78,1,0.5,1234,71,1,0.5,1082,412,1,0.5,1450,101,1,0.5,1211.5,288.5,3.5,0.5,1203,271,4,0.5,1112.5,301.5,2.5,0.5,1079.5,292.5,2.5,0.5,1100,279,2,0.5,1108.5,283.5,1.5,0.5,1111,273,1,0.5,1105,266,1,0.5,1130,275,1,0.5,1211,338,1,0.5,1227,322,1,0.5,704.5,325.5,3.5,0.5,1111,179,4,0.5,127.5,342.5,2.5,0.5,218.5,471.5,2.5,0.5,1259,224,2,0.5,1347.5,311.5,1.5,0.5,1243,489,1,0.5,1344,515,1,0.5,1340.5,507.5,1.5,0.5,1326,513,1,0.5,1180,282,1,0.5,1130,398,1,0.5,978.5,241.5,3.5,0.5,1138,287,4,0.5,963.5,139.5,2.5,0.5,638.5,358.5,2.5,0.5,830,273,2,0.5,952.5,147.5,1.5,0.5,1000,246,1,0.5,662,471,1,0.5,710.5,515.5,1.5,0.5,757,666,1,0.5,478,148,2,0.5,106,131,2,0.5,118.5,139.5,1.5,0.5,57,84,1,0.5,57,131,1,0.5,64.5,121.5,1.5,0.5,236,177,2,0.5,590,338,1,0.5,583,330,1,0.5,573.5,334.5,0.5,0.5,567.5,327.5,1.5,0.5,352,217,3,0.75,64,252,3,0.75,68,237,2,0.75,7,158,2,0.75,32,23,4,0.75,19,39,2,0.75,24,278,1,0.75,434,215,2,0.75,438.5,199.5,1.5,0.75,460.5,201.5,1.5,0.75,453,208,2,0.75,445.5,223.5,1.5,0.75,461.5,227.5,2.5,0.75,448,227,2,0.75,471,204,1,0.75,480.5,200.5,1.5,0.75,225,73,3,0.75,307,71,2,0.75,287,19,2,0.75,274.5,32.5,3.5,0.75,311.5,55.5,1.5,0.75,185,48,2,0.75,326,64,2,0.75,318.5,79.5,1.5,0.75,334.5,83.5,2.5,0.75,318,86,2,0.75,344,60,1,0.75,353.5,56.5,1.5,0.75,550,80,3,0.75,580,72,2,0.75,636.5,62.5,1.5,0.75,746.5,64.5,1.5,0.75,808.5,41.5,1.5,0.75,801,40,2,0.75,807,49,1,0.75,785,17,1,0.75,594,45,2,0.75,633.5,49.5,1.5,0.75,659.5,90.5,2.5,0.75,612,89,2,0.75,738,35,1,0.75,736.5,63.5,1.5,0.75,1088,218,3,0.75,1434,514,3,0.75,1421.5,560.5,2.5,0.75,1438.5,576.5,1.5,0.75,1429.5,478.5,2.5,0.75,1460.5,447.5,1.5,0.75,1473.5,678.5,1.5,0.75,1388.5,447.5,1.5,0.75,1170,216,2,0.75,1174.5,200.5,1.5,0.75,1196.5,202.5,1.5,0.75,1189,209,2,0.75,1181.5,224.5,1.5,0.75,1197.5,228.5,2.5,0.75,1184,228,2,0.75,1207,205,1,0.75,1216.5,201.5,1.5,0.75,961,74,3,0.75,961.5,21.5,1.5,0.75,960.5,31.5,1.5,0.75,991,22,1,0.75,1043,72,2,0.75,1047.5,56.5,1.5,0.75,921,49,2,0.75,1161,66,2,0.75,1170.5,88.5,1.5,0.75,1190.5,88.5,1.5,0.75,1184,89,2,0.75,1239,78,2,0.75,1187,94,1,0.75,1070.5,84.5,2.5,0.75,1054,87,2,0.75,1080,61,1,0.75,1153.5,73.5,1.5,0.75,1193.5,54.5,1.5,0.75,1159,25,2,0.75,1146.5,18.5,1.5,0.75,1170,19,1,0.75,1286,81,3,0.75,1293,86,2,0.75,1316,73,2,0.75,1372.5,63.5,1.5,0.75,1482.5,65.5,1.5,0.75,1330,46,2,0.75,1369.5,50.5,1.5,0.75,1395.5,91.5,2.5,0.75,1348,90,2,0.75,1436,25,2,0.75,1472.5,64.5,1.5,0.75,512,70,4,0.75,551.5,15.5,2.5,0.75,676.5,25.5,1.5,0.75,1240.5,388.5,2.5,0.75,1262,407,2,0.75,1266.5,391.5,1.5,0.75,1288.5,393.5,1.5,0.75,1270,385,2,0.75,1273.5,415.5,1.5,0.75,1289.5,419.5,2.5,0.75,1266,425,2,0.75,1155,439,2,0.75,1174,442,3,0.75,1148.5,489.5,1.5,0.75,907.5,627.5,1.5,0.75,850.5,830.5,1.5,0.75,918,617,1,0.75,1299,396,1,0.75,1310.5,390.5,1.5,0.75,1253,257,2,0.75,1262.5,279.5,1.5,0.75,1245.5,264.5,1.5,0.75,1378,272,3,0.75,1408,264,2,0.75,1464.5,254.5,1.5,0.75,1422,237,2,0.75,1461.5,241.5,1.5,0.75,1440,281,2,0.75,1332.5,579.5,2.5,0.75,498.5,59.5,2.5,0.75,1227.5,285.5,3.5,0.8,1256.5,274.5,2.5,0.8,1260.5,285.5,2.5,0.8,1267.5,274.5,1.5,0.8,1270,279,1,0.8,1273.5,271.5,1.5,0.8,1290.5,284.5,3.5,0.8,1319.5,273.5,2.5,0.8,1304.5,291.5,2.5,0.8,1330.5,273.5,1.5,0.8,1333,278,1,0.8,1336.5,270.5,1.5,0.8,1000.5,271.5,3.5,0.8,469.5,243.5,3.5,0.8,982,253,2,0.8,1051.5,282.5,2.5,0.8,1033.5,271.5,2.5,0.8,1040.5,260.5,1.5,0.8,1021,253,1,0.8,1046.5,257.5,1.5,0.8,1036.5,248.5,3.5,0.8,1061.5,264.5,2.5,0.8,1056.5,253.5,2.5,0.8,1072.5,264.5,1.5,0.8,1075,269,1,0.8,1078.5,261.5,1.5,0.8,1288.5,300.5,3.5,0.8,1297.5,262.5,2.5,0.8,1296.5,273.5,2.5,0.8,1291.5,292.5,1.5,0.8,1320,294,1,0.8,1304.5,282.5,1.5,0.8,472.5,214.5,3.5,0.8,501.5,203.5,2.5,0.8,505.5,214.5,2.5,0.8,554.5,241.5,1.5,0.8,488.5,203.5,1.5,0.8,512.5,203.5,1.5,0.8,515,208,1,0.8,518.5,200.5,1.5,0.8,535.5,213.5,3.5,0.8,564.5,202.5,2.5,0.8,693.5,91.5,2.5,0.8,401.5,77.5,1.5,0.8,605.5,183.5,1.5,0.8,549.5,220.5,2.5,0.8,575.5,202.5,1.5,0.8,578,207,1,0.8,581.5,199.5,1.5,0.8,280.5,243.5,3.5,0.8,262,225,2,0.8,331.5,254.5,2.5,0.8,313.5,243.5,2.5,0.8,320.5,232.5,1.5,0.8,301,225,1,0.8,326.5,229.5,1.5,0.8,316.5,220.5,3.5,0.8,341.5,236.5,2.5,0.8,336.5,225.5,2.5,0.8,352.5,236.5,1.5,0.8,355,241,1,0.8,358.5,233.5,1.5,0.8,533.5,229.5,3.5,0.8,542.5,191.5,2.5,0.8,541.5,202.5,2.5,0.8,536.5,221.5,1.5,0.8,565,223,1,0.8,549.5,211.5,1.5,0.8];
    const stars = [];
    for (let i = 0; i < RAW.length; i += 4) stars.push({ x: RAW[i], y: RAW[i+1], r: RAW[i+2], o: RAW[i+3] });
    const rMin = Math.min(...stars.map(s => s.r)), rMax = Math.max(...stars.map(s => s.r));
    const tr = rng(612);
    stars.forEach(s => {
      const f = (s.r - rMin) / (rMax - rMin), T = SKY.twinkle;
      let dim = 1 - T.dim, shrink = 1 - T.shrink, dur = T.speed * (0.6 + tr() * 0.8);
      if (T.bySize){ const k = 1.25 - 0.9 * f; dim = Math.min(.95, dim * k); shrink = Math.min(.85, shrink * k); dur *= 0.7 + 0.7 * f; }
      s.dim = dim; s.shrink = shrink; s.dur = dur; s.ph = tr(); s.rest = T.steady;
    });
    // faint background stars: seeded, gathered round the clusters, thinning towards the city, clear of the words, Moon and skyline
    const mb = MOON_BOX;
    const avoid = [{ x: 380, y: 360, x2: 790, y2: 600 }, { x: mb.x - 14, y: mb.y - 14, x2: mb.x + mb.width + 14, y2: mb.y + mb.height + 14 }];
    (function faint(){
      const r = rng(982), gauss = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
      let n = 0, guard = 0;
      while (n < SKY.faint.count && guard++ < 30000){
        let x, y;
        if (r() < .55){ const s = stars[Math.floor(r() * stars.length)]; x = s.x + gauss() * 55; y = s.y + gauss() * 40; }
        else { x = r() * W; y = r() * H * .88; if (r() > Math.pow(1 - y / H, 1.6)) continue; }
        if (x < 2 || x > W - 2 || y < 2 || onSkyline(x, y) || avoid.some(b => x > b.x && x < b.x2 && y > b.y && y < b.y2)) continue;
        stars.push({ x, y, r: .6 + r() * .6, o: (.25 + r() * .3) * (1 - .55 * y / H), dim: .65, shrink: 0, dur: 6 + r() * 8, ph: r(), rest: .4, faint: true });
        n++;
      }
    })();
    // low pinpricks in the lower and middle sky, down to just above the rooftops; kept off the lettering band and the Moon
    const LOW_MAX = 250;
    (function low(){
      const r = rng(1146);
      let n = 0, guard = 0;
      while (n < LOW_MAX && guard++ < 40000){
        const x = 8 + r() * (W - 16), y = 330 + Math.pow(r(), .8) * 560;
        if (onSkyline(x, y) || onSkyline(x, y + 6)) continue;
        const dx = x - CX, dy = y - CY, rr = Math.hypot(dx, dy), a = Math.atan2(dy, dx) * 180 / Math.PI;
        if (a > -155 && a < 35 && Math.abs(rr - 400) < 42) continue;
        if (avoid.some(b => x > b.x && x < b.x2 && y > b.y && y < b.y2)) continue;
        stars.push({ x, y, r: .6 + r() * .4, o: .6 + r() * .3, dim: .6, shrink: .15, dur: 5 + r() * 5, ph: r(), rest: .5, low: n++ });
      }
    })();
    // above Fiona's frame (the sky the postcard adds on top): a seeded field in the same mix of sizes.
    // The postcard only ever shows x 0…1512, so only that strip is made (the header made the whole surround).
    (function above(){
      const r = rng(2026), own = stars.slice(0, RAW.length / 4);
      for (let i = 0; i < 1500; i++){
        const x = -20 + r() * (W + 40), y = -420 + r() * 420;
        if (r() < .3){ const s = own[Math.floor(r() * own.length)]; stars.push({ x, y, r: s.r, o: s.o, dim: s.dim, shrink: s.shrink, dur: s.dur * (.8 + r() * .4), ph: r(), rest: s.rest }); }
        else stars.push({ x, y, r: .6 + r() * .6, o: .25 + r() * .3, dim: .65, shrink: 0, dur: 6 + r() * 8, ph: r(), rest: .4, faint: true });
      }
    })();
    // a seeded third of the stars get a whisper of pale gold, pale blue or mint
    const TINTS = ['#FFF3E0', '#E6F0FF', '#E2FCF3'];
    (() => { const r = rng(5); stars.forEach(s => { if (r() < SKY.tints.share) s.tint = TINTS[Math.floor(r() * TINTS.length)]; }); })();

    let scale = 1, dpr = 1, V = { x: 0, y: 0, w: W, h: H, k: 1 }, shown = stars, started = false;
    const FOCUS = { hill: 360, city: 810 };
    // rooftop profile of the skyline (first solid point from the top, every 2 units), for "lowest detail in view"
    const XL = -237, XR = 1798, roof = (() => {
      const c = document.createElement('canvas'), w = Math.ceil((XR - XL) / 2), h = 550; c.width = w; c.height = h;
      const g = c.getContext('2d'); g.setTransform(.5, 0, 0, .5, -XL / 2, -150); g.fill(skyline);
      const d = g.getImageData(0, 0, w, h).data, out = new Float32Array(w);
      for (let i = 0; i < w; i++){ let j = 0; while (j < h && d[(j * w + i) * 4 + 3] < 128) j++; out[i] = 300 + j * 2; }
      return out;
    })();
    const belowRoof = (x, y) => { const i = Math.round((x - XL) / 2); return y >= (i < 0 ? 378 : i >= roof.length ? 661 : roof[i]); };
    const lowestRoof = (x0, x1) => { let m = 0; for (let i = Math.max(0, Math.floor((x0 - XL) / 2)); i <= Math.min(roof.length - 1, Math.ceil((x1 - XL) / 2)); i++) m = Math.max(m, roof[i]); return m; };
    // which part of the artboard the postcard shows: bottom pinned, never stretched
    function view(bw, bh){
      const S = SKY.view, a = bw / bh, top = S.skyTop, full = H - top;
      const bottomFor = (x0, x1) => Math.min(H, lowestRoof(x0, x1) + S.belowDetail);
      let vw = W, vh = W / a, x = 0, y;
      if (vh >= full){
        if (vh > S.maxHeight){
          vh = S.maxHeight; vw = vh * a;
          x = Math.min(W - vw, Math.max(0, (FOCUS[S.crop] ?? FOCUS.hill) - vw / 2));
        }
        const u = Math.min(1, Math.max(0, (W - vw) / 300)), drop = (H - bottomFor(x, x + vw)) * u * u * (3 - 2 * u) * (1 - S.narrowGround);
        y = H - drop - vh;
      } else {
        let bottom = top + vh;
        const yb = bottomFor(0, W);
        if (bottom < yb){
          bottom = yb; vh = bottom - top; vw = vh * a;
          if (vw > XR - XL){ vw = XR - XL; vh = vw / a; }
          x = Math.min(XR - vw, Math.max(XL, 756 - vw / 2));
          bottom = Math.min(H, Math.max(bottom, bottomFor(x, x + vw)));
        }
        y = bottom - vh;
      }
      return { x, y, w: vw, h: vh, k: bw / vw };
    }
    const darkStops = () => Array.from({ length: 11 }, (_, i) => { const t = i / 10; return [t, `rgba(${mix([255, 255, 255], PAL.dark, t).map(Math.round).join(',')},${t.toFixed(1)})`]; });
    const paleStops = () => Array.from({ length: 9 }, (_, i) => { const u = i / 8, e = 1 - u * u * (3 - 2 * u); return [u, PAL.paleAmt * e]; });
    function paintSky(){
      const pct = y => ((y - V.y) / V.h * 100).toFixed(2) + '%', px = v => (v * V.k).toFixed(1) + 'px';
      layer.base.style.background = `linear-gradient(to bottom,${rgb(PAL.b1)} ${pct(PAL.y1)},${rgb(PAL.b2)} ${pct(PAL.y2)})`;
      layer.lift.style.background = `linear-gradient(to bottom,rgba(255,255,255,0) ${pct(PAL.lift)},#fff ${pct(982)})`;
      const pg = SKY.paleGlow, pl = rgb(PAL.pale).slice(4, -1);
      layer.pale.style.background = `radial-gradient(${px(pg.rx)} ${px(pg.size)} at ${px(pg.x - V.x)} ${px(pg.y - V.y)},${paleStops().map(([u, al]) => `rgba(${pl},${al.toFixed(3)}) ${(u * 100).toFixed(1)}%`).join(',')})`;
      layer.dark.style.background = `radial-gradient(${px(1149.4)} ${px(746.5)} at ${px(756 - V.x)} ${px(736.5 - V.y)},${darkStops().map(([t, c]) => c + ' ' + (t * 100) + '%').join(',')})`;
      q('#pc-land').setAttribute('fill', rgb(PAL.land)); q('#pc-sky-dark-stop').setAttribute('stop-color', rgb(PAL.dark));
    }
    // keep the Moon in the sky (and off the words) when the sides are trimmed
    function placeMoon(){
      const mx = 180, my = 360, L = V.x + Math.min(.16 * V.w, 150), Rt = V.x + V.w - Math.min(.16 * V.w, 150), top = Math.max(my - 160, V.y + 90);
      const spots = [[mx, my], [L, my], [L, top], [Rt, top], [Rt, my], [V.x + V.w / 2, top]];
      const free = ([x, y]) => x > V.x + 40 && x < V.x + V.w - 40 && y > V.y + 40 && !onSkyline(x, y + 30)
        && !(Math.abs(Math.hypot(x - CX, y - CY) - (R_BASE + CAP / 2)) < CAP + 75 && Math.atan2(y - CY, x - CX) * 180 / Math.PI > TEXT_START - D(8) && Math.atan2(y - CY, x - CX) * 180 / Math.PI < WEND + D(4));
      const [x, y] = spots.find(free) || spots[1];
      moonEl.setAttribute('transform', x === mx && y === my ? '' : `translate(${(x - mx).toFixed(1)} ${(y - my).toFixed(1)})`);
    }
    function nearWords(x, y){
      const dr = Math.hypot(x - CX, y - CY) - (R_BASE + CAP / 2), a = Math.atan2(y - CY, x - CX) * 180 / Math.PI;
      return Math.abs(dr) < CAP * .9 + 6 && a > TEXT_START - D(3) && a < WEND + D(2);
    }
    let bgTimer = 0, bgDone = false;
    function size(){
      const b = root.getBoundingClientRect(); if (!b.width || !b.height) return;
      dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
      V = view(b.width, b.height);
      cv.width = fly.width = flyOff.width = Math.round(b.width * dpr); cv.height = fly.height = flyOff.height = Math.round(b.height * dpr); flyBoxes = [];
      scale = cv.width / V.w;
      art.setAttribute('viewBox', `${V.x.toFixed(2)} ${V.y.toFixed(2)} ${V.w.toFixed(2)} ${V.h.toFixed(2)}`);
      paintSky();
      const clip = Math.max(0, (V.y + V.h - lowestRoof(V.x, V.x + V.w) - 4) * V.k);
      root.style.setProperty('--pc-clip', clip.toFixed(1) + 'px');
      const fg = q('#pc-dark-fade-grad'); fg.setAttribute('y1', (V.y + V.h - 240).toFixed(1)); fg.setAttribute('y2', (V.y + V.h).toFixed(1));
      const changed = fitCircle();
      placeMoon();
      const m = 12;
      shown = stars.filter(s => s.x > V.x - m && s.x < V.x + V.w + m && s.y > V.y - m && s.y < V.y + V.h + m && !nearWords(s.x, s.y));
      drawStars(performance.now());
      clearTimeout(bgTimer);
      if (!bgDone){ drawGlow(); drawBand(); bgDone = true; } else bgTimer = setTimeout(() => { drawGlow(); drawBand(); }, 120);
      if (changed && started) relayout();
    }
    function drawStars(now){
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(scale, 0, 0, scale, -V.x * scale, -V.y * scale);
      let fill = '#fff'; ctx.fillStyle = fill;
      const t = now / 1000, tinted = SKY.tints.on, lowN = SKY.lowStars.on ? SKY.lowStars.count : 0;
      for (const s of shown){
        if (s.low !== undefined && s.low >= lowN) continue;
        const want = tinted && s.tint ? s.tint : '#fff';
        if (want !== fill){ fill = want; ctx.fillStyle = fill; }
        let m = 0;
        if (!reduce){
          const u = ((t / s.dur) + s.ph) % 1;
          if (u > s.rest){ const v = (u - s.rest) / (1 - s.rest); m = .5 - .5 * Math.cos(2 * Math.PI * v); }
        }
        const a = s.o * (1 - s.dim * m);
        if (a < .01) continue;
        ctx.globalAlpha = a;
        ctx.beginPath(); ctx.arc(s.x, s.y, Math.max(.2, s.r * (1 - s.shrink * m)), 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    let loop = 0, last = 0, visible = true;
    function tick(now){
      loop = requestAnimationFrame(tick);
      if (now - last < 1000 / SKY.twinkle.fps - 2) return;
      last = now; drawStars(now);
    }
    function startLoop(){ if (!loop && visible && !reduce) loop = requestAnimationFrame(tick); }
    function stopLoop(){ cancelAnimationFrame(loop); loop = 0; }

    /* ---------- words on the circle ---------- */
    const measure = document.createElement('canvas').getContext('2d');
    const FONT = '"Flamenco", Georgia, serif';
    function capRatio(){ measure.font = `300 100px ${FONT}`; const m = measure.measureText('H'); return m.actualBoundingBoxAscent ? m.actualBoundingBoxAscent / 100 : .68; }
    function textWidth(text, cap){ measure.font = `300 ${cap / capRatio()}px ${FONT}`; return measure.measureText(text).width; }

    // Fiona's own circle if it fits; otherwise search for the roomiest circle that does
    let fitKey = '', fitIn = '';
    function fitCircle(){
      const S = SKY.view, cap = Math.max(CAP0, S.letterPx[V.w >= V.h ? 0 : 1] / V.k), gap = GAP0 * cap / CAP0;
      const wG = textWidth(SKY.words.greeting, cap), wMax = Math.max(wG, textWidth(SKY.words.budget, cap));
      const inKey = [V.x, V.y, V.w, V.h, cap, wG, wMax, S.crop, S.spiral].map(v => typeof v === 'number' ? v.toFixed(1) : v).join();
      if (inKey === fitIn) return false;
      fitIn = inKey;
      const mid = TEXT0 + wG / (R0 - GAP0) * 90 / Math.PI;
      const test = (cx, cy, r, start, loose, grow = 0) => {
        const rb = r - gap, mg = Math.max(10, .045 * V.w), P = (a, rr) => [cx + rr * Math.cos(rad(a)), cy + rr * Math.sin(rad(a))];
        const spa = start + (-90 - TEXT0) * R0 / r, rr0 = a => r + (a > spa ? grow * (a - spa) * (a - spa) : 0);
        const end = start + wMax / rb * 180 / Math.PI;
        for (let a = start - 1; a <= end + 1; a += 1.5)
          for (const rr of [rb - 3, rb + cap * 1.15]){
            const [x, y] = P(a, rr);
            if (x < V.x + mg || x > V.x + V.w - mg || y < V.y + mg || belowRoof(x, y + 14)) return false;
          }
        const VB = V.y + V.h;
        let exit = null;
        for (let a = end; a <= 125; a += 1){
          const [x, y] = P(a, rr0(a));
          if (y >= VB){ exit = a; break; }
          if (!loose && (x < V.x + 6 || x > V.x + V.w - 6)) return false;
        }
        if (exit === null || exit < end + 15) return false;
        return exit;
      };
      let g = null;
      const ex0 = test(CX0, CY0, R0, TEXT0);
      if (ex0 !== false) g = { cx: CX0, cy: CY0, r: R0, start: TEXT0, exit: ex0, own: true };
      else for (const [loose, grows] of [[false, [0]], [false, S.spiral ? [.0015, .003, .005, .008] : []], [true, [0]]]){
        if (g) break;
        for (let fr = loose ? .9 : .62; fr >= .3; fr -= .02){
          const r = Math.min(R0, fr * V.w), start = mid - wG / (r - gap) * 90 / Math.PI;
          for (const fx of [.5, .45, .55, .4, .6, .35, .65]){
            const cx = V.x + fx * V.w;
            for (let fy = .2; fy <= .7; fy += .03) for (const gw of grows){
              const cy = V.y + fy * V.h + .857 * r;
              const ex = test(cx, cy, r, start, loose, gw); if (ex === false) continue;
              const score = -Math.abs(r / V.w - .45) * 2 - Math.abs(fy - .45) * 1.2 - Math.abs(fx - .5) * .6 - gw * 25;
              if (!g || score > g.score) g = { score, cx, cy, r, start, exit: ex, loose, grow: gw };
            }
          }
        }
      }
      if (!g){
        const r = Math.min(R0, .45 * V.w), cy = V.y + .4 * V.h + .857 * r;
        g = { cx: V.x + V.w / 2, cy, r, start: mid - wG / (r - gap) * 90 / Math.PI, exit: cy < V.y + V.h + r ? Math.asin(Math.max(-1, Math.min(1, (V.y + V.h - cy) / r))) * 180 / Math.PI : 30 };
      }
      CX = g.cx; CY = g.cy; R_PATH = g.r; R_BASE = g.r - gap; CAP = cap; TEXT_START = g.start; EXIT = g.exit; DOT_STEP = D(.32);
      GROW = g.grow || 0; SPA = TEXT_START + D(-90 - TEXT0);
      BUDGET = wMax; WEND = TEXT_START + wMax / R_BASE * 180 / Math.PI + D(SKY.write.trail);
      const key = [CX, CY, R_PATH, TEXT_START, CAP, GROW * 1e4].map(v => v.toFixed(1)).join();
      const changed = key !== fitKey; fitKey = key; return changed;
    }
    function layout(text, group, trailTo, opts = {}){
      let size = CAP / capRatio();
      const cr = capRatio(); measure.font = `300 ${size}px ${FONT}`;
      const natural = measure.measureText(text).width;
      if (natural > BUDGET){ size *= Math.max(.6, BUDGET / natural); measure.font = `300 ${size}px ${FONT}`; }
      const deg = len => len / R_BASE * 180 / Math.PI;
      const out = []; let end = TEXT_START;
      [...text].forEach((ch, i) => {
        const x0 = measure.measureText(text.slice(0, i)).width, w = measure.measureText(text.slice(0, i + 1)).width - x0;
        end = TEXT_START + deg(x0 + w);
        if (!ch.trim()) return;
        const a = TEXT_START + deg(x0 + w / 2), [x, y] = at(a, R_BASE);
        const g = document.createElementNS(NS, 'g');
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(a + 90).toFixed(2)})`);
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', size.toFixed(2)); t.setAttribute('fill', '#fff');
        t.style.transformBox = 'view-box'; t.style.transformOrigin = `0px ${(-size * cr / 2).toFixed(1)}px`;
        t.style.opacity = 0; t.textContent = ch;
        g.appendChild(t); group.appendChild(g);
        out.push({ el: t, a, dot: false });
      });
      if (typeof trailTo === 'function') trailTo = trailTo(end);
      const d0 = end + D(1.2), skyA = skylineAngle(d0);
      for (let a = d0; a <= trailTo; a += DOT_STEP){
        const [x, y] = at(a), c = document.createElementNS(NS, 'circle'), t = (a - d0) / ((trailTo - d0) || 1);
        c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('fill', '#fff');
        c.style.transformBox = 'view-box'; c.style.transformOrigin = `${x.toFixed(1)}px ${y.toFixed(1)}px`; c.style.opacity = 0;
        let r = DOT_R, o = 1;
        if (opts.taper){ const k = Math.pow(t, 1.1); o = 1 - .62 * k; r = DOT_R * (1 - .6 * k); }
        c.setAttribute('r', r.toFixed(2)); c.setAttribute('fill-opacity', o.toFixed(2));
        group.appendChild(c);
        out.push({ el: c, a, dot: true });
      }
      return { pieces: out.sort((p, q) => p.a - q.a), letters: [TEXT_START - D(1), end + D(1)], end, skyA };
    }
    function skylineAngle(from){
      for (let a = from; a < EXIT + D(10); a += D(.2)){ const [x, y] = at(a); if (onSkyline(x, y)) return a; }
      return EXIT;
    }

    /* ---------- shooting stars on their own canvas (Fiona's "grainy glow") ---------- */
    const fly = q('.pc-fly'), fctx = fly.getContext('2d'), flyOff = document.createElement('canvas'), octx = flyOff.getContext('2d');
    const flyers = new Set(); let flyRaf = 0, flyBoxes = [], grainPat = null;
    const TAIL = [[0, 'rgba(255,255,255,.95)'], [.35, 'rgba(224,246,255,.45)'], [1, 'rgba(224,246,255,0)']];
    const TAIL_CORE = [[0, 'rgba(255,255,255,.9)'], [.22, 'rgba(244,251,255,.45)'], [.45, 'rgba(224,246,255,0)']];
    const HALO = [[0, 'rgba(244,251,255,.9)'], [.32, 'rgba(224,246,255,.45)'], [1, 'rgba(224,246,255,0)']];
    const HEAD = [[0, 'rgba(255,255,255,1)'], [.28, 'rgba(255,255,255,.95)'], [.62, 'rgba(255,255,255,.5)'], [1, 'rgba(255,255,255,0)']];
    const CORE = [[0, 'rgba(255,255,255,.75)'], [.45, 'rgba(244,251,255,.3)'], [1, 'rgba(224,246,255,0)']];
    const stops = (g, s) => { s.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
    const lin = (c, x1, y1, x2, y2, s) => stops(c.createLinearGradient(x1, y1, x2, y2), s);
    const radial = (c, x, y, r, s) => stops(c.createRadialGradient(x, y, 0, x, y, r), s);
    const disc = (c, x, y, r, s) => { c.fillStyle = radial(c, x, y, r, s); c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); };
    const poly = (c, P) => { c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
    function drawStar(s){
      const k = scale, tx = -V.x * k, ty = -V.y * k, pad = s.halo + 4;
      let x0 = s.hx - pad, y0 = s.hy - pad, x1 = s.hx + pad, y1 = s.hy + pad;
      for (const [x, y] of s.outline){ x0 = Math.min(x0, x - 3); y0 = Math.min(y0, y - 3); x1 = Math.max(x1, x + 3); y1 = Math.max(y1, y + 3); }
      const bx = Math.max(0, Math.floor(x0 * k + tx)), by = Math.max(0, Math.floor(y0 * k + ty));
      const bw = Math.min(fly.width, Math.ceil(x1 * k + tx)) - bx, bh = Math.min(fly.height, Math.ceil(y1 * k + ty)) - by;
      if (bw <= 0 || bh <= 0) return;
      octx.setTransform(1, 0, 0, 1, 0, 0); octx.clearRect(bx, by, bw, bh);
      octx.save(); octx.beginPath(); octx.rect(bx, by, bw, bh); octx.clip();
      octx.setTransform(k, 0, 0, k, tx, ty);
      octx.globalCompositeOperation = 'source-over'; octx.globalAlpha = s.alpha;
      octx.fillStyle = lin(octx, s.hx, s.hy, s.ex, s.ey, TAIL); poly(octx, s.outline); octx.fill();
      disc(octx, s.hx, s.hy, s.halo, HALO);
      octx.globalAlpha = 1; octx.globalCompositeOperation = 'destination-in';
      octx.fillStyle = grainPat; octx.fillRect(x0, y0, x1 - x0, y1 - y0);
      octx.globalCompositeOperation = 'source-over'; octx.globalAlpha = s.alpha;
      octx.fillStyle = lin(octx, s.hx, s.hy, s.ex, s.ey, TAIL_CORE); poly(octx, s.outline); octx.fill();
      disc(octx, s.hx, s.hy, s.core, CORE);
      disc(octx, s.hx, s.hy, s.head, HEAD);
      octx.restore();
      fctx.globalAlpha = s.group; fctx.drawImage(flyOff, bx, by, bw, bh, bx, by, bw, bh); fctx.globalAlpha = 1;
      flyBoxes.push([bx, by, bw, bh]);
    }
    function flyFrame(now){
      fctx.setTransform(1, 0, 0, 1, 0, 0);
      for (const [x, y, w, h] of flyBoxes) fctx.clearRect(x - 1, y - 1, w + 2, h + 2);
      flyBoxes = [];
      for (const f of [...flyers]){ const s = f.step(now); if (s) drawStar(s); else flyers.delete(f); }
      if (flyBoxes.length){
        fctx.save(); fctx.beginPath(); for (const [x, y, w, h] of flyBoxes) fctx.rect(x, y, w, h); fctx.clip();
        fctx.globalCompositeOperation = 'destination-out'; fctx.setTransform(scale, 0, 0, scale, -V.x * scale, -V.y * scale);
        fctx.fill(skyline); fctx.restore();
      }
      flyRaf = flyers.size ? requestAnimationFrame(flyFrame) : 0;
    }
    function launch(f){ flyers.add(f); if (!flyRaf) flyRaf = requestAnimationFrame(flyFrame); return f; }
    function clearFlyers(){ flyers.clear(); cancelAnimationFrame(flyRaf); flyRaf = 0; fctx.setTransform(1, 0, 0, 1, 0, 0); fctx.clearRect(0, 0, fly.width, fly.height); flyBoxes = []; }

    /* ---------- one star flight along the circle ---------- */
    let writer = null;
    function flight(o){
      const N = 240, tab = [0];
      for (let i = 1; i <= N; i++){ const a = o.from + (o.to - o.from) * (i - .5) / N; tab.push(tab[i-1] + 1 / o.pace(a)); }
      for (let i = 0; i <= N; i++) tab[i] /= tab[N];
      const angle = x => { let i = 1; while (i < N && tab[i] < x) i++; const f = (x - tab[i-1]) / ((tab[i] - tab[i-1]) || 1); return o.from + (o.to - o.from) * (i - 1 + f) / N; };
      const t0 = performance.now();
      if (writer) flyers.delete(writer);
      writer = launch({ step(now){
        if (this.over) return null;
        const x = Math.min(1, (now - t0) / (o.dur * 1000)), a = angle(x), [hx, hy] = at(a);
        const len = D(4 + 8 * o.pace(a)), A = [], B = [];
        for (let i = 0; i <= 20; i++){
          const f = i / 20, ta = Math.max(o.from, a - f * len), w = 3 * Math.pow(1 - f, 1.3) + .15;
          A.push(at(ta, rp(ta) + w)); B.push(at(ta, rp(ta) - w));
        }
        const [ex, ey] = at(Math.max(o.from, a - len));
        o.onAngle(a);
        if (x >= 1){ this.over = true; o.done && o.done(); return null; }
        return { hx, hy, ex, ey, outline: A.concat(B.reverse()), halo: 17, core: 9, head: 5, alpha: 1,
                 group: Math.min(1, x / .05) * (o.fadeEnd && x > .8 ? 1 - (x - .8) / .2 : 1) };
      } });
    }
    const paceFor = (letters, slow, fast, soft) => a => {
      let u = Math.min(1, Math.max(0, Math.min(a - letters[0], letters[1] - a) / soft + .5)); u = u * u * (3 - 2 * u);
      return fast - (fast - slow) * u;
    };

    /* ---------- writing messages ---------- */
    // The star writes the greeting; a new message is written by the same star, which wipes the old words just ahead
    // of itself and leaves the new ones just behind. A message sent mid-flight waits its turn.
    let timers = [], current = null, currentText = SKY.words.greeting, busy = true, pending = null, onWritten = null;
    const trailFor = end => end + D(SKY.write.trail);
    function clearAll(){
      timers.forEach(clearTimeout); timers = []; clearFlyers(); writer = null;
      words.textContent = ''; front.textContent = ''; clearTimeout(randTimer);
    }
    const reveal = p => {
      p.el.animate(p.dot
        ? [{ opacity: 0, transform: 'scale(2.4)' }, { opacity: 1, transform: 'scale(1)' }]
        : [{ opacity: 0, transform: 'scale(1.2)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: p.dot ? 900 : 650, easing: p.dot ? 'ease-out' : 'cubic-bezier(.25,.8,.35,1)', fill: 'forwards' })
        .onfinish = e => { p.el.style.opacity = 1; e.target.cancel(); };
    };
    const durFor = (from, to) => Math.max(2.4, SKY.write.speed * (to - from) / D(1));
    function play(text = currentText, done){
      clearAll(); busy = true; started = true; currentText = text;
      current = layout(text, words, trailFor, { taper: true });
      if (reduce){ current.pieces.forEach(p => p.el.style.opacity = 1); busy = false; written(); done && done(); return; }
      let i = 0;
      const from = A(-166), to = current.end + D(SKY.write.after);
      flight({ from, to, dur: durFor(from, to), fadeEnd: true,
        pace: paceFor(current.letters, 1.6, 2.5, D(16)),
        onAngle: a => { while (i < current.pieces.length && a - current.pieces[i].a >= -D(1.5)) reveal(current.pieces[i++]); },
        done: () => { while (i < current.pieces.length) reveal(current.pieces[i++]); written(); done && done(); } });
    }
    function write(text){
      text = String(text).replace(/\s+/g, ' ').trim().slice(0, SKY.words.maxChars);
      if (!text) return;
      if (busy){ pending = text; return; }
      if (reduce || !current){ play(text); return; }
      busy = true; currentText = text; clearTimeout(randTimer);
      const old = current.pieces.map(p => { p.el.getAnimations().forEach(an => an.cancel()); p.el.style.opacity = 1; return p; });
      const oldReach = old.length ? old[old.length - 1].a : TEXT_START;
      const next = layout(text, words, trailFor, { taper: true });
      next.pieces.forEach(p => p.el.style.opacity = 0);
      const apply = a => {
        for (const p of old){ const [w, g] = p.dot ? [D(2.5), D(.2)] : [D(4.5), D(.4)]; p.el.style.opacity = smooth((p.a - a - g) / w).toFixed(3); }
        for (const p of next.pieces){ const [w, g] = p.dot ? [D(2.5), D(.2)] : [D(5), D(.4)]; p.el.style.opacity = smooth((a - p.a - g) / w).toFixed(3); }
      };
      const from = A(-166), to = Math.max(oldReach, next.end + D(SKY.write.trail)) + D(12);
      flight({ from, to, dur: durFor(from, to) * 1.15, fadeEnd: true,
        pace: paceFor(next.letters, 1.5, 2.4, D(12)),
        onAngle: apply,
        done: () => { apply(1e3); old.forEach(p => (p.dot ? p.el : p.el.parentNode).remove()); current = next; written(); } });
    }
    function written(){
      busy = false;
      art.setAttribute('aria-label', `${COPY.label} “${currentText}”.`);
      if (pending){ const t = pending; pending = null; write(t); return; }
      afterSequence();
      onWritten && onWritten(currentText);
    }
    // the postcard changed shape: settle the current words on the new circle (or start again if mid-flight)
    function relayout(){
      if (busy || reduce){ play(currentText); return; }
      clearAll();
      current = layout(currentText, words, trailFor, { taper: true });
      current.pieces.forEach(p => p.el.style.opacity = 1);
      schedule();
    }

    /* ---------- random shooting stars (only while the postcard is on screen) ---------- */
    let randTimer = 0;
    function afterSequence(){
      if (reduce) return;
      const [a, b] = SKY.meteors.firstAfter;
      randTimer = setTimeout(() => { streak(); schedule(); }, (a + Math.random() * (b - a)) * 1000);
    }
    function schedule(){
      clearTimeout(randTimer);
      if (reduce || !visible) return;
      randTimer = setTimeout(() => {
        if (!busy){ streak(); if (Math.random() < SKY.meteors.pairChance) setTimeout(streak, 350 + Math.random() * 500); }
        schedule();
      }, SKY.meteors.every * 1000 * (.5 + Math.random()));
    }
    function plan(){
      for (let tries = 0; tries < 40; tries++){
        const left = Math.random() < .5, h = rad(-12 + Math.random() * 30);
        const v = [Math.cos(h) * (left ? -1 : 1), Math.sin(h)];
        const yMax = Math.min(600, V.y + V.h * .57);
        const P0 = [V.x + (left ? .26 + Math.random() * .7 : .05 + Math.random() * .7) * V.w, V.y + 35 + Math.random() * (yMax - V.y - 35) * .5];
        const dist = (240 + Math.random() * 260) * Math.min(1, Math.max(.55, V.w / 1300)), bend = SKY.meteors.curve * (.55 + Math.random() * .9);
        const Rr = 412 / Math.max(bend, .02), nA = [-v[1], v[0]], n = nA[1] > 0 ? nA : [v[1], -v[0]];
        const C = [P0[0] + Rr * n[0], P0[1] + Rr * n[1]], r0 = [P0[0] - C[0], P0[1] - C[1]];
        const sg = Math.sign(r0[0] * v[1] - r0[1] * v[0]) || 1, th0 = Math.atan2(r0[1], r0[0]);
        const pos = s => { const th = th0 + sg * s / Rr; return [C[0] + Rr * Math.cos(th), C[1] + Rr * Math.sin(th)]; };
        let ok = true;
        for (let i = 0; i <= 20 && ok; i++){
          const [x, y] = pos(dist * i / 20);
          if (x < V.x + 10 || x > V.x + V.w - 10 || y < V.y + 10 || y > yMax || onSkyline(x, y)) ok = false;
          const ang = Math.atan2(y - CY, x - CX) * 180 / Math.PI, dr = Math.hypot(x - CX, y - CY) - rp(ang);
          if (Math.abs(dr) < 45 + CAP - CAP0 && ang > A(-150) && ang < EXIT + D(5)) ok = false;
        }
        if (ok) return { pos, dist };
      }
      return null;
    }
    function streak(){
      if (reduce) return;
      const p = plan(); if (!p) return;
      const dur = 700 + Math.random() * 500, len = 70 + Math.random() * 70, t0 = performance.now();
      launch({ step(now){
        const x = Math.min(1, (now - t0) / dur); if (x >= 1) return null;
        const k = 1 - Math.pow(1 - x, 1.6), s = p.dist * k;
        const l = Math.min(s, len * Math.min(1, k * 3.5) * (1 - .5 * x)), [hx, hy] = p.pos(s), A = [], B = [];
        for (let i = 0; i <= 12; i++){
          const f = i / 12, sa = s - f * l, w = 1.9 * Math.pow(1 - f, 1.2) + .1, [px, py] = p.pos(sa), [qx, qy] = p.pos(Math.max(0, sa - 1));
          let tx = px - qx, ty = py - qy; const mm = Math.hypot(tx, ty) || 1; tx /= mm; ty /= mm;
          A.push([px - ty * w, py + tx * w]); B.push([px + ty * w, py - tx * w]);
        }
        const [ex, ey] = p.pos(s - l);
        const o = x < .15 ? x / .15 : x > .6 ? 1 - (x - .6) / .4 : 1;
        return { hx, hy, ex, ey, outline: A.concat(B.reverse()), halo: 10, core: 5.5, head: 3.2, alpha: o, group: 1 };
      } });
    }

    /* ---------- grain: one still tile, made once ---------- */
    (function grainMask(){
      const T = 160, c = document.createElement('canvas'); c.width = c.height = T;
      const x = c.getContext('2d'), img = x.createImageData(T, T), r = rng(77);
      for (let i = 0; i < img.data.length; i += 4){
        const v = r(), L = v < .3 ? .2 + .15 * r() : .6 + .4 * r();
        img.data[i] = img.data[i+1] = img.data[i+2] = 255; img.data[i+3] = Math.round(L * 255);
      }
      x.putImageData(img, 0, 0);
      grainPat = octx.createPattern(c, 'repeat'); grainPat.setTransform(new DOMMatrix().scale(96 / T));
    })();
    let grainCanvas = null;
    (function grain(){
      const G = SKY.grain, T = 256, c = document.createElement('canvas'); c.width = c.height = T;
      const x = c.getContext('2d'), img = x.createImageData(T, T), r = rng(4242);
      for (let i = 0; i < img.data.length; i += 4){
        const v = Math.min(1, Math.max(0, .5 + (r() - .5) * (1 + 2 * G.roughness))) * 255;
        img.data[i] = img.data[i+1] = img.data[i+2] = v; img.data[i+3] = 255;
      }
      x.putImageData(img, 0, 0); grainCanvas = c;
      grainEl.style.backgroundImage = `url(${c.toDataURL()})`;
      grainEl.style.backgroundSize = `${T * G.size / (window.devicePixelRatio || 1)}px`;
      grainEl.style.opacity = G.on ? G.amount : 0;
    })();

    /* ---------- start; pause when hidden or scrolled away ---------- */
    let fontsDone = false, greeted = false, wentAway = false, canReplay = null;
    const setVisible = v => { visible = v; v ? (startLoop(), !busy && schedule()) : (stopLoop(), clearTimeout(randTimer)); whenSeen(); };
    new ResizeObserver(() => size()).observe(root);
    new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !document.hidden)).observe(root);
    // replay on return (see SKY.replay)
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting){ wentAway = true; return; }           // completely out of view
      if (e.intersectionRatio < SKY.replay.inView || !wentAway) return;
      wentAway = false;
      if (greeted && !reduce && !busy && !recording && (!canReplay || canReplay())) play(currentText);
    }, { threshold: [0, SKY.replay.inView] }).observe(root);
    document.addEventListener('visibilitychange', () => setVisible(!document.hidden && root.getBoundingClientRect().bottom > 0 && root.getBoundingClientRect().top < innerHeight));
    root.addEventListener('click', () => { if (!busy && !recording) play(currentText); });
    // wait for Flamenco, but never more than 1.5 s
    Promise.race([document.fonts.load(`300 40px "Flamenco"`, SKY.words.budget), new Promise(r => setTimeout(r, 1500))])
      .catch(() => {}).finally(() => { fitIn = ''; size(); startLoop(); fontsDone = true; whenSeen(); });
    // the opening starts only once the postcard is actually on screen and has painted
    function whenSeen(){
      if (greeted || !fontsDone || document.hidden || !visible) return;
      greeted = true;
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => play(currentText), 600)));
    }

    let palAnim = 0, palIndex = 0;
    function setPalette(i, instant){
      const from = PAL, to = toPal(SKY.palettes[i]), t0 = performance.now(); palIndex = i;
      cancelAnimationFrame(palAnim);
      const step = now => {
        const t = Math.min(1, (now - t0) / 1200), e = t * t * (3 - 2 * t);
        PAL = mixPal(from, to, e);
        paintSky(); tintGlow();
        if (t < 1) palAnim = requestAnimationFrame(step);
      };
      if (reduce || instant){ PAL = to; paintSky(); tintGlow(); } else palAnim = requestAnimationFrame(step);
    }

    /* ---------- the postcard as one picture (each video frame) ---------- */
    // Every layer onto one canvas in the on-screen order: sky, lift, pale light, glow, Milky Way, corner darkening,
    // stars, Moon, words, skyline (with its darkening), shooting stars, grain.
    const moonPath = new Path2D(MOON);
    let grainTile = null;
    function compose(c, out){
      const k = scale, W2 = cv.width, H2 = cv.height, py = y => (y - V.y) * k, ox = -V.x * k, oy = -V.y * k;
      c.save(); c.setTransform(out, 0, 0, out, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      let g = c.createLinearGradient(0, py(PAL.y1), 0, py(PAL.y2)); g.addColorStop(0, rgb(PAL.b1)); g.addColorStop(1, rgb(PAL.b2));
      c.fillStyle = g; c.fillRect(0, 0, W2, H2);
      g = c.createLinearGradient(0, py(PAL.lift), 0, py(982)); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, '#fff');
      c.globalAlpha = .2; c.fillStyle = g; c.fillRect(0, 0, W2, H2); c.globalAlpha = 1;
      c.imageSmoothingQuality = 'high';
      if (PAL.paleAmt > .001){
        const pg = SKY.paleGlow, pl = rgb(PAL.pale).slice(4, -1);
        c.save(); c.translate((pg.x - V.x) * k, (pg.y - V.y) * k); c.scale(1, pg.size / pg.rx);
        const r = c.createRadialGradient(0, 0, 0, 0, 0, pg.rx * k); paleStops().forEach(([u, al]) => r.addColorStop(u, `rgba(${pl},${al})`));
        c.fillStyle = r; c.fillRect(-1e5, -1e5, 2e5, 2e5); c.restore();
      }
      c.drawImage(glowCv, 0, 0, W2, H2);
      c.drawImage(bandCv, 0, 0, W2, H2);
      const darkFill = () => {
        c.save(); c.translate((756 - V.x) * k, (736.5 - V.y) * k); c.scale(1, 746.5 / 1149.4);
        const r = c.createRadialGradient(0, 0, 0, 0, 0, 1149.4 * k); darkStops().forEach(([t, col]) => r.addColorStop(t, col));
        c.fillStyle = r; c.fillRect(-1e5, -1e5, 2e5, 2e5); c.restore();
      };
      c.globalCompositeOperation = 'multiply'; darkFill(); c.globalCompositeOperation = 'source-over';
      c.drawImage(cv, 0, 0);
      c.save(); c.setTransform(out * k, 0, 0, out * k, out * ox, out * oy);
      const mt = (moonEl.getAttribute('transform') || '').match(/-?[\d.]+/g); if (mt) c.translate(+mt[0], +mt[1]);
      c.shadowColor = 'rgba(255,255,255,.6)'; c.shadowBlur = 8 * k * out; c.fillStyle = '#fff'; c.fill(moonPath); c.restore();
      c.save(); c.setTransform(out * k, 0, 0, out * k, out * ox, out * oy); c.fillStyle = '#fff'; c.textAlign = 'center';
      for (const e of words.querySelectorAll('text, circle')){
        const cs = getComputedStyle(e), o = +cs.opacity; if (o < .01) continue;
        const m = cs.transform && cs.transform !== 'none' ? +cs.transform.slice(7).split(',')[0] : 1;
        if (e.tagName === 'circle'){
          c.globalAlpha = o * (+e.getAttribute('fill-opacity') || 1);
          c.beginPath(); c.arc(+e.getAttribute('cx'), +e.getAttribute('cy'), +e.getAttribute('r') * m, 0, 6.2832); c.fill();
        } else {
          const [tx, ty, rot] = e.parentNode.getAttribute('transform').match(/-?[\d.]+/g).map(Number), sz = +e.getAttribute('font-size');
          const orY = parseFloat(e.style.transformOrigin.split(' ')[1]) || 0;
          c.save(); c.translate(tx, ty); c.rotate(rad(rot)); c.translate(0, orY); c.scale(m, m); c.translate(0, -orY);
          c.globalAlpha = o; c.font = `300 ${sz}px ${FONT}`; c.fillText(e.textContent, 0, 0); c.restore();
        }
      }
      c.restore(); c.globalAlpha = 1;
      c.save(); c.setTransform(out * k, 0, 0, out * k, out * ox, out * oy); c.fillStyle = rgb(PAL.land); c.fill(skyline); c.restore();
      const sd = document.createElement('canvas'); sd.width = W2; sd.height = H2; const s = sd.getContext('2d');
      s.setTransform(k, 0, 0, k, ox, oy); s.fillStyle = '#000'; s.fill(skyline); s.setTransform(1, 0, 0, 1, 0, 0);
      s.globalCompositeOperation = 'source-in';
      { const cc = c; c = s; darkFill(); c = cc; }
      s.globalCompositeOperation = 'destination-in';
      const fg = s.createLinearGradient(0, py(V.y + V.h - 240), 0, py(V.y + V.h));
      for (let i = 0; i <= 12; i++){ const u = i / 12, e = u * u * (3 - 2 * u); fg.addColorStop(u, `rgba(0,0,0,${(1 - e).toFixed(3)})`); }
      s.fillStyle = fg; s.fillRect(0, 0, W2, H2);
      c.globalCompositeOperation = 'multiply'; c.drawImage(sd, 0, 0); c.globalCompositeOperation = 'source-over';
      c.drawImage(fly, 0, 0);
      if (CREDIT.inVideo && CREDIT.text) drawCredit(c, W2 / root.clientWidth);
      if (SKY.grain.on){
        if (!grainTile) grainTile = c.createPattern(grainCanvas, 'repeat');
        grainTile.setTransform(new DOMMatrix().scale(SKY.grain.size));
        c.globalCompositeOperation = 'soft-light'; c.globalAlpha = SKY.grain.amount; c.fillStyle = grainTile; c.fillRect(0, 0, W2, H2);
      }
      c.restore();
    }

    // the credit, drawn as on screen (same size, spacing and place), so the video carries it too
    function drawCredit(c, k){
      const el = root.querySelector('.pc-credit'), cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize) || 10, sp = parseFloat(cs.letterSpacing) || 0;
      const right = parseFloat(cs.right) || 12, bottom = parseFloat(cs.bottom) || 10;
      const text = CREDIT.text.toUpperCase();
      c.save(); c.globalCompositeOperation = 'source-over'; c.globalAlpha = CREDIT.opacity; c.fillStyle = '#fff';
      c.font = `500 ${fs * k}px Jost, "Avenir Next", sans-serif`; c.textBaseline = 'alphabetic';
      const widths = [...text].map(ch => c.measureText(ch).width + sp * k), total = widths.reduce((a, b) => a + b, 0) - sp * k;
      let x = root.clientWidth * k - right * k - total;
      const y = root.clientHeight * k - bottom * k - fs * k * .28;
      [...text].forEach((ch, i) => { c.fillText(ch, x, y); x += widths[i]; });
      c.restore();
    }

    /* ---------- record the star writing the message: ~8 s, MP4 where the browser can, else WebM ---------- */
    let recording = false;
    function record(onProgress, onCanvas){
      return new Promise((resolve, reject) => {
        if (recording) return reject(new Error('busy'));
        const types = ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
        const type = window.MediaRecorder && types.find(t => MediaRecorder.isTypeSupported(t));
        if (!type || !HTMLCanvasElement.prototype.captureStream) return reject(new Error('This browser can’t make videos; the link still works.'));
        const out = Math.min(1, 1600 / cv.width), rc = document.createElement('canvas');
        rc.width = Math.round(cv.width * out / 2) * 2; rc.height = Math.round(cv.height * out / 2) * 2;
        const c = rc.getContext('2d'), stream = rc.captureStream(30);
        const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 8e6 }), chunks = [];
        rec.ondataavailable = e => e.data.size && chunks.push(e.data);
        recording = true; pending = null;
        let raf = 0, t0 = 0, total = 0, stopAt = 0;
        const frame = now => {
          compose(c, out);
          if (total) onProgress && onProgress(Math.min(1, (now - t0) / total));
          if (stopAt && now >= stopAt){ rec.stop(); return; }
          raf = requestAnimationFrame(frame);
        };
        rec.onstop = () => { cancelAnimationFrame(raf); recording = false; stream.getTracks().forEach(t => t.stop());
          resolve({ blob: new Blob(chunks, { type: type.split(';')[0] }), ext: type.includes('mp4') ? 'mp4' : 'webm', w: rc.width, h: rc.height }); };
        rec.onerror = e => { recording = false; reject(e.error || e); };
        compose(c, out); onCanvas && onCanvas(rc); rec.start(250); t0 = performance.now();
        const hold = 2.2, text = currentText;
        clearAll(); compose(c, out);
        const from = A(-166), to0 = layout(text, document.createElementNS(NS, 'g'), trailFor).end + D(SKY.write.after);
        total = (reduce ? 3 : durFor(from, to0) + .6 + hold) * 1000;
        setTimeout(() => play(text, () => { if (!reduce) stopAt = performance.now() + hold * 1000; }), reduce ? 0 : 600);
        if (reduce) stopAt = t0 + 3000;
        raf = requestAnimationFrame(frame);
      });
    }

    return {
      write, setPalette, record,
      // a shared link opens with the sender's message instead of the greeting (before the opening plays)
      open(text){ text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, SKY.words.maxChars); if (text && !started) currentText = text; },
      get text(){ return currentText; }, get busy(){ return busy || recording; }, palette: () => palIndex,
      set onWritten(fn){ onWritten = fn; },
      set canReplay(fn){ canReplay = fn; },
      // change the lettering size ([landscape, portrait] px) and let the star write it again
      letters(px){ SKY.view.letterPx = px; fitIn = ''; size(); if (!recording) play(currentText); }
    };
  }

  /* ==========================================================================================
     4. The controls round the postcard, and sharing
     ========================================================================================== */
  function controls(P){
    if (sharedText) P.open(sharedText);
    if (skyIndex) P.setPalette(skyIndex, true);
    const sw = [...el.swatches.children];
    sw.forEach((b, i) => b.addEventListener('click', () => {
      P.setPalette(i); skyIndex = i; applyCard(i);
      sw.forEach((c, j) => c.setAttribute('aria-pressed', i === j));
    }));

    // the message field: the send arrow wakes up once there's something to write
    const input = el.input, MAX = +input.maxLength;
    let sent = false;
    const syncField = () => { el.send.disabled = !input.value.trim(); el.count.textContent = input.value.length > MAX - 10 ? `${MAX - input.value.length} left` : ''; };
    input.addEventListener('input', () => { syncField(); el.help.classList.remove('pc-quiet'); });
    input.addEventListener('focus', () => { if (!sent) el.help.classList.remove('pc-quiet'); });
    input.addEventListener('blur', () => el.help.classList.add('pc-quiet'));
    el.form.addEventListener('submit', () => {
      const t = input.value.trim(); if (!t){ input.focus(); return; }
      el.send.classList.remove('pc-sent'); void el.send.offsetWidth; el.send.classList.add('pc-sent');
      P.write(t); sent = true; el.help.classList.add('pc-quiet'); el.count.textContent = '';
    });
    syncField();
    // no replay while someone is typing or the share window is open
    P.canReplay = () => document.activeElement !== input && sheet.hidden;

    // "Write your own" is a plain link to a fresh postcard.html (same tab), so the received postcard is never
    // changed and the phone's Back button returns to it. (In-app browsers in WhatsApp, Instagram etc. handle new tabs badly.)

    // ---------- share: a link straight away (like GIPHY), and a video made while you watch ----------
    const shareLink = () => {
      const u = new URL(SHARE_PAGE, document.baseURI);
      return `${u.href.split(/[?#]/)[0]}?postcard=${encodeURIComponent(P.text)}&sky=${P.palette() + 1}`;
    };
    let video = null, videoKey = '', making = false;
    const fileName = () => `${COPY.videoName}.${video.ext}`;
    const videoFile = () => new File([video.blob], fileName(), { type: video.blob.type });
    const setVideoButtons = on => {
      el.save.disabled = !on;
      const canShare = !!(on && navigator.canShare && navigator.canShare({ files: [videoFile()] }));
      el.shareVideo.hidden = !canShare; el.shareVideo.disabled = !canShare;
    };
    const showVideo = () => {
      el.media.textContent = '';
      const v = document.createElement('video'); v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      v.src = URL.createObjectURL(video.blob); el.media.appendChild(v); v.play().catch(() => {});
      el.videoNote.textContent = `${video.ext.toUpperCase()} · ${(video.blob.size / 1048576).toFixed(1)} MB`;
      setVideoButtons(true);
    };
    const setRing = p => el.ring.setAttribute('stroke-dashoffset', (144.5 * (1 - p)).toFixed(1));
    el.share.addEventListener('click', async () => {
      el.link.value = shareLink(); el.copy.textContent = 'Copy link';
      el.linkNote.textContent = '';
      el.media.style.setProperty('--pc-ar', `${el.postcard.clientWidth} / ${el.postcard.clientHeight}`);
      sheet.hidden = false; el.copy.focus();
      const key = P.text + '|' + P.palette() + '|' + el.media.style.getPropertyValue('--pc-ar');
      if (video && key === videoKey){ showVideo(); return; }
      if (making) return;
      making = true; video = null; setVideoButtons(false); el.media.textContent = ''; el.videoNote.textContent = '';
      const note = document.createElement('div'); note.className = 'pc-making'; note.textContent = 'Making your video…';
      el.share.setAttribute('aria-busy', 'true'); el.postcard.classList.add('pc-recording');
      try {
        video = await P.record(p => { setRing(p); note.textContent = `Making your video… ${Math.round(p * 100)}%`; },
                               canvas => { el.media.textContent = ''; el.media.append(canvas, note); });
        videoKey = key; showVideo();
      } catch (err){
        el.media.textContent = ''; el.videoNote.textContent = (err && err.message) || 'The video couldn’t be made in this browser; the link still works.';
      } finally {
        making = false; el.share.setAttribute('aria-busy', 'false'); el.postcard.classList.remove('pc-recording'); setRing(0);
      }
    });
    el.copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(el.link.value); el.copy.textContent = 'Copied'; }
      catch (e){ el.link.focus(); el.link.select(); el.linkNote.textContent = 'Press Ctrl+C (or ⌘C) to copy the selected link.'; }
    });
    const closeSheet = () => { sheet.hidden = true; el.media.querySelector('video')?.pause(); el.share.focus(); };
    el.close.addEventListener('click', closeSheet);
    sheet.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
    sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
    // the video alone: some apps drop the file if a link or text is sent with it
    el.shareVideo.addEventListener('click', async () => {
      try { await navigator.share({ files: [videoFile()], title: 'Postcard from Edinburgh' }); }
      catch (e){ if (e.name !== 'AbortError') el.videoNote.textContent = 'Sharing isn’t available here; use Download video instead.'; }
    });
    el.save.addEventListener('click', () => {
      const a = document.createElement('a'); a.href = URL.createObjectURL(video.blob); a.download = fileName();
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 30000);
    });
  }
})();
