/* ==========================================================================================
   Pencil Box · Play section · Fiona Cowie
   A tin of five magic pencils: tap the lid, it flips open on its hinges, and you draw on the paper inside.

   How it fits the site
   - The heading is in index.html; this script puts the tin in place of <div data-pencilbox> (like postcard.js).
   - The drawing engine (the "Final Five" pencils) only starts the first time the tin is opened, and pauses
     whenever the paper is out of sight.
   - Phones: the open tin grows to fill the screen (moved to the end of <body>, above the site's bar, because the
     site's <main> has a transform); the phone's Back gesture closes it.
   - One global only: window.startPencilBox (the engine, started by the tin below).
   ========================================================================================== */
(() => {
  'use strict';
  const mount = document.querySelector('[data-pencilbox]');
  if (!mount) return;

  /* ---------- 1. the tin's markup (lid artwork, inside of the lid, paper, pencil tray) ---------- */
  const MARKUP = "\n<!-- shared pencil artwork and pencil colours -->\n<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\" focusable=\"false\">\n  <defs>\n    <linearGradient id=\"gRainbow\" gradientUnits=\"userSpaceOnUse\" x1=\"12\" y1=\"37\" x2=\"38\" y2=\"11\">\n      <stop offset=\"0\" stop-color=\"#F4AFC0\"/><stop offset=\".2\" stop-color=\"#F7C9A0\"/>\n      <stop offset=\".4\" stop-color=\"#F3E39A\"/><stop offset=\".6\" stop-color=\"#B7E0BF\"/>\n      <stop offset=\".8\" stop-color=\"#AFD1F0\"/><stop offset=\"1\" stop-color=\"#CDBBEE\"/>\n    </linearGradient>\n    <linearGradient id=\"gGlitter\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"108\" y2=\"107\">\n      <stop offset=\"0\" stop-color=\"#E9C46A\"/><stop offset=\".5\" stop-color=\"#E59AB8\"/><stop offset=\"1\" stop-color=\"#B79CE0\"/>\n    </linearGradient>\n    <linearGradient id=\"gBubbles\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"108\" y2=\"107\">\n      <stop offset=\"0\" stop-color=\"#9ED8E8\"/><stop offset=\"1\" stop-color=\"#C3B6EC\"/>\n    </linearGradient>\n    <linearGradient id=\"gAurora\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"108\" y2=\"107\">\n      <stop offset=\"0\" stop-color=\"#3FD8C2\"/><stop offset=\".4\" stop-color=\"#3FA3EE\"/><stop offset=\".7\" stop-color=\"#7B6CF0\"/><stop offset=\"1\" stop-color=\"#E27BD0\"/>\n    </linearGradient>\n    <linearGradient id=\"gSunset\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"108\" y2=\"107\">\n      <stop offset=\"0\" stop-color=\"#FFB36B\"/><stop offset=\".4\" stop-color=\"#FF7A8A\"/><stop offset=\".7\" stop-color=\"#C86BD8\"/><stop offset=\"1\" stop-color=\"#6C6FE0\"/>\n    </linearGradient>\n    <linearGradient id=\"gDreamy\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"108\" y2=\"107\">\n      <stop offset=\"0\" stop-color=\"#5B5BF0\"/><stop offset=\".3\" stop-color=\"#4E8EEA\"/><stop offset=\".55\" stop-color=\"#FF86C8\"/><stop offset=\".8\" stop-color=\"#FFB3A7\"/><stop offset=\"1\" stop-color=\"#FFD98C\"/>\n    </linearGradient>\n    <linearGradient id=\"gSherbet\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"108\" y2=\"107\">\n      <stop offset=\"0\" stop-color=\"#FFE11A\"/><stop offset=\".45\" stop-color=\"#FFB0A0\"/><stop offset=\"1\" stop-color=\"#F56CCB\"/>\n    </linearGradient>\n    <linearGradient id=\"gOcean\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"108\" y2=\"107\">\n      <stop offset=\"0\" stop-color=\"#9BE7F0\"/><stop offset=\".4\" stop-color=\"#3FB7D8\"/><stop offset=\".7\" stop-color=\"#2C7FC4\"/><stop offset=\"1\" stop-color=\"#243F9E\"/>\n    </linearGradient>\n    <linearGradient id=\"gFinalGlitter\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"23\" x2=\"141\" y2=\"23\">\n      <stop offset=\"0\" stop-color=\"#5B64EF\"/><stop offset=\".25\" stop-color=\"#5B8BEF\"/><stop offset=\".45\" stop-color=\"#B888F6\"/><stop offset=\".65\" stop-color=\"#FF83FE\"/><stop offset=\".82\" stop-color=\"#FFA59A\"/><stop offset=\"1\" stop-color=\"#FFC800\"/>\n    </linearGradient>\n    <linearGradient id=\"gFinalBubbles\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"23\" x2=\"141\" y2=\"23\">\n      <stop offset=\"0\" stop-color=\"#A8C3F7\"/><stop offset=\".35\" stop-color=\"#FFB5FE\"/><stop offset=\".7\" stop-color=\"#ADCEC0\"/><stop offset=\"1\" stop-color=\"#FFDE66\"/>\n    </linearGradient>\n    <linearGradient id=\"gFinalStars\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"23\" x2=\"141\" y2=\"23\">\n      <stop offset=\"0\" stop-color=\"#F0868E\"/><stop offset=\".3\" stop-color=\"#F79AB8\"/><stop offset=\".6\" stop-color=\"#FFA59A\"/><stop offset=\".8\" stop-color=\"#FFB98A\"/><stop offset=\"1\" stop-color=\"#FFC9A6\"/>\n    </linearGradient>\n    <!-- flowers: the flower blue down to the tip (the line it draws), with the flowers' gold and pink blushing in at the eraser end -->\n    <linearGradient id=\"gFinalFlowers\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"23\" x2=\"141\" y2=\"23\">\n      <stop offset=\"0\" stop-color=\"#FFC800\"/><stop offset=\".14\" stop-color=\"#FF8AC8\"/><stop offset=\".3\" stop-color=\"#FD1BED\"/><stop offset=\".48\" stop-color=\"#7F5CF0\"/><stop offset=\".62\" stop-color=\"#336FED\"/><stop offset=\"1\" stop-color=\"#336FED\"/>\n    </linearGradient>\n    <!-- birds: a sky-blue pencil (swallows fill the sky rather than draw a line), deepening smoothly to the lead tip -->\n    <linearGradient id=\"gFinalBirds\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"23\" x2=\"141\" y2=\"23\">\n      <stop offset=\"0\" stop-color=\"#D3E9FE\"/><stop offset=\".5\" stop-color=\"#A9D4FD\"/><stop offset=\".8\" stop-color=\"#7DBAF6\"/><stop offset=\"1\" stop-color=\"#4F95E8\"/>\n    </linearGradient>\n    <symbol id=\"pencilArt\" viewBox=\"0 0 109 107\" overflow=\"visible\">\n      <!-- Fiona's Pencil.svg (141 \u00d7 46, pointing right), laid onto the old diagonal so the cursor's tip and eraser points are unchanged -->\n      <g transform=\"translate(108.5 106.9) rotate(44.54) translate(-141 -23)\">\n        <path class=\"pb-pencil-body\" style=\"fill: var(--body, #15171A)\" d=\"M100.814 4.59755C95.8137 4.09755 15.3137 2.29041 6.81371 6.29041C-1.6863 10.2904 -3.18627 37.9999 7.81372 39.9999C18.8137 41.9999 98.8137 40.7904 100.814 39.7904C102.814 38.7904 141 24.2448 141 23.0975C141 21.9503 105.814 5.09756 100.814 4.59755Z\"/>\n        <path class=\"pb-pencil-top\" d=\"M97.2993 37.5242C97.6528 37.8778 98.7134 38.2313 98.7134 38.2313L106.845 34.3422L124.5 27.0975L124 17.5975L113 12.5975L101.5 6.59755C101.5 6.59755 97.6528 8.17929 97.6528 8.88638C97.6528 9.59347 103.31 15.2503 103.31 15.9574C103.31 16.6646 97.6528 23.7356 97.6528 24.4427C97.6528 25.1498 102.956 33.2816 102.956 33.2816C102.956 33.2816 96.9457 37.1706 97.2993 37.5242Z\" fill=\"#FAF8F4\" stroke=\"#FAF8F4\"/>\n        <path class=\"pb-pencil-eraser\" style=\"fill: var(--eraser, var(--body, #15171A))\" d=\"M20 40.7948C14.2088 40.6234 9.84004 40.3683 7.81348 39.9999C-3.18612 37.9994 -1.68638 10.29 6.81348 6.28993C8.56954 5.46359 13.3987 4.873 20 4.45888V40.7948Z\"/>\n        <path class=\"pb-pencil-stripes-vertical\" d=\"M24 40.8983C23.319 40.8839 22.652 40.8668 22 40.8505V4.34169C22.6525 4.30597 23.3195 4.2709 24 4.23817V40.8983ZM20 40.7948C19.3128 40.7745 18.6456 40.7532 18 40.7304V4.59267C18.6465 4.54572 19.3137 4.50193 20 4.45888V40.7948Z\" fill=\"#FAF8F4\"/>\n        <g class=\"pb-pencil-stripes-horizontal\" stroke=\"#FAF8F4\" stroke-width=\"2\" stroke-linecap=\"round\">\n          <path d=\"M32 14.5975H98.468\"/>\n          <path d=\"M30 30.5975H96.468\"/>\n        </g>\n      </g>\n    </symbol>\n  </defs>\n</svg>\n<!-- relief filters for the inside of the lid -->\n<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\" focusable=\"false\"><defs>\n<filter id=\"pbS-plate\" x=\"-8%\" y=\"-8%\" width=\"116%\" height=\"122%\" color-interpolation-filters=\"sRGB\">\n  <feFlood flood-color=\"#2E5CC2\" flood-opacity=\"0.06\"/>\n  <feComposite in2=\"SourceAlpha\" operator=\"in\" result=\"flr\"/>\n  <feOffset in=\"SourceAlpha\" dx=\"3.20\" dy=\"3.20\" result=\"tla\"/>\n  <feComposite in=\"SourceAlpha\" in2=\"tla\" operator=\"out\" result=\"tlb\"/>\n  <feGaussianBlur in=\"tlb\" stdDeviation=\"1.00\" result=\"tlc\"/>\n  <feComposite in=\"tlc\" in2=\"SourceAlpha\" operator=\"in\" result=\"tl\"/>\n  <feFlood flood-color=\"#2E5CC2\" flood-opacity=\"0.5\"/>\n  <feComposite in2=\"tl\" operator=\"in\" result=\"shd\"/>\n  <feOffset in=\"SourceAlpha\" dx=\"1.76\" dy=\"1.76\" result=\"lpa\"/>\n  <feComposite in=\"lpa\" in2=\"SourceAlpha\" operator=\"out\" result=\"lpb\"/>\n  <feGaussianBlur in=\"lpb\" stdDeviation=\"0.80\" result=\"lip\"/>\n  <feFlood flood-color=\"#FFFCF7\" flood-opacity=\"0.22\"/>\n  <feComposite in2=\"lip\" operator=\"in\" result=\"lit\"/>\n  <feMerge><feMergeNode in=\"SourceGraphic\"/><feMergeNode in=\"flr\"/><feMergeNode in=\"shd\"/><feMergeNode in=\"lit\"/></feMerge>\n</filter>\n<filter id=\"pbS-letters\" x=\"-8%\" y=\"-8%\" width=\"116%\" height=\"122%\" color-interpolation-filters=\"sRGB\">\n  <feFlood flood-color=\"#2E5CC2\" flood-opacity=\"0.06\"/>\n  <feComposite in2=\"SourceAlpha\" operator=\"in\" result=\"flr\"/>\n  <feOffset in=\"SourceAlpha\" dx=\"2.56\" dy=\"2.56\" result=\"tla\"/>\n  <feComposite in=\"SourceAlpha\" in2=\"tla\" operator=\"out\" result=\"tlb\"/>\n  <feGaussianBlur in=\"tlb\" stdDeviation=\"1.00\" result=\"tlc\"/>\n  <feComposite in=\"tlc\" in2=\"SourceAlpha\" operator=\"in\" result=\"tl\"/>\n  <feFlood flood-color=\"#2E5CC2\" flood-opacity=\"0.5\"/>\n  <feComposite in2=\"tl\" operator=\"in\" result=\"shd\"/>\n  <feOffset in=\"SourceAlpha\" dx=\"1.41\" dy=\"1.41\" result=\"lpa\"/>\n  <feComposite in=\"lpa\" in2=\"SourceAlpha\" operator=\"out\" result=\"lpb\"/>\n  <feGaussianBlur in=\"lpb\" stdDeviation=\"0.80\" result=\"lip\"/>\n  <feFlood flood-color=\"#FFFCF7\" flood-opacity=\"0.22\"/>\n  <feComposite in2=\"lip\" operator=\"in\" result=\"lit\"/>\n  <feMerge><feMergeNode in=\"SourceGraphic\"/><feMergeNode in=\"flr\"/><feMergeNode in=\"shd\"/><feMergeNode in=\"lit\"/></feMerge>\n</filter>\n<filter id=\"pbS-dots\" x=\"-8%\" y=\"-8%\" width=\"116%\" height=\"122%\" color-interpolation-filters=\"sRGB\">\n  <feFlood flood-color=\"#2E5CC2\" flood-opacity=\"0.06\"/>\n  <feComposite in2=\"SourceAlpha\" operator=\"in\" result=\"flr\"/>\n  <feOffset in=\"SourceAlpha\" dx=\"1.12\" dy=\"1.12\" result=\"tla\"/>\n  <feComposite in=\"SourceAlpha\" in2=\"tla\" operator=\"out\" result=\"tlb\"/>\n  <feGaussianBlur in=\"tlb\" stdDeviation=\"1.00\" result=\"tlc\"/>\n  <feComposite in=\"tlc\" in2=\"SourceAlpha\" operator=\"in\" result=\"tl\"/>\n  <feFlood flood-color=\"#2E5CC2\" flood-opacity=\"0.5\"/>\n  <feComposite in2=\"tl\" operator=\"in\" result=\"shd\"/>\n  <feOffset in=\"SourceAlpha\" dx=\"0.62\" dy=\"0.62\" result=\"lpa\"/>\n  <feComposite in=\"lpa\" in2=\"SourceAlpha\" operator=\"out\" result=\"lpb\"/>\n  <feGaussianBlur in=\"lpb\" stdDeviation=\"0.80\" result=\"lip\"/>\n  <feFlood flood-color=\"#FFFCF7\" flood-opacity=\"0.22\"/>\n  <feComposite in2=\"lip\" operator=\"in\" result=\"lit\"/>\n  <feMerge><feMergeNode in=\"SourceGraphic\"/><feMergeNode in=\"flr\"/><feMergeNode in=\"shd\"/><feMergeNode in=\"lit\"/></feMerge>\n</filter>\n<filter id=\"pbS-vine\" x=\"-8%\" y=\"-8%\" width=\"116%\" height=\"122%\" color-interpolation-filters=\"sRGB\">\n  <feFlood flood-color=\"#2E5CC2\" flood-opacity=\"0.06\"/>\n  <feComposite in2=\"SourceAlpha\" operator=\"in\" result=\"flr\"/>\n  <feOffset in=\"SourceAlpha\" dx=\"1.28\" dy=\"1.28\" result=\"tla\"/>\n  <feComposite in=\"SourceAlpha\" in2=\"tla\" operator=\"out\" result=\"tlb\"/>\n  <feGaussianBlur in=\"tlb\" stdDeviation=\"1.00\" result=\"tlc\"/>\n  <feComposite in=\"tlc\" in2=\"SourceAlpha\" operator=\"in\" result=\"tl\"/>\n  <feFlood flood-color=\"#2E5CC2\" flood-opacity=\"0.5\"/>\n  <feComposite in2=\"tl\" operator=\"in\" result=\"shd\"/>\n  <feOffset in=\"SourceAlpha\" dx=\"0.70\" dy=\"0.70\" result=\"lpa\"/>\n  <feComposite in=\"lpa\" in2=\"SourceAlpha\" operator=\"out\" result=\"lpb\"/>\n  <feGaussianBlur in=\"lpb\" stdDeviation=\"0.80\" result=\"lip\"/>\n  <feFlood flood-color=\"#FFFCF7\" flood-opacity=\"0.22\"/>\n  <feComposite in2=\"lip\" operator=\"in\" result=\"lit\"/>\n  <feMerge><feMergeNode in=\"SourceGraphic\"/><feMergeNode in=\"flr\"/><feMergeNode in=\"shd\"/><feMergeNode in=\"lit\"/></feMerge>\n</filter>\n</defs></svg>\n  <div class=\"pb-tin\" id=\"pbTin\" data-state=\"closed\">\n    <div class=\"pb-box\" id=\"pbBox\">\n      <button type=\"button\" class=\"pb-peek\" id=\"pbPeek\" hidden tabindex=\"-1\" aria-hidden=\"true\"><canvas id=\"pbPeekCanvas\" aria-hidden=\"true\"></canvas></button>\n      <div class=\"pb-inner\" id=\"pbInner\" hidden>\n        <div class=\"desk\" id=\"desk\">\n          <div class=\"pb-area\" id=\"pbArea\"><div class=\"pb-paper\" id=\"pbPaper\">\n            <div class=\"stage unpicked\" id=\"stage\" role=\"img\" aria-label=\"Drawing paper. Choose a pencil from the box, then press and drag to draw.\">\n              <svg viewBox=\"0 0 1728 1117\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n                <filter id=\"paperNoise\" x=\"0\" y=\"0\" width=\"1728\" height=\"1117\" filterUnits=\"userSpaceOnUse\">\n                  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" seed=\"7\"/>\n                  <feColorMatrix type=\"matrix\" values=\"0 0 0 0 0.35  0 0 0 0 0.33  0 0 0 0 0.3  0 0 0 0.9 -0.35\"/>\n                </filter>\n                <rect width=\"1728\" height=\"1117\" filter=\"url(#paperNoise)\" opacity=\".5\"/>\n              </svg>\n              <canvas id=\"waterCanvas\"></canvas>\n              <canvas id=\"inkCanvas\"></canvas>\n              <canvas id=\"liveCanvas\"></canvas>\n              <svg id=\"cursor\" viewBox=\"0 0 1728 1117\" aria-hidden=\"true\">\n                <ellipse id=\"tipShadow\" rx=\"7\" ry=\"3.2\" fill=\"#2B2B2B\" opacity=\"0\"/>\n                <g id=\"pencil\"><use id=\"pencilUse\" href=\"#pencilArt\" width=\"109\" height=\"107\"/></g>\n              </svg>\n              <div class=\"hint\" id=\"hint\">Pick a pencil from the box</div>\n              <div class=\"fps-badge\" id=\"fpsBadge\" aria-hidden=\"true\">\u2013 fps</div>\n            </div>\n            <div class=\"pb-controls\" role=\"group\" aria-label=\"Paper\">\n              <button type=\"button\" class=\"pb-rb is-eraser\" id=\"pbEraser\" aria-pressed=\"false\" aria-label=\"Flip to eraser\" data-tip=\"Flip to eraser\">\n                <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><g class=\"on\"><path d=\"M4.5 14.5l8.5-8.5 6 6-7 7H9.5z\"/><path d=\"M9 10l6 6\"/><path d=\"M12.5 19.5H20\"/></g><g class=\"off\"><path d=\"M5 19l1-4.2 10-10 3.2 3.2-10 10z\"/><path d=\"M14 7l3.2 3.2\"/></g></svg>\n              </button>\n              <button type=\"button\" class=\"pb-rb\" id=\"pbHand\" aria-pressed=\"false\" aria-label=\"Right-handed. Switch to left hand\" data-tip=\"Switch to left hand\">\n                <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><g class=\"pb-hand\"><path d=\"M18 11V6a2 2 0 0 0-4 0\"/><path d=\"M14 10V4a2 2 0 0 0-4 0v2\"/><path d=\"M10 10.5V6a2 2 0 0 0-4 0v8\"/><path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\"/></g></svg>\n              </button>\n              <button type=\"button\" class=\"pb-rb\" id=\"pbTear\" aria-label=\"Tear off page\" data-tip=\"Tear off page\">\n                <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M14 20H6.5A1.5 1.5 0 0 1 5 18.5V7.5A1.5 1.5 0 0 1 6.5 6h11A1.5 1.5 0 0 1 19 7.5V15\"/><path d=\"M8.5 4v3.5M12 4v3.5M15.5 4v3.5\"/><path d=\"M19 15c-2.8 0-5 2.2-5 5 0-1.6-.2-3.4 1-4s2.4-1 4-1z\"/></svg>\n              </button>\n              <button type=\"button\" class=\"pb-rb\" id=\"pbSound\" aria-pressed=\"true\" aria-label=\"Sound on. Turn sound off\" data-tip=\"Turn sound off\">\n                <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.5 9.5h3l4.5-4v13l-4.5-4h-3z\"/><g class=\"on\"><path d=\"M15.5 9a4 4 0 0 1 0 6\"/><path d=\"M17.8 6.6a7.5 7.5 0 0 1 0 10.8\"/></g><g class=\"off\"><path d=\"M15.5 9.5l5 5M20.5 9.5l-5 5\"/></g></svg>\n              </button>\n              <button type=\"button\" class=\"pb-rb\" id=\"pbSave\" aria-label=\"Download drawing\" data-tip=\"Download drawing\">\n                <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 4.5v10\"/><path d=\"M7.5 10.5 12 15l4.5-4.5\"/><path d=\"M5 19.5h14\"/></svg>\n              </button>\n            </div>\n            <span class=\"pb-status toast\" id=\"toast\" role=\"status\" aria-live=\"polite\"></span>\n          </div></div>\n          <section class=\"box\" aria-label=\"Pencil box\">\n            <div class=\"box-top\">\n              <span class=\"box-title\" id=\"boxTitle\" aria-live=\"polite\">Try one out\u2026</span>\n              <span class=\"box-note\" id=\"boxNote\" hidden></span>\n              <button type=\"button\" class=\"pb-x\" id=\"pbFullClose\" aria-label=\"Close the Pencil Box\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/></svg></button>\n            </div>\n            <div class=\"slots\" id=\"slots\"></div>\n          </section>\n        </div>\n      </div>\n    </div>\n    <span class=\"pb-hinge l\" aria-hidden=\"true\"></span><span class=\"pb-hinge r\" aria-hidden=\"true\"></span>\n    <div class=\"pb-lid\" id=\"pbLid\">\n      <div class=\"pb-face front\" id=\"pbFront\">\n        <svg class=\"pb-lid-art\" viewBox=\"0 0 1240 540\" fill=\"none\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\">\n<g id=\"pb-lid-pencil-tin-lid\">\n<rect id=\"pb-lid-box-background\" width=\"1239.31\" height=\"539.7\" rx=\"46.1211\" fill=\"#5B8BEF\"/>\n<path id=\"pb-lid-outer-border\" d=\"M33.9727 126.961C33.9727 73.983 76.9199 35.0326 129.898 35.0326L626.512 30.5361L1105.14 32.035C1158.12 32.035 1204.06 73.983 1204.06 126.961L1204.56 251.864L1203.06 408.742C1203.06 457.306 1163.7 503.668 1115.13 503.668L668.979 506.666L117.907 500.671C71.5515 500.671 33.9727 469.087 33.9727 422.731V126.961Z\" fill=\"#FFEE34\"/>\n<path id=\"pb-lid-main-border\" d=\"M40.9688 126.961C40.9688 77.2941 76.2357 43.0264 125.903 43.0264L640.003 38.0303L1108.14 40.0287C1157.81 40.0287 1198.07 77.2941 1198.07 126.961V408.742C1198.07 458.409 1157.81 498.672 1108.14 498.672C1108.14 498.672 797.381 496.674 599.535 498.672C408.726 500.6 130.899 494.675 130.899 494.675C81.2319 494.675 40.9688 470.4 40.9688 420.733L41.968 262.856L40.9688 126.961Z\" fill=\"#FFC800\"/>\n<path id=\"pb-lid-inner-border\" d=\"M72.9422 113.971C72.9422 85.8263 103.752 70.0051 131.896 70.0051L616.52 64.0098H1120.13C1148.27 64.0098 1170.09 92.8209 1170.09 120.965L1175.09 260.357L1170.09 417.735C1170.09 445.879 1142.28 468.695 1114.13 468.695C1114.13 468.695 589.541 467.196 568.557 468.695C547.573 470.194 127.9 468.695 127.9 468.695C99.7549 468.695 72.9422 445.879 72.9422 417.735L68.9453 265.853L72.9422 113.971Z\" fill=\"#FFE7DF\"/>\n<path id=\"pb-lid-inner-background\" d=\"M76.8945 114.399C76.8945 87.137 112.357 74.8734 140.171 74.8734L614.089 70.0654L1111.78 71.0647C1139.6 71.0647 1161.1 91.7057 1161.1 118.967C1161.1 118.967 1167.09 240.915 1167.09 281.841C1167.09 322.766 1161.16 417.74 1161.16 417.74C1161.16 445.001 1136.95 464.199 1109.14 464.199C1109.14 464.199 605.962 461.005 576.7 463.053C547.437 465.102 128.198 462.041 128.198 462.041C100.384 462.041 74.896 440.953 74.896 413.692C74.896 413.692 71.9453 294.704 71.9453 248.866C71.9453 203.028 76.8945 114.399 76.8945 114.399Z\" fill=\"#90CBFD\"/>\n<g id=\"pb-lid-pencil-letters-shadow\">\n<path id=\"pb-lid-P\" d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#883577\"/>\n<path id=\"pb-lid-E\" d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#883577\"/>\n<path id=\"pb-lid-N\" d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#883577\"/>\n<path id=\"pb-lid-S\" d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#883577\"/>\n<path id=\"pb-lid-L\" d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#883577\"/>\n<path id=\"pb-lid-C\" d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#883577\"/>\n<g id=\"pb-lid-I-pencil\">\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#883577\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#883577\"/>\n</g>\n<g id=\"pb-lid-pencil-letters-white\">\n<path id=\"pb-lid-P_2\" d=\"M222.566 198.949C252.191 193.306 276.822 191.916 294.071 196.348C302.705 198.567 309.528 202.253 314.193 207.633C318.863 213.021 321.327 220.058 321.327 228.888C321.326 237.805 317.108 244.736 310.84 250.093C304.584 255.44 296.267 259.238 287.993 261.929C279.713 264.622 271.439 266.218 265.239 267.14C262.138 267.601 259.553 267.894 257.743 268.072C256.838 268.161 256.126 268.221 255.639 268.259C255.504 268.27 255.385 268.278 255.286 268.285L243.423 324.765L243.337 325.178H242.915C233.466 325.18 226.055 325.661 219.365 325.902C212.681 326.142 206.728 326.143 200.257 325.173L199.756 325.097L199.819 324.594C205.965 275.047 210.705 247.582 222.158 199.339L222.235 199.011L222.566 198.949ZM267.53 210.596C267.125 210.647 266.735 210.78 266.446 211.052L266.326 211.165L266.293 211.326L255.81 262.681L256.28 262.809L256.416 262.308C256.292 262.768 256.281 262.806 256.28 262.809L256.282 262.81L256.287 262.811C256.29 262.812 256.295 262.813 256.301 262.814C256.337 262.824 256.423 262.846 256.55 262.876C257.748 263.156 262.793 264.177 268.687 262.958C275.45 261.56 283.268 257.21 287.542 245.527C291.833 233.795 287.383 224.435 281.532 218.39C278.61 215.372 275.327 213.166 272.58 211.883C271.208 211.242 269.951 210.822 268.926 210.654C268.414 210.57 267.94 210.544 267.53 210.596Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#FFFCF7\"/>\n<path id=\"pb-lid-E_2\" d=\"M329.116 328.258C347.131 262.595 347.476 238.864 359.741 199.41C394.375 196.278 447.981 196.813 448.5 202.528C449.019 208.242 445.757 219.919 431.371 225.388C416.984 230.856 399.189 216.555 399.189 216.555L392.441 251.885C392.441 251.885 416.837 250.619 419.432 253.963C422.028 257.306 412.652 280.939 388.289 274.745L381.541 298.124C402.472 302.508 420.585 312.631 438.571 294.645C456.557 276.659 436.832 371.133 367.527 319.95C350.131 307.104 336.078 330.083 329.116 328.258Z\" fill=\"#FFFCF7\"/>\n<path id=\"pb-lid-N_2\" d=\"M489.369 201.196C484.645 207.182 469.483 276.813 459.976 326.338H478.871L494.093 260.152L525.061 326.338C525.061 326.338 558.893 331.234 561.803 326.338C564.714 321.442 592.486 206.636 585.581 203.916C578.677 201.196 572.95 202.284 568.785 203.916C564.62 205.549 550.781 284.068 550.781 284.068C537.39 245.417 520.794 204.461 518.238 201.196C515.682 197.931 494.093 195.211 489.369 201.196Z\" fill=\"#FFFCF7\"/>\n<path id=\"pb-lid-S_2\" d=\"M938.308 287.754C954.717 270.316 975.849 284.548 970.915 287.754C950.782 297.766 976.32 325.807 988.512 306.488C1000.7 287.169 921.758 262.463 939.27 225.441C964.004 173.153 1045.32 200.287 1030.43 226.488C1015.55 252.689 992.256 236.731 997.949 233.749C1003.64 230.768 1014.59 197.786 984.575 212.092C954.556 226.398 1013.66 254.004 1022.87 284.639C1032.09 315.273 997.436 330.554 977.125 330.338C936.528 329.907 921.899 305.193 938.308 287.754Z\" fill=\"#FFFCF7\"/>\n<path id=\"pb-lid-L_2\" d=\"M826.587 325.142C802.974 348.456 844.749 204.529 847.878 201.553C851.006 198.577 886.325 197.832 884.747 201.553C883.168 205.275 861.388 280.585 864.494 295.543C884.746 305.409 898.767 292.427 906.037 288.792C913.307 285.158 905.099 326.462 882.15 328.258C859.201 330.053 850.2 301.829 826.587 325.142Z\" fill=\"#FFFCF7\"/>\n<path id=\"pb-lid-C_2\" d=\"M653.149 328.259C691.269 335.028 715.434 288.416 710.27 285.678C628.849 340.011 653.296 214.26 680.671 217.133C692.431 218.367 685.864 242.577 696.249 243.097C706.635 243.616 728.486 226.411 722.733 217.133C696.924 175.51 636.48 200.39 620.954 239.462C605.427 278.533 615.029 321.489 653.149 328.259Z\" fill=\"#FFFCF7\"/>\n<g id=\"pb-lid-I-pencil_2\">\n<path d=\"M775.698 324.104C771.544 328.259 743.503 333.451 738.829 322.027C734.156 310.603 757.771 235.729 760.12 229.594C762.469 223.46 779.137 192.573 786.084 193.765C793.031 194.956 794.862 219.021 795.95 236.864C796.397 244.195 779.853 319.949 775.698 324.104Z\" fill=\"#FFFCF7\"/>\n</g>\n</g>\n<g id=\"pb-lid-pencil-letters-pink\">\n<path id=\"pb-lid-P_3\" d=\"M225.652 201.132C255.277 195.49 279.908 194.099 297.157 198.532C305.791 200.75 312.614 204.437 317.278 209.817C321.949 215.204 324.412 222.241 324.412 231.072C324.412 239.989 320.194 246.92 313.926 252.276C307.67 257.623 299.353 261.421 291.079 264.112C282.799 266.805 274.525 268.401 268.325 269.323C265.224 269.785 262.639 270.077 260.829 270.255C259.924 270.344 259.212 270.405 258.725 270.443C258.59 270.454 258.471 270.461 258.371 270.468L246.509 326.948L246.423 327.361H246.001C236.552 327.363 229.141 327.844 222.451 328.085C215.767 328.326 209.814 328.326 203.343 327.356L202.842 327.281L202.905 326.778C209.051 277.231 213.791 249.766 225.244 201.523L225.321 201.195L225.652 201.132ZM270.616 212.779C270.211 212.831 269.821 212.963 269.532 213.236L269.412 213.348L269.379 213.51L258.896 264.865L259.366 264.993L259.502 264.492C259.378 264.951 259.367 264.989 259.366 264.993L259.368 264.994C259.369 264.994 259.371 264.994 259.372 264.995C259.376 264.996 259.381 264.996 259.387 264.998C259.399 265.001 259.417 265.006 259.439 265.012C259.485 265.023 259.551 265.04 259.636 265.06C259.807 265.1 260.057 265.154 260.376 265.216C261.014 265.339 261.933 265.487 263.059 265.592C265.31 265.802 268.406 265.838 271.773 265.142C278.536 263.744 286.354 259.394 290.628 247.71C294.919 235.978 290.469 226.618 284.617 220.574C281.696 217.556 278.413 215.35 275.666 214.067C274.294 213.426 273.037 213.006 272.012 212.837C271.5 212.753 271.026 212.728 270.616 212.779Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-E_3\" d=\"M332.203 330.441C350.218 264.778 350.563 241.047 362.828 201.593C397.462 198.461 451.068 198.996 451.587 204.711C452.106 210.425 448.844 222.102 434.458 227.571C420.071 233.04 402.276 218.739 402.276 218.739L395.528 254.068C395.528 254.068 419.924 252.802 422.519 256.146C425.115 259.489 415.739 283.122 391.376 276.928L384.628 300.307C405.558 304.691 423.672 314.815 441.658 296.829C459.644 278.843 439.919 373.317 370.613 322.133C353.218 309.287 339.164 332.266 332.203 330.441Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-N_3\" d=\"M492.455 203.38C487.731 209.366 472.569 278.997 463.062 328.522H481.957L497.179 262.336L528.147 328.522C528.147 328.522 561.979 333.419 564.889 328.522C567.8 323.626 595.572 208.82 588.667 206.1C581.763 203.38 576.036 204.468 571.871 206.1C567.706 207.733 553.867 286.252 553.867 286.252C540.476 247.601 523.88 206.645 521.324 203.38C518.768 200.115 497.179 197.395 492.455 203.38Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-S_3\" d=\"M941.396 289.938C957.805 272.499 978.937 286.732 974.003 289.938C953.87 299.95 979.408 327.991 991.6 308.672C1003.79 289.353 924.846 264.646 942.358 227.624C967.092 175.336 1048.41 202.471 1033.52 228.672C1018.64 254.872 995.344 238.914 1001.04 235.933C1006.73 232.951 1017.68 199.97 987.663 214.276C957.644 228.582 1016.75 256.187 1025.96 286.822C1035.18 317.457 1000.52 332.738 980.213 332.522C939.616 332.091 924.987 307.376 941.396 289.938Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-L_3\" d=\"M829.673 327.326C806.06 350.639 847.835 206.713 850.963 203.737C854.092 200.761 889.411 200.016 887.832 203.737C886.254 207.458 864.474 282.768 867.58 297.727C887.832 307.593 901.853 294.611 909.123 290.976C916.393 287.341 908.185 328.646 885.236 330.441C862.287 332.237 853.286 304.012 829.673 327.326Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-C_3\" d=\"M656.235 330.442C694.355 337.211 718.52 290.599 713.356 287.861C631.935 342.195 656.382 216.443 683.757 219.316C695.517 220.55 688.95 244.76 699.335 245.28C709.721 245.799 731.572 228.594 725.819 219.316C700.01 177.694 639.566 202.573 624.04 241.645C608.513 280.716 618.115 323.673 656.235 330.442Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<g id=\"pb-lid-I-pencil_3\">\n<path d=\"M778.784 326.288C774.63 330.443 746.589 335.635 741.915 324.211C737.242 312.787 760.857 237.913 763.206 231.779C765.555 225.644 782.223 194.757 789.17 195.949C796.117 197.14 797.948 221.206 799.036 239.049C799.483 246.379 782.938 322.134 778.784 326.288Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path d=\"M763.264 231.634C765.811 225.173 782.276 194.766 789.17 195.948C795.846 197.093 797.795 219.363 798.903 236.934C792.286 233.632 777.345 231.398 763.264 231.634Z\" fill=\"#D9D9D9\"/>\n<path d=\"M772.275 214.646C778.099 205.008 785.212 195.269 789.171 195.948C793.469 196.685 795.806 206.178 797.222 217.535C793.198 217.284 782.971 218.807 772.275 214.646Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n</g>\n<path id=\"pb-lid-P_4\" d=\"M225.652 201.132C255.277 195.49 279.908 194.099 297.157 198.532C305.791 200.75 312.614 204.437 317.278 209.817C321.949 215.204 324.412 222.241 324.412 231.072C324.412 239.989 320.194 246.92 313.926 252.276C307.67 257.623 299.353 261.421 291.079 264.112C282.799 266.805 274.525 268.401 268.325 269.323C265.224 269.785 262.639 270.077 260.829 270.255C259.924 270.344 259.212 270.405 258.725 270.443C258.59 270.454 258.471 270.461 258.371 270.468L246.509 326.948L246.423 327.361H246.001C236.552 327.363 229.141 327.844 222.451 328.085C215.767 328.326 209.814 328.326 203.343 327.356L202.842 327.281L202.905 326.778C209.051 277.231 213.791 249.766 225.244 201.523L225.321 201.195L225.652 201.132ZM270.616 212.779C270.211 212.831 269.821 212.963 269.532 213.236L269.412 213.348L269.379 213.51L258.896 264.865L259.366 264.993L259.502 264.492C259.378 264.951 259.367 264.989 259.366 264.993L259.368 264.994L259.372 264.995C259.376 264.996 259.381 264.996 259.387 264.998C259.399 265.001 259.417 265.006 259.439 265.012C259.485 265.023 259.551 265.04 259.636 265.06C259.807 265.1 260.057 265.154 260.376 265.216C261.014 265.339 261.933 265.487 263.059 265.592C265.31 265.802 268.406 265.838 271.773 265.142C278.536 263.744 286.354 259.394 290.628 247.71C294.919 235.978 290.469 226.618 284.617 220.574C281.696 217.556 278.413 215.35 275.666 214.067C274.294 213.426 273.037 213.006 272.012 212.837C271.5 212.753 271.026 212.728 270.616 212.779Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-E_4\" d=\"M332.203 330.442C350.218 264.779 350.563 241.048 362.828 201.594C397.462 198.461 451.068 198.997 451.587 204.711C452.106 210.426 448.844 222.103 434.458 227.571C420.071 233.04 402.276 218.739 402.276 218.739L395.528 254.069C395.528 254.069 419.924 252.803 422.519 256.146C425.115 259.49 415.739 283.122 391.376 276.929L384.628 300.308C405.558 304.691 423.672 314.815 441.658 296.829C459.644 278.843 439.919 373.317 370.613 322.134C353.218 309.287 339.164 332.267 332.203 330.442Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-N_4\" d=\"M492.455 203.379C487.731 209.365 472.569 278.996 463.062 328.521H481.957L497.179 262.335L528.147 328.521C528.147 328.521 561.979 333.418 564.889 328.521C567.8 323.625 595.572 208.819 588.667 206.099C581.763 203.379 576.036 204.467 571.871 206.099C567.706 207.732 553.867 286.251 553.867 286.251C540.476 247.6 523.88 206.644 521.324 203.379C518.768 200.114 497.179 197.394 492.455 203.379Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-S_4\" d=\"M941.396 289.938C957.805 272.499 978.937 286.732 974.003 289.938C953.87 299.95 979.408 327.991 991.6 308.672C1003.79 289.353 924.846 264.646 942.358 227.624C967.092 175.336 1048.41 202.471 1033.52 228.672C1018.64 254.872 995.344 238.914 1001.04 235.933C1006.73 232.951 1017.68 199.97 987.663 214.276C957.644 228.582 1016.75 256.187 1025.96 286.822C1035.18 317.457 1000.52 332.738 980.213 332.522C939.616 332.091 924.987 307.376 941.396 289.938Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-L_4\" d=\"M829.673 327.326C806.06 350.639 847.835 206.713 850.963 203.737C854.092 200.761 889.411 200.016 887.832 203.737C886.254 207.458 864.474 282.768 867.58 297.727C887.832 307.593 901.853 294.611 909.123 290.976C916.393 287.341 908.185 328.646 885.236 330.441C862.287 332.237 853.286 304.012 829.673 327.326Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path id=\"pb-lid-C_4\" d=\"M656.235 330.442C694.355 337.211 718.52 290.599 713.356 287.861C631.935 342.195 656.382 216.443 683.757 219.316C695.517 220.55 688.95 244.76 699.335 245.28C709.721 245.799 731.572 228.594 725.819 219.316C700.01 177.694 639.566 202.573 624.04 241.645C608.513 280.716 618.115 323.673 656.235 330.442Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<g id=\"pb-lid-I-pencil_4\">\n<path d=\"M778.784 326.288C774.63 330.443 746.589 335.635 741.915 324.211C737.242 312.787 760.857 237.913 763.206 231.779C765.555 225.644 782.223 194.757 789.17 195.949C796.117 197.14 797.948 221.206 799.036 239.049C799.483 246.379 782.938 322.134 778.784 326.288Z\" fill=\"#EE5CD1\" style=\"mix-blend-mode:hard-light\"/>\n<path d=\"M775.005 210.281C774.076 211.714 773.16 213.181 772.274 214.646C782.969 218.807 793.196 217.283 797.221 217.533C798.005 223.818 798.509 230.674 798.903 236.934C792.286 233.632 777.344 231.398 763.264 231.634C764.571 228.319 769.543 218.702 775.005 210.281ZM796.527 212.637C796.776 214.185 797.002 215.795 797.209 217.444C797.002 215.795 796.776 214.185 796.527 212.637ZM796.01 209.688C796.168 210.515 796.32 211.366 796.463 212.236C796.32 211.366 796.168 210.515 796.01 209.688ZM775.964 208.823C775.711 209.202 775.459 209.583 775.208 209.968C775.459 209.583 775.711 209.202 775.964 208.823ZM795.788 208.571C795.777 208.52 795.767 208.468 795.756 208.417C795.767 208.468 795.777 208.52 795.788 208.571ZM794.288 202.796C794.763 204.221 795.189 205.824 795.573 207.562C795.189 205.824 794.763 204.221 794.288 202.796ZM783.634 199.011C781.679 200.947 779.549 203.646 777.423 206.684C779.549 203.646 781.679 200.947 783.634 199.011ZM793.516 200.74C793.689 201.145 793.856 201.571 794.018 202.018C793.856 201.571 793.689 201.145 793.516 200.74ZM787.535 196.165C787.598 196.141 787.661 196.119 787.723 196.099C787.661 196.119 787.598 196.141 787.535 196.165ZM788.166 195.979C788.037 196.006 787.906 196.04 787.772 196.082C787.906 196.04 788.037 196.006 788.166 195.979ZM787.348 196.24C787.411 196.214 787.473 196.189 787.535 196.165C787.473 196.189 787.411 196.214 787.348 196.24Z\" fill=\"#FFE7DF\"/>\n</g>\n</g>\n<g id=\"pb-lid-circles-small\">\n<path d=\"M417.75 43.4455C413.553 41.9684 410.329 44.5293 409.756 48.9414C409.197 53.2374 411.921 57.7804 416.251 57.9344C420.697 58.0926 423.536 53.3811 423.245 48.9414C423.034 45.7011 420.813 44.5236 417.75 43.4455Z\" fill=\"#FFFCF7\"/>\n<path d=\"M449.152 42.9898C444.223 41.5549 438.006 45.4984 437.333 49.7842C436.677 53.9573 441.134 58.3703 446.218 58.5199C451.44 58.6735 455.861 54.0969 455.52 49.7842C455.272 46.6366 452.749 44.037 449.152 42.9898Z\" fill=\"#FFFCF7\"/>\n<path d=\"M481.128 44.5249C477.746 44.0678 474.643 46.2969 473.767 49.5958C472.573 54.0941 479.663 58.2989 483.76 56.0907C485.856 54.9607 487.141 53.4734 487.257 51.0946C487.418 47.7874 484.409 44.9683 481.128 44.5249Z\" fill=\"#FFFCF7\"/>\n<path d=\"M505.476 46.9526C500.179 46.9526 499.062 48.3662 498.6 51.7046C498.15 54.9552 500.402 56.8202 503.887 56.9367C507.467 57.0564 509.752 53.4915 509.518 50.1322C509.347 47.6803 507.912 46.9526 505.476 46.9526Z\" fill=\"#FFFCF7\"/>\n<path d=\"M536.041 45.2518C532.537 44.1653 528.116 47.1515 527.638 50.397C527.171 53.5571 530.34 56.899 533.955 57.0122C537.667 57.1286 540.811 53.6629 540.569 50.397C540.392 48.0134 538.598 46.0449 536.041 45.2518Z\" fill=\"#FFFCF7\"/>\n<path d=\"M558.639 43.9451C555.257 43.488 552.154 45.7172 551.278 49.016C549.818 54.5171 557.467 57.7245 561.564 55.5164C563.661 54.3864 564.652 52.8937 564.768 50.5149C564.929 47.2077 564.062 44.6782 558.639 43.9451Z\" fill=\"#FFFCF7\"/>\n<path d=\"M590.184 43.0259C585.734 43.0256 584.191 45.6085 583.617 50.0206C583.059 54.3166 585.867 56.8041 590.184 56.4361C595.109 56.0163 597.397 54.4603 597.107 50.0206C596.895 46.7802 595.108 43.0262 590.184 43.0259Z\" fill=\"#FFFCF7\"/>\n<path d=\"M624.838 44.9854C621.426 44.9853 617.523 46.885 617.081 50.1305C616.651 53.2907 619.576 56.6325 622.913 56.7458C626.339 56.8621 629.241 53.3964 629.018 50.1305C628.854 47.7469 627.513 44.9854 624.838 44.9854Z\" fill=\"#FFFCF7\"/>\n<path d=\"M647.206 46.4736C644.451 46.1092 641.211 47.7953 641.211 50.5163C641.211 56.0969 646.012 57.4547 649.349 55.6943C651.056 54.7934 652.103 53.6077 652.197 51.7112C652.329 49.0746 649.878 46.8271 647.206 46.4736Z\" fill=\"#FFFCF7\"/>\n<path d=\"M672.535 45.3941C667.248 45.0759 666.503 47.7867 666.041 51.1251C665.592 54.3757 667.843 56.2406 671.329 56.3572C674.908 56.4769 677.193 52.9119 676.959 49.5526C676.789 47.1008 675.144 45.5511 672.535 45.3941Z\" fill=\"#FFFCF7\"/>\n<path d=\"M700.001 44.4057C696.497 43.3191 692.076 46.3053 691.598 49.5508C691.131 52.711 694.376 55.4224 697.915 56.1661C701.955 57.0149 704.771 52.8167 704.529 49.5508C704.352 47.1672 702.558 45.1987 700.001 44.4057Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M725.499 43.3735C721.76 43.3735 718.399 45.3833 717.44 49.1245C715.842 55.3632 724.216 59.0008 728.702 56.4965C730.997 55.2149 732.082 53.5221 732.209 50.8243C732.386 47.0736 730.934 43.3736 725.499 43.3735Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1185.99 196.357C1181.36 194.773 1177.8 197.519 1177.17 202.249C1176.55 206.855 1179.56 211.725 1184.34 211.89C1189.24 212.06 1192.37 207.009 1192.05 202.249C1191.82 198.775 1189.37 197.512 1185.99 196.357Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M386.239 49.0339C381.64 47.8198 375.837 51.1566 375.208 54.783C374.596 58.3141 378.757 62.0482 383.502 62.1748C388.375 62.3048 390.692 58.4322 390.374 54.783C390.141 52.1196 389.597 49.92 386.239 49.0339Z\" fill=\"#FFFCF7\"/>\n<path d=\"M355.973 47.0862C352.253 46.6008 348.841 48.9681 347.878 52.4715C346.565 57.2488 354.362 61.7143 358.867 59.3691C361.172 58.1691 362.585 56.5895 362.713 54.0633C362.891 50.551 359.581 47.5571 355.973 47.0862Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1074.32 48.0474C1068.55 47.7292 1067.74 50.44 1067.23 53.7784C1066.74 57.029 1069.2 58.894 1073 59.0105C1076.91 59.1302 1079.4 55.5652 1079.14 52.2059C1078.96 49.7541 1077.16 48.2044 1074.32 48.0474Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1185.54 124.209C1182.03 123.032 1177.61 126.267 1177.13 129.783C1176.67 133.207 1179.84 136.827 1183.45 136.95C1187.16 137.076 1190.31 133.321 1190.06 129.783C1189.89 127.201 1188.09 125.068 1185.54 124.209Z\" fill=\"#FFFCF7\"/>\n<path d=\"M919.552 43.0932C915.849 42.5748 912.452 45.103 911.493 48.8442C909.894 55.0829 918.269 58.7205 922.754 56.2162C925.05 54.9346 926.135 53.2418 926.262 50.544C926.439 46.7933 925.49 43.9246 919.552 43.0932Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1043.52 44.0249C1038.61 44.0246 1036.91 46.9038 1036.27 51.8219C1035.66 56.6107 1038.76 59.3835 1043.52 58.9733C1048.95 58.5053 1051.48 56.7709 1051.16 51.8219C1050.92 48.2099 1048.95 44.0253 1043.52 44.0249Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1016.38 46.3438C1011.88 46.3437 1006.72 48.3107 1006.14 51.6713C1005.57 54.9434 1009.43 58.4036 1013.84 58.5209C1018.36 58.6414 1022.2 55.0529 1021.9 51.6713C1021.68 49.2032 1019.91 46.3438 1016.38 46.3438Z\" fill=\"#FFFCF7\"/>\n<path d=\"M890.854 46.0777C887.849 45.6768 884.314 47.5316 884.314 50.5246C884.314 56.6632 889.552 58.1569 893.192 56.2204C895.055 55.2295 896.196 53.9251 896.3 51.8391C896.443 48.9388 893.77 46.4665 890.854 46.0777Z\" fill=\"#FFFCF7\"/>\n<path d=\"M864.482 44.0526C858.714 43.7055 857.902 46.6627 857.398 50.3046C856.908 53.8507 859.364 55.8853 863.166 56.0124C867.071 56.1429 869.564 52.2539 869.309 48.5892C869.123 45.9145 867.328 44.2239 864.482 44.0526Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1184.18 93.231C1180.41 92.0644 1175.65 95.2706 1175.13 98.7551C1174.63 102.148 1178.13 105.059 1181.94 105.858C1186.29 106.769 1189.32 102.262 1189.06 98.7551C1188.87 96.196 1186.94 94.0824 1184.18 93.231Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M777.215 42.0269C773.225 42.0268 769.639 44.1906 768.616 48.2184C766.91 54.9351 775.846 58.8513 780.632 56.1552C783.081 54.7755 784.239 52.9529 784.375 50.0484C784.564 46.0104 783.014 42.0269 777.215 42.0269Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M329.654 49.4713C325.023 47.8877 321.466 50.6333 320.833 55.3635C320.216 59.9693 323.222 64.8398 328 65.0049C332.907 65.1745 336.039 60.1233 335.719 55.3635C335.485 51.8895 333.034 50.6271 329.654 49.4713Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1104.55 45.3087C1100.24 43.9505 1094.8 47.6833 1094.21 51.7402C1093.63 55.6903 1097.53 59.8676 1101.98 60.0092C1106.55 60.1546 1110.42 55.8225 1110.12 51.7402C1109.9 48.7607 1107.7 46.3 1104.55 45.3087Z\" fill=\"#FFFCF7\"/>\n<path d=\"M140.139 49.0847C136.419 48.5993 133.007 50.9667 132.044 54.47C130.731 59.2473 138.528 63.7128 143.033 61.3677C145.339 60.1676 146.751 58.5881 146.879 56.0618C147.057 52.5495 143.747 49.5556 140.139 49.0847Z\" fill=\"#FFFCF7\"/>\n<path d=\"M110.067 53.044C104.299 52.7258 103.487 55.4366 102.983 58.775C102.493 62.0256 104.949 63.8905 108.751 64.0071C112.656 64.1268 115.149 60.5618 114.894 57.2025C114.708 54.7507 112.913 53.201 110.067 53.044Z\" fill=\"#FFFCF7\"/>\n<path d=\"M83.3922 64.2561C79.8882 63.079 75.4679 66.3141 74.9891 69.8301C74.5228 73.2536 77.692 76.8739 81.3066 76.9966C85.0188 77.1226 88.1625 73.3681 87.9201 69.8301C87.7432 67.2479 85.9495 65.1153 83.3922 64.2561Z\" fill=\"#FFFCF7\"/>\n<path d=\"M172.133 46.0908C168.43 45.5723 165.033 48.1005 164.074 51.8417C162.475 58.0805 170.85 61.718 175.335 59.2137C177.631 57.9322 178.716 56.2393 178.843 53.5415C179.02 49.7909 178.071 46.9221 172.133 46.0908Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M300.096 47.0229C295.187 47.0226 293.484 49.9018 292.851 54.82C292.235 59.6087 295.333 62.3815 300.096 61.9714C305.53 61.5033 308.055 59.7689 307.735 54.82C307.501 51.2079 305.53 47.0233 300.096 47.0229Z\" fill=\"#FFFCF7\"/>\n<path d=\"M210.293 48.022C206.596 48.0219 202.368 49.9584 201.889 53.2666C201.423 56.4879 204.592 59.8943 208.207 60.0097C211.919 60.1283 215.063 56.5956 214.821 53.2666C214.644 50.8369 213.191 48.022 210.293 48.022Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1138.66 48.0762C1135.66 47.6754 1132.12 49.5301 1132.12 52.5232C1132.12 58.6618 1137.36 60.1554 1141 58.219C1142.86 57.228 1144 55.9237 1144.11 53.8376C1144.25 50.9373 1141.58 48.4651 1138.66 48.0762Z\" fill=\"#FFFCF7\"/>\n<path d=\"M67.0993 96.0126C61.3316 95.6655 60.519 98.6227 60.0153 102.265C59.5249 105.811 61.9809 107.845 65.7831 107.972C69.6881 108.103 72.1809 104.214 71.9259 100.549C71.7399 97.8745 69.9454 96.1839 67.0993 96.0126Z\" fill=\"#FFFCF7\"/>\n<path d=\"M809.476 44.2691C805.703 43.1025 800.943 46.3087 800.427 49.7932C799.925 53.1861 803.419 56.0973 807.23 56.8957C811.581 57.8071 814.613 53.2996 814.352 49.7932C814.162 47.2341 812.23 45.1205 809.476 44.2691Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1184.78 159.62C1180.53 159.62 1176.7 161.905 1175.61 166.161C1173.79 173.256 1183.32 177.394 1188.43 174.545C1191.04 173.088 1192.27 171.162 1192.42 168.094C1192.62 163.828 1190.97 159.62 1184.78 159.62Z\" fill=\"#FFFCF7\"/>\n<path d=\"M261.517 49.4151C257.503 48.0295 254.42 50.4319 253.872 54.5708C253.338 58.6008 255.943 62.8625 260.084 63.007C264.336 63.1554 267.051 58.7356 266.773 54.5708C266.571 51.531 264.447 50.4264 261.517 49.4151Z\" fill=\"#FFFCF7\"/>\n<path d=\"M751.522 44.2713C747.749 43.0942 742.989 46.3293 742.473 49.8452C741.971 53.2687 745.384 56.889 749.276 57.0117C753.274 57.1378 756.66 53.3832 756.399 49.8452C756.208 47.263 754.277 45.1304 751.522 44.2713Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1185.23 333.853C1182 333.443 1179.05 335.446 1178.21 338.41C1177.08 342.452 1183.83 346.231 1187.74 344.247C1189.73 343.231 1190.96 341.895 1191.07 339.757C1191.22 336.785 1188.36 334.252 1185.23 333.853Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M831.315 49.0423C826.508 48.782 825.831 50.9999 825.411 53.7313C825.002 56.3909 827.049 57.9167 830.218 58.0121C833.472 58.11 835.549 55.1933 835.337 52.4447C835.182 50.4387 833.686 49.1708 831.315 49.0423Z\" fill=\"#FFFCF7\"/>\n<path d=\"M934.08 475.69C930.668 475.69 926.765 477.59 926.323 480.835C925.893 483.995 928.818 487.337 932.155 487.45C935.582 487.567 938.484 484.101 938.26 480.835C938.097 478.452 936.756 475.69 934.08 475.69Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1123.13 475.739C1120.37 475.375 1117.13 477.061 1117.13 479.782C1117.13 485.362 1121.93 486.72 1125.27 484.96C1126.98 484.059 1128.02 482.873 1128.12 480.977C1128.25 478.34 1125.8 476.093 1123.13 475.739Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M956.814 475.715C951.527 475.397 950.782 478.108 950.321 481.446C949.871 484.697 952.122 486.562 955.608 486.678C959.187 486.798 961.472 483.233 961.239 479.874C961.068 477.422 959.423 475.872 956.814 475.715Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1148.56 467.923C1145.06 466.837 1140.64 469.823 1140.16 473.068C1139.69 476.229 1142.94 478.94 1146.48 479.684C1150.52 480.533 1153.33 476.334 1153.09 473.068C1152.91 470.685 1151.12 468.716 1148.56 467.923Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1028.47 471.693C1024.73 471.693 1021.37 473.703 1020.41 477.444C1018.81 483.683 1027.18 487.32 1031.67 484.816C1033.96 483.534 1035.05 481.841 1035.18 479.144C1035.35 475.393 1033.9 471.693 1028.47 471.693Z\" fill=\"#FFFCF7\"/>\n<path d=\"M905.115 472.692C901.125 472.692 897.539 474.856 896.516 478.883C894.81 485.6 903.746 489.516 908.533 486.82C910.982 485.44 912.14 483.618 912.275 480.713C912.464 476.675 910.914 472.692 905.115 472.692Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M989.336 474.935C985.562 473.768 980.802 476.974 980.287 480.459C979.784 483.852 983.279 486.763 987.09 487.561C991.44 488.473 995.873 483.558 994.212 480.459C993.29 478.739 992.09 475.786 989.336 474.935Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1064.28 473.938C1060.5 472.761 1055.74 475.996 1055.23 479.512C1054.73 482.935 1058.14 486.555 1062.03 486.678C1066.03 486.804 1069.42 483.05 1069.15 479.512C1068.96 476.929 1067.03 474.797 1064.28 473.938Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1093 475.105C1087.73 474.858 1086.99 476.961 1086.53 479.55C1086.08 482.072 1088.32 483.518 1091.8 483.609C1095.37 483.702 1097.65 480.936 1097.41 478.33C1097.24 476.429 1095.6 475.226 1093 475.105Z\" fill=\"#FFFCF7\"/>\n<path d=\"M233.973 49.23C231.008 48.234 227.268 50.9713 226.863 53.9464C226.468 56.8432 229.15 59.9065 232.208 60.0103C235.35 60.117 238.01 56.9401 237.805 53.9464C237.655 51.7614 236.137 49.9569 233.973 49.23Z\" fill=\"#FFFCF7\"/>\n<path d=\"M984.4 45.0821C981.19 44.6377 978.246 46.8048 977.416 50.0115C976.03 55.359 983.288 58.4769 987.175 56.3304C989.165 55.2319 990.105 53.7809 990.215 51.4685C990.369 48.2536 989.546 45.7947 984.4 45.0821Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1170.44 62.0112C1166.19 62.0109 1164.71 64.5063 1164.16 68.7687C1163.63 72.9189 1166.31 75.322 1170.44 74.9665C1175.15 74.5609 1177.34 73.0578 1177.06 68.7687C1176.86 65.6382 1175.15 62.0115 1170.44 62.0112Z\" fill=\"#FFFCF7\"/>\n<path d=\"M954.413 47.0229C951.285 47.0229 947.708 48.6366 947.302 51.3935C946.908 54.0778 949.589 56.9165 952.648 57.0128C955.789 57.1116 958.449 54.1676 958.244 51.3935C958.094 49.3688 956.865 47.023 954.413 47.0229Z\" fill=\"#FFFCF7\"/>\n<path d=\"M291.846 478.108C288.669 478.739 284.426 479.192 283.853 483.604C283.294 487.9 286.208 492.75 290.496 492.137C294.759 491.528 297.632 488.043 297.342 483.604C297.13 480.363 295.031 477.475 291.846 478.108Z\" fill=\"#FFFCF7\"/>\n<path d=\"M331.499 479.952C327.456 478.684 322.355 482.168 321.803 485.955C321.265 489.641 324.921 493.54 329.092 493.672C333.375 493.808 337.003 489.765 336.723 485.955C336.519 483.174 334.449 480.877 331.499 479.952Z\" fill=\"#FFFCF7\"/>\n<path d=\"M59.4561 212.954C56.0738 212.497 52.9711 214.726 52.0955 218.024C50.9016 222.523 57.9909 226.728 62.0878 224.519C64.1843 223.389 65.4689 221.902 65.5851 219.523C65.7466 216.216 62.7374 213.397 59.4561 212.954Z\" fill=\"#FFFCF7\"/>\n<path d=\"M58.5126 245.894C53.2255 245.575 52.4806 248.286 52.0189 251.625C51.5693 254.875 53.8207 256.74 57.3061 256.857C60.8856 256.976 63.1707 253.411 62.937 250.052C62.7664 247.6 61.1215 246.051 58.5126 245.894Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M71.401 445.94C67.897 444.854 63.4767 447.84 62.9979 451.085C62.5316 454.246 65.7007 457.587 69.3153 457.701C73.0276 457.817 76.1713 454.351 75.9289 451.085C75.752 448.702 73.9583 446.733 71.401 445.94Z\" fill=\"#FFFCF7\"/>\n<path d=\"M58.6633 337.531C54.7512 336.899 51.1626 339.981 50.1498 344.541C48.4609 352.146 57.308 356.58 62.0467 353.528C64.4716 351.966 65.6179 349.902 65.7523 346.613C65.9392 342.042 64.9364 338.545 58.6633 337.531Z\" fill=\"#FFFCF7\"/>\n<path d=\"M56.5996 301.825C52.1504 301.824 50.607 304.407 50.0335 308.819C49.475 313.115 52.2831 315.603 56.5996 315.235C61.5247 314.815 63.8132 313.259 63.5229 308.819C63.311 305.579 61.5244 301.825 56.5996 301.825Z\" fill=\"#FFFCF7\"/>\n<path d=\"M210.644 474.69C207.232 474.69 203.329 476.59 202.887 479.836C202.457 482.996 205.382 486.338 208.718 486.451C212.145 486.567 215.047 483.101 214.823 479.836C214.66 477.452 213.319 474.69 210.644 474.69Z\" fill=\"#FFFCF7\"/>\n<path d=\"M404.685 480.735C401.93 480.37 398.69 482.057 398.69 484.778C398.69 490.358 403.492 491.716 406.828 489.956C408.536 489.055 409.582 487.869 409.677 485.972C409.808 483.336 407.358 481.088 404.685 480.735Z\" fill=\"#FFFCF7\"/>\n<path d=\"M443.213 478.712C437.926 478.394 437.181 481.105 436.719 484.443C436.27 487.694 438.521 489.559 442.006 489.676C445.586 489.795 447.871 486.23 447.637 482.871C447.467 480.419 445.822 478.869 443.213 478.712Z\" fill=\"#FFFCF7\"/>\n<path d=\"M478.085 480.913C474.581 479.826 470.16 482.813 469.682 486.058C469.215 489.218 472.46 491.93 475.999 492.673C480.039 493.522 482.855 489.324 482.613 486.058C482.436 483.675 480.642 481.706 478.085 480.913Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M510.87 477.688C507.131 477.688 503.77 479.698 502.811 483.439C501.213 489.678 509.587 493.315 514.073 490.811C516.368 489.529 517.453 487.837 517.58 485.139C517.757 481.388 516.305 477.688 510.87 477.688Z\" fill=\"#FFFCF7\"/>\n<path d=\"M373.117 477.972C368.805 476.614 363.364 480.347 362.775 484.404C362.201 488.354 366.102 492.531 370.55 492.673C375.119 492.818 378.988 488.486 378.69 484.404C378.472 481.424 376.265 478.964 373.117 477.972Z\" fill=\"#FFFCF7\"/>\n<path d=\"M575.801 475.753C572.081 475.268 568.669 477.635 567.707 481.138C566.394 485.916 574.19 490.381 578.695 488.036C581.001 486.836 582.413 485.257 582.541 482.73C582.719 479.218 579.409 476.224 575.801 475.753Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1188.23 397.776C1182.46 397.458 1181.65 400.169 1181.14 403.507C1180.65 406.757 1183.11 408.622 1186.91 408.739C1190.82 408.859 1193.31 405.294 1193.05 401.934C1192.87 399.483 1191.07 397.933 1188.23 397.776Z\" fill=\"#FFFCF7\"/>\n<path d=\"M720.704 474.758C717.001 474.239 713.604 476.768 712.645 480.509C711.047 486.747 719.421 490.385 723.907 487.881C726.202 486.599 727.287 484.906 727.414 482.209C727.591 478.458 726.642 475.589 720.704 474.758Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M816.694 472.692C811.785 472.692 810.082 475.571 809.449 480.489C808.833 485.278 811.931 488.05 816.694 487.64C822.128 487.172 824.653 485.438 824.332 480.489C824.099 476.877 822.127 472.692 816.694 472.692Z\" fill=\"#FFFCF7\"/>\n<path d=\"M881.771 475.69C878.075 475.69 873.847 477.626 873.368 480.935C872.902 484.156 876.071 487.562 879.685 487.678C883.398 487.796 886.541 484.264 886.299 480.935C886.122 478.505 884.669 475.69 881.771 475.69Z\" fill=\"#FFFCF7\"/>\n<path d=\"M850.883 475.744C847.878 475.343 844.344 477.198 844.344 480.191C844.344 486.33 849.582 487.823 853.222 485.887C855.084 484.896 856.226 483.592 856.329 481.506C856.472 478.605 853.799 476.133 850.883 475.744Z\" fill=\"#FFFCF7\"/>\n<path d=\"M763.56 474.718C757.793 474.371 756.98 477.328 756.476 480.97C755.986 484.516 758.442 486.551 762.244 486.678C766.149 486.808 768.642 482.919 768.387 479.255C768.201 476.58 766.406 474.889 763.56 474.718Z\" fill=\"#FFFCF7\"/>\n<path d=\"M250.627 473.691C246.637 473.691 243.051 475.855 242.028 479.883C240.322 486.6 249.258 490.516 254.044 487.82C256.493 486.44 257.651 484.617 257.787 481.713C257.976 477.675 256.426 473.691 250.627 473.691Z\" fill=\"#FFF200\" style=\"mix-blend-mode:soft-light\"/>\n<path d=\"M169.776 475.14C165.145 473.557 161.588 476.302 160.955 481.032C160.339 485.638 163.345 490.509 168.122 490.674C173.029 490.843 176.161 485.792 175.841 481.032C175.607 477.558 173.156 476.296 169.776 475.14Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1186.49 425.013C1182.17 423.655 1176.73 427.388 1176.14 431.445C1175.57 435.395 1179.47 439.572 1183.92 439.714C1188.49 439.859 1192.36 435.527 1192.06 431.445C1191.84 428.465 1189.63 426.005 1186.49 425.013Z\" fill=\"#FFFCF7\"/>\n<path d=\"M62.1994 129.022C58.4799 128.537 55.0678 130.904 54.105 134.408C52.792 139.185 60.5881 143.65 65.0935 141.305C67.3991 140.105 68.8117 138.526 68.9395 135.999C69.1172 132.487 65.8079 129.493 62.1994 129.022Z\" fill=\"#FFFCF7\"/>\n<path d=\"M62.1042 412.764C56.3365 412.446 55.5239 415.157 55.0202 418.495C54.5297 421.746 56.9858 423.611 60.788 423.727C64.6929 423.847 67.1858 420.282 66.9308 416.923C66.7447 414.471 64.9502 412.921 62.1042 412.764Z\" fill=\"#FFFCF7\"/>\n<path d=\"M58.2216 273.914C54.5185 273.396 51.1216 275.924 50.1629 279.665C48.5642 285.904 56.9388 289.541 61.4243 287.037C63.7197 285.755 64.8048 284.063 64.932 281.365C65.1088 277.614 64.1596 274.745 58.2216 273.914Z\" fill=\"#FFFCF7\"/>\n<path d=\"M61.2806 166.929C56.3716 166.929 54.6687 169.808 54.0359 174.726C53.4197 179.515 56.518 182.288 61.2806 181.878C66.7146 181.41 69.2396 179.675 68.9193 174.726C68.6856 171.114 66.7144 166.93 61.2806 166.929Z\" fill=\"#FFFCF7\"/>\n<path d=\"M103.376 472.692C99.6792 472.692 95.4513 474.628 94.9725 477.937C94.5062 481.158 97.6753 484.564 101.29 484.68C105.002 484.798 108.146 481.266 107.904 477.937C107.727 475.507 106.274 472.692 103.376 472.692Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1170.64 455.759C1167.63 455.358 1164.1 457.213 1164.1 460.206C1164.1 466.345 1169.33 467.839 1172.97 465.902C1174.84 464.911 1175.98 463.607 1176.08 461.521C1176.22 458.62 1173.55 456.148 1170.64 455.759Z\" fill=\"#FFFCF7\"/>\n<path d=\"M611.631 474.935C607.857 473.768 603.097 476.974 602.581 480.459C602.079 483.852 605.573 486.763 609.385 487.561C613.735 488.473 616.768 483.965 616.507 480.459C616.316 477.9 614.385 475.786 611.631 474.935Z\" fill=\"#FFFCF7\"/>\n<path d=\"M60.6742 375.162C56.6604 373.776 53.5777 376.178 53.0291 380.317C52.495 384.347 55.1002 388.609 59.2409 388.754C63.4933 388.902 66.208 384.482 65.9304 380.317C65.7278 377.278 63.6037 376.173 60.6742 375.162Z\" fill=\"#FFFCF7\"/>\n<path d=\"M540.136 476.557C535.864 475.343 530.476 478.68 529.893 482.306C529.324 485.838 533.187 489.572 537.593 489.698C542.118 489.828 545.951 485.956 545.655 482.306C545.439 479.643 543.253 477.443 540.136 476.557Z\" fill=\"#FFFCF7\"/>\n<path d=\"M786.35 476.71C781.543 476.449 780.866 478.667 780.446 481.399C780.038 484.058 782.084 485.584 785.253 485.68C788.507 485.777 790.584 482.861 790.372 480.112C790.217 478.106 788.721 476.838 786.35 476.71Z\" fill=\"#FFFCF7\"/>\n<path d=\"M137.048 474.899C134.084 473.903 130.343 476.64 129.938 479.615C129.544 482.512 132.225 485.575 135.284 485.679C138.425 485.786 141.085 482.609 140.88 479.615C140.73 477.43 139.212 475.626 137.048 474.899Z\" fill=\"#FFFCF7\"/>\n<path d=\"M640.665 474.748C637.456 474.304 634.512 476.471 633.681 479.678C632.296 485.025 639.554 488.143 643.441 485.996C645.43 484.898 646.371 483.447 646.481 481.135C646.634 477.92 645.812 475.461 640.665 474.748Z\" fill=\"#FFFCF7\"/>\n<path d=\"M682.277 476.303C678.464 476.303 674.104 478.074 673.61 481.098C673.129 484.043 676.397 487.157 680.126 487.263C683.955 487.371 687.197 484.141 686.947 481.098C686.765 478.877 685.266 476.303 682.277 476.303Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1187.08 372.814C1184.32 372.486 1181.08 374.003 1181.08 376.452C1181.08 381.475 1185.88 382.697 1189.22 381.113C1190.93 380.302 1191.97 379.235 1192.07 377.528C1192.2 375.155 1189.75 373.132 1187.08 372.814Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1185.63 242.894C1180.35 242.604 1179.6 245.069 1179.14 248.104C1178.69 251.059 1180.94 252.754 1184.43 252.86C1188.01 252.969 1190.29 249.728 1190.06 246.674C1189.89 244.445 1188.24 243.036 1185.63 242.894Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1185.88 274.053C1182.65 273.066 1178.57 275.779 1178.13 278.728C1177.7 281.598 1180.69 284.062 1183.96 284.737C1187.69 285.509 1190.29 281.695 1190.06 278.728C1189.9 276.562 1188.24 274.774 1185.88 274.053Z\" fill=\"#FFFCF7\"/>\n<path d=\"M1186.79 298.827C1183.3 298.827 1180.17 300.702 1179.27 304.193C1177.78 310.014 1185.6 313.408 1189.79 311.071C1191.93 309.875 1192.94 308.296 1193.06 305.779C1193.23 302.279 1191.87 298.827 1186.79 298.827Z\" fill=\"#FFFCF7\"/>\n</g>\n<g id=\"pb-lid-leaves\">\n<g>\n<path d=\"M397.231 438.713C399.633 450.125 416.898 458.783 416.898 458.783C416.898 458.783 420.888 440.019 416.898 429.539C413.902 421.67 408.83 411.763 404.291 412.909C399.753 414.056 395.071 428.45 397.231 438.713Z\" fill=\"#336FED\"/>\n<path d=\"M380.703 459.203C392.725 451.936 416.675 459.203 416.675 459.203C416.675 459.203 405.049 478.353 392.694 480.687C382.604 482.592 367.713 477.689 367.214 474.192C366.714 470.694 373.964 463.277 380.703 459.203Z\" fill=\"#336FED\"/>\n</g>\n<g>\n<path d=\"M131.964 376.766C132.699 384.362 140.957 396.751 140.957 396.751C140.957 396.751 152.442 388.322 153.947 380.264C155.682 370.969 148.451 357.781 144.954 357.782C141.456 357.783 130.958 366.369 131.964 376.766Z\" fill=\"#336FED\"/>\n<path d=\"M122.925 394.261C115.281 397.437 107.437 403.753 107.937 407.75C108.437 411.747 117.929 417.742 132.418 412.746C146.906 407.75 141.411 391.762 141.411 391.762C141.411 391.762 129.602 391.487 122.925 394.261Z\" fill=\"#336FED\"/>\n</g>\n<g>\n<path d=\"M117.243 185.732C110.322 199.477 124.15 221.501 124.15 221.501C124.15 221.501 141.419 207.528 141.765 193.155C142.035 181.922 138.681 167.918 134.118 167.49C129.555 167.062 121.606 177.068 117.243 185.732Z\" fill=\"#336FED\"/>\n<path d=\"M148.885 215.017C137.844 213.822 122.905 221.512 122.905 221.512C122.905 221.512 135.147 239.631 147.386 241.996C159.443 244.326 175.864 236.501 177.363 232.504C178.862 228.507 162.077 216.446 148.885 215.017Z\" fill=\"#336FED\"/>\n</g>\n<g>\n<path d=\"M287.776 102.118C282.28 108.613 279.782 120.104 279.782 120.104C279.782 120.104 300.872 121.015 308.26 112.11C313.565 105.716 316.254 101.119 312.757 96.1228C309.259 91.1268 293.272 95.6225 287.776 102.118Z\" fill=\"#336FED\"/>\n<path d=\"M276.558 143.448C273.734 134.645 279.556 119.966 279.556 119.966C279.556 119.966 294.152 125.118 298.541 132.956C304.09 142.867 300.04 161.434 296.043 161.934C292.046 162.433 279.762 153.436 276.558 143.448Z\" fill=\"#336FED\"/>\n</g>\n<g>\n<path d=\"M542.053 107.472C536.817 99.241 539.056 78.9941 539.056 78.9941C539.056 78.9941 557.042 80.9924 562.537 92.4834C568.033 103.974 562.537 117.464 559.04 117.964C555.543 118.464 546.062 113.773 542.053 107.472Z\" fill=\"#336FED\"/>\n<path d=\"M556.155 58.43C545.775 62.2232 538.994 78.0693 538.994 78.0693C538.994 78.0693 558.931 84.0455 568.583 77.6909C575.613 73.0625 582.154 64.9815 580.484 59.7218C578.814 54.4621 565.515 55.0093 556.155 58.43Z\" fill=\"#336FED\"/>\n</g>\n<g>\n<path d=\"M873.86 114.761C868.315 109.147 866.604 96.3873 866.604 96.3873C866.604 96.3873 890.492 90.4161 901.543 96.4604C911.092 101.683 918.274 116.728 915.906 118.53C913.537 120.332 884.261 125.294 873.86 114.761Z\" fill=\"#336FED\"/>\n<path d=\"M867.792 64.4528C863.433 72.9307 865.969 96.8182 865.969 96.8182C865.969 96.8182 886.876 92.2396 890.47 80.8383C893.662 70.7144 889.005 53.6291 884.162 52.0025C879.319 50.3758 871.664 56.9231 867.792 64.4528Z\" fill=\"#336FED\"/>\n</g>\n<g>\n<path d=\"M689.426 421.9C697.799 430.799 718.837 428.789 718.837 428.789C718.837 428.789 718.32 414.516 713.795 407.209C706.429 395.313 685.922 389.905 682.508 392.291C679.094 394.677 681.426 413.396 689.426 421.9Z\" fill=\"#336FED\"/>\n<path d=\"M701.443 455.037C703.027 444.736 719.095 429.915 719.095 429.915C719.095 429.915 729.588 435.985 730.316 443.384C731.463 455.036 711.361 473.558 708.759 473.742C706.157 473.927 700.081 463.892 701.443 455.037Z\" fill=\"#336FED\"/>\n</g>\n<g>\n<path d=\"M1007.54 414.754C1009.02 425.975 1031.03 431.741 1031.03 431.741C1031.03 431.741 1036.29 421.45 1035.02 414.754C1033.04 404.273 1017.54 393.27 1012.54 393.77C1007.54 394.27 1006.59 407.532 1007.54 414.754Z\" fill=\"#336FED\"/>\n<path d=\"M1002.58 435.505C1009.84 427.578 1030.01 433.284 1030.01 433.284C1030.01 433.284 1033.15 433.63 1031.03 444.205C1028.91 454.78 993.141 462.653 989.23 459.202C985.319 455.751 997.024 441.579 1002.58 435.505Z\" fill=\"#336FED\"/>\n</g>\n<g>\n<path d=\"M1119.61 208.548C1119.61 208.548 1092.22 213.325 1085.99 226.934C1083.56 232.257 1078.52 241.766 1080.4 245.186C1082.28 248.606 1107.09 242.846 1114.93 232.577C1120.72 224.975 1119.61 208.548 1119.61 208.548Z\" fill=\"#336FED\"/>\n<path d=\"M1126.03 236.748C1119.11 228.542 1121.53 209.64 1121.53 209.64C1121.53 209.64 1138.89 215.432 1144.27 224.604C1148.61 232.011 1152.39 246.047 1147.87 246.29C1143.35 246.534 1132.02 243.866 1126.03 236.748Z\" fill=\"#336FED\"/>\n</g>\n</g>\n<g id=\"pb-lid-leave-shadow\">\n<g>\n<path d=\"M405.959 446.36C407.16 452.81 415.792 457.703 415.792 457.703C415.792 457.703 417.787 447.098 415.792 441.174C414.294 436.727 411.758 431.127 409.489 431.775C407.22 432.423 404.879 440.559 405.959 446.36Z\" fill=\"#345089\"/>\n<path d=\"M390.531 461.821C398.408 456.874 415.949 457.22 415.949 457.22C415.949 457.22 409.36 467.692 400.828 470.367C393.86 472.552 382.921 472.155 382.271 470.578C381.621 469.002 386.115 464.594 390.531 461.821Z\" fill=\"#345089\"/>\n</g>\n<g>\n<path d=\"M137.93 385.108C138.358 388.845 143.17 394.941 143.17 394.941C143.17 394.941 149.863 390.794 150.74 386.829C151.752 382.255 147.538 375.767 145.5 375.767C143.461 375.768 137.344 379.992 137.93 385.108Z\" fill=\"#345089\"/>\n<path d=\"M129.652 395.985C125.197 397.548 120.626 400.656 120.918 402.622C121.209 404.589 126.74 407.539 135.184 405.081C143.627 402.622 140.424 394.756 140.424 394.756C140.424 394.756 133.543 394.62 129.652 395.985Z\" fill=\"#345089\"/>\n</g>\n<g>\n<path d=\"M121.507 200.979C118.942 207.648 126.039 218.436 126.039 218.436C126.039 218.436 133.25 211.699 132.833 204.697C132.507 199.225 130.441 192.387 128.372 192.16C126.302 191.933 123.125 196.775 121.507 200.979Z\" fill=\"#345089\"/>\n<path d=\"M139.703 216.951C133.838 216.386 125.902 220.015 125.902 220.015C125.902 220.015 132.405 228.564 138.907 229.68C145.311 230.78 154.034 227.087 154.83 225.201C155.626 223.316 146.71 217.625 139.703 216.951Z\" fill=\"#345089\"/>\n</g>\n<g>\n<path d=\"M285.406 109.329C282.227 112.804 280.782 118.953 280.782 118.953C280.782 118.953 292.981 119.44 297.255 114.675C300.323 111.254 301.878 108.794 299.855 106.121C297.833 103.448 288.585 105.853 285.406 109.329Z\" fill=\"#345089\"/>\n<path d=\"M278.21 132.261C276.659 127.652 279.856 119.967 279.856 119.967C279.856 119.967 287.874 122.664 290.284 126.768C293.332 131.957 291.108 141.678 288.912 141.939C286.717 142.201 279.969 137.49 278.21 132.261Z\" fill=\"#345089\"/>\n</g>\n<g>\n<path d=\"M542.428 98.965C539.642 93.4828 540.833 79.9976 540.833 79.9976C540.833 79.9976 550.405 81.3285 553.329 88.982C556.254 96.6355 553.329 105.62 551.468 105.953C549.607 106.286 544.562 103.162 542.428 98.965Z\" fill=\"#345089\"/>\n<path d=\"M552.256 67.3619C545.805 69.9475 541.16 77.7471 541.16 77.7471C541.16 77.7471 553.122 78.8424 559.212 75.1457C563.648 72.4531 567.897 68.2225 567.048 65.9555C566.199 63.6885 558.074 65.03 552.256 67.3619Z\" fill=\"#345089\"/>\n</g>\n<g>\n<path d=\"M870.702 103.575C868.773 100.801 870.08 96.0178 870.08 96.0178C870.08 96.0178 883.598 97.2277 888.331 100.924C892.421 104.118 893.579 110.479 892.03 110.79C890.481 111.101 874.322 108.779 870.702 103.575Z\" fill=\"#345089\"/>\n<path d=\"M869.815 79.7862C868.082 85.4062 870.341 95.7715 870.341 95.7715C870.341 95.7715 880.218 85.8885 881.456 79.1675C882.555 73.1997 879.568 66.8357 877.164 67.8536C874.759 68.8715 871.354 74.7947 869.815 79.7862Z\" fill=\"#345089\"/>\n</g>\n<g>\n<path d=\"M705.806 426.751C711.004 431.299 718.134 427.963 718.134 427.963C718.134 427.963 714.472 419.369 711.054 415.397C705.49 408.932 696.747 407.72 696.091 409.509C695.435 411.298 700.838 422.404 705.806 426.751Z\" fill=\"#345089\"/>\n<path d=\"M711.345 444.649C711.968 438.371 718.763 429.441 718.763 429.441C718.763 429.441 723.283 433.227 723.633 437.75C724.186 444.875 715.685 456.035 714.573 456.127C713.461 456.22 710.809 450.047 711.345 444.649Z\" fill=\"#345089\"/>\n</g>\n<g>\n<path d=\"M1017.23 422.146C1020.76 429.772 1032.12 430.212 1032.12 430.212C1032.12 430.212 1031.86 422.133 1029.58 417.646C1026.01 410.621 1016.23 405.444 1014.11 406.613C1012 407.782 1014.95 417.237 1017.23 422.146Z\" fill=\"#345089\"/>\n<path d=\"M1019.5 433.864C1024.54 430.961 1028.7 432.723 1028.7 432.723C1028.7 432.723 1029.08 438.191 1024.56 443.378C1020.03 448.564 1006.72 446.485 1006.86 443.992C1007 441.5 1015.64 436.089 1019.5 433.864Z\" fill=\"#345089\"/>\n</g>\n<g id=\"pb-lid-leaves-shadow\">\n<path d=\"M1120.03 210.88C1120.03 210.88 1103.65 214.205 1099.59 222.116C1098 225.21 1094.75 230.752 1095.76 232.666C1096.78 234.579 1111.65 230.748 1116.58 224.711C1120.23 220.241 1120.03 210.88 1120.03 210.88Z\" fill=\"#345089\"/>\n<path d=\"M1125.06 228.129C1120.67 223.009 1121.56 211.639 1121.56 211.639C1121.56 211.639 1132.15 215.54 1135.64 221.208C1138.46 225.785 1141.14 234.357 1138.44 234.4C1135.73 234.443 1128.86 232.57 1125.06 228.129Z\" fill=\"#345089\"/>\n</g>\n</g>\n<g id=\"pb-lid-chains\">\n<path id=\"pb-lid-chain\" d=\"M196.349 155.938C220.243 116.19 235.818 106.477 283.281 120.965C330.744 135.454 347.719 135.456 393.19 125.463C438.66 115.47 477.974 78.9023 542.574 79.4989C599.279 80.0226 631.452 110.722 687.96 115.47C757.7 121.331 803.223 127.122 873.815 94.4867C944.408 61.8513 974.266 138.768 1034.19 142.449C1180.23 151.421 1094.06 263.383 1109.13 323.809C1124.21 384.234 1061.1 437.603 1024.7 431.225C974.731 422.47 937.56 443.951 894.799 431.225C852.038 418.499 810.141 373.56 715.439 431.225C620.737 488.89 581.543 405.746 555.564 412.24C529.584 418.734 467.779 458.581 407.179 457.704C348.015 456.848 370.712 417.237 313.756 421.233C256.801 425.23 239.814 360.281 174.364 391.756C108.915 423.232 103.219 310.127 105.918 261.857C108.616 213.588 172.454 195.686 196.349 155.938Z\" stroke-width=\"3.99689\" stroke=\"#336FED\"/>\n<path id=\"pb-lid-chain_2\" d=\"M198.785 158.374C222.68 118.626 238.255 108.913 285.718 123.401C333.181 137.89 350.156 137.892 395.626 127.899C441.097 117.906 480.41 81.3384 545.01 81.935C601.715 82.4586 633.888 113.158 690.396 117.906C760.137 123.767 805.66 129.558 876.252 96.9228C946.844 64.2874 976.702 141.204 1036.63 144.885C1182.67 153.857 1096.5 265.819 1111.57 326.245C1126.64 386.67 1063.54 440.039 1027.13 433.661C977.167 424.906 939.997 446.387 897.236 433.661C854.475 420.935 812.577 375.996 717.875 433.661C623.173 491.326 583.98 408.182 558 414.676C532.02 421.17 470.216 461.017 409.615 460.14C350.452 459.284 373.149 419.673 316.193 423.669C259.237 427.666 242.25 362.717 176.801 394.192C111.352 425.668 105.656 312.563 108.354 264.293C111.053 216.024 174.891 198.122 198.785 158.374Z\" stroke-width=\"3.99689\" stroke=\"#336FED\"/>\n</g>\n<g id=\"pb-lid-flowers\">\n<path d=\"M509.108 429.226C492.247 415.522 551.574 401.247 555.571 402.746C559.569 404.246 600.806 439.366 582.55 442.716C571.462 444.75 558.069 430.725 558.069 430.725C558.069 430.725 544.615 457.583 535.09 450.709C528.197 445.734 533.088 428.227 533.088 428.227C533.088 428.227 517.101 435.721 509.108 429.226Z\" fill=\"#FFC800\"/>\n<path d=\"M524.057 410.464C522.951 412.43 522.909 414.402 524.592 416.237C530.379 422.55 546.497 416.267 546.574 416.237C546.556 416.282 542.436 426.678 546.574 430.226C552.037 434.909 558.565 416.237 558.565 416.237C558.592 416.277 564.307 424.764 570.057 426.229C574.117 427.263 575.179 424.027 574.797 419.261C584.644 429.439 592.58 440.874 582.547 442.715C571.459 444.75 558.065 430.725 558.065 430.725C558.021 430.814 544.597 457.572 535.087 450.708C528.206 445.742 533.069 428.285 533.085 428.227C533.006 428.264 517.078 435.705 509.105 429.225C500.773 422.453 511.048 415.543 524.057 410.464Z\" fill=\"#FFEA00\"/>\n<path d=\"M886.314 398.399C875.378 399.48 877.819 425.729 877.819 425.729C877.819 425.729 862.374 418.059 852.339 423.731C833.729 434.25 895.306 452.708 898.303 452.209C901.301 451.709 942.426 418.286 924.783 414.042C915.062 411.704 901.801 421.381 901.801 421.381C901.801 421.381 896.872 397.355 886.314 398.399Z\" fill=\"#FFC800\"/>\n<path d=\"M886.313 398.399C896.852 397.357 901.783 421.294 901.801 421.381C901.837 421.355 915.075 411.708 924.783 414.042C933.246 416.078 928.185 424.826 920.299 433.435C920.103 432.642 919.773 431.901 919.287 431.225C914.982 425.242 905.835 435.182 905.798 435.222C905.798 435.222 901.374 417.857 893.308 421.233C885.569 424.473 891.809 439.219 891.809 439.219C891.809 439.219 877.862 431.301 871.324 439.219C870.186 440.598 869.709 441.92 869.762 443.182C855.194 437.146 842.454 429.319 852.34 423.731C862.349 418.074 877.743 425.691 877.819 425.729C877.808 425.604 875.404 399.477 886.313 398.399Z\" fill=\"#FFEA00\"/>\n<path d=\"M1130.62 299.827C1128.81 280.81 1087.15 315.814 1086.65 321.31C1086.15 326.807 1134.97 363.392 1134.62 342.793C1134.42 331.614 1120.13 322.31 1120.13 322.31C1120.13 322.31 1131.62 310.319 1130.62 299.827Z\" fill=\"#FFC800\"/>\n<path d=\"M1107.87 301.565C1118.66 294.388 1129.71 290.235 1130.62 299.827C1131.62 310.319 1120.13 322.31 1120.13 322.31C1120.13 322.31 1134.43 331.614 1134.62 342.793C1134.85 356.152 1114.4 345.458 1100.13 334.792C1100.73 330.711 1100.65 327.332 1100.65 327.306C1100.65 327.306 1111.89 332.071 1113.64 327.306C1115.29 322.776 1105.17 318.327 1105.14 318.313C1105.17 318.296 1114.46 311.994 1113.64 306.323C1113.25 303.687 1110.85 302.279 1107.87 301.565Z\" fill=\"#FFEA00\"/>\n<path d=\"M1002.22 112.472C993.731 115.97 1014.21 155.439 1021.21 157.937C1028.2 160.435 1082.66 146.447 1067.67 134.956C1057.76 127.358 1037.7 137.454 1037.7 137.454C1037.7 137.454 1047.45 109.869 1037.7 109.975C1031.72 110.04 1024.21 121.966 1024.21 121.966C1024.21 121.966 1010.72 108.975 1002.22 112.472Z\" fill=\"#FFC800\"/>\n<path d=\"M688.967 148.945C666.483 155.94 675.98 107.978 677.477 105.979C678.974 103.98 713.329 81.4788 716.945 96.9856C718.864 105.218 707.952 113.972 707.952 113.972C707.952 113.972 729.436 119.968 728.436 128.461C727.435 136.955 693.464 128.961 693.464 128.961C693.464 128.961 696.926 146.469 688.967 148.945Z\" fill=\"#FFC800\"/>\n<path d=\"M423.17 101.481C440.916 104.972 394.193 136.954 390.195 136.954C386.198 136.954 343.07 118.227 354.223 104.479C361.48 95.534 381.203 105.503 381.203 105.503C381.203 105.503 384.572 74.8993 395.192 79.5231C404.25 83.4672 402.186 105.978 402.186 105.978C402.186 105.978 414.947 99.8639 423.17 101.481Z\" fill=\"#FFC800\"/>\n<path d=\"M209.336 166.432C205.34 167.432 147.624 144.694 164.373 134.956C174.325 129.17 194.848 143.45 194.848 143.45C194.848 143.45 187.514 120.405 197.347 114.97C216.333 104.479 213.333 165.433 209.336 166.432Z\" fill=\"#FFC800\"/>\n<path d=\"M117.41 271.849C105.578 274.633 109.915 301.326 109.915 301.326C109.915 301.326 92.124 286.914 83.436 293.332C72.6901 301.271 99.9232 323.309 99.9232 323.309C99.9232 323.309 83.232 333.682 85.4345 344.293C89.0326 361.627 125.903 328.805 127.901 325.308C129.9 321.81 134.396 267.852 117.41 271.849Z\" fill=\"#FFC800\"/>\n<g id=\"pb-lid-petals-highlight\">\n<path d=\"M701.421 93.0352C708.838 90.6603 715.465 90.6397 716.945 96.9854C718.86 105.198 708.006 113.93 707.953 113.973C708.054 114.001 729.435 119.989 728.437 128.462C727.436 136.943 693.56 128.983 693.466 128.961C693.466 128.961 696.927 146.469 688.968 148.945C678.636 152.159 675.06 143.769 674.354 133.566C679.937 130.495 683.972 121.466 683.972 121.466C684.033 121.492 696.447 126.736 698.96 121.466C701.514 116.108 689.014 109.997 688.968 109.975C689.048 109.936 701.021 104.157 703.456 96.9854C704.336 94.3928 703.419 93.2392 701.421 93.0352Z\" fill=\"#FFF700\"/>\n<path d=\"M197.348 114.971C206.355 109.993 210.411 121.099 211.762 134.253C208.691 133.364 205.48 132.997 202.842 133.957C194.4 137.031 202.808 154.372 202.842 154.44C202.764 154.404 184.999 146.087 180.859 150.443C179.548 151.824 179.04 153.277 179.157 154.763C166.284 147.977 155.981 139.835 164.373 134.956C174.325 129.171 194.848 143.45 194.848 143.45C194.848 143.45 187.514 120.405 197.348 114.971Z\" fill=\"#FFF700\"/>\n<path d=\"M117.409 271.849C125.494 269.947 128.71 281.173 129.647 293.838C126.372 291.583 122.543 289.929 119.407 291.333C111.22 295 123.891 316.792 123.904 316.814C123.904 316.814 106.397 304.93 101.921 310.319C96.9804 316.267 119.332 324.779 119.407 324.808C119.316 324.835 98.5967 330.87 100.922 337.797C101.745 340.247 104.497 341.7 107.345 342.56C97.4027 349.066 87.2383 352.982 85.4346 344.292C83.236 333.699 99.8704 323.342 99.9229 323.309C99.8148 323.222 72.7117 301.256 83.4355 293.333C92.1112 286.923 109.865 301.286 109.915 301.327C109.915 301.327 105.578 274.634 117.409 271.849Z\" fill=\"#FFF700\"/>\n</g>\n<path d=\"M282.782 396.751C280.284 394.253 213.574 401.576 228.824 418.734C236.817 427.727 263.297 416.236 263.297 416.236C263.297 416.236 256.885 435.691 265.796 443.215C280.385 455.533 285.28 399.249 282.782 396.751Z\" fill=\"#FFC800\"/>\n<path d=\"M250.06 400.157C249.212 401.987 249.43 403.735 251.306 405.246C260.322 412.506 273.453 408.315 277.285 403.747C277.25 403.81 269.415 418.107 273.788 422.732C276.571 425.676 279.211 424.356 281.583 420.888C279.087 435.515 273.96 450.11 265.795 443.215C256.906 435.709 263.266 416.332 263.297 416.237C263.221 416.27 236.805 427.714 228.823 418.734C221.046 409.983 234.59 403.793 250.06 400.157Z\" fill=\"#FFEA00\"/>\n<path d=\"M1037.69 109.975C1047.44 109.87 1037.72 137.383 1037.69 137.454C1037.78 137.409 1057.78 127.375 1067.67 134.956C1074.95 140.535 1065.85 146.702 1053.77 151.286C1053.93 149.609 1053.6 147.848 1052.18 146.448C1046.78 141.135 1031.7 147.947 1031.7 147.947C1031.7 147.947 1039.07 131.439 1030.7 131.958C1023.72 132.391 1020.21 144.419 1020.21 144.449C1020.21 144.449 1011.15 130.67 1006.22 135.456C1006.13 135.539 1006.05 135.625 1005.97 135.712C1001 125.052 997.958 114.228 1002.22 112.472C1010.7 108.979 1024.17 121.936 1024.2 121.965C1024.25 121.891 1031.74 110.04 1037.69 109.975Z\" fill=\"#FFEA00\"/>\n<path d=\"M381.202 105.503C381.217 105.366 384.596 74.9111 395.191 79.5239C404.25 83.468 402.186 105.979 402.186 105.979C402.186 105.979 414.946 99.8649 423.169 101.482C431.315 103.084 425.876 110.688 417.223 118.448C417.055 118.285 416.874 118.124 416.676 117.968C410.818 113.374 400.717 122.441 400.688 122.466C400.688 122.466 399.781 104.712 392.194 104.98C384.293 105.26 386.699 124.464 386.699 124.464C386.699 124.464 371.002 111.92 362.218 117.47C360.699 118.43 359.717 119.403 359.093 120.307C353.288 115.132 350.168 109.478 354.223 104.48C361.463 95.5542 381.118 105.461 381.202 105.503Z\" fill=\"#FFEA00\"/>\n</g>\n</g>\n        </svg>\n        <div class=\"pb-grain\" aria-hidden=\"true\"></div>\n        <button type=\"button\" class=\"pb-open\" id=\"pbOpen\" aria-expanded=\"false\" aria-controls=\"pbBox\"><span class=\"pb-sr\">Open the Pencil Box</span></button>\n        <div class=\"pb-shade\" id=\"pbShadeFront\"></div>\n      </div>\n      <div class=\"pb-face inside\" id=\"pbInside\" inert>\n        <div class=\"pb-note\">\n          <!-- the back of the raised front, pressed in and upside down (relief filters below) -->\n          <svg class=\"pb-reverse\" viewBox=\"23 23 1194 494\" fill=\"none\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\">\n<g class=\"pb-s pb-s-plate\"><g transform=\"translate(0 540) scale(1 -1)\">\n<path d=\"M33.9727 126.961C33.9727 73.983 76.9199 35.0326 129.898 35.0326L626.512 30.5361L1105.14 32.035C1158.12 32.035 1204.06 73.983 1204.06 126.961L1204.56 251.864L1203.06 408.742C1203.06 457.306 1163.7 503.668 1115.13 503.668L668.979 506.666L117.907 500.671C71.5515 500.671 33.9727 469.087 33.9727 422.731V126.961Z\" fill=\"#5B8BEF\"/>\n</g></g>\n<g class=\"pb-s pb-s-letters\"><g transform=\"translate(0 540) scale(1 -1)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n<g class=\"pb-join\" transform=\"translate(-1.00 -0.56)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g class=\"pb-join\" transform=\"translate(-2.00 -1.11)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g class=\"pb-join\" transform=\"translate(-3.00 -1.67)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g class=\"pb-join\" transform=\"translate(-4.00 -2.22)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g class=\"pb-join\" transform=\"translate(-5.00 -2.78)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g class=\"pb-join\" transform=\"translate(-6.00 -3.33)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g class=\"pb-join\" transform=\"translate(-7.00 -3.89)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g class=\"pb-join\" transform=\"translate(-8.00 -4.44)\">\n<g>\n<path d=\"M234.647 206.128C264.272 200.486 288.903 199.095 306.152 203.528C314.786 205.746 321.609 209.433 326.274 214.813C330.944 220.2 333.408 227.237 333.408 236.068C333.407 244.985 329.189 251.916 322.922 257.272C316.665 262.619 308.348 266.417 300.074 269.108C291.794 271.801 283.52 273.397 277.32 274.319C274.219 274.781 271.634 275.074 269.824 275.252C268.919 275.341 268.207 275.401 267.721 275.439C267.585 275.45 267.466 275.457 267.367 275.465L255.504 331.944L255.418 332.357H254.996C245.547 332.359 238.136 332.841 231.446 333.081C224.762 333.322 218.809 333.322 212.338 332.352L211.837 332.277L211.9 331.774C218.046 282.227 222.786 254.762 234.239 206.519L234.316 206.191L234.647 206.128ZM279.611 217.776C279.206 217.827 278.816 217.959 278.527 218.232L278.407 218.345L278.374 218.506L267.891 269.861L268.362 269.989L268.497 269.488C268.373 269.947 268.362 269.986 268.362 269.989L268.364 269.99L268.368 269.991C268.371 269.992 268.376 269.992 268.382 269.994C268.418 270.003 268.504 270.026 268.631 270.056C269.83 270.336 274.874 271.356 280.768 270.138C287.531 268.74 295.349 264.39 299.623 252.706C303.914 240.974 299.464 231.614 293.613 225.57C290.691 222.552 287.408 220.346 284.661 219.063C283.289 218.422 282.032 218.002 281.007 217.833C280.495 217.749 280.021 217.724 279.611 217.776Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M341.197 335.438C359.212 269.775 359.557 246.044 371.822 206.59C406.456 203.458 460.062 203.993 460.581 209.707C461.1 215.422 457.838 227.099 443.452 232.567C429.065 238.036 411.27 223.735 411.27 223.735L404.522 259.065C404.522 259.065 428.918 257.799 431.513 261.143C434.109 264.486 424.733 288.118 400.37 281.925L393.622 305.304C414.553 309.688 432.666 319.811 450.652 301.825C468.638 283.839 448.914 378.313 379.608 327.13C362.212 314.283 348.159 337.263 341.197 335.438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M501.45 208.375C496.726 214.361 481.564 283.992 472.057 333.517H490.953L506.174 267.331L537.143 333.517C537.143 333.517 570.974 338.414 573.885 333.517C576.795 328.621 604.567 213.815 597.662 211.095C590.758 208.375 585.031 209.463 580.866 211.095C576.701 212.728 562.862 291.247 562.862 291.247C549.471 252.596 532.875 211.64 530.319 208.375C527.763 205.111 506.174 202.39 501.45 208.375Z\" fill=\"#5B8BEF\"/>\n<path d=\"M950.39 294.934C966.799 277.496 987.931 291.728 982.997 294.934C962.864 304.946 988.402 332.987 1000.59 313.668C1012.79 294.349 933.84 269.642 951.352 232.62C976.086 180.333 1057.4 207.467 1042.52 233.668C1027.63 259.868 1004.34 243.91 1010.03 240.929C1015.72 237.947 1026.68 204.966 996.657 219.272C966.638 233.578 1025.74 261.183 1034.96 291.818C1044.17 322.453 1009.52 337.734 989.207 337.518C948.61 337.087 933.981 312.372 950.39 294.934Z\" fill=\"#5B8BEF\"/>\n<path d=\"M838.667 332.322C815.054 355.635 856.83 211.709 859.958 208.733C863.086 205.757 898.405 205.012 896.827 208.733C895.248 212.454 873.468 287.764 876.574 302.723C896.826 312.589 910.847 299.607 918.117 295.972C925.387 292.337 917.179 333.642 894.23 335.437C871.281 337.233 862.28 309.008 838.667 332.322Z\" fill=\"#5B8BEF\"/>\n<path d=\"M665.227 335.439C703.347 342.208 727.512 295.595 722.348 292.857C640.927 347.191 665.374 221.44 692.749 224.312C704.509 225.546 697.942 249.757 708.328 250.276C718.713 250.796 740.564 233.591 734.811 224.312C709.002 182.69 648.558 207.57 633.032 246.641C617.505 285.713 627.108 328.669 665.227 335.439Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M787.778 331.284C783.624 335.438 755.583 340.63 750.909 329.207C746.236 317.783 769.851 242.909 772.2 236.774C774.549 230.639 791.217 199.753 798.164 200.944C805.111 202.136 806.942 226.201 808.03 244.044C808.478 251.374 791.933 327.129 787.778 331.284Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M295.27 259.358L267.292 267.851L267.792 272.847L281.281 271.848L293.771 267.352L295.27 259.358Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g>\n<path d=\"M222.566 198.949C252.191 193.306 276.822 191.916 294.071 196.348C302.705 198.567 309.528 202.253 314.193 207.633C318.863 213.021 321.327 220.058 321.327 228.888C321.326 237.805 317.108 244.736 310.84 250.093C304.584 255.44 296.267 259.238 287.993 261.929C279.713 264.622 271.439 266.218 265.239 267.14C262.138 267.601 259.553 267.894 257.743 268.072C256.838 268.161 256.126 268.221 255.639 268.259C255.504 268.27 255.385 268.278 255.286 268.285L243.423 324.765L243.337 325.178H242.915C233.466 325.18 226.055 325.661 219.365 325.902C212.681 326.142 206.728 326.143 200.257 325.173L199.756 325.097L199.819 324.594C205.965 275.047 210.705 247.582 222.158 199.339L222.235 199.011L222.566 198.949ZM267.53 210.596C267.125 210.647 266.735 210.78 266.446 211.052L266.326 211.165L266.293 211.326L255.81 262.681L256.28 262.809L256.416 262.308C256.292 262.768 256.281 262.806 256.28 262.809L256.282 262.81L256.287 262.811C256.29 262.812 256.295 262.813 256.301 262.814C256.337 262.824 256.423 262.846 256.55 262.876C257.748 263.156 262.793 264.177 268.687 262.958C275.45 261.56 283.268 257.21 287.542 245.527C291.833 233.795 287.383 224.435 281.532 218.39C278.61 215.372 275.327 213.166 272.58 211.883C271.208 211.242 269.951 210.822 268.926 210.654C268.414 210.57 267.94 210.544 267.53 210.596Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M329.116 328.258C347.131 262.595 347.476 238.864 359.741 199.41C394.375 196.278 447.981 196.813 448.5 202.528C449.019 208.242 445.757 219.919 431.371 225.388C416.984 230.856 399.189 216.555 399.189 216.555L392.441 251.885C392.441 251.885 416.837 250.619 419.432 253.963C422.028 257.306 412.652 280.939 388.289 274.745L381.541 298.124C402.472 302.508 420.585 312.631 438.571 294.645C456.557 276.659 436.832 371.133 367.527 319.95C350.131 307.104 336.078 330.083 329.116 328.258Z\" fill=\"#5B8BEF\"/>\n<path d=\"M489.369 201.196C484.645 207.182 469.483 276.813 459.976 326.338H478.871L494.093 260.152L525.061 326.338C525.061 326.338 558.893 331.234 561.803 326.338C564.714 321.442 592.486 206.636 585.581 203.916C578.677 201.196 572.95 202.284 568.785 203.916C564.62 205.549 550.781 284.068 550.781 284.068C537.39 245.417 520.794 204.461 518.238 201.196C515.682 197.931 494.093 195.211 489.369 201.196Z\" fill=\"#5B8BEF\"/>\n<path d=\"M938.308 287.754C954.717 270.316 975.849 284.548 970.915 287.754C950.782 297.766 976.32 325.807 988.512 306.488C1000.7 287.169 921.758 262.463 939.27 225.441C964.004 173.153 1045.32 200.287 1030.43 226.488C1015.55 252.689 992.256 236.731 997.949 233.749C1003.64 230.768 1014.59 197.786 984.575 212.092C954.556 226.398 1013.66 254.004 1022.87 284.639C1032.09 315.273 997.436 330.554 977.125 330.338C936.528 329.907 921.899 305.193 938.308 287.754Z\" fill=\"#5B8BEF\"/>\n<path d=\"M826.587 325.142C802.974 348.456 844.749 204.529 847.878 201.553C851.006 198.577 886.325 197.832 884.747 201.553C883.168 205.275 861.388 280.585 864.494 295.543C884.746 305.409 898.767 292.427 906.037 288.792C913.307 285.158 905.099 326.462 882.15 328.258C859.201 330.053 850.2 301.829 826.587 325.142Z\" fill=\"#5B8BEF\"/>\n<path d=\"M653.149 328.259C691.269 335.028 715.434 288.416 710.27 285.678C628.849 340.011 653.296 214.26 680.671 217.133C692.431 218.367 685.864 242.577 696.249 243.097C706.635 243.616 728.486 226.411 722.733 217.133C696.924 175.51 636.48 200.39 620.954 239.462C605.427 278.533 615.029 321.489 653.149 328.259Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M775.698 324.104C771.544 328.259 743.503 333.451 738.829 322.027C734.156 310.603 757.771 235.729 760.12 229.594C762.469 223.46 779.137 192.573 786.084 193.765C793.031 194.956 794.862 219.021 795.95 236.864C796.397 244.195 779.853 319.949 775.698 324.104Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g>\n<path d=\"M225.652 201.132C255.277 195.49 279.908 194.099 297.157 198.532C305.791 200.75 312.614 204.437 317.278 209.817C321.949 215.204 324.412 222.241 324.412 231.072C324.412 239.989 320.194 246.92 313.926 252.276C307.67 257.623 299.353 261.421 291.079 264.112C282.799 266.805 274.525 268.401 268.325 269.323C265.224 269.785 262.639 270.077 260.829 270.255C259.924 270.344 259.212 270.405 258.725 270.443C258.59 270.454 258.471 270.461 258.371 270.468L246.509 326.948L246.423 327.361H246.001C236.552 327.363 229.141 327.844 222.451 328.085C215.767 328.326 209.814 328.326 203.343 327.356L202.842 327.281L202.905 326.778C209.051 277.231 213.791 249.766 225.244 201.523L225.321 201.195L225.652 201.132ZM270.616 212.779C270.211 212.831 269.821 212.963 269.532 213.236L269.412 213.348L269.379 213.51L258.896 264.865L259.366 264.993L259.502 264.492C259.378 264.951 259.367 264.989 259.366 264.993L259.368 264.994C259.369 264.994 259.371 264.994 259.372 264.995C259.376 264.996 259.381 264.996 259.387 264.998C259.399 265.001 259.417 265.006 259.439 265.012C259.485 265.023 259.551 265.04 259.636 265.06C259.807 265.1 260.057 265.154 260.376 265.216C261.014 265.339 261.933 265.487 263.059 265.592C265.31 265.802 268.406 265.838 271.773 265.142C278.536 263.744 286.354 259.394 290.628 247.71C294.919 235.978 290.469 226.618 284.617 220.574C281.696 217.556 278.413 215.35 275.666 214.067C274.294 213.426 273.037 213.006 272.012 212.837C271.5 212.753 271.026 212.728 270.616 212.779Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M332.203 330.441C350.218 264.778 350.563 241.047 362.828 201.593C397.462 198.461 451.068 198.996 451.587 204.711C452.106 210.425 448.844 222.102 434.458 227.571C420.071 233.04 402.276 218.739 402.276 218.739L395.528 254.068C395.528 254.068 419.924 252.802 422.519 256.146C425.115 259.489 415.739 283.122 391.376 276.928L384.628 300.307C405.558 304.691 423.672 314.815 441.658 296.829C459.644 278.843 439.919 373.317 370.613 322.133C353.218 309.287 339.164 332.266 332.203 330.441Z\" fill=\"#5B8BEF\"/>\n<path d=\"M492.455 203.38C487.731 209.366 472.569 278.997 463.062 328.522H481.957L497.179 262.336L528.147 328.522C528.147 328.522 561.979 333.419 564.889 328.522C567.8 323.626 595.572 208.82 588.667 206.1C581.763 203.38 576.036 204.468 571.871 206.1C567.706 207.733 553.867 286.252 553.867 286.252C540.476 247.601 523.88 206.645 521.324 203.38C518.768 200.115 497.179 197.395 492.455 203.38Z\" fill=\"#5B8BEF\"/>\n<path d=\"M941.396 289.938C957.805 272.499 978.937 286.732 974.003 289.938C953.87 299.95 979.408 327.991 991.6 308.672C1003.79 289.353 924.846 264.646 942.358 227.624C967.092 175.336 1048.41 202.471 1033.52 228.672C1018.64 254.872 995.344 238.914 1001.04 235.933C1006.73 232.951 1017.68 199.97 987.663 214.276C957.644 228.582 1016.75 256.187 1025.96 286.822C1035.18 317.457 1000.52 332.738 980.213 332.522C939.616 332.091 924.987 307.376 941.396 289.938Z\" fill=\"#5B8BEF\"/>\n<path d=\"M829.673 327.326C806.06 350.639 847.835 206.713 850.963 203.737C854.092 200.761 889.411 200.016 887.832 203.737C886.254 207.458 864.474 282.768 867.58 297.727C887.832 307.593 901.853 294.611 909.123 290.976C916.393 287.341 908.185 328.646 885.236 330.441C862.287 332.237 853.286 304.012 829.673 327.326Z\" fill=\"#5B8BEF\"/>\n<path d=\"M656.235 330.442C694.355 337.211 718.52 290.599 713.356 287.861C631.935 342.195 656.382 216.443 683.757 219.316C695.517 220.55 688.95 244.76 699.335 245.28C709.721 245.799 731.572 228.594 725.819 219.316C700.01 177.694 639.566 202.573 624.04 241.645C608.513 280.716 618.115 323.673 656.235 330.442Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M778.784 326.288C774.63 330.443 746.589 335.635 741.915 324.211C737.242 312.787 760.857 237.913 763.206 231.779C765.555 225.644 782.223 194.757 789.17 195.949C796.117 197.14 797.948 221.206 799.036 239.049C799.483 246.379 782.938 322.134 778.784 326.288Z\" fill=\"#5B8BEF\"/>\n<path d=\"M763.264 231.634C765.811 225.173 782.276 194.766 789.17 195.948C795.846 197.093 797.795 219.363 798.903 236.934C792.286 233.632 777.345 231.398 763.264 231.634Z\" fill=\"#5B8BEF\"/>\n<path d=\"M772.275 214.646C778.099 205.008 785.212 195.269 789.171 195.948C793.469 196.685 795.806 206.178 797.222 217.535C793.198 217.284 782.971 218.807 772.275 214.646Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M225.652 201.132C255.277 195.49 279.908 194.099 297.157 198.532C305.791 200.75 312.614 204.437 317.278 209.817C321.949 215.204 324.412 222.241 324.412 231.072C324.412 239.989 320.194 246.92 313.926 252.276C307.67 257.623 299.353 261.421 291.079 264.112C282.799 266.805 274.525 268.401 268.325 269.323C265.224 269.785 262.639 270.077 260.829 270.255C259.924 270.344 259.212 270.405 258.725 270.443C258.59 270.454 258.471 270.461 258.371 270.468L246.509 326.948L246.423 327.361H246.001C236.552 327.363 229.141 327.844 222.451 328.085C215.767 328.326 209.814 328.326 203.343 327.356L202.842 327.281L202.905 326.778C209.051 277.231 213.791 249.766 225.244 201.523L225.321 201.195L225.652 201.132ZM270.616 212.779C270.211 212.831 269.821 212.963 269.532 213.236L269.412 213.348L269.379 213.51L258.896 264.865L259.366 264.993L259.502 264.492C259.378 264.951 259.367 264.989 259.366 264.993L259.368 264.994L259.372 264.995C259.376 264.996 259.381 264.996 259.387 264.998C259.399 265.001 259.417 265.006 259.439 265.012C259.485 265.023 259.551 265.04 259.636 265.06C259.807 265.1 260.057 265.154 260.376 265.216C261.014 265.339 261.933 265.487 263.059 265.592C265.31 265.802 268.406 265.838 271.773 265.142C278.536 263.744 286.354 259.394 290.628 247.71C294.919 235.978 290.469 226.618 284.617 220.574C281.696 217.556 278.413 215.35 275.666 214.067C274.294 213.426 273.037 213.006 272.012 212.837C271.5 212.753 271.026 212.728 270.616 212.779Z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#5B8BEF\"/>\n<path d=\"M332.203 330.442C350.218 264.779 350.563 241.048 362.828 201.594C397.462 198.461 451.068 198.997 451.587 204.711C452.106 210.426 448.844 222.103 434.458 227.571C420.071 233.04 402.276 218.739 402.276 218.739L395.528 254.069C395.528 254.069 419.924 252.803 422.519 256.146C425.115 259.49 415.739 283.122 391.376 276.929L384.628 300.308C405.558 304.691 423.672 314.815 441.658 296.829C459.644 278.843 439.919 373.317 370.613 322.134C353.218 309.287 339.164 332.267 332.203 330.442Z\" fill=\"#5B8BEF\"/>\n<path d=\"M492.455 203.379C487.731 209.365 472.569 278.996 463.062 328.521H481.957L497.179 262.335L528.147 328.521C528.147 328.521 561.979 333.418 564.889 328.521C567.8 323.625 595.572 208.819 588.667 206.099C581.763 203.379 576.036 204.467 571.871 206.099C567.706 207.732 553.867 286.251 553.867 286.251C540.476 247.6 523.88 206.644 521.324 203.379C518.768 200.114 497.179 197.394 492.455 203.379Z\" fill=\"#5B8BEF\"/>\n<path d=\"M941.396 289.938C957.805 272.499 978.937 286.732 974.003 289.938C953.87 299.95 979.408 327.991 991.6 308.672C1003.79 289.353 924.846 264.646 942.358 227.624C967.092 175.336 1048.41 202.471 1033.52 228.672C1018.64 254.872 995.344 238.914 1001.04 235.933C1006.73 232.951 1017.68 199.97 987.663 214.276C957.644 228.582 1016.75 256.187 1025.96 286.822C1035.18 317.457 1000.52 332.738 980.213 332.522C939.616 332.091 924.987 307.376 941.396 289.938Z\" fill=\"#5B8BEF\"/>\n<path d=\"M829.673 327.326C806.06 350.639 847.835 206.713 850.963 203.737C854.092 200.761 889.411 200.016 887.832 203.737C886.254 207.458 864.474 282.768 867.58 297.727C887.832 307.593 901.853 294.611 909.123 290.976C916.393 287.341 908.185 328.646 885.236 330.441C862.287 332.237 853.286 304.012 829.673 327.326Z\" fill=\"#5B8BEF\"/>\n<path d=\"M656.235 330.442C694.355 337.211 718.52 290.599 713.356 287.861C631.935 342.195 656.382 216.443 683.757 219.316C695.517 220.55 688.95 244.76 699.335 245.28C709.721 245.799 731.572 228.594 725.819 219.316C700.01 177.694 639.566 202.573 624.04 241.645C608.513 280.716 618.115 323.673 656.235 330.442Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M778.784 326.288C774.63 330.443 746.589 335.635 741.915 324.211C737.242 312.787 760.857 237.913 763.206 231.779C765.555 225.644 782.223 194.757 789.17 195.949C796.117 197.14 797.948 221.206 799.036 239.049C799.483 246.379 782.938 322.134 778.784 326.288Z\" fill=\"#5B8BEF\"/>\n<path d=\"M775.005 210.281C774.076 211.714 773.16 213.181 772.274 214.646C782.969 218.807 793.196 217.283 797.221 217.533C798.005 223.818 798.509 230.674 798.903 236.934C792.286 233.632 777.344 231.398 763.264 231.634C764.571 228.319 769.543 218.702 775.005 210.281ZM796.527 212.637C796.776 214.185 797.002 215.795 797.209 217.444C797.002 215.795 796.776 214.185 796.527 212.637ZM796.01 209.688C796.168 210.515 796.32 211.366 796.463 212.236C796.32 211.366 796.168 210.515 796.01 209.688ZM775.964 208.823C775.711 209.202 775.459 209.583 775.208 209.968C775.459 209.583 775.711 209.202 775.964 208.823ZM795.788 208.571C795.777 208.52 795.767 208.468 795.756 208.417C795.767 208.468 795.777 208.52 795.788 208.571ZM794.288 202.796C794.763 204.221 795.189 205.824 795.573 207.562C795.189 205.824 794.763 204.221 794.288 202.796ZM783.634 199.011C781.679 200.947 779.549 203.646 777.423 206.684C779.549 203.646 781.679 200.947 783.634 199.011ZM793.516 200.74C793.689 201.145 793.856 201.571 794.018 202.018C793.856 201.571 793.689 201.145 793.516 200.74ZM787.535 196.165C787.598 196.141 787.661 196.119 787.723 196.099C787.661 196.119 787.598 196.141 787.535 196.165ZM788.166 195.979C788.037 196.006 787.906 196.04 787.772 196.082C787.906 196.04 788.037 196.006 788.166 195.979ZM787.348 196.24C787.411 196.214 787.473 196.189 787.535 196.165C787.473 196.189 787.411 196.214 787.348 196.24Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n</g></g>\n<g class=\"pb-s pb-s-dots\"><g transform=\"translate(0 540) scale(1 -1)\">\n<g>\n<path d=\"M417.75 43.4455C413.553 41.9684 410.329 44.5293 409.756 48.9414C409.197 53.2374 411.921 57.7804 416.251 57.9344C420.697 58.0926 423.536 53.3811 423.245 48.9414C423.034 45.7011 420.813 44.5236 417.75 43.4455Z\" fill=\"#5B8BEF\"/>\n<path d=\"M449.152 42.9898C444.223 41.5549 438.006 45.4984 437.333 49.7842C436.677 53.9573 441.134 58.3703 446.218 58.5199C451.44 58.6735 455.861 54.0969 455.52 49.7842C455.272 46.6366 452.749 44.037 449.152 42.9898Z\" fill=\"#5B8BEF\"/>\n<path d=\"M481.128 44.5249C477.746 44.0678 474.643 46.2969 473.767 49.5958C472.573 54.0941 479.663 58.2989 483.76 56.0907C485.856 54.9607 487.141 53.4734 487.257 51.0946C487.418 47.7874 484.409 44.9683 481.128 44.5249Z\" fill=\"#5B8BEF\"/>\n<path d=\"M505.476 46.9526C500.179 46.9526 499.062 48.3662 498.6 51.7046C498.15 54.9552 500.402 56.8202 503.887 56.9367C507.467 57.0564 509.752 53.4915 509.518 50.1322C509.347 47.6803 507.912 46.9526 505.476 46.9526Z\" fill=\"#5B8BEF\"/>\n<path d=\"M536.041 45.2518C532.537 44.1653 528.116 47.1515 527.638 50.397C527.171 53.5571 530.34 56.899 533.955 57.0122C537.667 57.1286 540.811 53.6629 540.569 50.397C540.392 48.0134 538.598 46.0449 536.041 45.2518Z\" fill=\"#5B8BEF\"/>\n<path d=\"M558.639 43.9451C555.257 43.488 552.154 45.7172 551.278 49.016C549.818 54.5171 557.467 57.7245 561.564 55.5164C563.661 54.3864 564.652 52.8937 564.768 50.5149C564.929 47.2077 564.062 44.6782 558.639 43.9451Z\" fill=\"#5B8BEF\"/>\n<path d=\"M590.184 43.0259C585.734 43.0256 584.191 45.6085 583.617 50.0206C583.059 54.3166 585.867 56.8041 590.184 56.4361C595.109 56.0163 597.397 54.4603 597.107 50.0206C596.895 46.7802 595.108 43.0262 590.184 43.0259Z\" fill=\"#5B8BEF\"/>\n<path d=\"M624.838 44.9854C621.426 44.9853 617.523 46.885 617.081 50.1305C616.651 53.2907 619.576 56.6325 622.913 56.7458C626.339 56.8621 629.241 53.3964 629.018 50.1305C628.854 47.7469 627.513 44.9854 624.838 44.9854Z\" fill=\"#5B8BEF\"/>\n<path d=\"M647.206 46.4736C644.451 46.1092 641.211 47.7953 641.211 50.5163C641.211 56.0969 646.012 57.4547 649.349 55.6943C651.056 54.7934 652.103 53.6077 652.197 51.7112C652.329 49.0746 649.878 46.8271 647.206 46.4736Z\" fill=\"#5B8BEF\"/>\n<path d=\"M672.535 45.3941C667.248 45.0759 666.503 47.7867 666.041 51.1251C665.592 54.3757 667.843 56.2406 671.329 56.3572C674.908 56.4769 677.193 52.9119 676.959 49.5526C676.789 47.1008 675.144 45.5511 672.535 45.3941Z\" fill=\"#5B8BEF\"/>\n<path d=\"M700.001 44.4057C696.497 43.3191 692.076 46.3053 691.598 49.5508C691.131 52.711 694.376 55.4224 697.915 56.1661C701.955 57.0149 704.771 52.8167 704.529 49.5508C704.352 47.1672 702.558 45.1987 700.001 44.4057Z\" fill=\"#5B8BEF\"/>\n<path d=\"M725.499 43.3735C721.76 43.3735 718.399 45.3833 717.44 49.1245C715.842 55.3632 724.216 59.0008 728.702 56.4965C730.997 55.2149 732.082 53.5221 732.209 50.8243C732.386 47.0736 730.934 43.3736 725.499 43.3735Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1185.99 196.357C1181.36 194.773 1177.8 197.519 1177.17 202.249C1176.55 206.855 1179.56 211.725 1184.34 211.89C1189.24 212.06 1192.37 207.009 1192.05 202.249C1191.82 198.775 1189.37 197.512 1185.99 196.357Z\" fill=\"#5B8BEF\"/>\n<path d=\"M386.239 49.0339C381.64 47.8198 375.837 51.1566 375.208 54.783C374.596 58.3141 378.757 62.0482 383.502 62.1748C388.375 62.3048 390.692 58.4322 390.374 54.783C390.141 52.1196 389.597 49.92 386.239 49.0339Z\" fill=\"#5B8BEF\"/>\n<path d=\"M355.973 47.0862C352.253 46.6008 348.841 48.9681 347.878 52.4715C346.565 57.2488 354.362 61.7143 358.867 59.3691C361.172 58.1691 362.585 56.5895 362.713 54.0633C362.891 50.551 359.581 47.5571 355.973 47.0862Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1074.32 48.0474C1068.55 47.7292 1067.74 50.44 1067.23 53.7784C1066.74 57.029 1069.2 58.894 1073 59.0105C1076.91 59.1302 1079.4 55.5652 1079.14 52.2059C1078.96 49.7541 1077.16 48.2044 1074.32 48.0474Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1185.54 124.209C1182.03 123.032 1177.61 126.267 1177.13 129.783C1176.67 133.207 1179.84 136.827 1183.45 136.95C1187.16 137.076 1190.31 133.321 1190.06 129.783C1189.89 127.201 1188.09 125.068 1185.54 124.209Z\" fill=\"#5B8BEF\"/>\n<path d=\"M919.552 43.0932C915.849 42.5748 912.452 45.103 911.493 48.8442C909.894 55.0829 918.269 58.7205 922.754 56.2162C925.05 54.9346 926.135 53.2418 926.262 50.544C926.439 46.7933 925.49 43.9246 919.552 43.0932Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1043.52 44.0249C1038.61 44.0246 1036.91 46.9038 1036.27 51.8219C1035.66 56.6107 1038.76 59.3835 1043.52 58.9733C1048.95 58.5053 1051.48 56.7709 1051.16 51.8219C1050.92 48.2099 1048.95 44.0253 1043.52 44.0249Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1016.38 46.3438C1011.88 46.3437 1006.72 48.3107 1006.14 51.6713C1005.57 54.9434 1009.43 58.4036 1013.84 58.5209C1018.36 58.6414 1022.2 55.0529 1021.9 51.6713C1021.68 49.2032 1019.91 46.3438 1016.38 46.3438Z\" fill=\"#5B8BEF\"/>\n<path d=\"M890.854 46.0777C887.849 45.6768 884.314 47.5316 884.314 50.5246C884.314 56.6632 889.552 58.1569 893.192 56.2204C895.055 55.2295 896.196 53.9251 896.3 51.8391C896.443 48.9388 893.77 46.4665 890.854 46.0777Z\" fill=\"#5B8BEF\"/>\n<path d=\"M864.482 44.0526C858.714 43.7055 857.902 46.6627 857.398 50.3046C856.908 53.8507 859.364 55.8853 863.166 56.0124C867.071 56.1429 869.564 52.2539 869.309 48.5892C869.123 45.9145 867.328 44.2239 864.482 44.0526Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1184.18 93.231C1180.41 92.0644 1175.65 95.2706 1175.13 98.7551C1174.63 102.148 1178.13 105.059 1181.94 105.858C1186.29 106.769 1189.32 102.262 1189.06 98.7551C1188.87 96.196 1186.94 94.0824 1184.18 93.231Z\" fill=\"#5B8BEF\"/>\n<path d=\"M777.215 42.0269C773.225 42.0268 769.639 44.1906 768.616 48.2184C766.91 54.9351 775.846 58.8513 780.632 56.1552C783.081 54.7755 784.239 52.9529 784.375 50.0484C784.564 46.0104 783.014 42.0269 777.215 42.0269Z\" fill=\"#5B8BEF\"/>\n<path d=\"M329.654 49.4713C325.023 47.8877 321.466 50.6333 320.833 55.3635C320.216 59.9693 323.222 64.8398 328 65.0049C332.907 65.1745 336.039 60.1233 335.719 55.3635C335.485 51.8895 333.034 50.6271 329.654 49.4713Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1104.55 45.3087C1100.24 43.9505 1094.8 47.6833 1094.21 51.7402C1093.63 55.6903 1097.53 59.8676 1101.98 60.0092C1106.55 60.1546 1110.42 55.8225 1110.12 51.7402C1109.9 48.7607 1107.7 46.3 1104.55 45.3087Z\" fill=\"#5B8BEF\"/>\n<path d=\"M140.139 49.0847C136.419 48.5993 133.007 50.9667 132.044 54.47C130.731 59.2473 138.528 63.7128 143.033 61.3677C145.339 60.1676 146.751 58.5881 146.879 56.0618C147.057 52.5495 143.747 49.5556 140.139 49.0847Z\" fill=\"#5B8BEF\"/>\n<path d=\"M110.067 53.044C104.299 52.7258 103.487 55.4366 102.983 58.775C102.493 62.0256 104.949 63.8905 108.751 64.0071C112.656 64.1268 115.149 60.5618 114.894 57.2025C114.708 54.7507 112.913 53.201 110.067 53.044Z\" fill=\"#5B8BEF\"/>\n<path d=\"M83.3922 64.2561C79.8882 63.079 75.4679 66.3141 74.9891 69.8301C74.5228 73.2536 77.692 76.8739 81.3066 76.9966C85.0188 77.1226 88.1625 73.3681 87.9201 69.8301C87.7432 67.2479 85.9495 65.1153 83.3922 64.2561Z\" fill=\"#5B8BEF\"/>\n<path d=\"M172.133 46.0908C168.43 45.5723 165.033 48.1005 164.074 51.8417C162.475 58.0805 170.85 61.718 175.335 59.2137C177.631 57.9322 178.716 56.2393 178.843 53.5415C179.02 49.7909 178.071 46.9221 172.133 46.0908Z\" fill=\"#5B8BEF\"/>\n<path d=\"M300.096 47.0229C295.187 47.0226 293.484 49.9018 292.851 54.82C292.235 59.6087 295.333 62.3815 300.096 61.9714C305.53 61.5033 308.055 59.7689 307.735 54.82C307.501 51.2079 305.53 47.0233 300.096 47.0229Z\" fill=\"#5B8BEF\"/>\n<path d=\"M210.293 48.022C206.596 48.0219 202.368 49.9584 201.889 53.2666C201.423 56.4879 204.592 59.8943 208.207 60.0097C211.919 60.1283 215.063 56.5956 214.821 53.2666C214.644 50.8369 213.191 48.022 210.293 48.022Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1138.66 48.0762C1135.66 47.6754 1132.12 49.5301 1132.12 52.5232C1132.12 58.6618 1137.36 60.1554 1141 58.219C1142.86 57.228 1144 55.9237 1144.11 53.8376C1144.25 50.9373 1141.58 48.4651 1138.66 48.0762Z\" fill=\"#5B8BEF\"/>\n<path d=\"M67.0993 96.0126C61.3316 95.6655 60.519 98.6227 60.0153 102.265C59.5249 105.811 61.9809 107.845 65.7831 107.972C69.6881 108.103 72.1809 104.214 71.9259 100.549C71.7399 97.8745 69.9454 96.1839 67.0993 96.0126Z\" fill=\"#5B8BEF\"/>\n<path d=\"M809.476 44.2691C805.703 43.1025 800.943 46.3087 800.427 49.7932C799.925 53.1861 803.419 56.0973 807.23 56.8957C811.581 57.8071 814.613 53.2996 814.352 49.7932C814.162 47.2341 812.23 45.1205 809.476 44.2691Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1184.78 159.62C1180.53 159.62 1176.7 161.905 1175.61 166.161C1173.79 173.256 1183.32 177.394 1188.43 174.545C1191.04 173.088 1192.27 171.162 1192.42 168.094C1192.62 163.828 1190.97 159.62 1184.78 159.62Z\" fill=\"#5B8BEF\"/>\n<path d=\"M261.517 49.4151C257.503 48.0295 254.42 50.4319 253.872 54.5708C253.338 58.6008 255.943 62.8625 260.084 63.007C264.336 63.1554 267.051 58.7356 266.773 54.5708C266.571 51.531 264.447 50.4264 261.517 49.4151Z\" fill=\"#5B8BEF\"/>\n<path d=\"M751.522 44.2713C747.749 43.0942 742.989 46.3293 742.473 49.8452C741.971 53.2687 745.384 56.889 749.276 57.0117C753.274 57.1378 756.66 53.3832 756.399 49.8452C756.208 47.263 754.277 45.1304 751.522 44.2713Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1185.23 333.853C1182 333.443 1179.05 335.446 1178.21 338.41C1177.08 342.452 1183.83 346.231 1187.74 344.247C1189.73 343.231 1190.96 341.895 1191.07 339.757C1191.22 336.785 1188.36 334.252 1185.23 333.853Z\" fill=\"#5B8BEF\"/>\n<path d=\"M831.315 49.0423C826.508 48.782 825.831 50.9999 825.411 53.7313C825.002 56.3909 827.049 57.9167 830.218 58.0121C833.472 58.11 835.549 55.1933 835.337 52.4447C835.182 50.4387 833.686 49.1708 831.315 49.0423Z\" fill=\"#5B8BEF\"/>\n<path d=\"M934.08 475.69C930.668 475.69 926.765 477.59 926.323 480.835C925.893 483.995 928.818 487.337 932.155 487.45C935.582 487.567 938.484 484.101 938.26 480.835C938.097 478.452 936.756 475.69 934.08 475.69Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1123.13 475.739C1120.37 475.375 1117.13 477.061 1117.13 479.782C1117.13 485.362 1121.93 486.72 1125.27 484.96C1126.98 484.059 1128.02 482.873 1128.12 480.977C1128.25 478.34 1125.8 476.093 1123.13 475.739Z\" fill=\"#5B8BEF\"/>\n<path d=\"M956.814 475.715C951.527 475.397 950.782 478.108 950.321 481.446C949.871 484.697 952.122 486.562 955.608 486.678C959.187 486.798 961.472 483.233 961.239 479.874C961.068 477.422 959.423 475.872 956.814 475.715Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1148.56 467.923C1145.06 466.837 1140.64 469.823 1140.16 473.068C1139.69 476.229 1142.94 478.94 1146.48 479.684C1150.52 480.533 1153.33 476.334 1153.09 473.068C1152.91 470.685 1151.12 468.716 1148.56 467.923Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1028.47 471.693C1024.73 471.693 1021.37 473.703 1020.41 477.444C1018.81 483.683 1027.18 487.32 1031.67 484.816C1033.96 483.534 1035.05 481.841 1035.18 479.144C1035.35 475.393 1033.9 471.693 1028.47 471.693Z\" fill=\"#5B8BEF\"/>\n<path d=\"M905.115 472.692C901.125 472.692 897.539 474.856 896.516 478.883C894.81 485.6 903.746 489.516 908.533 486.82C910.982 485.44 912.14 483.618 912.275 480.713C912.464 476.675 910.914 472.692 905.115 472.692Z\" fill=\"#5B8BEF\"/>\n<path d=\"M989.336 474.935C985.562 473.768 980.802 476.974 980.287 480.459C979.784 483.852 983.279 486.763 987.09 487.561C991.44 488.473 995.873 483.558 994.212 480.459C993.29 478.739 992.09 475.786 989.336 474.935Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1064.28 473.938C1060.5 472.761 1055.74 475.996 1055.23 479.512C1054.73 482.935 1058.14 486.555 1062.03 486.678C1066.03 486.804 1069.42 483.05 1069.15 479.512C1068.96 476.929 1067.03 474.797 1064.28 473.938Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1093 475.105C1087.73 474.858 1086.99 476.961 1086.53 479.55C1086.08 482.072 1088.32 483.518 1091.8 483.609C1095.37 483.702 1097.65 480.936 1097.41 478.33C1097.24 476.429 1095.6 475.226 1093 475.105Z\" fill=\"#5B8BEF\"/>\n<path d=\"M233.973 49.23C231.008 48.234 227.268 50.9713 226.863 53.9464C226.468 56.8432 229.15 59.9065 232.208 60.0103C235.35 60.117 238.01 56.9401 237.805 53.9464C237.655 51.7614 236.137 49.9569 233.973 49.23Z\" fill=\"#5B8BEF\"/>\n<path d=\"M984.4 45.0821C981.19 44.6377 978.246 46.8048 977.416 50.0115C976.03 55.359 983.288 58.4769 987.175 56.3304C989.165 55.2319 990.105 53.7809 990.215 51.4685C990.369 48.2536 989.546 45.7947 984.4 45.0821Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1170.44 62.0112C1166.19 62.0109 1164.71 64.5063 1164.16 68.7687C1163.63 72.9189 1166.31 75.322 1170.44 74.9665C1175.15 74.5609 1177.34 73.0578 1177.06 68.7687C1176.86 65.6382 1175.15 62.0115 1170.44 62.0112Z\" fill=\"#5B8BEF\"/>\n<path d=\"M954.413 47.0229C951.285 47.0229 947.708 48.6366 947.302 51.3935C946.908 54.0778 949.589 56.9165 952.648 57.0128C955.789 57.1116 958.449 54.1676 958.244 51.3935C958.094 49.3688 956.865 47.023 954.413 47.0229Z\" fill=\"#5B8BEF\"/>\n<path d=\"M291.846 478.108C288.669 478.739 284.426 479.192 283.853 483.604C283.294 487.9 286.208 492.75 290.496 492.137C294.759 491.528 297.632 488.043 297.342 483.604C297.13 480.363 295.031 477.475 291.846 478.108Z\" fill=\"#5B8BEF\"/>\n<path d=\"M331.499 479.952C327.456 478.684 322.355 482.168 321.803 485.955C321.265 489.641 324.921 493.54 329.092 493.672C333.375 493.808 337.003 489.765 336.723 485.955C336.519 483.174 334.449 480.877 331.499 479.952Z\" fill=\"#5B8BEF\"/>\n<path d=\"M59.4561 212.954C56.0738 212.497 52.9711 214.726 52.0955 218.024C50.9016 222.523 57.9909 226.728 62.0878 224.519C64.1843 223.389 65.4689 221.902 65.5851 219.523C65.7466 216.216 62.7374 213.397 59.4561 212.954Z\" fill=\"#5B8BEF\"/>\n<path d=\"M58.5126 245.894C53.2255 245.575 52.4806 248.286 52.0189 251.625C51.5693 254.875 53.8207 256.74 57.3061 256.857C60.8856 256.976 63.1707 253.411 62.937 250.052C62.7664 247.6 61.1215 246.051 58.5126 245.894Z\" fill=\"#5B8BEF\"/>\n<path d=\"M71.401 445.94C67.897 444.854 63.4767 447.84 62.9979 451.085C62.5316 454.246 65.7007 457.587 69.3153 457.701C73.0276 457.817 76.1713 454.351 75.9289 451.085C75.752 448.702 73.9583 446.733 71.401 445.94Z\" fill=\"#5B8BEF\"/>\n<path d=\"M58.6633 337.531C54.7512 336.899 51.1626 339.981 50.1498 344.541C48.4609 352.146 57.308 356.58 62.0467 353.528C64.4716 351.966 65.6179 349.902 65.7523 346.613C65.9392 342.042 64.9364 338.545 58.6633 337.531Z\" fill=\"#5B8BEF\"/>\n<path d=\"M56.5996 301.825C52.1504 301.824 50.607 304.407 50.0335 308.819C49.475 313.115 52.2831 315.603 56.5996 315.235C61.5247 314.815 63.8132 313.259 63.5229 308.819C63.311 305.579 61.5244 301.825 56.5996 301.825Z\" fill=\"#5B8BEF\"/>\n<path d=\"M210.644 474.69C207.232 474.69 203.329 476.59 202.887 479.836C202.457 482.996 205.382 486.338 208.718 486.451C212.145 486.567 215.047 483.101 214.823 479.836C214.66 477.452 213.319 474.69 210.644 474.69Z\" fill=\"#5B8BEF\"/>\n<path d=\"M404.685 480.735C401.93 480.37 398.69 482.057 398.69 484.778C398.69 490.358 403.492 491.716 406.828 489.956C408.536 489.055 409.582 487.869 409.677 485.972C409.808 483.336 407.358 481.088 404.685 480.735Z\" fill=\"#5B8BEF\"/>\n<path d=\"M443.213 478.712C437.926 478.394 437.181 481.105 436.719 484.443C436.27 487.694 438.521 489.559 442.006 489.676C445.586 489.795 447.871 486.23 447.637 482.871C447.467 480.419 445.822 478.869 443.213 478.712Z\" fill=\"#5B8BEF\"/>\n<path d=\"M478.085 480.913C474.581 479.826 470.16 482.813 469.682 486.058C469.215 489.218 472.46 491.93 475.999 492.673C480.039 493.522 482.855 489.324 482.613 486.058C482.436 483.675 480.642 481.706 478.085 480.913Z\" fill=\"#5B8BEF\"/>\n<path d=\"M510.87 477.688C507.131 477.688 503.77 479.698 502.811 483.439C501.213 489.678 509.587 493.315 514.073 490.811C516.368 489.529 517.453 487.837 517.58 485.139C517.757 481.388 516.305 477.688 510.87 477.688Z\" fill=\"#5B8BEF\"/>\n<path d=\"M373.117 477.972C368.805 476.614 363.364 480.347 362.775 484.404C362.201 488.354 366.102 492.531 370.55 492.673C375.119 492.818 378.988 488.486 378.69 484.404C378.472 481.424 376.265 478.964 373.117 477.972Z\" fill=\"#5B8BEF\"/>\n<path d=\"M575.801 475.753C572.081 475.268 568.669 477.635 567.707 481.138C566.394 485.916 574.19 490.381 578.695 488.036C581.001 486.836 582.413 485.257 582.541 482.73C582.719 479.218 579.409 476.224 575.801 475.753Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1188.23 397.776C1182.46 397.458 1181.65 400.169 1181.14 403.507C1180.65 406.757 1183.11 408.622 1186.91 408.739C1190.82 408.859 1193.31 405.294 1193.05 401.934C1192.87 399.483 1191.07 397.933 1188.23 397.776Z\" fill=\"#5B8BEF\"/>\n<path d=\"M720.704 474.758C717.001 474.239 713.604 476.768 712.645 480.509C711.047 486.747 719.421 490.385 723.907 487.881C726.202 486.599 727.287 484.906 727.414 482.209C727.591 478.458 726.642 475.589 720.704 474.758Z\" fill=\"#5B8BEF\"/>\n<path d=\"M816.694 472.692C811.785 472.692 810.082 475.571 809.449 480.489C808.833 485.278 811.931 488.05 816.694 487.64C822.128 487.172 824.653 485.438 824.332 480.489C824.099 476.877 822.127 472.692 816.694 472.692Z\" fill=\"#5B8BEF\"/>\n<path d=\"M881.771 475.69C878.075 475.69 873.847 477.626 873.368 480.935C872.902 484.156 876.071 487.562 879.685 487.678C883.398 487.796 886.541 484.264 886.299 480.935C886.122 478.505 884.669 475.69 881.771 475.69Z\" fill=\"#5B8BEF\"/>\n<path d=\"M850.883 475.744C847.878 475.343 844.344 477.198 844.344 480.191C844.344 486.33 849.582 487.823 853.222 485.887C855.084 484.896 856.226 483.592 856.329 481.506C856.472 478.605 853.799 476.133 850.883 475.744Z\" fill=\"#5B8BEF\"/>\n<path d=\"M763.56 474.718C757.793 474.371 756.98 477.328 756.476 480.97C755.986 484.516 758.442 486.551 762.244 486.678C766.149 486.808 768.642 482.919 768.387 479.255C768.201 476.58 766.406 474.889 763.56 474.718Z\" fill=\"#5B8BEF\"/>\n<path d=\"M250.627 473.691C246.637 473.691 243.051 475.855 242.028 479.883C240.322 486.6 249.258 490.516 254.044 487.82C256.493 486.44 257.651 484.617 257.787 481.713C257.976 477.675 256.426 473.691 250.627 473.691Z\" fill=\"#5B8BEF\"/>\n<path d=\"M169.776 475.14C165.145 473.557 161.588 476.302 160.955 481.032C160.339 485.638 163.345 490.509 168.122 490.674C173.029 490.843 176.161 485.792 175.841 481.032C175.607 477.558 173.156 476.296 169.776 475.14Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1186.49 425.013C1182.17 423.655 1176.73 427.388 1176.14 431.445C1175.57 435.395 1179.47 439.572 1183.92 439.714C1188.49 439.859 1192.36 435.527 1192.06 431.445C1191.84 428.465 1189.63 426.005 1186.49 425.013Z\" fill=\"#5B8BEF\"/>\n<path d=\"M62.1994 129.022C58.4799 128.537 55.0678 130.904 54.105 134.408C52.792 139.185 60.5881 143.65 65.0935 141.305C67.3991 140.105 68.8117 138.526 68.9395 135.999C69.1172 132.487 65.8079 129.493 62.1994 129.022Z\" fill=\"#5B8BEF\"/>\n<path d=\"M62.1042 412.764C56.3365 412.446 55.5239 415.157 55.0202 418.495C54.5297 421.746 56.9858 423.611 60.788 423.727C64.6929 423.847 67.1858 420.282 66.9308 416.923C66.7447 414.471 64.9502 412.921 62.1042 412.764Z\" fill=\"#5B8BEF\"/>\n<path d=\"M58.2216 273.914C54.5185 273.396 51.1216 275.924 50.1629 279.665C48.5642 285.904 56.9388 289.541 61.4243 287.037C63.7197 285.755 64.8048 284.063 64.932 281.365C65.1088 277.614 64.1596 274.745 58.2216 273.914Z\" fill=\"#5B8BEF\"/>\n<path d=\"M61.2806 166.929C56.3716 166.929 54.6687 169.808 54.0359 174.726C53.4197 179.515 56.518 182.288 61.2806 181.878C66.7146 181.41 69.2396 179.675 68.9193 174.726C68.6856 171.114 66.7144 166.93 61.2806 166.929Z\" fill=\"#5B8BEF\"/>\n<path d=\"M103.376 472.692C99.6792 472.692 95.4513 474.628 94.9725 477.937C94.5062 481.158 97.6753 484.564 101.29 484.68C105.002 484.798 108.146 481.266 107.904 477.937C107.727 475.507 106.274 472.692 103.376 472.692Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1170.64 455.759C1167.63 455.358 1164.1 457.213 1164.1 460.206C1164.1 466.345 1169.33 467.839 1172.97 465.902C1174.84 464.911 1175.98 463.607 1176.08 461.521C1176.22 458.62 1173.55 456.148 1170.64 455.759Z\" fill=\"#5B8BEF\"/>\n<path d=\"M611.631 474.935C607.857 473.768 603.097 476.974 602.581 480.459C602.079 483.852 605.573 486.763 609.385 487.561C613.735 488.473 616.768 483.965 616.507 480.459C616.316 477.9 614.385 475.786 611.631 474.935Z\" fill=\"#5B8BEF\"/>\n<path d=\"M60.6742 375.162C56.6604 373.776 53.5777 376.178 53.0291 380.317C52.495 384.347 55.1002 388.609 59.2409 388.754C63.4933 388.902 66.208 384.482 65.9304 380.317C65.7278 377.278 63.6037 376.173 60.6742 375.162Z\" fill=\"#5B8BEF\"/>\n<path d=\"M540.136 476.557C535.864 475.343 530.476 478.68 529.893 482.306C529.324 485.838 533.187 489.572 537.593 489.698C542.118 489.828 545.951 485.956 545.655 482.306C545.439 479.643 543.253 477.443 540.136 476.557Z\" fill=\"#5B8BEF\"/>\n<path d=\"M786.35 476.71C781.543 476.449 780.866 478.667 780.446 481.399C780.038 484.058 782.084 485.584 785.253 485.68C788.507 485.777 790.584 482.861 790.372 480.112C790.217 478.106 788.721 476.838 786.35 476.71Z\" fill=\"#5B8BEF\"/>\n<path d=\"M137.048 474.899C134.084 473.903 130.343 476.64 129.938 479.615C129.544 482.512 132.225 485.575 135.284 485.679C138.425 485.786 141.085 482.609 140.88 479.615C140.73 477.43 139.212 475.626 137.048 474.899Z\" fill=\"#5B8BEF\"/>\n<path d=\"M640.665 474.748C637.456 474.304 634.512 476.471 633.681 479.678C632.296 485.025 639.554 488.143 643.441 485.996C645.43 484.898 646.371 483.447 646.481 481.135C646.634 477.92 645.812 475.461 640.665 474.748Z\" fill=\"#5B8BEF\"/>\n<path d=\"M682.277 476.303C678.464 476.303 674.104 478.074 673.61 481.098C673.129 484.043 676.397 487.157 680.126 487.263C683.955 487.371 687.197 484.141 686.947 481.098C686.765 478.877 685.266 476.303 682.277 476.303Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1187.08 372.814C1184.32 372.486 1181.08 374.003 1181.08 376.452C1181.08 381.475 1185.88 382.697 1189.22 381.113C1190.93 380.302 1191.97 379.235 1192.07 377.528C1192.2 375.155 1189.75 373.132 1187.08 372.814Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1185.63 242.894C1180.35 242.604 1179.6 245.069 1179.14 248.104C1178.69 251.059 1180.94 252.754 1184.43 252.86C1188.01 252.969 1190.29 249.728 1190.06 246.674C1189.89 244.445 1188.24 243.036 1185.63 242.894Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1185.88 274.053C1182.65 273.066 1178.57 275.779 1178.13 278.728C1177.7 281.598 1180.69 284.062 1183.96 284.737C1187.69 285.509 1190.29 281.695 1190.06 278.728C1189.9 276.562 1188.24 274.774 1185.88 274.053Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1186.79 298.827C1183.3 298.827 1180.17 300.702 1179.27 304.193C1177.78 310.014 1185.6 313.408 1189.79 311.071C1191.93 309.875 1192.94 308.296 1193.06 305.779C1193.23 302.279 1191.87 298.827 1186.79 298.827Z\" fill=\"#5B8BEF\"/>\n</g>\n</g></g>\n<g class=\"pb-s pb-s-vine\"><g transform=\"translate(0 540) scale(1 -1)\">\n<g>\n<g>\n<path d=\"M397.231 438.713C399.633 450.125 416.898 458.783 416.898 458.783C416.898 458.783 420.888 440.019 416.898 429.539C413.902 421.67 408.83 411.763 404.291 412.909C399.753 414.056 395.071 428.45 397.231 438.713Z\" fill=\"#5B8BEF\"/>\n<path d=\"M380.703 459.203C392.725 451.936 416.675 459.203 416.675 459.203C416.675 459.203 405.049 478.353 392.694 480.687C382.604 482.592 367.713 477.689 367.214 474.192C366.714 470.694 373.964 463.277 380.703 459.203Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M131.964 376.766C132.699 384.362 140.957 396.751 140.957 396.751C140.957 396.751 152.442 388.322 153.947 380.264C155.682 370.969 148.451 357.781 144.954 357.782C141.456 357.783 130.958 366.369 131.964 376.766Z\" fill=\"#5B8BEF\"/>\n<path d=\"M122.925 394.261C115.281 397.437 107.437 403.753 107.937 407.75C108.437 411.747 117.929 417.742 132.418 412.746C146.906 407.75 141.411 391.762 141.411 391.762C141.411 391.762 129.602 391.487 122.925 394.261Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M117.243 185.732C110.322 199.477 124.15 221.501 124.15 221.501C124.15 221.501 141.419 207.528 141.765 193.155C142.035 181.922 138.681 167.918 134.118 167.49C129.555 167.062 121.606 177.068 117.243 185.732Z\" fill=\"#5B8BEF\"/>\n<path d=\"M148.885 215.017C137.844 213.822 122.905 221.512 122.905 221.512C122.905 221.512 135.147 239.631 147.386 241.996C159.443 244.326 175.864 236.501 177.363 232.504C178.862 228.507 162.077 216.446 148.885 215.017Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M287.776 102.118C282.28 108.613 279.782 120.104 279.782 120.104C279.782 120.104 300.872 121.015 308.26 112.11C313.565 105.716 316.254 101.119 312.757 96.1228C309.259 91.1268 293.272 95.6225 287.776 102.118Z\" fill=\"#5B8BEF\"/>\n<path d=\"M276.558 143.448C273.734 134.645 279.556 119.966 279.556 119.966C279.556 119.966 294.152 125.118 298.541 132.956C304.09 142.867 300.04 161.434 296.043 161.934C292.046 162.433 279.762 153.436 276.558 143.448Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M542.053 107.472C536.817 99.241 539.056 78.9941 539.056 78.9941C539.056 78.9941 557.042 80.9924 562.537 92.4834C568.033 103.974 562.537 117.464 559.04 117.964C555.543 118.464 546.062 113.773 542.053 107.472Z\" fill=\"#5B8BEF\"/>\n<path d=\"M556.155 58.43C545.775 62.2232 538.994 78.0693 538.994 78.0693C538.994 78.0693 558.931 84.0455 568.583 77.6909C575.613 73.0625 582.154 64.9815 580.484 59.7218C578.814 54.4621 565.515 55.0093 556.155 58.43Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M873.86 114.761C868.315 109.147 866.604 96.3873 866.604 96.3873C866.604 96.3873 890.492 90.4161 901.543 96.4604C911.092 101.683 918.274 116.728 915.906 118.53C913.537 120.332 884.261 125.294 873.86 114.761Z\" fill=\"#5B8BEF\"/>\n<path d=\"M867.792 64.4528C863.433 72.9307 865.969 96.8182 865.969 96.8182C865.969 96.8182 886.876 92.2396 890.47 80.8383C893.662 70.7144 889.005 53.6291 884.162 52.0025C879.319 50.3758 871.664 56.9231 867.792 64.4528Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M689.426 421.9C697.799 430.799 718.837 428.789 718.837 428.789C718.837 428.789 718.32 414.516 713.795 407.209C706.429 395.313 685.922 389.905 682.508 392.291C679.094 394.677 681.426 413.396 689.426 421.9Z\" fill=\"#5B8BEF\"/>\n<path d=\"M701.443 455.037C703.027 444.736 719.095 429.915 719.095 429.915C719.095 429.915 729.588 435.985 730.316 443.384C731.463 455.036 711.361 473.558 708.759 473.742C706.157 473.927 700.081 463.892 701.443 455.037Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M1007.54 414.754C1009.02 425.975 1031.03 431.741 1031.03 431.741C1031.03 431.741 1036.29 421.45 1035.02 414.754C1033.04 404.273 1017.54 393.27 1012.54 393.77C1007.54 394.27 1006.59 407.532 1007.54 414.754Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1002.58 435.505C1009.84 427.578 1030.01 433.284 1030.01 433.284C1030.01 433.284 1033.15 433.63 1031.03 444.205C1028.91 454.78 993.141 462.653 989.23 459.202C985.319 455.751 997.024 441.579 1002.58 435.505Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M1119.61 208.548C1119.61 208.548 1092.22 213.325 1085.99 226.934C1083.56 232.257 1078.52 241.766 1080.4 245.186C1082.28 248.606 1107.09 242.846 1114.93 232.577C1120.72 224.975 1119.61 208.548 1119.61 208.548Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1126.03 236.748C1119.11 228.542 1121.53 209.64 1121.53 209.64C1121.53 209.64 1138.89 215.432 1144.27 224.604C1148.61 232.011 1152.39 246.047 1147.87 246.29C1143.35 246.534 1132.02 243.866 1126.03 236.748Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g>\n<g>\n<path d=\"M405.959 446.36C407.16 452.81 415.792 457.703 415.792 457.703C415.792 457.703 417.787 447.098 415.792 441.174C414.294 436.727 411.758 431.127 409.489 431.775C407.22 432.423 404.879 440.559 405.959 446.36Z\" fill=\"#5B8BEF\"/>\n<path d=\"M390.531 461.821C398.408 456.874 415.949 457.22 415.949 457.22C415.949 457.22 409.36 467.692 400.828 470.367C393.86 472.552 382.921 472.155 382.271 470.578C381.621 469.002 386.115 464.594 390.531 461.821Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M137.93 385.108C138.358 388.845 143.17 394.941 143.17 394.941C143.17 394.941 149.863 390.794 150.74 386.829C151.752 382.255 147.538 375.767 145.5 375.767C143.461 375.768 137.344 379.992 137.93 385.108Z\" fill=\"#5B8BEF\"/>\n<path d=\"M129.652 395.985C125.197 397.548 120.626 400.656 120.918 402.622C121.209 404.589 126.74 407.539 135.184 405.081C143.627 402.622 140.424 394.756 140.424 394.756C140.424 394.756 133.543 394.62 129.652 395.985Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M121.507 200.979C118.942 207.648 126.039 218.436 126.039 218.436C126.039 218.436 133.25 211.699 132.833 204.697C132.507 199.225 130.441 192.387 128.372 192.16C126.302 191.933 123.125 196.775 121.507 200.979Z\" fill=\"#5B8BEF\"/>\n<path d=\"M139.703 216.951C133.838 216.386 125.902 220.015 125.902 220.015C125.902 220.015 132.405 228.564 138.907 229.68C145.311 230.78 154.034 227.087 154.83 225.201C155.626 223.316 146.71 217.625 139.703 216.951Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M285.406 109.329C282.227 112.804 280.782 118.953 280.782 118.953C280.782 118.953 292.981 119.44 297.255 114.675C300.323 111.254 301.878 108.794 299.855 106.121C297.833 103.448 288.585 105.853 285.406 109.329Z\" fill=\"#5B8BEF\"/>\n<path d=\"M278.21 132.261C276.659 127.652 279.856 119.967 279.856 119.967C279.856 119.967 287.874 122.664 290.284 126.768C293.332 131.957 291.108 141.678 288.912 141.939C286.717 142.201 279.969 137.49 278.21 132.261Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M542.428 98.965C539.642 93.4828 540.833 79.9976 540.833 79.9976C540.833 79.9976 550.405 81.3285 553.329 88.982C556.254 96.6355 553.329 105.62 551.468 105.953C549.607 106.286 544.562 103.162 542.428 98.965Z\" fill=\"#5B8BEF\"/>\n<path d=\"M552.256 67.3619C545.805 69.9475 541.16 77.7471 541.16 77.7471C541.16 77.7471 553.122 78.8424 559.212 75.1457C563.648 72.4531 567.897 68.2225 567.048 65.9555C566.199 63.6885 558.074 65.03 552.256 67.3619Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M870.702 103.575C868.773 100.801 870.08 96.0178 870.08 96.0178C870.08 96.0178 883.598 97.2277 888.331 100.924C892.421 104.118 893.579 110.479 892.03 110.79C890.481 111.101 874.322 108.779 870.702 103.575Z\" fill=\"#5B8BEF\"/>\n<path d=\"M869.815 79.7862C868.082 85.4062 870.341 95.7715 870.341 95.7715C870.341 95.7715 880.218 85.8885 881.456 79.1675C882.555 73.1997 879.568 66.8357 877.164 67.8536C874.759 68.8715 871.354 74.7947 869.815 79.7862Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M705.806 426.751C711.004 431.299 718.134 427.963 718.134 427.963C718.134 427.963 714.472 419.369 711.054 415.397C705.49 408.932 696.747 407.72 696.091 409.509C695.435 411.298 700.838 422.404 705.806 426.751Z\" fill=\"#5B8BEF\"/>\n<path d=\"M711.345 444.649C711.968 438.371 718.763 429.441 718.763 429.441C718.763 429.441 723.283 433.227 723.633 437.75C724.186 444.875 715.685 456.035 714.573 456.127C713.461 456.22 710.809 450.047 711.345 444.649Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M1017.23 422.146C1020.76 429.772 1032.12 430.212 1032.12 430.212C1032.12 430.212 1031.86 422.133 1029.58 417.646C1026.01 410.621 1016.23 405.444 1014.11 406.613C1012 407.782 1014.95 417.237 1017.23 422.146Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1019.5 433.864C1024.54 430.961 1028.7 432.723 1028.7 432.723C1028.7 432.723 1029.08 438.191 1024.56 443.378C1020.03 448.564 1006.72 446.485 1006.86 443.992C1007 441.5 1015.64 436.089 1019.5 433.864Z\" fill=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M1120.03 210.88C1120.03 210.88 1103.65 214.205 1099.59 222.116C1098 225.21 1094.75 230.752 1095.76 232.666C1096.78 234.579 1111.65 230.748 1116.58 224.711C1120.23 220.241 1120.03 210.88 1120.03 210.88Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1125.06 228.129C1120.67 223.009 1121.56 211.639 1121.56 211.639C1121.56 211.639 1132.15 215.54 1135.64 221.208C1138.46 225.785 1141.14 234.357 1138.44 234.4C1135.73 234.443 1128.86 232.57 1125.06 228.129Z\" fill=\"#5B8BEF\"/>\n</g>\n</g>\n<g>\n<path d=\"M196.349 155.938C220.243 116.19 235.818 106.477 283.281 120.965C330.744 135.454 347.719 135.456 393.19 125.463C438.66 115.47 477.974 78.9023 542.574 79.4989C599.279 80.0226 631.452 110.722 687.96 115.47C757.7 121.331 803.223 127.122 873.815 94.4867C944.408 61.8513 974.266 138.768 1034.19 142.449C1180.23 151.421 1094.06 263.383 1109.13 323.809C1124.21 384.234 1061.1 437.603 1024.7 431.225C974.731 422.47 937.56 443.951 894.799 431.225C852.038 418.499 810.141 373.56 715.439 431.225C620.737 488.89 581.543 405.746 555.564 412.24C529.584 418.734 467.779 458.581 407.179 457.704C348.015 456.848 370.712 417.237 313.756 421.233C256.801 425.23 239.814 360.281 174.364 391.756C108.915 423.232 103.219 310.127 105.918 261.857C108.616 213.588 172.454 195.686 196.349 155.938Z\" stroke-width=\"3.99689\" stroke=\"#5B8BEF\"/>\n<path d=\"M198.785 158.374C222.68 118.626 238.255 108.913 285.718 123.401C333.181 137.89 350.156 137.892 395.626 127.899C441.097 117.906 480.41 81.3384 545.01 81.935C601.715 82.4586 633.888 113.158 690.396 117.906C760.137 123.767 805.66 129.558 876.252 96.9228C946.844 64.2874 976.702 141.204 1036.63 144.885C1182.67 153.857 1096.5 265.819 1111.57 326.245C1126.64 386.67 1063.54 440.039 1027.13 433.661C977.167 424.906 939.997 446.387 897.236 433.661C854.475 420.935 812.577 375.996 717.875 433.661C623.173 491.326 583.98 408.182 558 414.676C532.02 421.17 470.216 461.017 409.615 460.14C350.452 459.284 373.149 419.673 316.193 423.669C259.237 427.666 242.25 362.717 176.801 394.192C111.352 425.668 105.656 312.563 108.354 264.293C111.053 216.024 174.891 198.122 198.785 158.374Z\" stroke-width=\"3.99689\" stroke=\"#5B8BEF\"/>\n</g>\n<g>\n<path d=\"M509.108 429.226C492.247 415.522 551.574 401.247 555.571 402.746C559.569 404.246 600.806 439.366 582.55 442.716C571.462 444.75 558.069 430.725 558.069 430.725C558.069 430.725 544.615 457.583 535.09 450.709C528.197 445.734 533.088 428.227 533.088 428.227C533.088 428.227 517.101 435.721 509.108 429.226Z\" fill=\"#5B8BEF\"/>\n<path d=\"M524.057 410.464C522.951 412.43 522.909 414.402 524.592 416.237C530.379 422.55 546.497 416.267 546.574 416.237C546.556 416.282 542.436 426.678 546.574 430.226C552.037 434.909 558.565 416.237 558.565 416.237C558.592 416.277 564.307 424.764 570.057 426.229C574.117 427.263 575.179 424.027 574.797 419.261C584.644 429.439 592.58 440.874 582.547 442.715C571.459 444.75 558.065 430.725 558.065 430.725C558.021 430.814 544.597 457.572 535.087 450.708C528.206 445.742 533.069 428.285 533.085 428.227C533.006 428.264 517.078 435.705 509.105 429.225C500.773 422.453 511.048 415.543 524.057 410.464Z\" fill=\"#5B8BEF\"/>\n<path d=\"M886.314 398.399C875.378 399.48 877.819 425.729 877.819 425.729C877.819 425.729 862.374 418.059 852.339 423.731C833.729 434.25 895.306 452.708 898.303 452.209C901.301 451.709 942.426 418.286 924.783 414.042C915.062 411.704 901.801 421.381 901.801 421.381C901.801 421.381 896.872 397.355 886.314 398.399Z\" fill=\"#5B8BEF\"/>\n<path d=\"M886.313 398.399C896.852 397.357 901.783 421.294 901.801 421.381C901.837 421.355 915.075 411.708 924.783 414.042C933.246 416.078 928.185 424.826 920.299 433.435C920.103 432.642 919.773 431.901 919.287 431.225C914.982 425.242 905.835 435.182 905.798 435.222C905.798 435.222 901.374 417.857 893.308 421.233C885.569 424.473 891.809 439.219 891.809 439.219C891.809 439.219 877.862 431.301 871.324 439.219C870.186 440.598 869.709 441.92 869.762 443.182C855.194 437.146 842.454 429.319 852.34 423.731C862.349 418.074 877.743 425.691 877.819 425.729C877.808 425.604 875.404 399.477 886.313 398.399Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1130.62 299.827C1128.81 280.81 1087.15 315.814 1086.65 321.31C1086.15 326.807 1134.97 363.392 1134.62 342.793C1134.42 331.614 1120.13 322.31 1120.13 322.31C1120.13 322.31 1131.62 310.319 1130.62 299.827Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1107.87 301.565C1118.66 294.388 1129.71 290.235 1130.62 299.827C1131.62 310.319 1120.13 322.31 1120.13 322.31C1120.13 322.31 1134.43 331.614 1134.62 342.793C1134.85 356.152 1114.4 345.458 1100.13 334.792C1100.73 330.711 1100.65 327.332 1100.65 327.306C1100.65 327.306 1111.89 332.071 1113.64 327.306C1115.29 322.776 1105.17 318.327 1105.14 318.313C1105.17 318.296 1114.46 311.994 1113.64 306.323C1113.25 303.687 1110.85 302.279 1107.87 301.565Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1002.22 112.472C993.731 115.97 1014.21 155.439 1021.21 157.937C1028.2 160.435 1082.66 146.447 1067.67 134.956C1057.76 127.358 1037.7 137.454 1037.7 137.454C1037.7 137.454 1047.45 109.869 1037.7 109.975C1031.72 110.04 1024.21 121.966 1024.21 121.966C1024.21 121.966 1010.72 108.975 1002.22 112.472Z\" fill=\"#5B8BEF\"/>\n<path d=\"M688.967 148.945C666.483 155.94 675.98 107.978 677.477 105.979C678.974 103.98 713.329 81.4788 716.945 96.9856C718.864 105.218 707.952 113.972 707.952 113.972C707.952 113.972 729.436 119.968 728.436 128.461C727.435 136.955 693.464 128.961 693.464 128.961C693.464 128.961 696.926 146.469 688.967 148.945Z\" fill=\"#5B8BEF\"/>\n<path d=\"M423.17 101.481C440.916 104.972 394.193 136.954 390.195 136.954C386.198 136.954 343.07 118.227 354.223 104.479C361.48 95.534 381.203 105.503 381.203 105.503C381.203 105.503 384.572 74.8993 395.192 79.5231C404.25 83.4672 402.186 105.978 402.186 105.978C402.186 105.978 414.947 99.8639 423.17 101.481Z\" fill=\"#5B8BEF\"/>\n<path d=\"M209.336 166.432C205.34 167.432 147.624 144.694 164.373 134.956C174.325 129.17 194.848 143.45 194.848 143.45C194.848 143.45 187.514 120.405 197.347 114.97C216.333 104.479 213.333 165.433 209.336 166.432Z\" fill=\"#5B8BEF\"/>\n<path d=\"M117.41 271.849C105.578 274.633 109.915 301.326 109.915 301.326C109.915 301.326 92.124 286.914 83.436 293.332C72.6901 301.271 99.9232 323.309 99.9232 323.309C99.9232 323.309 83.232 333.682 85.4345 344.293C89.0326 361.627 125.903 328.805 127.901 325.308C129.9 321.81 134.396 267.852 117.41 271.849Z\" fill=\"#5B8BEF\"/>\n<g>\n<path d=\"M701.421 93.0352C708.838 90.6603 715.465 90.6397 716.945 96.9854C718.86 105.198 708.006 113.93 707.953 113.973C708.054 114.001 729.435 119.989 728.437 128.462C727.436 136.943 693.56 128.983 693.466 128.961C693.466 128.961 696.927 146.469 688.968 148.945C678.636 152.159 675.06 143.769 674.354 133.566C679.937 130.495 683.972 121.466 683.972 121.466C684.033 121.492 696.447 126.736 698.96 121.466C701.514 116.108 689.014 109.997 688.968 109.975C689.048 109.936 701.021 104.157 703.456 96.9854C704.336 94.3928 703.419 93.2392 701.421 93.0352Z\" fill=\"#5B8BEF\"/>\n<path d=\"M197.348 114.971C206.355 109.993 210.411 121.099 211.762 134.253C208.691 133.364 205.48 132.997 202.842 133.957C194.4 137.031 202.808 154.372 202.842 154.44C202.764 154.404 184.999 146.087 180.859 150.443C179.548 151.824 179.04 153.277 179.157 154.763C166.284 147.977 155.981 139.835 164.373 134.956C174.325 129.171 194.848 143.45 194.848 143.45C194.848 143.45 187.514 120.405 197.348 114.971Z\" fill=\"#5B8BEF\"/>\n<path d=\"M117.409 271.849C125.494 269.947 128.71 281.173 129.647 293.838C126.372 291.583 122.543 289.929 119.407 291.333C111.22 295 123.891 316.792 123.904 316.814C123.904 316.814 106.397 304.93 101.921 310.319C96.9804 316.267 119.332 324.779 119.407 324.808C119.316 324.835 98.5967 330.87 100.922 337.797C101.745 340.247 104.497 341.7 107.345 342.56C97.4027 349.066 87.2383 352.982 85.4346 344.292C83.236 333.699 99.8704 323.342 99.9229 323.309C99.8148 323.222 72.7117 301.256 83.4355 293.333C92.1112 286.923 109.865 301.286 109.915 301.327C109.915 301.327 105.578 274.634 117.409 271.849Z\" fill=\"#5B8BEF\"/>\n</g>\n<path d=\"M282.782 396.751C280.284 394.253 213.574 401.576 228.824 418.734C236.817 427.727 263.297 416.236 263.297 416.236C263.297 416.236 256.885 435.691 265.796 443.215C280.385 455.533 285.28 399.249 282.782 396.751Z\" fill=\"#5B8BEF\"/>\n<path d=\"M250.06 400.157C249.212 401.987 249.43 403.735 251.306 405.246C260.322 412.506 273.453 408.315 277.285 403.747C277.25 403.81 269.415 418.107 273.788 422.732C276.571 425.676 279.211 424.356 281.583 420.888C279.087 435.515 273.96 450.11 265.795 443.215C256.906 435.709 263.266 416.332 263.297 416.237C263.221 416.27 236.805 427.714 228.823 418.734C221.046 409.983 234.59 403.793 250.06 400.157Z\" fill=\"#5B8BEF\"/>\n<path d=\"M1037.69 109.975C1047.44 109.87 1037.72 137.383 1037.69 137.454C1037.78 137.409 1057.78 127.375 1067.67 134.956C1074.95 140.535 1065.85 146.702 1053.77 151.286C1053.93 149.609 1053.6 147.848 1052.18 146.448C1046.78 141.135 1031.7 147.947 1031.7 147.947C1031.7 147.947 1039.07 131.439 1030.7 131.958C1023.72 132.391 1020.21 144.419 1020.21 144.449C1020.21 144.449 1011.15 130.67 1006.22 135.456C1006.13 135.539 1006.05 135.625 1005.97 135.712C1001 125.052 997.958 114.228 1002.22 112.472C1010.7 108.979 1024.17 121.936 1024.2 121.965C1024.25 121.891 1031.74 110.04 1037.69 109.975Z\" fill=\"#5B8BEF\"/>\n<path d=\"M381.202 105.503C381.217 105.366 384.596 74.9111 395.191 79.5239C404.25 83.468 402.186 105.979 402.186 105.979C402.186 105.979 414.946 99.8649 423.169 101.482C431.315 103.084 425.876 110.688 417.223 118.448C417.055 118.285 416.874 118.124 416.676 117.968C410.818 113.374 400.717 122.441 400.688 122.466C400.688 122.466 399.781 104.712 392.194 104.98C384.293 105.26 386.699 124.464 386.699 124.464C386.699 124.464 371.002 111.92 362.218 117.47C360.699 118.43 359.717 119.403 359.093 120.307C353.288 115.132 350.168 109.478 354.223 104.48C361.463 95.5542 381.118 105.461 381.202 105.503Z\" fill=\"#5B8BEF\"/>\n</g>\n</g></g>\n          </svg>\n        </div>\n        <div class=\"pb-grain\" aria-hidden=\"true\"></div>\n        <button type=\"button\" class=\"pb-open\" id=\"pbCloseLid\" aria-controls=\"pbBox\"><span class=\"pb-sr\">Close the Pencil Box</span></button>\n        <div class=\"pb-shade\" id=\"pbShadeInside\"></div>\n      </div>\n    </div>\n  </div>\n  <!-- under the box while it is open (desktop): the just-in-case way to close it (\"Behind the scenes\" moves to its own Play item) -->\n  <p class=\"pb-more\" id=\"pbMore\" hidden><button type=\"button\" class=\"pb-close-text\" id=\"pbCloseText\"><span aria-hidden=\"true\">\u00d7</span> Close box</button></p>\n  <!-- the Final Five playground panel: hidden; the engine reads Fiona's locked settings from it -->\n  <section class=\"panel\" aria-label=\"Drawing controls\" hidden>\n    <div class=\"row\">\n      <button type=\"button\" class=\"btn primary\" id=\"clear\">Tear off page</button>\n      <button type=\"button\" class=\"btn\" id=\"demoBtn\" hidden>Play demo</button>\n      <button type=\"button\" class=\"btn\" id=\"soundBtn\" aria-pressed=\"true\">Sound on</button>\n      <button type=\"button\" class=\"btn eraser-btn\" id=\"eraserBtn\" aria-pressed=\"false\">Flip to eraser <span style=\"opacity:.6\">(E)</span></button>\n      <div class=\"group\">\n        <span class=\"label\" id=\"lblHand\">Hand</span>\n        <div class=\"seg\" role=\"group\" aria-labelledby=\"lblHand\" id=\"handSeg\">\n          <button type=\"button\" data-hand=\"right\">Right</button>\n          <button type=\"button\" data-hand=\"left\">Left</button>\n        </div>\n      </div>\n      <div class=\"group\">\n        <span class=\"label\" id=\"lblLayout\">Box</span>\n        <div class=\"seg\" role=\"group\" aria-labelledby=\"lblLayout\" id=\"layoutSeg\">\n          <button type=\"button\" data-v=\"bottom\" aria-pressed=\"true\">Bottom</button>\n          <button type=\"button\" data-v=\"side\" aria-pressed=\"false\">Side</button>\n        </div>\n      </div>\n      <label class=\"slider\" for=\"size\">\n        <span class=\"top\"><span class=\"label\">Brush size</span><output id=\"sizeOut\"></output></span>\n        <input type=\"range\" id=\"size\" min=\"0.6\" max=\"1.8\" step=\"0.05\">\n      </label>\n      <label class=\"slider\" for=\"lag\">\n        <span class=\"top\"><span class=\"label\">Follow lag</span><output id=\"lagOut\"></output></span>\n        <input type=\"range\" id=\"lag\" min=\"0\" max=\"80\" step=\"1\">\n      </label>\n    </div>\n    <div class=\"opts\" id=\"opts\">\n      <span class=\"label\" id=\"optsLbl\">Pencil options</span>\n      <div class=\"group\" data-for=\"stars\">\n        <div class=\"seg\" role=\"group\" aria-label=\"Star style\" id=\"starStyleSeg\">\n          <button type=\"button\" data-v=\"drawn\">Soft drawn stars</button>\n          <button type=\"button\" data-v=\"night\">Night sky</button>\n          <button type=\"button\" data-v=\"combo\">Night sky + drawn stars</button>\n        </div>\n        <div class=\"seg\" role=\"group\" aria-label=\"Star shapes\" id=\"starShapesSeg\">\n          <button type=\"button\" data-v=\"fiona\">Your hand-drawn stars</button>\n          <button type=\"button\" data-v=\"soft\">Soft drawn (mine)</button>\n        </div>\n        <small class=\"optnote\">For the drawn stars:</small>\n        <div class=\"seg\" role=\"group\" aria-label=\"Star sparkle\" id=\"starSparkleSeg\">\n          <button type=\"button\" data-v=\"glitter\">Glitter sparkle</button>\n          <button type=\"button\" data-v=\"soft\">Soft brighten</button>\n        </div>\n        <div class=\"seg\" role=\"group\" aria-label=\"What the stars do\" id=\"starsSeg\">\n          <button type=\"button\" data-v=\"fall\">Fall away</button>\n          <button type=\"button\" data-v=\"stay\">Stay and twinkle</button>\n        </div>\n        <div class=\"seg\" role=\"group\" aria-label=\"Star colours\" id=\"starPalSeg\">\n          <button type=\"button\" data-v=\"gold\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#D2791C,#E3A12A,#F5CF63)\"></span>Gold</button>\n          <button type=\"button\" data-v=\"tints\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#E3A12A,#F5CF63,#7FA6E6,#6CC7A8,#A79BE6)\"></span>Gold with tints</button>\n          <button type=\"button\" data-v=\"rose\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#C9786A,#D98390,#E8A07A,#F2C09A)\"></span>Rose gold</button>\n          <button type=\"button\" data-v=\"multi\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#345089,#90CBFD,#0C9E8D,#5EACA3,#FFC800,#FF83FE,#FD1BED,#883577)\"></span>Your multicolour</button>\n          <button type=\"button\" data-v=\"rosenew\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#F0868E,#F79AB8,#FFA59A,#FFB98A,#FFC9A6)\"></span>Rose gold (your palette)</button>\n          <button type=\"button\" data-v=\"twilight\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#2B3F7A,#4B4FA8,#7A68C8,#F2C14E)\"></span>Twilight</button>\n          <button type=\"button\" data-v=\"pastel\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#F4AFC0,#F7C9A0,#F3E39A,#B7E0BF,#AFD1F0,#CDBBEE)\"></span>Pastel</button>\n          <button type=\"button\" data-v=\"silver\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#8E9AAB,#A9B4C2,#D5DBE3,#B8B0C8)\"></span>Silver</button>\n        </div>\n        <div class=\"optrow\" style=\"width:100%\">\n          <label class=\"slider\" for=\"starDensity\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">How many</span><output id=\"starDensityOut\"></output></span><input type=\"range\" id=\"starDensity\" min=\"30\" max=\"300\" step=\"5\"></label>\n          <label class=\"slider\" for=\"starPatch\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Patchiness</span><output id=\"starPatchOut\"></output></span><input type=\"range\" id=\"starPatch\" min=\"0\" max=\"100\" step=\"5\"></label>\n          <label class=\"slider\" for=\"starSpread\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Spread</span><output id=\"starSpreadOut\"></output></span><input type=\"range\" id=\"starSpread\" min=\"30\" max=\"300\" step=\"5\"></label>\n          <label class=\"slider\" for=\"starTiny\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Tiny stars</span><output id=\"starTinyOut\"></output></span><input type=\"range\" id=\"starTiny\" min=\"0\" max=\"90\" step=\"5\"></label>\n          <label class=\"slider\" for=\"starBig\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Star size</span><output id=\"starBigOut\"></output></span><input type=\"range\" id=\"starBig\" min=\"50\" max=\"200\" step=\"5\"></label>\n          <label class=\"slider\" for=\"starTwAmt\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Twinkle amount</span><output id=\"starTwAmtOut\"></output></span><input type=\"range\" id=\"starTwAmt\" min=\"0\" max=\"300\" step=\"5\"></label>\n          <label class=\"slider\" for=\"starGrain\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Grain</span><output id=\"starGrainOut\"></output></span><input type=\"range\" id=\"starGrain\" min=\"0\" max=\"300\" step=\"5\"></label>\n          <label class=\"slider\" for=\"starTwStr\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Twinkle strength</span><output id=\"starTwStrOut\"></output></span><input type=\"range\" id=\"starTwStr\" min=\"20\" max=\"200\" step=\"5\"></label>\n        </div>\n      </div>\n      <div class=\"group\" data-for=\"flowers\">\n        <div class=\"optrow\" style=\"width:100%\">\n          <label class=\"slider\" for=\"flowerGap\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Spacing</span><output id=\"flowerGapOut\"></output></span><input type=\"range\" id=\"flowerGap\" min=\"50\" max=\"200\" step=\"5\"></label>\n          <label class=\"slider\" for=\"flowerScale\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Flower size</span><output id=\"flowerScaleOut\"></output></span><input type=\"range\" id=\"flowerScale\" min=\"50\" max=\"200\" step=\"5\"></label>\n          <label class=\"slider\" for=\"flowerGrain\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Grain</span><output id=\"flowerGrainOut\"></output></span><input type=\"range\" id=\"flowerGrain\" min=\"0\" max=\"300\" step=\"5\"></label>\n          <label class=\"slider\" for=\"flowerVary\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Size variation</span><output id=\"flowerVaryOut\"></output></span><input type=\"range\" id=\"flowerVary\" min=\"0\" max=\"200\" step=\"5\"></label>\n          <label class=\"slider\" for=\"flowerWobble\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Wobble as it settles</span><output id=\"flowerWobbleOut\"></output></span><input type=\"range\" id=\"flowerWobble\" min=\"0\" max=\"250\" step=\"5\"></label>\n          <label class=\"slider\" for=\"flowerWind\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Breeze</span><output id=\"flowerWindOut\"></output></span><input type=\"range\" id=\"flowerWind\" min=\"0\" max=\"250\" step=\"5\"></label>\n          <label class=\"slider\" for=\"flowerSpeed\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Growing speed</span><output id=\"flowerSpeedOut\"></output></span><input type=\"range\" id=\"flowerSpeed\" min=\"30\" max=\"250\" step=\"5\"></label>\n        </div>\n      </div>\n      <div class=\"group\" data-for=\"birds\">\n        <div class=\"seg\" role=\"group\" aria-label=\"Kind of bird\" id=\"birdTypeSeg\">\n          <button type=\"button\" data-v=\"swallow\">Swallows (your drawing)</button>\n          <button type=\"button\" data-v=\"gull\">Distant gulls</button>\n        </div>\n        <div class=\"seg\" role=\"group\" aria-label=\"What the birds do\" id=\"birdModeSeg\">\n          <button type=\"button\" data-v=\"away\">Fly away</button>\n          <button type=\"button\" data-v=\"linger\">Wheel about, then go</button>\n          <button type=\"button\" data-v=\"mix\">Mix: a few stay</button>\n        </div>\n        <div class=\"seg\" role=\"group\" aria-label=\"Birdsong\" id=\"birdSongSeg\">\n          <button type=\"button\" data-v=\"on\">Birdsong on</button>\n          <button type=\"button\" data-v=\"off\">Silent</button>\n        </div>\n        <label class=\"slider\" for=\"birdSongVol\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Birdsong volume</span><output id=\"birdSongVolOut\"></output></span><input type=\"range\" id=\"birdSongVol\" min=\"10\" max=\"200\" step=\"5\"></label>\n        <div class=\"seg\" role=\"group\" aria-label=\"Bird colour\" id=\"birdColSeg\">\n          <button type=\"button\" data-v=\"dove\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#6E7686,#868B9C,#B5BAC5)\"></span>Dove grey</button>\n          <button type=\"button\" data-v=\"dusk\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#2F3846,#4A5262,#8A93A3)\"></span>Dusk grey</button>\n          <button type=\"button\" data-v=\"navy\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#002344,#123A5E,#5E7C98)\"></span>Header navy</button>\n          <button type=\"button\" data-v=\"warm\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#3E3236,#5C4A4E,#9A8A88)\"></span>Warm charcoal</button>\n        </div>\n        <div class=\"optrow\" style=\"width:100%\">\n          <label class=\"slider\" for=\"birdCount\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">How many</span><output id=\"birdCountOut\"></output></span><input type=\"range\" id=\"birdCount\" min=\"30\" max=\"300\" step=\"5\"></label>\n          <label class=\"slider\" for=\"birdDist\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Distance</span><output id=\"birdDistOut\"></output></span><input type=\"range\" id=\"birdDist\" min=\"0\" max=\"100\" step=\"5\"></label>\n          <label class=\"slider\" for=\"birdSpeed\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Speed</span><output id=\"birdSpeedOut\"></output></span><input type=\"range\" id=\"birdSpeed\" min=\"40\" max=\"400\" step=\"5\"></label>\n          <label class=\"slider\" for=\"birdFlap\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Wingbeat speed</span><output id=\"birdFlapOut\"></output></span><input type=\"range\" id=\"birdFlap\" min=\"40\" max=\"250\" step=\"5\"></label>\n          <label class=\"slider\" for=\"birdGrain\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Grain</span><output id=\"birdGrainOut\"></output></span><input type=\"range\" id=\"birdGrain\" min=\"0\" max=\"300\" step=\"5\"></label>\n          <label class=\"slider\" for=\"birdFlock\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Flocking</span><output id=\"birdFlockOut\"></output></span><input type=\"range\" id=\"birdFlock\" min=\"0\" max=\"100\" step=\"5\"></label>\n        </div>\n      </div>\n      <div class=\"group\" data-for=\"bubbles\">\n        <div class=\"seg\" role=\"group\" aria-label=\"Pop sound\" id=\"bubSoundSeg\">\n          <button type=\"button\" data-v=\"on\">Pop sound on</button>\n          <button type=\"button\" data-v=\"off\">Silent</button>\n        </div>\n        <label class=\"slider\" for=\"bubSoundVol\" style=\"max-width:190px\"><span class=\"top\"><span class=\"label\">Pop volume</span><output id=\"bubSoundVolOut\"></output></span><input type=\"range\" id=\"bubSoundVol\" min=\"10\" max=\"250\" step=\"5\"></label>\n        <div class=\"seg\" role=\"group\" aria-label=\"Bubble look\" id=\"bubStyleSeg\">\n          <button type=\"button\" data-v=\"pearl\">Pearl bubbles</button>\n          <button type=\"button\" data-v=\"riso\">Riso bubbles</button>\n        </div>\n        <div class=\"seg\" role=\"group\" aria-label=\"Pearl bubble colours\" id=\"bubPalSeg\">\n          <button type=\"button\" data-v=\"pearl\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#A9CBF5,#CDB8F2,#F4B8D8,#A8EDE6)\"></span>Pearl colours</button>\n          <button type=\"button\" data-v=\"candy\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#5B8BEF,#FF83FE,#78AD96,#FFC800)\"></span>Your colours</button>\n        </div>\n        <div class=\"seg\" role=\"group\" aria-label=\"What the bubbles do\" id=\"bubblesSeg\">\n          <button type=\"button\" data-v=\"mix\">Mix</button>\n          <button type=\"button\" data-v=\"stay\">Stay</button>\n          <button type=\"button\" data-v=\"float\">Float away</button>\n        </div>\n        <small class=\"optnote\">Resting bubbles pop when the pencil touches them. Brush size sets bubble size.</small>\n        <div class=\"optrow\" style=\"width:100%\">\n          <div class=\"seg\" role=\"group\" id=\"bubMixSeg\"><button type=\"button\" data-v=\"on\">Natural size mix</button><button type=\"button\" data-v=\"off\">Even sizes</button></div>\n          <div class=\"seg\" role=\"group\" id=\"bubWobbleSeg\"><button type=\"button\" data-v=\"on\">Wobble</button><button type=\"button\" data-v=\"off\">No wobble</button></div>\n          <div class=\"seg\" role=\"group\" id=\"bubGrainSeg\"><button type=\"button\" data-v=\"on\">Grain</button><button type=\"button\" data-v=\"off\">No grain</button></div>\n        </div>\n        <div class=\"optrow\" style=\"width:100%\">\n          <div class=\"seg\" role=\"group\" id=\"bubStarHiSeg\"><button type=\"button\" data-v=\"on\">Star highlights</button><button type=\"button\" data-v=\"off\">Round highlights</button></div>\n          <div class=\"seg\" role=\"group\" id=\"bubOverlapSeg\"><button type=\"button\" data-v=\"on\">Deeper overlaps</button><button type=\"button\" data-v=\"off\">Plain overlaps</button></div>\n        </div>\n        <div class=\"optrow\" style=\"width:100%\">\n          <label class=\"slider\" for=\"bubColour\" style=\"max-width:190px\">\n            <span class=\"top\"><span class=\"label\">Colour strength</span><output id=\"bubColourOut\"></output></span>\n            <input type=\"range\" id=\"bubColour\" min=\"30\" max=\"300\" step=\"1\">\n          </label>\n          <label class=\"slider\" for=\"bubEdge\" style=\"max-width:190px\">\n            <span class=\"top\"><span class=\"label\">Edge</span><output id=\"bubEdgeOut\"></output></span>\n            <input type=\"range\" id=\"bubEdge\" min=\"0\" max=\"300\" step=\"1\">\n          </label>\n          <label class=\"slider\" for=\"bubShine\" style=\"max-width:190px\">\n            <span class=\"top\"><span class=\"label\">Highlight</span><output id=\"bubShineOut\"></output></span>\n            <input type=\"range\" id=\"bubShine\" min=\"0\" max=\"250\" step=\"1\">\n          </label>\n          <label class=\"slider\" for=\"bubShift\" style=\"max-width:190px\">\n            <span class=\"top\"><span class=\"label\">Colour shift</span><output id=\"bubShiftOut\"></output></span>\n            <input type=\"range\" id=\"bubShift\" min=\"0\" max=\"200\" step=\"1\">\n          </label>\n          <label class=\"slider\" for=\"bubGlint\" style=\"max-width:190px\">\n            <span class=\"top\"><span class=\"label\">Glints</span><output id=\"bubGlintOut\"></output></span>\n            <input type=\"range\" id=\"bubGlint\" min=\"0\" max=\"300\" step=\"1\">\n          </label>\n          <label class=\"slider\" for=\"bubWarm\" style=\"max-width:190px\">\n            <span class=\"top\"><span class=\"label\">Warmth</span><output id=\"bubWarmOut\"></output></span>\n            <input type=\"range\" id=\"bubWarm\" min=\"0\" max=\"100\" step=\"1\">\n          </label>\n          <label class=\"slider\" for=\"bubGrainAmt\" style=\"max-width:190px\">\n            <span class=\"top\"><span class=\"label\">Grain amount</span><output id=\"bubGrainAmtOut\"></output></span>\n            <input type=\"range\" id=\"bubGrainAmt\" min=\"0\" max=\"400\" step=\"5\">\n          </label>\n        </div>\n      </div>\n      <div class=\"group\" data-for=\"gradient\">\n        <div class=\"optrow\">\n          <div class=\"seg\" role=\"group\" aria-label=\"Gradient colours\" id=\"gradSeg\">\n            <button type=\"button\" data-v=\"aurora\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#3FD8C2,#3FA3EE,#7B6CF0,#E27BD0)\"></span>Aurora</button>\n            <button type=\"button\" data-v=\"sunset\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#FFB36B,#FF7A8A,#C86BD8,#6C6FE0)\"></span>Sunset</button>\n            <button type=\"button\" data-v=\"ocean\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#9BE7F0,#3FB7D8,#2C7FC4,#243F9E)\"></span>Ocean</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"Line thickness\" id=\"widthSeg\">\n            <button type=\"button\" data-v=\"speed\">Thick when slow</button>\n            <button type=\"button\" data-v=\"swell\">Swelling</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"Finish\" id=\"finishSeg\">\n            <button type=\"button\" data-v=\"painty\">Painty</button>\n            <button type=\"button\" data-v=\"grainy\">Grainy</button>\n            <button type=\"button\" data-v=\"riso\">Riso</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"Light\" id=\"lightSeg\">\n            <button type=\"button\" data-v=\"shimmer\">Shimmer</button>\n            <button type=\"button\" data-v=\"shine\">Subtle shine</button>\n            <button type=\"button\" data-v=\"none\">No light</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"When the pencil is lifted\" id=\"wobSeg\">\n            <button type=\"button\" data-v=\"jump\">Jump</button>\n            <button type=\"button\" data-v=\"wobble\">Wobble</button>\n            <button type=\"button\" data-v=\"off\">Stay still</button>\n          </div>\n        </div>\n      </div>\n      <div class=\"group\" data-for=\"spray\">\n        <div class=\"optrow\">\n          <div class=\"seg\" role=\"group\" aria-label=\"Spray colours\" id=\"sprayPalSeg\">\n            <button type=\"button\" data-v=\"dreamy\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#5B5BF0,#4E8EEA,#FF86C8,#FFB3A7,#FFD98C)\"></span>Dreamy</button>\n            <button type=\"button\" data-v=\"sherbet\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#FFE11A,#FFC857,#FFB0A0,#F56CCB)\"></span>Sherbet</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"Spray finish\" id=\"sprayFinSeg\">\n            <button type=\"button\" data-v=\"smooth\">Smooth</button>\n            <button type=\"button\" data-v=\"grainy\">Grainy spray</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"Spray thickness\" id=\"sprayWidthSeg\">\n            <button type=\"button\" data-v=\"speed\">Thick when slow</button>\n            <button type=\"button\" data-v=\"swell\">Swelling</button>\n            <button type=\"button\" data-v=\"even\">Even</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"When the pencil is lifted\" id=\"sprayLiftSeg\">\n            <button type=\"button\" data-v=\"jump\">Jump</button>\n            <button type=\"button\" data-v=\"wobble\">Wobble</button>\n            <button type=\"button\" data-v=\"off\">Stay still</button>\n          </div>\n        </div>\n      </div>\n      <div class=\"group\" data-for=\"glitter\">\n        <div class=\"optrow\">\n          <div class=\"seg\" role=\"group\" aria-label=\"Glitter paint colours\" id=\"glitPalSeg\">\n            <button type=\"button\" data-v=\"dreamy\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#5B5BF0,#4E8EEA,#FF86C8,#FFB3A7,#FFD98C)\"></span>Dreamy</button>\n            <button type=\"button\" data-v=\"sherbet\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#FFE11A,#FFC857,#FFB0A0,#F56CCB)\"></span>Sherbet</button>\n            <button type=\"button\" data-v=\"aurora\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#3FD8C2,#3FA3EE,#7B6CF0,#E27BD0)\"></span>Aurora</button>\n            <button type=\"button\" data-v=\"sunset\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#FFB36B,#FF7A8A,#C86BD8,#6C6FE0)\"></span>Sunset</button>\n            <button type=\"button\" data-v=\"ocean\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#9BE7F0,#3FB7D8,#2C7FC4,#243F9E)\"></span>Ocean</button>\n            <button type=\"button\" data-v=\"candy\"><span class=\"dot\" style=\"background:linear-gradient(90deg,#5B64EF,#5B8BEF,#B888F6,#FF83FE,#FFA59A,#FFC800)\"></span>Your colours</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"Sparkle\" id=\"glitSparkSeg\">\n            <button type=\"button\" data-v=\"gentle\">Gentle glow</button>\n            <button type=\"button\" data-v=\"twinkle\">Twinkling</button>\n            <button type=\"button\" data-v=\"wave\">Catch the light</button>\n            <button type=\"button\" data-v=\"both\">Twinkle + catch</button>\n          </div>\n          <label class=\"slider\" for=\"glitMix\" style=\"max-width:220px\">\n            <span class=\"top\"><span class=\"label\">Colour balance: blues \u2194 pinks</span><output id=\"glitMixOut\"></output></span>\n            <input type=\"range\" id=\"glitMix\" min=\"-100\" max=\"100\" step=\"5\">\n          </label>\n          <label class=\"slider\" for=\"glitTwinkle\" style=\"max-width:220px\">\n            <span class=\"top\"><span class=\"label\">Twinkle strength</span><output id=\"glitTwinkleOut\"></output></span>\n            <input type=\"range\" id=\"glitTwinkle\" min=\"0\" max=\"100\" step=\"1\">\n          </label>\n          <div class=\"seg\" role=\"group\" aria-label=\"Edge\" id=\"glitEdgeSeg\">\n            <button type=\"button\" data-v=\"dots\">Clumpy scatter</button>\n            <button type=\"button\" data-v=\"spray\">Spray edge</button>\n          </div>\n          <label class=\"slider\" for=\"glitDensity\" style=\"max-width:200px\">\n            <span class=\"top\"><span class=\"label\">Glitter amount</span><output id=\"glitDensityOut\"></output></span>\n            <input type=\"range\" id=\"glitDensity\" min=\"30\" max=\"250\" step=\"1\">\n          </label>\n          <div class=\"seg\" role=\"group\" aria-label=\"Glitter settles after the jump\" id=\"glitSettleSeg\">\n            <button type=\"button\" data-v=\"on\">Settles after jump</button>\n            <button type=\"button\" data-v=\"off\">Stays put</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"Amount of glitter\" id=\"glitAmtSeg\">\n            <button type=\"button\" data-v=\"lots\">Lots of glitter</button>\n            <button type=\"button\" data-v=\"light\">A sprinkle</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"Thickness\" id=\"glitWidthSeg\">\n            <button type=\"button\" data-v=\"speed\">Thick when slow</button>\n            <button type=\"button\" data-v=\"swell\">Swelling</button>\n            <button type=\"button\" data-v=\"even\">Even</button>\n          </div>\n          <div class=\"seg\" role=\"group\" aria-label=\"When the pencil is lifted\" id=\"glitLiftSeg\">\n            <button type=\"button\" data-v=\"jump\">Jump</button>\n            <button type=\"button\" data-v=\"wobble\">Wobble</button>\n            <button type=\"button\" data-v=\"off\">Stay still</button>\n          </div>\n        </div>\n      </div>\n      <p class=\"optnote\" data-for=\"none\">No extra options for this pencil yet.</p>\n    </div>\n    <div class=\"meters\" aria-live=\"off\">\n      <span class=\"meter\">Frame rate <b id=\"fps\">\u2013</b></span>\n      <span class=\"meter\">Moving pieces <b id=\"count\">0</b></span>\n      <span class=\"meter\">Glitter specks <b id=\"flecks\">0</b></span>\n      <span>60 fps is smooth. The loop pauses when the paper is scrolled out of view.</span>\n    </div>\n  </section>\n";
  mount.insertAdjacentHTML('beforebegin', MARKUP);
  mount.insertAdjacentHTML('afterend', "<div class=\"pb pb-full\" id=\"pbFull\" hidden role=\"dialog\" aria-modal=\"true\" aria-label=\"Pencil Box\"></div>");
  mount.remove();

  /* ---------- 2. the drawing engine (Final Five), started on the tin's first open ---------- */
/* ======== Pencil Box: Final Five engine, unchanged except that it starts on first open with the paper's size ======== */
window.startPencilBox = (BW_IN, BH_IN) => {
  let BW = BW_IN || 1728, BH = BH_IN || 1117;   // the paper's shape, set when the tin first opens (reshape() below, while it's blank)
  const TIP = { x: 108.5, y: 106.9 };
  const ERASER_END = { x: 8.5, y: 8.5 };     // the rounded end of the pencil artwork
  const $ = id => document.getElementById(id);
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SIZES = { glitter: 1.2, bubbles: 1.5, stars: 1.8, birds: 1.8 };   // Fiona's chosen size per pencil (others default to 1)
  let picked = false, triedOne = false;   // nothing in hand when the box first opens
  const S = { brush: "glitter", hand: "right", size: 1, lag: 0.35, stars: "stay", starPal: "rosenew", starShapes: "fiona", starStyle: "drawn", starSparkle: "glitter", starDensity: 3, starPatch: 0.45, starSpread: 1.6, starTiny: 0, starBig: 1, starTwAmt: 3, starTwStr: 2, starGrain: 1.2, bubbles: "mix", grad: "aurora", gradWidth: "speed", light: "shimmer", finish: "riso", lift: "jump", sprayPal: "dreamy", sprayFinish: "grainy", sprayLift: "jump", sprayWidth: "speed", glitPal: "candy", glitWidth: "swell", glitLift: "jump", glitAmount: "lots", glitSparkle: "twinkle", glitTwinkle: 0.3, glitEdge: "dots", glitClump: 42, glitContrast: 0, glitDensity: 2.5, glitSettle: true, glitMix: 0, bubColour: 1.02, bubShine: 1.1, bubShift: 1, bubGlint: 1.5, bubEdge: 0.82, bubGrainAmt: 3.2, bubMix: true, bubWobble: true, bubWindow: false, bubGrain: true, bubShade: false, bubTintHi: false, bubRich: false, bubOverlap: true, bubWarm: 0.5, bubStyle: "pearl", bubPal: "candy", bubStarHi: true, bubSound: true, bubSoundVol: 1, bubApproach: false, birdMode: "away", birdCol: "dove", birdCount: 0.3, birdDist: 0, birdSpeed: 4, birdFlap: 1, birdFlock: 0, birdGrain: 1.3, birdSong: true, birdSongVol: 2, birdType: "swallow", flowerGap: 1, flowerScale: 1, flowerSpeed: 1, flowerWind: 1, flowerVary: 1, flowerGrain: 1.3, flowerWobble: 1.95 };

  const BRUSHES = [
    { id: "glitter", name: "Glitter", body: "url(#gFinalGlitter)", note: "Grainy paint in blue, pink and gold, with glitter that pours out, jumps and twinkles." },
    { id: "bubbles", name: "Bubbles", body: "url(#gFinalBubbles)", note: "Pearly bubbles with star highlights that float, wobble, drift away and pop." },
    { id: "stars",   name: "Stars",   body: "url(#gFinalStars)",   note: "Hand-drawn rose-gold stars scattered like the Milky Way, glinting as they catch the light." },
    { id: "flowers", name: "Flowers", body: "url(#gFinalFlowers)",             note: "A flower chain that grows and opens as you draw, sways in the breeze and wobbles when you lift." },
    { id: "birds",   name: "Birds",   body: "url(#gFinalBirds)",   note: "Swallows take off from the line, swoop and fly away, singing as they go." },
  ];
  const byId = Object.fromEntries(BRUSHES.map(b => [b.id, b]));

  /* ---------- canvases ---------- */
  const stage = $("stage");
  let R = Math.max(1, Math.min(2, (devicePixelRatio || 1) * stage.clientWidth / BW));
  const setup = c => { c.width = Math.round(BW * R); c.height = Math.round(BH * R); const x = c.getContext("2d"); x.setTransform(R, 0, 0, R, 0, 0); return x; };
  const waterCtx = setup($("waterCanvas")), ink = setup($("inkCanvas")), live = setup($("liveCanvas"));

  /* ---------- shared shapes ---------- */
  function sparkle(c, r) {
    const k = r * 0.16;
    c.beginPath(); c.moveTo(0, -r);
    c.quadraticCurveTo(k, -k, r, 0); c.quadraticCurveTo(k, k, 0, r);
    c.quadraticCurveTo(-k, k, -r, 0); c.quadraticCurveTo(-k, -k, 0, -r); c.closePath();
  }
  function star5(c, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.44 : r;
      i ? c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    c.closePath();
  }
  const easeOutBack = x => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);

  /* ---------- particles (everything that moves and then disappears) ---------- */
  const P = [];
  const MAX_P = 700;
  function spawn(p) {
    if (P.length >= MAX_P) {
      if (p.kind === "startw" || p.kind === "nighttw") return;      // when busy, skip a new twinkle rather than cut another short
      const i = P.findIndex(q => q.life !== Infinity && q.kind !== "startw" && q.kind !== "nighttw");
      P.splice(i < 0 ? 0 : i, 1);
    }
    p.age = 0; p.seed = Math.random() * 10; P.push(p);
  }
  function stepParticles(dt) {
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.age += dt;
      if (p.age >= p.life) { P.splice(i, 1); p.die && p.die(p); continue; }
      if (p.move) p.move(p, dt);
      else {
        p.vy += (p.g || 0) * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.vr) p.rot += p.vr * dt;
      }
    }
  }

  const GOLD = ["#E3A12A", "#F2C14E", "#D2791C", "#F5CF63"];
  // ---- round stars, like the header's night sky: a small solid core in a soft, grainy glow (pre-drawn, one per colour) ----
  const STAR_COLS = {
    gold:  ["#E3A12A", "#F2C14E", "#D2791C", "#F5CF63"],
    // gold with a third tinted, as in the header (its pale gold / blue / mint, deepened so they read on paper)
    tints: ["#E3A12A", "#F2C14E", "#D2791C", "#F5CF63", "#E3A12A", "#F2C14E", "#7FA6E6", "#6CC7A8", "#A79BE6"],
    rose:  ["#E8A07A", "#D98390", "#F2C09A", "#C9786A", "#EBB0A8"],                    // rose gold
    // rose gold brought in line with Fiona's palette (9 Nov): the glitter's coral-peach #FFA59A at its heart,
    // warmed towards her gold #FFC800 on one side and her pink #FF83FE on the other; cleaner and brighter than the dusty version
    // Fiona's multicolour stars (stars-2.svg, 10 Nov)
    multi: ["#90CBFD", "#883577", "#FD1BED", "#FF83FE", "#345089", "#0C9E8D", "#346963", "#FFC800", "#5EACA3"],
    rosenew: ["#FFA59A", "#FFB98A", "#F79AB8", "#FFC9A6", "#F0868E", "#FFA59A"],
    twilight: ["#2B3F7A", "#4B4FA8", "#7A68C8", "#3D6CB0", "#E3A12A", "#F2C14E"],       // the header's night blues, a little gold
    pastel: ["#F4AFC0", "#F7C9A0", "#F3E39A", "#B7E0BF", "#AFD1F0", "#CDBBEE"],          // the old rainbow's pastels
    silver: ["#A9B4C2", "#C3CBD6", "#8E9AAB", "#D5DBE3", "#B8B0C8"],                    // pewter and silver-lilac
  };
  const STAR_SPR = {}, STAR_CORE = 0.23;     // core radius as a fraction of the sprite's half-width
  function starSprite(hex) {
    if (STAR_SPR[hex]) return STAR_SPR[hex];
    const S2 = 96, h = S2 / 2, c = document.createElement("canvas"); c.width = c.height = S2;
    const x = c.getContext("2d"), [r, g, b] = hexRgb(hex);
    const hr = Math.round(r + (255 - r) * 0.2), hg = Math.round(g + (255 - g) * 0.2), hb = Math.round(b + (255 - b) * 0.2);
    const gr = x.createRadialGradient(h, h, h * STAR_CORE * 0.8, h, h, h);
    gr.addColorStop(0, `rgba(${hr},${hg},${hb},.9)`); gr.addColorStop(0.25, `rgba(${hr},${hg},${hb},.45)`);
    gr.addColorStop(0.55, `rgba(${hr},${hg},${hb},.15)`); gr.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, S2, S2);
    const img = x.getImageData(0, 0, S2, S2), rnd = mulberry(311 + hex.charCodeAt(2));
    for (let i = 0; i < S2 * S2; i++) img.data[i * 4 + 3] *= 0.3 + 0.7 * rnd();       // grainy, airbrushed glow
    x.putImageData(img, 0, 0);
    return (STAR_SPR[hex] = c);
  }
  const STAR_CORE_FILL = {};
  function starCore(c, x, y, r, hex) {        // solid, opaque core drawn as a true circle, a little lighter at the heart
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
    if (r < 2.2) { c.fillStyle = hex; c.fill(); return; }
    const [R0, G0, B0] = hexRgb(hex), l = v => Math.round(v + (255 - v) * 0.45);
    const g = c.createRadialGradient(x - r * 0.15, y - r * 0.15, 0, x, y, r);
    g.addColorStop(0, `rgb(${l(R0)},${l(G0)},${l(B0)})`); g.addColorStop(0.55, hex); g.addColorStop(1, hex);
    c.fillStyle = g; c.fill();
  }
  // ---- soft hand-drawn stars: rounded tips, slightly uneven, a pencil grain in the colour (pre-drawn per shape + colour) ----
  const DRAWN_VARIANTS = 8, DRAWN = {}, DS = 64, DR = 27;
  // Fiona's own hand-drawn stars (stars.svg, 10 Nov): 12 shapes, each centred in its box; rel keeps the small ones smaller
  const FIONA_STARS = [{"d":"M57 4.5C56 4 55.5 0 54.5 0C53.5 0 53 7 53 7C53 7 47.5 9.5 47.5 10.5C47.5 11.5 54.5 12.5 54.5 12.5C54.5 12.5 56 18 57 18C58 18 59 12.5 59 12.5C59 12.5 66.5 13.5 66.5 12.5C66.5 11.5 62 9 62 9C62 9 65 3 64.5 2C64 1 58 5 57 4.5Z","cx":57.0,"cy":9.0,"h":9.5,"rel":0.821},{"d":"M75.6081 10.0435C74.8472 10.0435 71.0426 7.82609 70.6622 8.56522C70.2817 9.30435 74.0863 13.3696 74.0863 13.3696C74.0863 13.3696 69.1405 17.4348 69.5209 18.1739C69.9013 18.913 75.2278 15.9565 75.9886 15.9565C76.7495 15.9565 79.4127 21.5 80.1736 21.5C80.9345 21.5 79.0323 14.8478 79.0323 14.8478C79.0323 14.8478 85.5 14.1087 85.5 13.3696C85.5 12.6304 80.1735 11.5217 79.4127 11.1522C78.6518 10.7826 79.4127 4.5 78.6518 4.5C77.8909 4.5 76.3689 10.0435 75.6081 10.0435Z","cx":77.32,"cy":13.0,"h":8.5,"rel":0.776},{"d":"M67.5 28.5C67.5 28.5 63 23 62 23C61 23 64 31 64 31C64 31 56.5 35 56.5 36C56.5 37 65.5 35 65.5 35C65.5 35 70 44.5 71 44.5C72 44.5 70.5 36 70.5 36C70.5 36 80 34.5 80 33.5C80 32.5 72 32 71.5 31.5C71 31 73 24 72.5 23.5C72 23 67.5 28.5 67.5 28.5Z","cx":68.25,"cy":33.75,"h":11.75,"rel":0.913},{"d":"M95.5 15C94.5 15 92.5 19 92.5 19C92.5 19 85.5 18.5 85.5 19C85.5 19.5 90.5 23.5 90.5 23.5C90.5 23.5 87 27.5 87 28C87 28.5 93 26 93 26C93 26 97 31 97.5 31C98 31 96.5 24.5 96.5 24.5C96.5 24.5 101 23 101 22C101 21 95.5 21 95.5 21C95.5 21 96.5 15 95.5 15Z","cx":93.25,"cy":23.0,"h":8.0,"rel":0.753},{"d":"M37.9192 16.5C37.1036 16.5 33.8409 25.0185 33.8409 25.0185C33.8409 25.0185 26.5 27.1482 26.5 28C26.5 28.8519 34.2487 30.9815 34.2487 30.9815C34.2487 30.9815 37.1036 39.5 37.9192 39.5C38.7349 39.5 39.5505 29.7037 39.5505 29.7037C39.5505 29.7037 46.8914 28 46.4836 27.1482C46.0758 26.2963 39.5505 25.0185 39.5505 25.0185C39.5505 25.0185 38.7349 16.5 37.9192 16.5Z","cx":36.7,"cy":28.0,"h":11.5,"rel":0.903},{"d":"M13 2.5C11.5 2.5 9.5 11 9.5 11C9.5 11 0 13 0 14.5C0 16 10.5 18 10.5 18C10.5 18 13 28 14.5 28C16 28 16.5 17.5 16.5 17.5C16.5 17.5 25.5 14 25.5 13C25.5 12 16 12 15.5 11C15 10 14.5 2.5 13 2.5Z","cx":12.75,"cy":15.25,"h":12.75,"rel":0.951},{"d":"M7.8839 34.8581L4.17775 30.3284C4.0103 30.1237 3.6812 30.2852 3.74067 30.5429L4.97209 35.8791C4.98967 35.9553 4.9706 36.0353 4.92055 36.0953L0.666747 41.1999C0.498513 41.4018 0.715742 41.6933 0.957282 41.5897L6.83632 39.0701C6.93429 39.0282 7.04809 39.0529 7.11979 39.1318L11.3562 43.7918C11.5294 43.9823 11.8427 43.8183 11.7848 43.5675L10.5279 38.1209C10.5103 38.0447 10.5294 37.9647 10.5794 37.9047L14.8673 32.7592C15.0335 32.5598 14.8234 32.2706 14.5824 32.367L8.17023 34.9319C8.06891 34.9724 7.953 34.9426 7.8839 34.8581Z","cx":7.77,"cy":37.05,"h":7.27,"rel":0.718},{"d":"M20.0799 46.9001L27.4083 37.7397C27.5687 37.5392 27.8909 37.6818 27.8503 37.9353L26.0318 49.3011C26.0132 49.4172 26.0781 49.5306 26.1876 49.5734L36.412 53.5743C36.7009 53.6873 36.6491 54.111 36.3415 54.1511L26.1111 55.4855C26.0404 55.4947 25.977 55.5337 25.9369 55.5926L19.2305 65.4286C19.0088 65.7538 18.5 65.5969 18.5 65.2033V53.618C18.5 53.5433 18.4666 53.4725 18.4089 53.425L10.5834 46.9804C10.3975 46.8273 10.5142 46.5257 10.7548 46.5377L19.8722 46.9936C19.9525 46.9976 20.0297 46.9628 20.0799 46.9001Z","cx":23.55,"cy":51.65,"h":14.11,"rel":1.0},{"d":"M54.0087 50.0998L52.2321 48.7276C51.7605 48.3633 51.1037 48.8349 51.2982 49.3982L51.9638 51.3262C52.0308 51.5203 51.9939 51.7352 51.8659 51.8959L50.0316 54.1983C49.6401 54.6896 50.1712 55.3759 50.7451 55.1202L52.7917 54.2082C53.0057 54.1128 53.2557 54.1507 53.4318 54.3053L55.8428 56.4216C56.2626 56.7901 56.9139 56.4354 56.8322 55.8828L56.3918 52.9064C56.3695 52.7561 56.4052 52.6028 56.4916 52.4777L57.7014 50.7255C58.0016 50.2908 57.634 49.7083 57.1123 49.7923L54.4708 50.2173C54.3071 50.2437 54.1399 50.2011 54.0087 50.0998Z","cx":53.82,"cy":52.58,"h":4.21,"rel":0.546},{"d":"M60.9987 51.1475L62.1782 50.7312C62.469 50.6286 62.7616 50.8797 62.7044 51.1827L62.5379 52.0642C62.5141 52.1901 62.5521 52.3199 62.6401 52.4131L63.8628 53.7077C64.1038 53.9628 63.9229 54.3824 63.572 54.3824H62.0868C61.932 54.3824 61.7912 54.4716 61.7251 54.6116L61.2978 55.5164C61.1389 55.8529 60.6469 55.8091 60.5499 55.4498L60.2072 54.1795C60.1811 54.083 60.1199 53.9997 60.0355 53.9461L59.081 53.3397C58.8219 53.1751 58.8371 52.7921 59.1083 52.6485L59.5727 52.4027C59.7277 52.3206 59.8111 52.1472 59.7786 51.9749L59.6542 51.3166C59.592 50.9872 59.9382 50.732 60.2344 50.8888L60.6784 51.1238C60.7771 51.1761 60.8933 51.1847 60.9987 51.1475Z","cx":61.46,"cy":53.24,"h":2.64,"rel":0.433},{"d":"M53.8214 58.5716L53.5396 60.2624C53.5152 60.4086 53.4121 60.5293 53.2715 60.5762L51.4161 61.1946C51.0781 61.3073 51.045 61.7725 51.3637 61.9319L53.4419 62.971C53.4804 62.9902 53.5155 63.0155 53.5459 63.0459L54.8172 64.3172C55.0691 64.5691 55.5 64.3907 55.5 64.0343V62.7C55.5 62.5741 55.5593 62.4555 55.66 62.38L56.9822 61.3883C57.2201 61.2099 57.1871 60.8435 56.9211 60.7106L55.6042 60.0521C55.5361 60.0181 55.4792 59.9654 55.4401 59.9001L54.559 58.4316C54.3676 58.1126 53.8825 58.2047 53.8214 58.5716Z","cx":54.13,"cy":61.34,"h":3.23,"rel":0.478}];
  const FIONA_STAR_PATHS = [];
  const pickStarShape = () => S.starShapes === "fiona" ? 100 + ((Math.random() * FIONA_STARS.length) | 0) : (Math.random() * DRAWN_VARIANTS) | 0;
  const starRel = v => v >= 100 ? FIONA_STARS[v - 100].rel : 1;
  function drawnSprite(v, hex, flat) {
    const own = v >= 100;
    const key = (own ? "F" : "") + v + hex + (flat ? "f" : "") + S.starGrain;
    if (DRAWN[key]) return DRAWN[key];
    const c = document.createElement("canvas"); c.width = c.height = DS; const x = c.getContext("2d"), rnd = mulberry(700 + v * 13);
    if (own) {
      const st = FIONA_STARS[v - 100];
      const path = FIONA_STAR_PATHS[v] || (FIONA_STAR_PATHS[v] = new Path2D(st.d));
      x.save(); x.translate(DS / 2, DS / 2); x.scale(DR / st.h, DR / st.h); x.translate(-st.cx, -st.cy);
      x.fillStyle = hex; x.fill(path); x.restore();
    }
    if (!own) {
    const n = v % 3 === 0 ? 5 : 4, inner = n === 5 ? 0.5 : 0.42, pts = [];
    for (let i = 0; i < 2 * n; i++) {
      const a = -Math.PI / 2 + i * Math.PI / n + (rnd() - 0.5) * 0.16;
      const rr = (i % 2 ? DR * inner * (0.9 + 0.2 * rnd()) : DR * (0.9 + 0.12 * rnd()));
      pts.push([DS / 2 + Math.cos(a) * rr, DS / 2 + Math.sin(a) * rr]);
    }
    const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    x.beginPath();
    for (let i = 0; i < pts.length; i++) {          // every corner rounded: tips softly, valleys more
      const P0 = pts[(i + pts.length - 1) % pts.length], P1 = pts[i], P2 = pts[(i + 1) % pts.length], k = i % 2 ? 0.3 : 0.2;
      const A = lerp(P1, P0, k), B = lerp(P1, P2, k);
      i ? x.lineTo(A[0], A[1]) : x.moveTo(A[0], A[1]); x.quadraticCurveTo(P1[0], P1[1], B[0], B[1]);
    }
    x.closePath(); x.fillStyle = hex; x.fill();
    }
    if (!flat) {                                     // pencil grain: a little uneven, with the odd fleck of paper
      const img = x.getImageData(0, 0, DS, DS), g = mulberry(900 + v);
      // grain amount (100% = the original light pencil grain); more = a deeper speckle and more paper flecks,
      // with the average strength kept the same so only the texture changes
      const A = S.starGrain, ga = Math.min(0.85, 0.2 * A), fl = 0.04 * A, keep = Math.min(1.6, 0.9 / (1 - ga / 2));
      const lum = 0.09 * A;                          // light and dark specks within the colour, like coloured pencil on paper
      for (let i = 3; i < img.data.length; i += 4) {
        const q = g(); img.data[i] = Math.min(255, img.data[i] * keep * (q < fl ? 0.3 : 1 - ga + ga * g()));
        const j = (g() - 0.5) * 2 * lum, t = j < 0 ? 1 + j * 1.6 : 1;    // darker specks deepen the colour, lighter ones lift towards white
        for (let c = 0; c < 3; c++) { const v = img.data[i - 3 + c]; img.data[i - 3 + c] = j < 0 ? v * t : v + (255 - v) * j; }
      }
      x.putImageData(img, 0, 0);
    }
    return (DRAWN[key] = c);
  }
  const lighten = (hex, t) => "#" + hexRgb(hex).map(v => Math.round(v + (255 - v) * t).toString(16).padStart(2, "0")).join("");
  function blitDrawn(c, x, y, r, rot, v, hex, s, flat) {
    const d = 2 * r * s * DS / (2 * DR);
    c.save(); c.translate(x, y); c.rotate(rot); c.drawImage(drawnSprite(v, hex, flat), -d / 2, -d / 2, d, d); c.restore();
  }
  // r = core radius; the glow reaches r / STAR_CORE
  function blitStar(c, x, y, r, col, s) {
    starCore(c, x, y, r * s, col);       // no glow: on paper it read as stains (Fiona, 9 Oct)
  }
  function drawStar(c, p) {
    const k = p.age / p.life;
    if (p.stay) {
      blitDrawn(c, p.x, p.y, p.r, p.rot, p.v, p.col, easeOutBack(Math.min(1, k))); return;
    }
    const s = k < 0.12 ? easeOutBack(k / 0.12) : 1 - 0.6 * ((k - 0.12) / 0.88);
    let a = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
    a *= 0.8 + 0.2 * Math.sin(p.age * 7 + p.seed * 3);             // a gentle twinkle as it falls
    c.save(); c.globalAlpha = a; blitDrawn(c, p.x, p.y, p.r, p.rot, p.v, p.col, s); c.restore();
  }
  // twinkles on stars resting on the paper: most dim and shrink a little (like the header), the odd one swells into a glow
  function drawStarTwinkle(c, p) {
    const m = 0.5 - 0.5 * Math.cos(2 * Math.PI * p.age / p.life);
    c.save();
    if (p.glow) {
      // a glint, like sunlight on water: a quick flash to almost white (fast in, slower out), the odd double flash,
      // a hair bigger at the peak; no turning
      // gentler (Fiona: "sparkly rather than flashing"): a soft rise and fall, to a paler tint rather than near white
      const u = p.age / p.life, f = Math.pow(Math.sin(Math.PI * u), 1.5);
      // on pale paper a star lifted towards white seems to vanish, so it only lifts a little (a third of the way) and
      // swells slightly: it catches the light without disappearing
      const v = S.starTwStr, sc = 1 + 0.08 * f * v;
      blitDrawn(c, p.x, p.y, p.r, p.rot, p.v, p.col, sc);
      c.globalAlpha = Math.min(0.8, 0.65 * f * v); blitDrawn(c, p.x, p.y, p.r, p.rot, p.v, lighten(p.col, 0.35), sc);
    } else {                     // dims back: a veil of paper in its own shape
      c.globalAlpha = Math.min(0.35, 0.25 * m * S.starTwStr); blitDrawn(c, p.x, p.y, p.r, p.rot, p.v, "#FAF8F4", 1.04, true);   // only a gentle fade, never gone
    }
    c.restore();
  }
  // ---- bubbles, after Fiona's bubble.svg: clear centre, soft pastel towards the rim, a faint second tint, no outline ----
  // ---- bubbles, after Fiona's bubble.svg (clear centre, colour towards the rim, faint second tint, no outline),
  //      with a pearly spectrum round each rim: mostly blues, lilacs, pinks and aquas, small touches of peach and yellow ----
  const PEARL = { blue: "#A9CBF5", peri: "#B3BDF5", lilac: "#CDB8F2", pink: "#F4B8D8", aqua: "#A8EDE6", mint: "#BDEFD0", peach: "#F7D2B8", yellow: "#F4EBAA",
                  apricot: "#F9C7A6", coral: "#F6B0BC", orchid: "#E2B2E8" };   // warm pearls, echoing Sunset
  // Fiona's palette (9 Nov) in the pearl bubbles: the same roles as the pearls, filled from her pink, blue, green and gold
  // (and the colours between them), as pastel tints a little stronger than the pearls
  let CANDY_PEARL_C = null;
  const candyPearl = () => CANDY_PEARL_C || (CANDY_PEARL_C = (() => {
    const mixHex = (a, b, t) => "#" + hexRgb(a).map((v, i) => Math.round(v + (hexRgb(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");
    const tintHex = (h, t) => mixHex(h, "#FFFFFF", t);
    const pk = "#FF83FE", bl = "#5B8BEF", gr = "#78AD96", gd = "#FFC800", T = 0.3;
    return {
      blue: tintHex(bl, T), peri: tintHex(mixHex(bl, pk, 0.25), T), lilac: tintHex(mixHex(bl, pk, 0.55), T), pink: tintHex(pk, T),
      aqua: tintHex(mixHex(gr, bl, 0.4), T), mint: tintHex(gr, T), peach: tintHex(mixHex(pk, gd, 0.55), T), yellow: tintHex(gd, T),
      apricot: tintHex(mixHex(gd, pk, 0.3), T), coral: tintHex(mixHex(pk, gd, 0.35), T), orchid: tintHex(mixHex(pk, bl, 0.25), T),
    };
  })());
  const PEARL_ORDER = ["blue", "lilac", "pink", "peach", "aqua", "mint", "yellow", "peri"];
  const PEARL_WEIGHT = { blue: 1.3, peri: 1, lilac: 1.1, pink: 1.2, aqua: 1.1, mint: 0.9, peach: 0.35, yellow: 0.3 };   // warm colours only as slivers
  const BUBBLE_VARIANTS = 8;
  const BUBBLE_SET = { length: BUBBLE_VARIANTS };
  const BS = 128, BRAD = 60;                 // sprite size and bubble radius inside it
  let BUBBLE_SPRITES = null, BUBBLE_SHINE = null, BUBBLE_SHINE_T = null, BUBBLE_SHADE = null;
  function makeBubbleSprites() {
    const mk = draw => { const c = document.createElement("canvas"); c.width = c.height = BS; const x = c.getContext("2d"); x.translate(BS / 2, BS / 2); draw(x); return c; };
    const circle = x => { x.beginPath(); x.arc(0, 0, BRAD, 0, Math.PI * 2); };
    const rnd = mulberry(2024);
    BUBBLE_SPRITES = Array.from({ length: BUBBLE_VARIANTS }, (_, v) => {
      // soft overlapping washes of colour round the film (no wedges): mostly cool pearls, the odd small warm touch
      // Warmth: more rose, coral, orchid and apricot in the film, fewer aquas and mints (0 = the original cool pearls)
      const W = S.bubWarm || 0, PAL = S.bubPal === "candy" ? candyPearl() : PEARL, touch = S.bubPal === "candy" ? 0.3 : 0.18;
      const cool = ["blue", "lilac", "pink", "aqua", "mint", "peri"], warmBig = ["coral", "orchid", "pink", "apricot", "lilac", "peri"];
      const washes = [];
      for (let i = 0; i < 8; i++) {
        const warm = rnd() < touch * (1 - W);
        const pickWarm = rnd() < W * 0.75;
        const CL = ["blue", "pink", "mint", "yellow", "lilac", "aqua", "coral", "pink", "blue", "mint"];   // your colours: all four inks in equal turn
        const n = S.bubPal === "candy" ? CL[(v * 3 + i * 3 + (rnd() * 3 | 0)) % CL.length]
          : warm ? (rnd() < 0.5 ? "peach" : "yellow")
          : pickWarm ? warmBig[(v + i * 2 + (rnd() * 2 | 0)) % warmBig.length]
          : cool[(v + i * 2 + (rnd() * 2 | 0)) % cool.length];
        const ang = rnd() * 6.283, dist = BRAD * (0.45 + 0.4 * rnd());
        const small = warm && S.bubPal !== "candy";
        washes.push({ n, x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, r: BRAD * (small ? 0.28 + 0.12 * rnd() : 0.5 + 0.35 * rnd()), a: small ? 0.75 : 0.9 });
      }
      const film = mk(x => {
        circle(x); x.fillStyle = PAL[(W > 0.5 && v % 2 === 0 ? warmBig : cool)[v % cool.length]]; x.globalAlpha = 0.55; x.fill(); x.globalAlpha = 1;
        x.save(); circle(x); x.clip();
        for (const w of washes) {
          const [r, g, b] = hexRgb(PAL[w.n]);
          const gr = x.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
          gr.addColorStop(0, `rgba(${r},${g},${b},${w.a})`); gr.addColorStop(0.55, `rgba(${r},${g},${b},${w.a * 0.5})`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
          x.fillStyle = gr; x.fillRect(-BRAD, -BRAD, BRAD * 2, BRAD * 2);
        }
        x.restore();
      });
      const masked = (profile) => mk(x => {
        x.drawImage(film, -BS / 2, -BS / 2);
        x.globalCompositeOperation = "destination-in";
        circle(x); x.fillStyle = profile(x); x.fill();
      });
      // her profile: clear at the centre (3% of a radius 2.53× the bubble) rising to full colour at 44%
      const body = masked(x => { const gr = x.createRadialGradient(0, 0, 0, 0, 0, BRAD * 2.526); gr.addColorStop(0.0337, "rgba(0,0,0,0)"); gr.addColorStop(0.4426, "rgba(0,0,0,1)"); return gr; });
      // the edge, where the film is seen side-on: a soft coloured band just inside the rim (no outline)
      const rim = masked(x => { const gr = x.createRadialGradient(0, 0, 0, 0, 0, BRAD); gr.addColorStop(0.72, "rgba(0,0,0,0)"); gr.addColorStop(0.93, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,.55)"); return gr; });
      const tint = mk(x => {                 // her second layer, pearl version: white → pale aqua over 0.69 of the radius, at 20%
        const gr = x.createRadialGradient(0, 0, 0, 0, 0, BRAD * 0.688);
        const tr = Math.round(184 + 66 * W), tg = Math.round(240 - 22 * W), tb = Math.round(236 - 10 * W);   // pale aqua → blush
        gr.addColorStop(0, "rgba(255,255,255,.2)"); gr.addColorStop(1, `rgba(${tr},${tg},${tb},.2)`);
        circle(x); x.fillStyle = gr; x.fill();
      });
      const dots = washes.filter(w => S.bubPal === "candy" || !["peach", "yellow", "apricot"].includes(w.n)).map(w => hexRgb(PAL[w.n]));
      if (!dots.length) dots.push(hexRgb(PAL.pink));
      const grained = src => {               // a whisper of grain in the colour only (alpha × 0.7–1, seeded)
        const c = document.createElement("canvas"); c.width = c.height = BS; const x = c.getContext("2d");
        x.drawImage(src, 0, 0); const img = x.getImageData(0, 0, BS, BS), gr = mulberry(500 + v);
        // grain amount: 100% = the original whisper (alpha × 0.62–1); more = deeper speckle, with the odd clear fleck
        const ga = Math.min(0.9, 0.38 * (S.bubGrainAmt || 1));
        const keep = Math.min(1.5, 0.81 / (1 - ga / 2));      // same average strength at any grain amount: only the texture changes
        // above 250%: light and dark specks in the colour too (as on the stars), so the grain keeps getting stronger
        const lum = 0.07 * Math.max(0, (S.bubGrainAmt || 1) - 2.5);
        for (let i = 3; i < img.data.length; i += 4) {
          const q = gr(); img.data[i] *= keep * (q < 0.03 * Math.max(0, (S.bubGrainAmt || 1) - 1) ? 0.25 : 1 - ga + ga * gr());
          if (lum) { const j = (gr() - 0.5) * 2 * lum; for (let c = 1; c <= 3; c++) { const v = img.data[i - c]; img.data[i - c] = j < 0 ? v * (1 + j * 1.6) : v + (255 - v) * j; } }
        }
        x.putImageData(img, 0, 0); return c;
      };
      const richer = src => {                // more saturated, not darker: push each colour away from its own grey
        const c = document.createElement("canvas"); c.width = c.height = BS; const x = c.getContext("2d");
        x.drawImage(src, 0, 0); const img = x.getImageData(0, 0, BS, BS), d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const m = (d[i] + d[i + 1] + d[i + 2]) / 3;
          for (let j = 0; j < 3; j++) d[i + j] = Math.max(0, Math.min(255, m + (d[i + j] - m) * 2.3));
          d[i + 3] = Math.min(255, d[i + 3] * 1.15);
        }
        x.putImageData(img, 0, 0); return c;
      };
      const rimR = richer(rim);
      return { body, rim, rimR, bodyG: grained(body), rimG: grained(rim), rimRG: grained(rimR), tint, rgb: dots[0], dots };
    });
    // the side away from the light: a thin crescent of deeper pearl inside the lower-right rim (stays put, like the highlight)
    BUBBLE_SHADE = mk(x => {
      x.save(); circle(x); x.clip();
      const gr = x.createRadialGradient(0, 0, 0, 0, 0, BRAD);
      gr.addColorStop(0.78, "rgba(118,128,196,0)"); gr.addColorStop(0.95, "rgba(118,128,196,.55)"); gr.addColorStop(1, "rgba(140,128,200,.35)");
      x.fillStyle = gr; x.fillRect(-BRAD, -BRAD, BRAD * 2, BRAD * 2);
      // soften it away towards the lit side
      x.globalCompositeOperation = "destination-out";
      const cut = x.createRadialGradient(-BRAD * 0.3, -BRAD * 0.34, BRAD * 0.5, -BRAD * 0.3, -BRAD * 0.34, BRAD * 1.15);
      cut.addColorStop(0, "rgba(0,0,0,1)"); cut.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = cut; x.fillRect(-BRAD, -BRAD, BRAD * 2, BRAD * 2);
      x.restore();
    });
    // highlights that show on white paper: a white heart with a pale aqua / pink halo
    BUBBLE_SHINE_T = mk(x => {
      let gr = x.createRadialGradient(-BRAD * 0.36, -BRAD * 0.4, 0, -BRAD * 0.36, -BRAD * 0.4, BRAD * 0.28);
      gr.addColorStop(0, "rgba(255,255,255,.8)"); gr.addColorStop(0.3, "rgba(225,250,247,.55)"); gr.addColorStop(0.65, "rgba(150,226,222,.32)"); gr.addColorStop(1, "rgba(150,226,222,0)");
      x.fillStyle = gr; x.fillRect(-BRAD, -BRAD, BRAD * 2, BRAD * 2);
      gr = x.createRadialGradient(BRAD * 0.4, BRAD * 0.36, 0, BRAD * 0.4, BRAD * 0.36, BRAD * 0.17);
      gr.addColorStop(0, "rgba(255,240,248,.35)"); gr.addColorStop(0.5, "rgba(240,180,214,.22)"); gr.addColorStop(1, "rgba(240,180,214,0)");
      x.fillStyle = gr; x.fillRect(-BRAD, -BRAD, BRAD * 2, BRAD * 2);
    });
    BUBBLE_SHINE = mk(x => {                 // where it catches the light: soft highlight top-left, fainter one opposite
      let gr = x.createRadialGradient(-BRAD * 0.36, -BRAD * 0.4, 0, -BRAD * 0.36, -BRAD * 0.4, BRAD * 0.26);
      gr.addColorStop(0, "rgba(255,255,255,.75)"); gr.addColorStop(0.35, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = gr; x.fillRect(-BRAD, -BRAD, BRAD * 2, BRAD * 2);
      gr = x.createRadialGradient(BRAD * 0.4, BRAD * 0.36, 0, BRAD * 0.4, BRAD * 0.36, BRAD * 0.16);
      gr.addColorStop(0, "rgba(255,255,255,.25)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = gr; x.fillRect(-BRAD, -BRAD, BRAD * 2, BRAD * 2);
    });
  }
  let BUBBLE_WINDOW = null;
  function makeBubbleWindow() {               // a soft, curved window reflection top-left, plus a small one opposite
    const c = document.createElement("canvas"); c.width = c.height = BS; const x = c.getContext("2d");
    x.translate(BS / 2, BS / 2);
    if ("filter" in x) x.filter = "blur(2.2px)";
    const pane = (a0, a1, r0, r1, alpha) => {
      x.beginPath(); x.arc(0, 0, BRAD * r1, a0, a1); x.arc(0, 0, BRAD * r0, a1, a0, true); x.closePath();
      x.fillStyle = `rgba(255,255,255,${alpha})`; x.fill();
    };
    pane(-2.55, -2.05, 0.58, 0.8, 0.7);        // the window: two panes with a thin gap, following the curve
    pane(-2.0, -1.62, 0.58, 0.8, 0.55);
    pane(0.55, 0.85, 0.66, 0.8, 0.22);         // faint reflection on the far side
    x.filter = "none";
    BUBBLE_WINDOW = c;
  }
  /* ---- Riso bubbles (Fiona, 9 Nov): flat, pale discs printed in two inks that stipple into each other across the
     bubble, like a riso gradient; overprinted with multiply, so where bubbles overlap the inks mix into new, stronger colours ---- */
  const RISO_INKS = { pink: "#FF83FE", blue: "#5B8BEF", green: "#78AD96", gold: "#FFC800" };
  const RISO_PAIRS = [["pink", "gold"], ["green", "gold"], ["blue", "pink"], ["pink", "gold"], ["green", "blue"], ["blue", "green"], ["pink", "blue"], ["gold", "pink"]];
  let RISO_SPRITES = null;
  function makeRisoSprites() {
    RISO_SPRITES = RISO_PAIRS.map(([a, b], v) => {
      const c = document.createElement("canvas"); c.width = c.height = BS; const x = c.getContext("2d");
      const img = x.createImageData(BS, BS), d = img.data, rnd = mulberry(4100 + v * 31);
      const tint = 0.58;                                         // a pale tint of each ink, as riso prints at 40–50%
      const A = hexRgb(RISO_INKS[a]).map(q => q + (255 - q) * tint), B = hexRgb(RISO_INKS[b]).map(q => q + (255 - q) * tint);
      const ang = rnd() * Math.PI * 2, ux = Math.cos(ang), uy = Math.sin(ang);
      for (let j = 0; j < BS; j++) for (let i = 0; i < BS; i++) {
        const px = i + 0.5 - BS / 2, py = j + 0.5 - BS / 2, rr = Math.hypot(px, py);
        if (rr > BRAD + 1) continue;
        const t = Math.max(0, Math.min(1, ((px * ux + py * uy) / BRAD + 1) / 2));
        const tt = t * t * (3 - 2 * t);
        const ink = rnd() < tt ? B : A;                          // stippled, not blended: each grain is one ink or the other
        const k = (j * BS + i) * 4;
        d[k] = ink[0]; d[k + 1] = ink[1]; d[k + 2] = ink[2];
        const edge = Math.max(0, Math.min(1, BRAD + 0.5 - rr));  // a crisp-ish printed edge with a little tooth
        d[k + 3] = 255 * edge * (rnd() < 0.06 ? 0.55 : 0.9 + 0.1 * rnd());
      }
      x.putImageData(img, 0, 0);
      return { img: c, dots: [hexRgb(RISO_INKS[a]), hexRgb(RISO_INKS[b])] };
    });
  }
  function drawRisoBubble(c, p) {
    if (!RISO_SPRITES) makeRisoSprites();
    const sp = RISO_SPRITES[p.set % RISO_SPRITES.length];
    const grow = Math.min(1, p.age / 0.35), eo = 1 - Math.pow(1 - grow, 3);
    const k = p.life === Infinity ? 0 : p.age / p.life;
    const r = p.r * (0.3 + 0.7 * eo) * (1 + 0.06 * Math.sin(grow * Math.PI)) * (1 + 0.15 * k);
    const fade = (p.life === Infinity ? 1 : Math.min(1, (1 - k) * 4)) * (p.drift ? Math.max(0, Math.min(1, (p.y + p.r) / 90)) : 1);
    const d = r * BS / BRAD, t = reduced ? 0 : p.age;
    c.save(); c.translate(p.x, p.y);
    if (S.bubWobble && !reduced) { const w = 0.035 * Math.sin(t * (1.1 + (p.seed % 1) * 0.8) + p.seed * 5); c.scale(1 + w, 1 - w); }
    c.rotate(p.seed + t * 0.12 * S.bubShift);                    // the gradient turns slowly
    c.globalCompositeOperation = "multiply";                      // overprint: overlaps make new colours
    let a = 0.95 * S.bubColour;
    while (a > 0.01) { c.globalAlpha = Math.min(1, a) * fade * eo; c.drawImage(sp.img, -d / 2, -d / 2, d, d); a -= 1; }
    c.restore();
  }
  function drawBubble(c, p) {
    if (S.bubStyle === "riso") return drawRisoBubble(c, p);
    if (!BUBBLE_SPRITES) makeBubbleSprites();
    if (S.bubWindow && !BUBBLE_WINDOW) makeBubbleWindow();
    const sp = BUBBLE_SPRITES[p.set];
    const grow = Math.min(1, p.age / 0.35), eo = 1 - Math.pow(1 - grow, 3);
    const k = p.life === Infinity ? 0 : p.age / p.life;
    // drifting towards you: grows (as if coming closer), eases out from the centre of the paper, then pops
    let ap = 0;
    if (p.approach) { const u = Math.min(1, (clock - p.approach.start) / p.approach.dur); ap = u * u * (3 - 2 * u); }
    const r = p.r * (0.3 + 0.7 * eo) * (1 + 0.06 * Math.sin(grow * Math.PI)) * (1 + 0.15 * k) * (1 + 1.5 * ap);
    const fade = (p.life === Infinity ? 1 : Math.min(1, (1 - k) * 4)) * (p.drift ? Math.max(0, Math.min(1, (p.y + p.r) / 90)) : 1);
    const d = r * BS / BRAD, x0 = -d / 2, y0 = -d / 2;
    const t = reduced ? 0 : p.age;
    c.save();
    c.translate(p.x + (p.x - BW / 2) * 0.22 * ap, p.y + (p.y - BH / 2) * 0.22 * ap - 20 * ap);
    if (S.bubWobble && !reduced) {             // never quite a perfect circle: a slow, slight stretch and squash
      const w = 0.035 * Math.sin(t * (1.1 + (p.seed % 1) * 0.8) + p.seed * 5);
      c.scale(1 + w, 1 - w);
    }
    // colour strength: above 100% the rim is laid down again, so it deepens while the centre stays clear
    // colour shift: the spectrum swirls slowly round the bubble, like a soap film; the highlight stays put
    const rot = p.seed + t * 0.18 * S.bubShift;
    c.save(); c.rotate(rot);
    const bodyImg = S.bubGrain ? sp.bodyG : sp.body;
    const rimImg = S.bubRich ? (S.bubGrain ? sp.rimRG : sp.rimR) : (S.bubGrain ? sp.rimG : sp.rim);
    if (S.bubOverlap) c.globalCompositeOperation = "multiply";   // where two bubbles cross, the colour deepens a touch
    let a = 0.9 * S.bubColour;
    while (a > 0.01) { c.globalAlpha = Math.min(1, a) * fade * eo; c.drawImage(bodyImg, -d / 2, -d / 2, d, d); a -= 1; }
    a = 0.6 * S.bubEdge;
    while (a > 0.01) { c.globalAlpha = Math.min(1, a) * fade * eo; c.drawImage(rimImg, -d / 2, -d / 2, d, d); a -= 1; }
    c.restore();
    if (S.bubShade) { c.globalAlpha = Math.min(1, 0.85 * Math.max(0.6, S.bubEdge)) * fade * eo; c.drawImage(BUBBLE_SHADE, x0, y0, d, d); }
    c.globalCompositeOperation = "source-over";
    const sh = S.bubShift, tw = 0.55 + 0.45 * Math.sin(t * 0.7 + p.seed);                  // the tint drifts slowly, like a soap film
    a = (1 - Math.min(1, sh) * 0.45 + Math.min(1, sh) * 0.45 * Math.sin(t * 0.7 + p.seed)) * Math.max(1, sh);
    while (a > 0.01) { c.globalAlpha = Math.min(1, a) * fade * eo; c.drawImage(sp.tint, x0, y0, d, d); a -= 1; }
    const glint = S.bubGlint > 0 ? Math.pow(Math.max(0, Math.sin(t * 0.8 * Math.max(0.3, S.bubGlint) + p.seed * 3)), 14 / Math.max(0.5, S.bubGlint)) : 0;  // now and then it catches the light
    a = (0.7 + 0.3 * glint) * S.bubShine;
    const shine = S.bubWindow ? BUBBLE_WINDOW : S.bubTintHi ? BUBBLE_SHINE_T : BUBBLE_SHINE;
    if (S.bubStarHi) {
      // Fiona's small hand-drawn stars as the highlights (11 Nov idea): a white star where the light catches the film,
      // a smaller one opposite, over a faint trace of the round highlight so it still reads as a bubble
      c.globalAlpha = Math.min(1, 0.3 * S.bubShine) * fade * eo; c.drawImage(shine, x0, y0, d, d);
      const v = 8 + ((p.seed * 7) | 0) % 3, v2 = 8 + ((p.seed * 13 + 1) | 0) % 3;
      const pulse = 1 + 0.3 * glint, al = Math.min(1, 0.5 * S.bubShine * (0.75 + 0.25 * glint)) * fade * eo;
      bubbleStar(c, v, -r * 0.36, -r * 0.4, r * 0.24 * pulse, p.seed * 2, al);
      bubbleStar(c, v2, r * 0.4, r * 0.36, r * 0.12 * pulse, p.seed * 3, al * 0.65);
    } else
    while (a > 0.01) { c.globalAlpha = Math.min(1, a) * fade * eo; c.drawImage(shine, x0, y0, d, d); a -= 1; }
    if (glint > 0.05) {
      if (!ORBS) ORBS = makeOrbs();
      const g = r * 0.7;
      c.globalAlpha = glint * 0.6 * fade; c.drawImage(ORBS[0], -r * 0.4 - g / 2, -r * 0.48 - g / 2, g, g);
    }
    c.restore();
  }
  function bubbleStar(c, v, x, y, rad, rot, alpha) {
    const st = FIONA_STARS[v], path = FIONA_STAR_PATHS[100 + v] || (FIONA_STAR_PATHS[100 + v] = new Path2D(st.d));
    c.save(); c.globalAlpha = alpha; c.translate(x, y); c.rotate(rot); c.scale(rad / st.h, rad / st.h); c.translate(-st.cx, -st.cy);
    c.fillStyle = "#FFFFFF"; c.fill(path); c.restore();
  }
  function drawBubblePop(c, p) {
    if (!BUBBLE_SPRITES) makeBubbleSprites();
    const k = p.age / p.life, r = p.r * (1 + 0.35 * k), d = r * BS / BRAD;
    c.save(); c.globalAlpha = 0.75 * (1 - k) * (1 - k);
    c.drawImage(BUBBLE_SPRITES[p.set].body, p.x - d / 2, p.y - d / 2, d, d);
    c.drawImage(BUBBLE_SHINE, p.x - d / 2, p.y - d / 2, d, d);
    c.restore();
  }
  function drawRing(c, p) {
    const k = p.age / p.life;
    c.save(); c.globalAlpha = 1 - k;
    c.beginPath(); c.arc(p.x, p.y, p.r * (1 + 0.7 * k), 0, Math.PI * 2);
    c.lineWidth = 1.4; c.strokeStyle = p.col; c.setLineDash([3, 5]); c.stroke();
    c.restore();
  }
  function drawDot(c, p) {
    c.save(); c.globalAlpha = 1 - p.age / p.life;
    c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2); c.fillStyle = p.col; c.fill();
    c.restore();
  }
  function drawGlint(c, p) {
    const s = Math.sin(Math.PI * p.age / p.life);
    c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
    c.globalAlpha = 0.35 * s; c.beginPath(); c.arc(0, 0, p.r * 0.7 * s, 0, Math.PI * 2); c.fillStyle = p.col; c.fill();
    c.globalAlpha = s; c.fillStyle = "#fff"; sparkle(c, p.r * s); c.fill();
    c.fillStyle = p.col; c.globalAlpha = s * 0.9; sparkle(c, p.r * s * 0.35); c.fill();
    c.restore();
  }
  function drawFleck(c, p) {
    const k = p.age / p.life;
    c.save(); c.globalAlpha = 1 - k * k; c.translate(p.x, p.y); c.rotate(p.rot);
    c.scale(Math.cos(p.age * 14 + p.seed), 1);
    c.fillStyle = p.col; c.fillRect(-p.r, -p.r * 0.7, p.r * 2, p.r * 1.4);
    c.restore();
  }
  // soft round glints (like the header's stars): bright centre, grainy airbrushed halo, barely-there tints
  const ORB_TINTS = ["#FFFFFF", "#FFF3E0", "#E6F0FF", "#E2FCF3", "#FFE6F0"];
  let ORBS = null;
  const makeOrbs = () => ORB_TINTS.map((hex, n) => {
    const S2 = 64, c = document.createElement("canvas"); c.width = c.height = S2;
    const x = c.getContext("2d"), [r, g, b] = hexRgb(hex), h = S2 / 2;
    const gr = x.createRadialGradient(h, h, 0, h, h, h);
    gr.addColorStop(0, `rgba(${r},${g},${b},.95)`); gr.addColorStop(0.18, `rgba(${r},${g},${b},.6)`);
    gr.addColorStop(0.42, `rgba(${r},${g},${b},.22)`); gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, S2, S2);
    const img = x.getImageData(0, 0, S2, S2), rnd = mulberry(77 + n);
    for (let i = 0; i < S2 * S2; i++) {
      const px = i % S2 - h + 0.5, py = (i / S2 | 0) - h + 0.5, d = Math.hypot(px, py) / h;
      if (d > 0.16) img.data[i * 4 + 3] *= 0.35 + 0.65 * rnd();       // grain only in the halo
    }
    x.putImageData(img, 0, 0);
    x.beginPath(); x.arc(h, h, S2 * 0.06, 0, Math.PI * 2); x.fillStyle = `rgba(${r},${g},${b},1)`; x.fill();
    return c;
  });
  function drawOrb(c, p) {
    if (p.age < 0) return;
    const s = Math.sin(Math.PI * p.age / p.life), d = p.r * 2 * (0.55 + 0.45 * s);
    c.save(); c.globalAlpha = Math.min(1, s * (0.95 + 0.4 * (p.boost || 0)));
    if (!ORBS) ORBS = makeOrbs();
    c.drawImage(ORBS[p.tint], p.x - d / 2, p.y - d / 2, d, d);
    if (p.boost) {                 // a brighter centre so it reads on pale paint
      c.globalAlpha = s * p.boost; c.fillStyle = "#fff";
      c.beginPath(); c.arc(p.x, p.y, d * 0.075, 0, Math.PI * 2); c.fill();
    }
    c.restore();
  }
  /* ---- birds: distant silhouettes, flapping as they go; further birds are smaller, slower and paler (as if in haze) ---- */
  const BIRD_COLS = { dove: ["#6E7686", "#7A8292", "#868B9C"], dusk: ["#2F3846", "#3A4352", "#4A5262"], navy: ["#0E2A48", "#123A5E", "#1F4766"], warm: ["#3E3236", "#4B3E42", "#5C4A4E"] };
  const PAPER_RGB = [250, 248, 244];
  function birdColour(hex, haze) { const c = hexRgb(hex); return `rgb(${c.map((v, i) => Math.round(v + (PAPER_RGB[i] - v) * haze)).join(",")})`; }
  /* ---- Swallows (Fiona's swallow-1.svg, 84 × 36, flying right; glide pose). Parts: 0 forked tail, 1 far wing,
     2 near wing, 3 body, 4 head, 5 eye, 6 beak. Until her other poses arrive, a wingbeat is faked by swinging
     the two wings about their shoulders. ---- */
  // Fiona's five poses (swallows-2.svg, 10 Nov), in her order: 0 level, 1 wings down, 2 wings up, 3 level nose-up,
  // 4 wings down nose-up. Each aligned on the body; all seven shapes (wings, tail, body, head, eye, beak) share
  // structures, so the whole bird morphs. One cycle, as Fiona drew it: 0 → 1 → 2 → 3 → 4 → back to 0 (the body
  // pitches up and settles within the cycle). A glide holds pose 0.
  const SW = {"cmds":["MCCCCCZ","MCLCCCZ","MCCLCCCCCZ","MCCCCCCZ","MCCCCZ","MLCCLCCZ","MLCLCLCZ"],"fills":["#004B91","#004B91","#004B91","#336FED","#004B91","#336FED","#FF83FE"],"P":[[[-20.68,7.64,-18.18,7.14,-0.18,0.64,-0.18,0.64,-0.18,0.64,-2.68,-2.86,-18.18,-1.86,-33.68,-0.86,-62.18,4.14,-55.68,5.64,-49.18,7.14,-36.68,7.64,-36.68,7.64,-36.68,7.64,-23.18,8.14,-20.68,7.64],[-23.68,26.14,-20.34,23.14,-17.01,20.14,-13.68,17.14,10.82,12.14,10.82,12.14,9.07,19.64,-0.18,24.64,-9.18,29.51,-32.18,37.64,-32.68,36.14,-33.18,34.64,-23.68,26.14,-23.68,26.14],[-59.53,20.64,-61.9,20.17,-34.73,13.43,-31.79,12.7,-31.63,12.66,-31.47,12.73,-31.38,12.87,-28.83,16.7,-28.68,16.92,-28.77,17.22,-29.02,17.3,-33.02,18.6,-60.46,27.5,-57.68,25.64,-55.68,24.31,-46.34,20.3,-40.34,17.79,-39.88,17.59,-40.12,16.85,-40.61,16.97,-47.25,18.56,-57.84,20.98,-59.53,20.64],[0.0,0.0,-14.51,1.76,-33.67,13.19,-38.07,15.92,-38.39,16.11,-38.29,16.58,-37.92,16.63,-32.21,17.27,-5.36,20.07,4.0,16.5,14.02,12.68,16.3,5.67,16.49,5.05,16.5,5.01,16.5,4.99,16.5,4.95,16.46,4.34,15.7,-1.9,0.0,0.0],[16.5,4.95,16.46,4.34,15.7,-1.9,0.0,0.0,-11.57,1.4,2.65,17.02,4.0,16.5,14.02,12.68,16.3,5.67,16.49,5.05,16.5,5.01,16.5,4.99,16.5,4.95],[10.79,3.91,10.75,3.84,10.55,3.43,9.99,3.34,9.67,3.67,9.34,4.0,9.43,4.55,9.84,4.76,9.91,4.79,10.16,4.92,10.47,4.87,10.67,4.67,10.87,4.47,10.92,4.16,10.79,3.91],[19.08,3.8,14.01,3.57,13.6,3.55,13.43,4.09,13.77,4.31,14.97,5.06,15.05,5.11,15.14,5.13,15.24,5.12,19.11,4.6,19.59,4.53,19.56,3.82,19.08,3.8]],[[-24.17,9.46,-21.67,8.99,-0.16,0.91,-0.16,0.91,-0.16,0.91,-2.62,-2.61,-18.13,-1.76,-33.64,-0.91,-48.17,-10.03,-48.67,-7.04,-49.17,-4.04,-44.18,3.46,-33.68,4.96,-23.18,6.46,-26.68,9.94,-24.17,9.46],[-13.18,42.96,-12.18,32.46,-17.68,17.96,-17.68,17.96,4.82,9.46,4.82,9.46,9.06,24.19,6.82,34.46,3.89,47.96,8.82,72.96,4.82,74.46,0.83,75.96,-14.17,53.46,-13.18,42.96],[-59.53,20.64,-61.9,20.17,-34.73,13.43,-31.79,12.7,-31.63,12.66,-31.47,12.73,-31.38,12.87,-28.83,16.7,-28.68,16.92,-28.77,17.22,-29.02,17.3,-33.02,18.6,-60.46,27.49,-57.68,25.64,-55.68,24.31,-46.34,20.3,-40.34,17.79,-39.88,17.59,-40.12,16.85,-40.6,16.97,-47.25,18.56,-57.84,20.98,-59.53,20.64],[0.0,0.0,-14.51,1.76,-33.67,13.19,-38.07,15.92,-38.39,16.11,-38.29,16.58,-37.92,16.63,-32.21,17.27,-5.36,20.07,4.0,16.5,14.02,12.68,16.3,5.67,16.49,5.05,16.5,5.01,16.5,4.99,16.5,4.95,16.46,4.34,15.7,-1.9,0.0,0.0],[16.5,4.95,16.46,4.34,15.7,-1.9,0.0,0.0,-11.57,1.4,2.65,17.02,4.0,16.5,14.03,12.68,16.3,5.67,16.49,5.05,16.5,5.01,16.5,4.99,16.5,4.95],[10.79,3.91,10.75,3.84,10.55,3.43,9.99,3.34,9.67,3.67,9.34,4.0,9.43,4.55,9.84,4.76,9.91,4.79,10.16,4.92,10.47,4.87,10.67,4.67,10.87,4.47,10.92,4.16,10.79,3.91],[19.08,3.8,14.01,3.57,13.6,3.55,13.43,4.09,13.77,4.31,14.97,5.06,15.05,5.11,15.14,5.13,15.24,5.12,19.11,4.6,19.59,4.53,19.56,3.82,19.08,3.8]],[[-22.18,7.96,-19.68,5.96,-0.68,2.96,-0.68,2.96,-0.68,2.96,-1.41,-12.42,-10.34,-25.13,-19.27,-37.84,-33.18,-56.54,-36.29,-53.23,-39.4,-49.92,-32.68,-26.54,-27.18,-14.54,-21.68,-2.54,-24.68,9.96,-22.18,7.96],[7.32,23.61,3.82,23.26,-7.18,17.46,-7.18,17.46,-15.18,7.46,-15.18,7.46,-18.18,7.8,-4.68,5.88,8.82,3.96,26.46,21.62,24.89,23.61,23.32,25.6,10.82,23.96,7.32,23.61],[-59.53,20.64,-61.9,20.17,-34.73,13.43,-31.79,12.7,-31.63,12.66,-31.47,12.73,-31.38,12.87,-28.83,16.7,-28.68,16.92,-28.77,17.22,-29.02,17.3,-33.02,18.6,-60.46,27.5,-57.68,25.64,-55.68,24.31,-46.34,20.3,-40.34,17.79,-39.88,17.59,-40.12,16.85,-40.61,16.97,-47.25,18.56,-57.84,20.98,-59.53,20.64],[0.0,0.0,-14.51,1.76,-33.67,13.19,-38.07,15.92,-38.39,16.11,-38.29,16.58,-37.92,16.63,-32.21,17.27,-5.36,20.07,4.0,16.5,14.02,12.68,16.3,5.67,16.49,5.05,16.5,5.01,16.5,4.99,16.5,4.95,16.46,4.34,15.7,-1.9,0.0,0.0],[16.5,4.95,16.46,4.34,15.7,-1.9,0.0,0.0,-11.57,1.4,2.65,17.02,4.0,16.5,14.02,12.68,16.3,5.67,16.49,5.05,16.5,5.01,16.5,4.99,16.5,4.95],[10.79,3.91,10.75,3.84,10.55,3.43,9.99,3.34,9.67,3.67,9.34,4.0,9.43,4.55,9.84,4.76,9.91,4.79,10.16,4.92,10.47,4.87,10.67,4.67,10.86,4.47,10.91,4.16,10.79,3.91],[19.07,3.8,14.01,3.57,13.6,3.55,13.43,4.09,13.77,4.31,14.97,5.06,15.05,5.11,15.14,5.13,15.24,5.12,19.11,4.6,19.59,4.53,19.56,3.82,19.07,3.8]],[[-21.16,9.32,-18.61,9.4,-6.82,1.32,-1.81,1.32,3.19,1.33,2.2,-2.18,-12.31,-4.68,-26.82,-7.18,-67.8,-6.6,-61.8,-3.67,-55.81,-0.75,-41.82,0.32,-30.81,3.82,-19.81,7.33,-23.71,9.25,-21.16,9.32],[-20.71,32.64,-16.81,25.58,-13.81,17.32,-13.81,17.32,9.46,10.82,9.46,10.82,9.31,16.84,1.75,25.58,-5.81,34.32,-26.23,45.83,-27.07,44.49,-27.91,43.16,-24.62,39.69,-20.71,32.64],[-58.46,23.5,-60.85,23.14,-34.04,15.1,-31.14,14.23,-30.98,14.18,-30.82,14.24,-30.72,14.38,-27.99,18.08,-27.83,18.29,-27.9,18.59,-28.15,18.68,-32.08,20.18,-59.06,30.39,-56.37,28.41,-54.43,26.98,-45.3,22.53,-39.43,19.72,-38.98,19.51,-39.26,18.78,-39.74,18.92,-46.3,20.83,-56.75,23.76,-58.46,23.5],[0.0,0.0,-14.41,2.46,-32.99,14.81,-37.26,17.74,-37.56,17.96,-37.45,18.42,-37.07,18.44,-31.33,18.81,-4.38,20.3,4.8,16.29,14.62,11.99,16.56,4.88,16.71,4.24,16.72,4.21,16.72,4.18,16.72,4.15,16.65,3.54,15.59,-2.66,0.0,0.0],[16.72,4.15,16.65,3.54,15.59,-2.66,0.0,0.0,-11.49,1.96,3.47,16.87,4.8,16.29,14.62,11.99,16.56,4.88,16.71,4.24,16.72,4.21,16.72,4.18,16.72,4.15],[10.97,3.38,10.93,3.32,10.7,2.91,10.14,2.85,9.83,3.19,9.52,3.54,9.64,4.09,10.06,4.27,10.13,4.3,10.39,4.42,10.69,4.35,10.88,4.14,11.07,3.94,11.1,3.63,10.97,3.38],[19.24,2.87,14.16,2.89,13.75,2.89,13.61,3.43,13.97,3.63,15.19,4.33,15.28,4.38,15.37,4.39,15.47,4.38,19.31,3.66,19.79,3.58,19.72,2.87,19.24,2.87]],[[-23.25,11.56,-20.79,10.86,-0.07,0.92,-0.07,0.92,-0.07,0.92,1.38,-4.09,-15.12,-5.09,-31.62,-6.09,-56.39,-19.13,-56.62,-16.1,-56.86,-13.07,-43.12,-1.09,-32.12,2.41,-21.12,5.91,-25.7,12.25,-23.25,11.56],[-9.62,42.41,-8.68,31.9,-14.63,18.12,-14.63,18.12,7.82,9.49,7.82,9.49,11.05,24.12,8.88,34.41,5.82,48.91,9.37,70.38,5.38,71.91,1.39,73.43,-10.56,52.91,-9.62,42.41],[-57.48,25.81,-59.88,25.55,-33.41,16.44,-30.55,15.46,-30.39,15.4,-30.23,15.46,-30.12,15.59,-27.24,19.18,-27.08,19.39,-27.14,19.69,-27.38,19.79,-31.25,21.44,-57.8,32.72,-55.19,30.63,-53.31,29.12,-44.37,24.31,-38.61,21.28,-38.17,21.04,-38.48,20.33,-38.95,20.48,-45.43,22.66,-55.76,26.0,-57.48,25.81],[0.0,0.0,-14.3,3.03,-32.38,16.11,-36.52,19.21,-36.82,19.44,-36.68,19.9,-36.31,19.91,-30.56,20.05,-3.57,20.46,5.44,16.08,15.09,11.4,16.74,4.21,16.87,3.57,16.88,3.54,16.88,3.51,16.87,3.48,16.78,2.87,15.47,-3.28,0.0,0.0],[16.87,3.48,16.78,2.87,15.47,-3.28,0.0,0.0,-11.4,2.42,4.14,16.72,5.44,16.08,15.09,11.4,16.74,4.21,16.87,3.57,16.88,3.54,16.88,3.51,16.87,3.48],[11.09,2.95,11.05,2.88,10.81,2.49,10.25,2.44,9.95,2.8,9.65,3.16,9.79,3.7,10.22,3.87,10.3,3.9,10.56,4.0,10.86,3.92,11.04,3.71,11.22,3.49,11.24,3.19,11.09,2.95],[19.34,2.1,14.27,2.32,13.86,2.34,13.74,2.89,14.1,3.07,15.36,3.72,15.44,3.77,15.54,3.78,15.63,3.76,19.44,2.89,19.92,2.78,19.82,2.08,19.34,2.1]]]};
  const easeIO = x => x * x * (3 - 2 * x);
  const SW_CYCLE = [0, 1, 2, 3, 4, 0];
  function swPath(c, cmds, nums) {
    c.beginPath(); let k = 0;
    for (const ch of cmds) {
      if (ch === "M") { c.moveTo(nums[k], nums[k + 1]); k += 2; }
      else if (ch === "L") { c.lineTo(nums[k], nums[k + 1]); k += 2; }
      else if (ch === "C") { c.bezierCurveTo(nums[k], nums[k + 1], nums[k + 2], nums[k + 3], nums[k + 4], nums[k + 5]); k += 6; }
      else c.closePath();
    }
  }
  const SW_BUF = SW.P[0].map(a => new Float32Array(a.length));
  function swPose(beat, climb) {
    // weights over the five poses for this moment
    const w = [0, 0, 0, 0, 0];
    if (beat === null) w[0] = 1;
    else {
      const n = SW_CYCLE.length - 1, ph = ((beat % 1) + 1) % 1 * n, q = Math.min(n - 1, Math.floor(ph)), t = easeIO(ph - q);
      w[SW_CYCLE[q]] += 1 - t; w[SW_CYCLE[q + 1]] += t;
    }
    for (let i = 0; i < 7; i++) {
      const out = SW_BUF[i]; out.fill(0);
      for (let j = 0; j < 5; j++) if (w[j]) { const a = SW.P[j][i]; for (let k = 0; k < a.length; k++) out[k] += a[k] * w[j]; }
    }
    return SW_BUF;
  }
  // a coloured-pencil speckle tile for any colour (as on the flowers): light and dark specks and the odd paper fleck
  const SPECKLE = {};
  function speckle(rgb, A) {
    const key = rgb + A; if (SPECKLE[key]) return SPECKLE[key];
    const [r, g, b] = rgb.match(/\d+/g).map(Number), T = 96, cv = document.createElement("canvas"); cv.width = cv.height = T;
    const x = cv.getContext("2d"), img = x.createImageData(T, T), d = img.data, rnd = mulberry(91 + r * 3 + g * 5 + b * 7);
    const lum = 0.08 * A, fl = 0.03 * A;
    for (let i = 0; i < d.length; i += 4) {
      const j = (rnd() - 0.5) * 2 * lum, sh = v => j < 0 ? v * (1 + j * 1.6) : v + (255 - v) * j;
      d[i] = sh(r); d[i + 1] = sh(g); d[i + 2] = sh(b); d[i + 3] = rnd() < fl ? 110 : 255;
    }
    x.putImageData(img, 0, 0);
    return (SPECKLE[key] = live.createPattern(cv, "repeat"));
  }
  function drawSwallow(c, p, span, beat, haze, fade) {
    const k = span / 42;
    const ang = Math.atan2(p.vy, p.vx);
    c.save(); c.translate(p.x, p.y); c.rotate(ang);
    if (Math.cos(ang) < 0) c.scale(1, -1);                   // flying left: keep the bird upright
    c.scale(k, k); c.translate(20, -4); c.globalAlpha = fade;          // centre the bird (its body starts 20 units right of centre)
    const pose = swPose(beat);
    const hz = Math.round(haze * 0.8 * 20) / 20;
    for (let i = 0; i < 7; i++) {
      let fill = birdColour(SW.fills[i], hz);
      if (S.birdGrain > 0) {
        fill = speckle(fill, S.birdGrain);
        if (fill.setTransform) fill.setTransform(new DOMMatrix([1 / k, 0, 0, 1 / k, 0, 0]));   // grain the same size at any bird size
      }
      c.fillStyle = fill; swPath(c, SW.cmds[i], pose[i]); c.fill();
    }
    c.restore();
  }
  function drawBird(c, p) {
    const t0 = p.t0 || 0, k = p.life === Infinity ? 0 : (p.age - t0) / (p.life - t0);
    const grow = Math.min(1, p.age / 0.3);
    const far = Math.min(1, p.far + (p.mode === "away" ? 0.55 * k : 0.3 * k * k));   // flying off into the distance
    const span = p.w * (0.35 + 0.65 * grow) * (1 - 0.7 * (far - p.far));
    const f = Math.sin(p.ph);                        // wing beat: +1 up, -1 down
    const haze = Math.min(0.72, 0.1 + 0.5 * far);
    const fade = Math.min(1, (1 - k) * 5) * Math.min(1, p.age / 0.15);
    if (p.type === "swallow") return drawSwallow(c, p, span, p.glide > 0 ? null : p.ph / (Math.PI * 2), haze, fade);
    c.save(); c.translate(p.x, p.y); c.rotate(p.tilt);
    c.globalAlpha = fade; c.fillStyle = birdColour(p.col, haze);
    const th = Math.max(0.55, span * 0.085);         // slim wings
    c.beginPath();
    for (const sd of [-1, 1]) {
      const tipX = sd * span, tipY = -span * 0.42 * f + span * 0.14;          // tips swept a little down and back, like a gull
      const midX = sd * span * 0.4, midY = -span * (0.2 + 0.3 * f);
      c.moveTo(0, -th * 0.2);
      c.quadraticCurveTo(midX, midY, tipX, tipY);
      c.quadraticCurveTo(midX * 1.05, midY + th * 1.4, 0, th * 0.9);
    }
    c.fill();
    c.beginPath(); c.ellipse(0, th * 0.25, th * 0.75, th * 0.55, 0, 0, Math.PI * 2); c.fill();   // a small body
    c.restore();
  }
  /* ---- Birdsong (Fiona, 10 Nov): made in the browser with the Web Audio API, no sound files. Each song is a few short
     sine-tone chirps with quick pitch sweeps, panned to where the bird is and quieter for distant birds. Starts only
     after the visitor has pressed on the paper (browsers require that), and only when the Birds pencil is in use. ---- */
  let AC = null, SONG_OUT = null, songVoices = 0;
  function audio() {
    if (!S.birdSong && !S.bubSound) return null;
    if (!AC) {
      const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return null;
      AC = new Ctx();
      SONG_OUT = AC.createGain(); SONG_OUT.gain.value = 0.5;
      const lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 6500;   // takes any edge off
      SONG_OUT.connect(lp); lp.connect(AC.destination);
    }
    if (AC.state === "suspended") AC.resume();
    if (!AC._unlocked) {
      // phones only let sound start from a tap: play one silent blip inside the tap to wake the audio
      AC._unlocked = true;
      try { const b = AC.createBuffer(1, 1, 22050), src = AC.createBufferSource(); src.buffer = b; src.connect(AC.destination); src.start(0); } catch (e) {}
    }
    return AC;
  }
  // phones count a finished tap (not just the first touch) as permission, so unlock there too
  ["touchend", "click"].forEach(ev => document.addEventListener(ev, () => {
    if ((S.brush === "birds" && S.birdSong) || (S.brush === "bubbles" && S.bubSound)) audio();
  }, { passive: true }));
  /* bubble pops (Fiona, 10 Nov): a soft, wet "plip": a sine that drops quickly in pitch, plus a tiny puff of
     filtered noise. Smaller bubbles pop higher. Full sound for bubbles the pencil pops; ones that pop on their own
     are much quieter. A few pops at most at once, so sweeping through a crowd of bubbles stays gentle. */
  let popNoise = null, popVoices = 0, lastPop = 0;
  function popSound(b, loud) {
    if (!S.bubSound || reduced) return;
    const ac = AC && AC.state === "running" ? AC : null; if (!ac) return;
    const now = ac.currentTime;
    if (popVoices >= 4 || now - lastPop < 0.03) return;
    lastPop = now; popVoices++; setTimeout(() => popVoices--, 150);
    const pan = Math.max(-0.8, Math.min(0.8, (b.x / BW) * 1.6 - 0.8));
    const size = Math.max(0.4, Math.min(1.6, b.r / 12)), vol = 0.16 * S.bubSoundVol * (loud ? 1 : 0.22);
    const out = AC.createStereoPanner ? AC.createStereoPanner() : null; if (out) { out.pan.value = pan; out.connect(SONG_OUT); }
    const dest = out || SONG_OUT, t = now + 0.005;
    const f0 = rand(650, 820) / Math.pow(size, 0.3),   // centred on the big bubbles' pop Fiona liked; small ones a touch higher, big ones a touch lower
          o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.35, t + 0.05);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.09);
    if (!popNoise) { popNoise = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate); const d = popNoise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); }
    const n = ac.createBufferSource(), bp = ac.createBiquadFilter(), ng = ac.createGain();
    n.buffer = popNoise; bp.type = "bandpass"; bp.frequency.value = 1000 / Math.pow(size, 0.3); bp.Q.value = 1.4;   // the puff lower and softer (was 2.8 kHz)
    ng.gain.setValueAtTime(vol * 0.3, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    n.connect(bp); bp.connect(ng); ng.connect(dest); n.start(t); n.stop(t + 0.05);
  }
  document.addEventListener("visibilitychange", () => { if (AC) document.hidden ? AC.suspend() : AC.resume(); });
  // one chirp: a sine tone sweeping from f0 up to f1 and back down to f2, with a soft attack and quick fade
  function chirp(t, dur, f0, f1, f2, vol, pan) {
    const o = AC.createOscillator(), g = AC.createGain(), pn = AC.createStereoPanner ? AC.createStereoPanner() : null;
    o.type = "sine";
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.4);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.012, dur * 0.2));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    if (pn) { pn.pan.value = pan; g.connect(pn); pn.connect(SONG_OUT); } else g.connect(SONG_OUT);
    o.start(t); o.stop(t + dur + 0.02);
  }
  // a little song for one bird: each bird gets its own voice (pitch) and one of a few song shapes
  function birdSong(b, kind) {
    const ac = audio(); if (!ac || songVoices >= 5) return;
    songVoices++; setTimeout(() => songVoices--, 900);
    const t0 = ac.currentTime + 0.02, pan = Math.max(-0.8, Math.min(0.8, (b.x / BW) * 1.6 - 0.8));
    const vol = 0.11 * S.birdSongVol * (1 - 0.55 * b.far) * (kind === "call" ? 0.7 : 1);
    const base = b.voice;                                   // 2.2–4.2 kHz
    const shape = kind || pick(["tweet", "tweet", "twitter", "whistle", "trill"]);
    if (shape === "tweet") {                                 // two or three quick up-tweets
      const n = 2 + (Math.random() < 0.5 ? 1 : 0);
      for (let i = 0; i < n; i++) chirp(t0 + i * 0.11, 0.07, base * 0.9, base * 1.35, base * 1.1, vol, pan);
    } else if (shape === "twitter") {                         // a quick descending run
      for (let i = 0; i < 5; i++) chirp(t0 + i * 0.065, 0.05, base * (1.4 - i * 0.08), base * (1.5 - i * 0.08), base * (1.2 - i * 0.08), vol * 0.85, pan);
    } else if (shape === "whistle") {                         // a clear rising then falling whistle, robin-like
      chirp(t0, 0.32, base * 0.75, base * 1.15, base * 0.9, vol * 0.8, pan);
      chirp(t0 + 0.38, 0.12, base * 1.1, base * 1.3, base * 1.2, vol * 0.6, pan);
    } else if (shape === "trill") {                           // a soft trill
      for (let i = 0; i < 8; i++) chirp(t0 + i * 0.045, 0.035, base * (i % 2 ? 1.25 : 1.05), base * (i % 2 ? 1.35 : 1.15), base * (i % 2 ? 1.2 : 1.0), vol * 0.7, pan);
    } else {                                                   // "call": a single soft chirp
      chirp(t0, 0.09, base, base * 1.3, base * 1.05, vol, pan);
    }
  }
  function swallowMove(q, dt) {
    // wingbeats in bursts of 3–5, then a glide on swept-back wings
    if (q.glide > 0) { q.glide -= dt; if (q.glide <= 0) { q.beats = 2 + (Math.random() * 2 | 0); q.ph = rand(0, Math.PI * 2); q.freq = rand(7.5, 10.5); } }
    else { const before = Math.floor(q.ph / (Math.PI * 2)); q.ph += dt * q.freq * Math.PI * 2 / 3.6 * S.birdFlap;   // wingbeat pace (not tied to flying speed: Fiona found that too much)   // one cycle of her five poses ≈ 0.4 s (it holds two wingbeats)
           if (Math.floor(q.ph / (Math.PI * 2)) > before && --q.beats <= 0) { q.glide = rand(0.35, 1.8); q.ph = 0; } }
    const k = q.age / q.life, spd = Math.hypot(q.vx, q.vy);
    let ang = Math.atan2(q.vy, q.vx);
    // swooping: the heading swings in long arcs; dives speed up a little
    ang += Math.sin(q.age * q.swoopRate + q.swoop) * 1.1 * dt;
    if (q.mode === "stay" || (q.mode === "linger" && k < 0.7)) {
      const dx = q.cx - q.x, dy = q.cy - 60 - q.y, dd = Math.hypot(dx, dy) || 1, want = Math.atan2(dy, dx);
      const diff = Math.atan2(Math.sin(want - ang), Math.cos(want - ang));
      if (dd > q.orbit * 1.4) ang += diff * 1.6 * dt; else ang += q.turn * 1.2 * dt;
      if (q.mode === "stay" && q.glide <= 0 && q.beats <= 0) q.glide = rand(0.6, 1.6);
    } else {
      // carry on the way it's facing with a gentle climb; never straight up or down
      const right = Math.cos(ang) >= 0, aim = right ? -0.3 : Math.PI + 0.3;
      ang += Math.atan2(Math.sin(aim - ang), Math.cos(aim - ang)) * 0.35 * dt;
      const rel = right ? ang : Math.atan2(Math.sin(Math.PI - ang), Math.cos(Math.PI - ang));   // angle above/below level
      const clamped = Math.max(-0.75, Math.min(0.6, rel));
      ang = right ? clamped : Math.PI - clamped;
    }
    const ns = spd * (1 + 0.25 * Math.sin(ang) * dt), lim = 200 * S.birdSpeed, lo = 70 * S.birdSpeed;
    const v = Math.min(lim, Math.max(lo, ns));
    q.vx = Math.cos(ang) * v; q.vy = Math.sin(ang) * v;
    if (S.birdSong && q.songAt && q.age > q.songAt) { q.songAt = q.age + (q.mode === "stay" ? rand(4, 9) : rand(2.5, 6)); if (Math.random() < 0.6) birdSong(q, Math.random() < 0.6 ? "twitter" : "trill"); }
    q.x += q.vx * dt; q.y += q.vy * dt;
    if (!(q.x === q.x && q.y === q.y)) { q.life = q.age; return; }   // safety: a bird with a bad position is removed, never stuck
    if (q.x < -80 || q.x > BW + 80 || q.y < -80 || q.y > BH + 80) q.life = q.age;
  }
  function birdSpawn(p, dir, sz, lead) {
    const D = S.birdDist, u = Math.random();
    const far = Math.min(0.95, D * 0.6 + u * 0.35);                    // 0 = near, 1 = very far
    const w = (20 + 26 * Math.pow(Math.random(), 2)) * sz * (1.2 - 0.6 * far);
    // heading: along the stroke, lifted upward a little, with each bird's own drift
    let hx = dir.x, hy = dir.y - 0.35; const hl = Math.hypot(hx, hy) || 1; hx /= hl; hy /= hl;
    const sp = (34 + 26 * Math.random()) * S.birdSpeed * (1 - 0.4 * far) * Math.sqrt(sz);
    const flock = S.birdFlock, jitter = (1 - flock) * 0.9 + 0.12;
    const a = Math.atan2(hy, hx) + (lead ? lead.da : (Math.random() - 0.5) * jitter);
    // in a group, each follows a little behind and to one side of the one before: a loose, uneven V
    let ox = rand(-6, 6) * sz, oy = rand(-6, 6) * sz;
    if (lead && lead.i) {
      const back = lead.i * 34 * sz * rand(0.8, 1.2), side = (lead.i % 2 ? 1 : -1) * Math.ceil(lead.i / 2) * 26 * sz * rand(0.7, 1.3);
      ox += -Math.cos(a) * back - Math.sin(a) * side; oy += -Math.sin(a) * back + Math.cos(a) * side;
    }
    const b = {
      kind: "bird", x: p.x + ox, y: p.y + oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      w, far, col: pick(BIRD_COLS[S.birdCol] || BIRD_COLS.dusk), ph: rand(0, 6.3), freq: rand(3.6, 5) * (1 - 0.25 * far), glide: rand(0, 1) < 0.4 ? rand(0.4, 1.2) : 0, tilt: 0, wander: rand(0, 6.3),
      mode: S.birdMode === "mix" ? (Math.random() < 0.22 && !(lead && lead.i) ? "stay" : "away") : S.birdMode,
      life: S.birdMode === "linger" ? rand(10, 15) : rand(6, 9), cx: p.x, cy: p.y, orbit: rand(40, 110) * sz, turn: (Math.random() < 0.5 ? -1 : 1) * rand(0.5, 0.9),
      move: (q, dt) => {
        if (q.type === "swallow") return swallowMove(q, dt);
        // flap, with the odd glide on raised wings
        if (q.glide > 0) { q.glide -= dt; q.ph += (Math.PI * 0.35 - q.ph % (Math.PI * 2)) * Math.min(1, dt * 4); }
        else { q.ph += dt * q.freq; if (Math.random() < dt * 0.55) q.glide = rand(0.8, 2.2); }   // long, easy glides between a few wingbeats
        const k = q.age / q.life;
        if (q.mode === "stay") {
          // soaring in slow, wide loops above where it was drawn, mostly gliding, like a gull on a thermal
          const spd = Math.hypot(q.vx, q.vy), target = 26 * Math.sqrt(q.w / 20);
          const ang = Math.atan2(q.vy, q.vx) + q.turn * 0.55 * dt, ns = spd + (target - spd) * Math.min(1, dt);
          q.vx = Math.cos(ang) * ns; q.vy = Math.sin(ang) * ns;
          const dx = q.cx - q.x, dy = q.cy - 40 - q.y, dd = Math.hypot(dx, dy) || 1;
          if (dd > q.orbit) { q.vx += dx / dd * 12 * dt; q.vy += dy / dd * 12 * dt; }
          if (q.glide <= 0 && Math.random() < dt * 0.9) q.glide = rand(1.5, 3.5);
        } else if (q.mode === "linger" && k < 0.7) {
          // wheel slowly about where it was drawn, drifting a little
          const ang = Math.atan2(q.vy, q.vx) + q.turn * dt, spd = Math.hypot(q.vx, q.vy);
          q.vx = Math.cos(ang) * spd; q.vy = Math.sin(ang) * spd;
          const dx = q.cx - q.x, dy = q.cy - q.y, dd = Math.hypot(dx, dy);
          if (dd > q.orbit) { q.vx += dx / dd * 30 * dt; q.vy += dy / dd * 30 * dt; }
        } else if (q.mode === "linger") {
          q.vy += -20 * dt; q.vx *= 1 + 0.15 * dt;                 // then away, up and out
        } else {
          // a slow climb, the heading drifting gently so each path is a soft curve
          const ang = Math.atan2(q.vy, q.vx) + Math.sin(q.age * 0.5 + q.wander) * 0.22 * dt, spd = Math.hypot(q.vx, q.vy);
          q.vx = Math.cos(ang) * spd; q.vy = Math.sin(ang) * spd - 4 * dt;
        }
        if (S.birdSong && q.songAt && q.age > q.songAt) {           // the odd song on the wing; staying birds sing now and then
          q.songAt = q.age + (q.mode === "stay" ? rand(5, 12) : rand(3, 8));
          if (Math.random() < 0.5) birdSong(q, Math.random() < 0.5 ? "call" : null);
        }
        const bob = Math.cos(q.ph) * q.w * 0.35;                     // body lifts on each downstroke
        q.x += q.vx * dt; q.y += q.vy * dt + bob * dt * (q.glide > 0 ? 0 : 1);
        q.tilt += (Math.max(-0.35, Math.min(0.35, q.vy / (Math.abs(q.vx) + 60) * 0.5)) - q.tilt) * Math.min(1, dt * 3);
        if (q.x < -60 || q.x > BW + 60 || q.y < -60 || q.y > BH + 60) q.life = q.age;   // gone off the paper
      },
    };
    b.voice = rand(2200, 4200); b.songAt = rand(1.5, 5);
    if (S.birdType === "swallow") {
      // swallows: bigger on the page, faster, quick bursts of wingbeats between long glides, swooping curved paths
      b.type = "swallow"; b.w = (26 + 22 * Math.pow(Math.random(), 1.5)) * sz * (1.15 - 0.55 * b.far);
      const spd = (110 + 70 * Math.random()) * S.birdSpeed * (1 - 0.35 * b.far);
      const hl = Math.hypot(b.vx, b.vy) || 1; b.vx = b.vx / hl * spd; b.vy = b.vy / hl * spd;
      b.beats = 0; b.glide = rand(0.05, 0.9); b.freq = rand(7.5, 10.5); b.swoop = rand(0, 6.3); b.swoopRate = rand(0.6, 1.2);   // each starts flapping at its own moment
      b.voice = rand(3400, 5000);
      if (b.mode === "linger") b.life = rand(9, 14); else b.life = rand(5, 8);
    }
    // most birds sing as they take off; a bird following in a V just gives a small call now and then
    if (S.birdSong && !reduced) { if (!(lead && lead.i)) { if (Math.random() < 0.75) birdSong(b, b.type === "swallow" ? pick(["twitter", "trill", "tweet"]) : null); } else if (Math.random() < 0.35) birdSong(b, "call"); }
    if (b.mode === "stay") {
      b.life = Infinity; b.orbit = rand(50, 120) * sz;
      const stayers = P.filter(q => q.kind === "bird" && q.mode === "stay");
      if (stayers.length >= 4) { const o = stayers[0]; o.mode = "away"; o.t0 = o.age; o.life = o.age + rand(6, 9); }   // the oldest one moves on
    }
    spawn(b);
    return b;
  }
  /* ---- Flower chain (Fiona, 10 Nov), from her two drawings: flowers-sequence-1 (buds) and -2 (open).
     Each petal and leaf has the same path structure in both, so it morphs from bud to open. Three flowers and three
     leaf pairs, each stored relative to its point on her stem and turned to the stem's direction there. ---- */
  const FLOWER_TPL = [{"kind":"leaf","p":[{"f":"#336FED","a":[21.05,1.52,14.43,-2.65,1.01,0.78,1.01,0.78,1.01,0.78,7.58,11.04,14.63,14.11,19.92,16.42,27.29,18.76,29.23,16.3,31.16,13.84,27.01,5.28,21.05,1.52],"b":[22.75,6.63,17.7,-0.05,3.83,-0.38,3.83,-0.38,3.83,-0.38,6.98,13.03,12.78,18.62,17.14,22.81,23.47,27.7,26.07,25.56,28.66,23.43,27.3,12.64,22.75,6.63]},{"f":"#345089","a":[10.9,2.4,7.36,-0.16,0.34,1.06,0.34,1.06,0.34,1.06,3.92,6.88,7.67,8.87,10.48,10.36,14.39,11.96,15.38,10.73,16.37,9.5,14.08,4.7,10.9,2.4],"b":[12.78,4.46,10.18,0.53,3.1,-0.29,3.1,-0.29,3.1,-0.29,4.75,7.29,7.73,10.65,9.97,13.17,13.21,16.16,14.53,15.1,15.85,14.03,15.12,8.0,12.78,4.46]},{"f":"#336FED","a":[24.75,-3.35,17.31,2.14,-0.23,-1.15,-0.23,-1.15,-0.23,-1.15,5.46,-14.39,13.75,-16.68,20.53,-18.54,31.48,-16.24,32.26,-13.98,33.04,-11.72,28.93,-6.43,24.75,-3.35],"b":[27.22,-11.74,21.63,-3.34,3.84,-0.73,3.84,-0.73,3.84,-0.73,5.54,-16.73,12.85,-22.03,18.82,-26.36,30.0,-27.73,31.39,-25.61,32.79,-23.49,30.35,-16.45,27.22,-11.74]},{"f":"#345089","a":[16.21,-4.59,11.18,-1.07,-1.11,-0.68,-1.11,-0.68,-1.11,-0.68,2.48,-7.79,8.19,-9.84,12.85,-11.52,20.53,-11.64,21.14,-10.63,21.75,-9.62,19.03,-6.57,16.21,-4.59],"b":[18.66,-10.09,14.83,-4.61,3.13,0.08,3.13,0.08,3.13,0.08,4.56,-8.7,9.45,-12.85,13.45,-16.25,20.8,-19.05,21.67,-18.19,22.54,-17.33,20.8,-13.16,18.66,-10.09]}]},{"kind":"leaf","p":[{"f":"#336FED","a":[16.29,0.51,10.15,-2.75,-0.92,1.59,-0.92,1.59,-0.92,1.59,1.91,8.84,5.67,11.88,11.8,16.83,23.9,16.39,25.33,14.63,26.76,12.87,22.15,3.62,16.29,0.51],"b":[16.05,14.63,13.72,6.17,-0.32,0.4,-0.32,0.4,-0.32,0.4,-4.78,9.64,-4.35,15.79,-3.66,25.82,7.55,36.13,10.52,35.76,13.49,35.39,18.28,22.72,16.05,14.63]},{"f":"#345089","a":[6.1,0.24,2.34,-0.99,-0.66,2.1,-0.66,2.1,-0.66,2.1,3.19,5.65,5.88,6.95,10.26,9.06,15.13,7.91,15.07,6.89,15.02,5.86,9.69,1.41,6.1,0.24],"b":[7.23,5.36,5.07,0.89,-0.58,1.11,-0.58,1.11,-0.58,1.11,-0.57,7.82,0.58,11.4,2.45,17.23,7.9,20.48,8.83,19.48,9.77,18.48,9.3,9.62,7.23,5.36]},{"f":"#336FED","a":[17.32,-4.25,12.78,-0.93,1.0,-1.92,1.0,-1.92,1.0,-1.92,-0.67,-8.66,1.88,-11.82,5.9,-16.81,20.62,-15.56,21.69,-14.54,22.75,-13.53,21.22,-7.1,17.32,-4.25],"b":[19.53,-10.45,15.07,-4.43,-0.11,-0.41,-0.11,-0.41,-0.11,-0.41,-4.74,-7.78,-2.72,-12.72,0.46,-20.51,19.44,-25.54,21.15,-24.78,22.87,-24.03,23.36,-15.61,19.53,-10.45]},{"f":"#345089","a":[8.93,-5.33,6.49,-2.93,0.58,-1.78,0.58,-1.78,0.58,-1.78,0.04,-5.11,1.47,-7.15,3.72,-10.36,11.11,-11.79,11.6,-11.4,12.09,-11.02,11.03,-7.4,8.93,-5.33],"b":[8.58,-8.03,6.41,-4.05,-0.59,-0.05,-0.59,-0.05,-0.59,-0.05,-2.52,-3.82,-1.48,-6.91,0.15,-11.78,8.9,-16.78,9.66,-16.53,10.42,-16.28,10.45,-11.45,8.58,-8.03]}]},{"kind":"leaf","p":[{"f":"#336FED","a":[3.88,-12.11,0.94,-7.91,-0.09,-0.67,-0.09,-0.67,-0.09,-0.67,12.16,-0.66,16.11,-6.42,18.94,-10.55,20.33,-13.49,18.12,-16.52,15.91,-19.54,6.82,-16.31,3.88,-12.11],"b":[-3.23,-14.16,-4.31,-8.15,-1.72,-0.11,-1.72,-0.11,-1.72,-0.11,11.72,-7.14,13.1,-15.34,14.09,-21.22,14.1,-25.05,10.13,-26.89,6.15,-28.73,-2.16,-20.18,-3.23,-14.16]},{"f":"#345089","a":[1.99,-6.86,0.46,-4.46,0.15,-0.53,0.15,-0.53,0.15,-0.53,7.2,-1.18,9.24,-4.47,10.72,-6.83,11.4,-8.48,10.01,-9.98,8.63,-11.48,3.52,-9.26,1.99,-6.86],"b":[-2.61,-7.68,-3.06,-4.32,-1.38,-0.1,-1.38,-0.1,-1.38,-0.1,6.01,-4.83,6.57,-9.39,6.97,-12.67,6.88,-14.75,4.59,-15.5,2.3,-16.24,-2.16,-11.03,-2.61,-7.68]},{"f":"#336FED","a":[8.93,11.84,3.85,9.12,-0.29,0.31,-0.29,0.31,-0.29,0.31,8.02,-3.38,13.32,-1.73,20.02,0.36,26.62,10.16,25.2,12.01,23.77,13.86,14.7,14.92,8.93,11.84],"b":[4.7,15.56,-0.23,11.11,-1.91,-0.11,-1.91,-0.11,-1.91,-0.11,9.02,-2.17,14.57,1.12,21.59,5.28,25.77,18.27,23.46,20.02,21.16,21.77,10.29,20.61,4.7,15.56]},{"f":"#345089","a":[5.48,6.58,2.7,5.41,0.22,0.89,0.22,0.89,0.22,0.89,4.51,-1.57,7.37,-0.98,10.99,-0.23,14.81,4.68,14.11,5.75,13.41,6.83,8.64,7.91,5.48,6.58],"b":[2.56,8.62,-0.24,6.54,-1.52,0.69,-1.52,0.69,-1.52,0.69,4.32,-1.01,7.42,0.42,11.35,2.23,14.03,8.87,12.84,9.92,11.66,10.98,5.75,10.97,2.56,8.62]}]},{"kind":"flower","p":[{"f":"#FD1BED","a":[20.54,-12.94,17.1,-5.24,0.79,-0.91,0.79,-0.91,0.79,-0.91,-0.15,-13.36,5.36,-18.67,9.86,-23.01,16.51,-28.2,20.67,-25.04,24.83,-21.88,22.47,-17.26,20.54,-12.94],"b":[15.16,-25.54,16.13,-15.15,1.19,-0.6,1.19,-0.6,1.19,-0.6,-7.36,-13.43,-4.66,-22.49,-2.45,-29.89,1.55,-39.52,7.96,-38.64,14.36,-37.76,14.62,-31.36,15.16,-25.54]},{"f":"#FD1BED","a":[21.14,-2.82,14.02,2.3,-0.39,0.64,-0.39,0.64,-0.39,0.64,6.4,-9.69,13.58,-12.24,19.44,-14.32,27.38,-16.42,28.49,-12.55,29.61,-8.68,25.13,-5.7,21.14,-2.82],"b":[27.72,-4.54,18.92,1.8,1.11,-0.25,1.11,-0.25,1.11,-0.25,9.51,-13.03,18.38,-16.18,25.63,-18.75,35.43,-21.34,36.81,-16.56,38.19,-11.78,32.65,-8.09,27.72,-4.54]},{"f":"#FD1BED","a":[20.89,6.43,12.61,7.81,1.73,-0.71,1.73,-0.71,1.73,-0.71,12.3,-7.16,19.36,-6.09,25.14,-5.22,32.6,-3.35,31.61,0.83,30.62,5.01,25.53,5.65,20.89,6.43],"b":[18.26,16.19,8.22,13.55,0.28,-1.57,0.28,-1.57,0.28,-1.57,15.46,-3.48,22.88,1.3,28.94,5.21,36.41,11.09,33.18,15.31,29.95,19.52,23.88,17.66,18.26,16.19]},{"f":"#FFC800","a":[5.5,-9.88,6.07,-5.39,-0.47,0.74,-0.47,0.74,-0.47,0.74,-4.48,-4.89,-3.37,-8.77,-2.47,-11.94,-0.79,-16.05,2.1,-15.6,4.99,-15.16,5.19,-12.39,5.5,-9.88],"b":[8.4,-13.25,9.1,-7.71,1.02,-0.14,1.02,-0.14,1.02,-0.14,-3.94,-7.09,-2.57,-11.88,-1.46,-15.8,0.62,-20.88,4.19,-20.33,7.76,-19.78,8.01,-16.36,8.4,-13.25]},{"f":"#FFC800","a":[6.33,6.98,1.98,5.99,-1.17,-0.46,-1.17,-0.46,-1.17,-0.46,5.54,-1.52,8.69,0.45,11.27,2.05,14.41,4.5,12.9,6.37,11.39,8.25,8.77,7.54,6.33,6.98],"b":[9.42,7.58,4.04,6.35,0.15,-1.62,0.15,-1.62,0.15,-1.62,8.44,-2.93,12.34,-0.5,15.52,1.49,19.41,4.51,17.54,6.83,15.67,9.15,12.43,8.27,9.42,7.58]},{"f":"#FFC800","a":[10.63,-1.06,6.95,1.76,-0.49,0.71,-0.49,0.71,-0.49,0.71,3.04,-5.06,6.75,-6.43,9.79,-7.55,13.89,-8.66,14.46,-6.48,15.02,-4.29,12.7,-2.65,10.63,-1.06],"b":[14.74,-2.36,10.18,1.13,0.99,-0.18,0.99,-0.18,0.99,-0.18,5.36,-7.3,9.94,-8.99,13.69,-10.38,18.76,-11.76,19.46,-9.05,20.16,-6.35,17.3,-4.32,14.74,-2.36]}]},{"kind":"flower","p":[{"f":"#FD1BED","a":[6.12,22.17,0.46,16.37,1.28,0.84,1.28,0.84,1.28,0.84,12.73,4.41,15.52,11.2,17.81,16.76,20.09,24.53,15.79,27.13,11.49,29.73,9.29,25.43,6.12,22.17],"b":[17.07,24.86,7.76,20.17,2.28,0.92,2.28,0.92,2.28,0.92,17.69,0.48,23.93,7.59,29.03,13.39,35.06,21.89,30.92,26.85,26.77,31.81,22.29,27.5,17.07,24.86]},{"f":"#FD1BED","a":[-5.18,20.4,-7.36,12.27,-0.98,-0.12,-0.98,-0.12,-0.98,-0.12,6.0,9.5,5.85,16.81,5.73,22.79,4.92,30.63,1.06,30.32,-2.79,30.01,-3.95,24.97,-5.18,20.4],"b":[-4.33,27.33,-7.14,16.86,1.07,0.93,1.07,0.93,1.07,0.93,10.05,13.3,9.86,22.71,9.7,30.39,8.66,40.48,3.7,40.08,-1.26,39.68,-2.75,33.2,-4.33,27.33]},{"f":"#FD1BED","a":[-12.84,13.68,-11.01,5.44,1.2,-0.03,1.2,-0.03,1.2,-0.03,3.3,12.89,-0.4,18.76,-3.43,23.55,-8.03,29.37,-11.61,26.31,-15.2,23.25,-13.87,18.29,-12.84,13.68],"b":[-20.29,11.44,-14.47,2.28,2.7,1.0,2.7,1.0,2.7,1.0,-0.42,17.56,-7.46,23.03,-13.22,27.51,-21.32,32.53,-24.33,27.26,-27.33,21.99,-23.55,16.58,-20.29,11.44]},{"f":"#FFC800","a":[6.07,8.38,2.07,7.4,-1.06,-0.13,-1.06,-0.13,-1.06,-0.13,4.99,-1.7,7.94,0.5,10.35,2.3,13.31,5.06,12.01,7.36,10.72,9.67,8.31,8.94,6.07,8.38],"b":[10.13,11.87,4.99,10.6,0.96,0.91,0.96,0.91,0.96,0.91,8.75,-1.1,12.54,1.72,15.64,4.03,19.45,7.59,17.79,10.55,16.12,13.52,13.01,12.57,10.13,11.87]},{"f":"#FFC800","a":[-8.95,3.77,-6.59,0.19,0.28,-0.44,0.28,-0.44,0.28,-0.44,-1.05,5.94,-3.89,8.11,-6.2,9.88,-9.47,11.87,-10.64,9.88,-11.82,7.88,-10.28,5.77,-8.95,3.77],"b":[-9.19,5.92,-6.14,1.33,2.69,0.51,2.69,0.51,2.69,0.51,0.98,8.72,-2.67,11.51,-5.65,13.78,-9.85,16.36,-11.36,13.79,-12.87,11.22,-10.9,8.5,-9.19,5.92]},{"f":"#FFC800","a":[-3.3,12.24,-4.99,7.17,-0.72,-0.11,-0.72,-0.11,-0.72,-0.11,4.36,6.07,4.39,10.54,4.42,14.18,3.99,18.94,1.27,18.58,-1.45,18.22,-2.36,15.09,-3.3,12.24],"b":[-1.92,16.83,-4.09,10.31,1.4,0.94,1.4,0.94,1.4,0.94,7.94,8.89,7.98,14.63,8.01,19.32,7.46,25.44,3.96,24.98,0.46,24.51,-0.7,20.49,-1.92,16.83]}]},{"kind":"flower","p":[{"f":"#FD1BED","a":[7.4,-22.3,10.06,-14.73,1.31,-1.37,1.31,-1.37,1.31,-1.37,-7.63,-9.49,-7.23,-16.69,-6.91,-22.58,-5.62,-30.43,-0.55,-30.85,4.52,-31.27,5.91,-26.54,7.4,-22.3],"b":[-4.37,-26.11,1.85,-19.06,-1.76,-0.71,-1.76,-0.71,-1.76,-0.71,-15.03,-5.58,-17.77,-13.58,-20.02,-20.1,-22.08,-29.19,-16.77,-31.88,-11.45,-34.57,-7.86,-30.06,-4.37,-26.11]},{"f":"#FD1BED","a":[16.13,-14.08,13.73,-5.31,0.78,0.78,0.78,0.78,0.78,0.78,-0.59,-12.89,3.59,-19.19,7.0,-24.34,12.11,-30.61,15.62,-27.45,19.14,-24.29,17.47,-19.0,16.13,-14.08],"b":[16.23,-17.73,13.42,-7.45,-1.74,-0.32,-1.74,-0.32,-1.74,-0.32,-3.35,-16.32,1.55,-23.71,5.54,-29.74,11.52,-37.08,15.64,-33.38,19.76,-29.68,17.8,-23.49,16.23,-17.73]},{"f":"#FD1BED","a":[18.07,-6.45,12.27,-0.65,-2.75,-1.27,-2.75,-1.27,-2.75,-1.27,1.93,-11.43,8.24,-14.8,13.4,-17.54,20.5,-20.58,22.23,-17.05,23.96,-13.53,21.33,-9.7,18.07,-6.45],"b":[21.3,4.31,12.17,7.34,-3.22,-1.19,-3.22,-1.19,-3.22,-1.19,7.01,-9.38,15.38,-9.59,22.22,-9.76,31.25,-9.21,31.21,-4.62,31.17,-0.02,26.41,2.61,21.3,4.31]},{"f":"#FFC800","a":[-0.41,-10.79,2.59,-7.59,0.77,0.87,0.77,0.87,0.77,0.87,-5.65,-1.3,-6.96,-4.96,-8.03,-7.94,-9.0,-12.11,-6.41,-13.38,-3.82,-14.64,-2.09,-12.59,-0.41,-10.79],"b":[-3.13,-13.87,0.38,-10.12,-1.75,-0.21,-1.75,-0.21,-1.75,-0.21,-9.28,-2.75,-10.81,-7.04,-12.06,-10.54,-13.19,-15.41,-10.16,-16.9,-7.13,-18.38,-5.1,-15.97,-3.13,-13.87]},{"f":"#FFC800","a":[9.51,2.03,5.43,3.85,-0.65,0.29,-0.65,0.29,-0.65,0.29,3.96,-5.35,7.6,-5.61,10.58,-5.82,14.76,-5.07,14.55,-2.53,14.33,-0.0,11.8,1.0,9.51,2.03],"b":[8.48,1.14,3.7,3.28,-3.42,-0.9,-3.42,-0.9,-3.42,-0.9,1.98,-7.49,6.25,-7.8,9.73,-8.05,14.63,-7.17,14.38,-4.2,14.13,-1.23,11.17,-0.06,8.48,1.14]},{"f":"#FFC800","a":[10.67,-9.18,8.91,-3.65,0.53,0.7,0.53,0.7,0.53,0.7,0.04,-7.69,2.86,-11.78,5.17,-15.12,8.58,-19.23,10.72,-17.43,12.87,-15.63,11.66,-12.29,10.67,-9.18],"b":[9.84,-11.99,7.77,-5.5,-2.04,-0.42,-2.04,-0.42,-2.04,-0.42,-2.61,-10.24,0.7,-15.03,3.4,-18.94,7.39,-23.75,9.9,-21.64,12.41,-19.54,10.99,-15.62,9.84,-11.99]}]}];
  const FLOWER_STEM = "#336FED";
  function bloomPath(c, a, b, m) {             // M x y, then cubic curves, closed
    c.beginPath();
    c.moveTo(a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m);
    for (let i = 2; i + 5 < a.length; i += 6) {
      const v = k => a[i + k] + (b[i + k] - a[i + k]) * m;
      c.bezierCurveTo(v(0), v(1), v(2), v(3), v(4), v(5));
    }
    c.closePath();
  }
  // grain for the flower pencil: each colour becomes a small repeating tile with light and dark specks
  // and the odd fleck of paper, like coloured pencil (built once per colour; rebuilt if the slider moves)
  const FGRAIN = {};
  function flowerGrain(hex) {
    const A = S.flowerGrain, key = hex + A;
    if (!A) return hex;
    if (FGRAIN[key]) return FGRAIN[key];
    const T = 96, c = document.createElement("canvas"); c.width = c.height = T; const x = c.getContext("2d");
    const img = x.createImageData(T, T), d = img.data, rnd = mulberry(77 + hex.charCodeAt(3) * 7), [r, g, b] = hexRgb(hex);
    const lum = 0.08 * A, fl = 0.03 * A;
    for (let i = 0; i < d.length; i += 4) {
      const j = (rnd() - 0.5) * 2 * lum, f = rnd() < fl;
      const sh = v => j < 0 ? v * (1 + j * 1.6) : v + (255 - v) * j;
      d[i] = sh(r); d[i + 1] = sh(g); d[i + 2] = sh(b); d[i + 3] = f ? 110 : 255;
    }
    x.putImageData(img, 0, 0);
    return (FGRAIN[key] = live.createPattern(c, "repeat"));
  }
  function drawBloomAt(c, p, s, m, sway) {
    const tp = FLOWER_TPL[p.tpl], sc = p.k * s;
    c.save(); c.translate(p.x, p.y); c.rotate(p.ang + (sway || 0) * p.flip); c.scale(sc, sc * p.flip);
    for (const q of tp.p) {
      bloomPath(c, q.a, q.b, m);
      const f = flowerGrain(q.f);
      // the grain moves with the petal, but stays the same size however big the flower is
      if (typeof f !== "string" && f.setTransform) f.setTransform(new DOMMatrix([1 / sc, 0, 0, 1 / (sc * p.flip), 0, 0]));
      c.fillStyle = f; c.fill();
    }
    c.restore();
  }
  const easeOut = x => 1 - Math.pow(1 - x, 3);
  // flowers and leaves stay alive after growing, so a soft breeze can move them: a wave that runs along each chain
  // (phase from distance along the stem), with slow gusts; leaves sway a little more, petals also breathe open and closed
  const blooms = [];
  function drawBlooms(c, dt) {
    const T = clock;
    for (const p of blooms) {
      p.age += dt;
      const t = Math.min(1, p.age / p.life);
      const s = 0.12 + 0.88 * easeOutBack(Math.min(1, t / 0.5)), m0 = easeOut(Math.max(0, Math.min(1, (t - 0.2) / 0.8)));
      let sway = 0, m = m0;
      if (!reduced && S.flowerWind > 0) {
        const settle = Math.min(1, Math.max(0, (p.age - p.life) / 1.2));          // the breeze takes hold once it has opened
        const gust = 0.55 + 0.45 * Math.sin(T * 0.37 + p.chain) * Math.sin(T * 0.23 + 1.3);
        const wave = Math.sin(T * 1.9 - p.L / (70 * p.k) + p.chain), flick = Math.sin(T * 5.3 - p.L / (40 * p.k) + p.seed);
        const amp = (p.leaf ? 0.07 : 0.045) * S.flowerWind * settle * gust;
        sway = amp * (wave + 0.25 * flick);
        if (!p.leaf) m = m0 - 0.06 * S.flowerWind * settle * gust * (0.5 + 0.5 * wave);   // petals close a touch and open again
      }
      // springy settle, only after the pencil lifts: a damped bounce that ripples back along the chain from the pencil end
      let sc = 1;
      if (!reduced && S.flowerWobble) {
        const W = S.flowerWobble;
        if (p.kickAt && T > p.kickAt) {
          const e2 = T - p.kickAt;
          if (e2 < 1.8) { const d = Math.exp(-3.2 * e2) * Math.sin(11 * e2); sway += 0.13 * W * d; sc += 0.06 * W * d; }
        }
      }
      drawBloomAt(c, p, Math.max(0.05, s * sc), m, sway);
    }
    // plenty on the paper: the oldest settle onto it and stop moving
    while (blooms.length > 260) { const o = blooms.shift(); drawBloomAt(ink, o, 1, 1, 0); }
  }
  const DRAW = { bird: drawBird, nighttw: drawNightTwinkle, startw: drawStarTwinkle, bubblepop: drawBubblePop, orb: drawOrb, star: drawStar, bubble: drawBubble, ring: drawRing, dot: drawDot, glint: drawGlint, fleck: drawFleck };

  /* ---------- brushes ---------- */
  // Each brush: step (min distance between points), begin(p), move(p, prev, dist), end()
  let acc = 0;
  const every = (dist, spacing, fn) => { acc += dist; while (acc >= spacing) { acc -= spacing; fn(); } };

  const rainbows = [], waters = [], flecks = [];
  const PASTEL = ["#F4AFC0", "#F7C9A0", "#F3E39A", "#B7E0BF", "#AFD1F0", "#CDBBEE"];
  const GLITTER = ["#D4AF37", "#E9C46A", "#F0D98C", "#E59AB8", "#D77FA6", "#B79CE0", "#8FB8DE", "#B8C0C8"];

  const settled = [];   // stars stamped onto the paper, used for twinkles
  // while a night-sky + stars stroke is being drawn, settled stars wait (drawn live, above the band)
  // until the band has been laid down, so the band never covers them
  let starComboPend = null;
  function stampStar(p) {
    if (starComboPend) { starComboPend.push(p); return; }
    stampStarNow(p);
  }
  function stampStarNow(p) {
    blitDrawn(ink, p.x, p.y, p.r, p.rot, p.v, p.col, 1);
    if (settled.length < 4000) settled.push({ x: p.x, y: p.y, r: p.r, col: p.col, rot: p.rot, v: p.v });
  }
  // a natural mix: many small, a few large
  const starR = sz => Math.random() < S.starTiny
    ? (1.8 + 1.8 * Math.random()) * sz * Math.sqrt(S.starBig)                    // star dust
    : (4.5 + 9 * Math.pow(Math.random(), 1.6)) * sz * S.starBig;
  // Fiona's small shapes (9–11) are chunkier, so they only ever appear small, as star dust
  const capStar = (v, r, sz) => v >= 100 && FIONA_STARS[v - 100].rel < 0.6 ? Math.min(r, 4.2 * sz) : r;
  const starSpawn = (p, sz, w = 1) => { const v = pickStarShape(), rel = starRel(v); return S.stars === "stay" ? spawn({
    kind: "star", stay: true, x: p.x + gauss() * 7 * sz * w, y: p.y + gauss() * 7 * sz * w,
    vx: gauss() * 30 * sz * w, vy: gauss() * 30 * sz * w, rot: rand(-0.5, 0.5), vr: rand(-1.2, 1.2), v,
    r: capStar(v, starR(sz) * rel, sz), life: reduced ? 0.01 : rand(0.35, 0.55), col: pick(STAR_COLS[S.starPal] || STAR_COLS.gold),
    move: (q, dt) => { const f = 1 - q.age / q.life; q.x += q.vx * dt * f; q.y += q.vy * dt * f; q.rot += q.vr * dt * f; },
    die: stampStar,
  }) : spawn({
    kind: "star", x: p.x + rand(-5, 5) * sz * w, y: p.y + rand(-5, 5) * sz * w,
    vx: rand(-45, 45) * sz, vy: rand(-10, 50) * sz, g: 60 * sz, rot: rand(0, 6.3), vr: rand(-3.5, 3.5), v,
    r: capStar(v, starR(sz) * 1.1 * rel, sz), life: rand(1.3, 2.2), col: pick(STAR_COLS[S.starPal] || STAR_COLS.gold),
  }); };
  const MAX_RESTING = 220;
  const bubbleSpawn = (p, sz, r0) => {
    const x0 = p.x + rand(-6, 6) * sz;
    // mix: about two-thirds settle and bob; the rest keep drifting up and off the paper
    const drift = S.bubbles === "mix" && Math.random() < 0.35, stay = (S.bubbles === "stay" || S.bubbles === "mix") && !drift;
    if (stay) {
      const resting = P.filter(q => q.kind === "bubble" && q.life === Infinity && !q.drift);
      if (resting.length >= MAX_RESTING) resting[0].life = resting[0].age;   // oldest pops
    }
    const R = (r0 || rand(6, 18)) * sz;
    spawn({
      kind: "bubble", x: x0, y: p.y, x0, vy: -rand(35, 80) * sz, wob: rand(4, 12) * sz, freq: rand(2, 4),
      r: R, life: stay || drift ? Infinity : rand(1.4, 3.2), set: (Math.random() * BUBBLE_SET.length) | 0, drift,
      sway: rand(-18, 18) * sz, rise: rand(26, 50) * sz, popAt: drift && Math.random() < 0.35 ? rand(1.4, 4.5) : 0,
      move: drift
        ? (b, dt) => {   // keep rising gently, drifting a little sideways, until it leaves the top of the paper
            b.vy += (-b.rise - b.vy) * Math.min(1, dt * 1.2);
            b.y += b.vy * dt; b.x0 += b.sway * dt;
            b.x = b.x0 + b.wob * 0.6 * Math.sin(b.age * b.freq * 0.6 + b.seed);
            if (b.popAt && b.age > b.popAt) { b.life = b.age; return; }          // about a third pop on the way up
            if (b.y < -b.r * 1.5 || b.x < -b.r * 2 || b.x > BW + b.r * 2) { b.silent = true; b.life = b.age; }
          }
        : stay
        ? (b, dt) => {   // rise, slow to a stop, then bob gently
            b.y += b.vy * dt; b.vy *= Math.pow(0.12, dt);
            const w = b.wob * (0.25 + 0.75 * Math.exp(-b.age));
            b.x = b.x0 + w * Math.sin(b.age * b.freq * (reduced ? 0 : 1) + b.seed);
            if (!reduced) b.y += Math.sin(b.age * 1.4 + b.seed) * 3 * dt;
          }
        : (b, dt) => { b.y += b.vy * dt; b.vy *= 1 - 0.25 * dt; b.x = b.x0 + b.wob * Math.sin(b.age * b.freq + b.seed); },
      die: b => {
        if (reduced || b.silent) return;
        popSound(b, !!b.byPencil);
        // soft pop: it swells a little and fades, with a few tiny droplets in its colour
        spawn({ kind: "bubblepop", x: b.x, y: b.y, vx: 0, vy: 0, r: b.r, set: b.set, life: 0.22 });
        if (!BUBBLE_SPRITES) makeBubbleSprites();
        for (let i = 0; i < 5; i++) {
          const [r, g, bl] = pick(S.bubStyle === "riso" && RISO_SPRITES ? RISO_SPRITES[b.set % RISO_SPRITES.length].dots : BUBBLE_SPRITES[b.set].dots);
          const a = rand(0, 6.3), v = rand(30, 70);
          spawn({ kind: "dot", x: b.x + Math.cos(a) * b.r * 0.8, y: b.y + Math.sin(a) * b.r * 0.8, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 120,
            r: rand(0.8, 1.6), life: rand(0.25, 0.4), col: `rgba(${r},${g},${bl},.8)` });
        }
      },
    });
    return R;
  };

  const BR = {
    flowers: {
      step: 2,
      begin(p) {
        this.L = 0; this.k = 1.45 * S.size * S.flowerScale; this.dir = null; this.pts = [p]; this.mid = p;
        this.next = 26 * this.k; this.leaf = Math.random() < 0.5; this.lastTpl = -1; this.chain = rand(0, 6.3);
        this.ph = rand(0, 6.3); this.ph2 = rand(0, 6.3); this.ph3 = rand(0, 6.3); this.turn = 0; this.sm = { x: p.x, y: p.y };
      },
      // size along the chain: a slow wave, so it runs from smaller flowers, leaves and stem to bigger ones and back
      grow(L) {
        const k = this.k, V = S.flowerVary;
        return 1 + 0.36 * V * (0.75 * Math.sin(L / (300 * k) + this.ph2) + 0.25 * Math.sin(L / (120 * k) + this.ph3));
      },
      // stem width: tapers in from a fine point, then swells and thins gently along its length
      width(L) {
        const k = this.k, start = Math.min(1, L / (60 * k));
        // thinnest is about where the old widest was; swells to about 1.6× that
        const swell = 0.5 + 0.38 * Math.sin(L / (110 * k) + this.ph) + 0.12 * Math.sin(L / (47 * k) + this.ph * 2);   // 0–1
        return 4.2 * k * (0.2 + 0.8 * start * start) * (1 + 0.6 * swell) * this.grow(L);
      },
      move(p, prev, d) {
        if (d < 0.01) return;
        // smooth the line: draw a curve through the midpoints of the pencil's path, using each point as the control
        // extra smoothing for the stem: follow the pencil softly, and only take a new point every 7 units
        this.raw = p;
        this.sm.x += (p.x - this.sm.x) * 0.3; this.sm.y += (p.y - this.sm.y) * 0.3;
        p = { x: this.sm.x, y: this.sm.y };
        const last = this.pts[this.pts.length - 1];
        if (Math.hypot(p.x - last.x, p.y - last.y) < 4.5 * this.k) return;
        this.curveTo(p, last);
      },
      curveTo(p, last) {
        this.pts.push(p); if (this.pts.length > 4) this.pts.shift();
        const ctrl = last, mid = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 }, from = this.mid;
        const seg = Math.hypot(mid.x - from.x, mid.y - from.y);
        if (seg < 0.01) return;
        // draw the curve in short pieces so the width can change smoothly along it
        const n = Math.max(1, Math.ceil(seg / 3));
        let px = from.x, py = from.y;
        const stemFill = flowerGrain(FLOWER_STEM);
        if (typeof stemFill !== "string" && stemFill.setTransform) stemFill.setTransform(new DOMMatrix());
        ink.save(); ink.strokeStyle = stemFill; ink.lineCap = "round"; ink.lineJoin = "round";
        for (let i = 1; i <= n; i++) {
          const t = i / n, u = 1 - t;
          const x = u * u * from.x + 2 * u * t * ctrl.x + t * t * mid.x, y = u * u * from.y + 2 * u * t * ctrl.y + t * t * mid.y;
          const dl = Math.hypot(x - px, y - py);
          ink.lineWidth = this.width(this.L + dl / 2);
          ink.beginPath(); ink.moveTo(px, py); ink.lineTo(x, y); ink.stroke();
          if (dl > 0.01) {
            const nx = (x - px) / dl, ny = (y - py) / dl;
            if (this.dir) this.turn = this.turn * 0.9 + Math.abs(Math.atan2(nx * this.dir.y - ny * this.dir.x, nx * this.dir.x + ny * this.dir.y)) ;
            this.dir = this.dir ? { x: this.dir.x * 0.6 + nx * 0.4, y: this.dir.y * 0.6 + ny * 0.4 } : { x: nx, y: ny };
          }
          this.L += dl; px = x; py = y;
          // place a flower or leaf pair exactly on the drawn stem (not on a sharp turn)
          if (this.L >= this.next && this.dir) {
            if (this.turn > 0.9) { this.next = this.L + 10 * this.k; continue; }
            const kind = this.leaf ? "leaf" : "flower";
            const opts = FLOWER_TPL.map((q, j) => j).filter(j => FLOWER_TPL[j].kind === kind && j !== this.lastTpl);
            const tpl = pick(opts); this.lastTpl = tpl;
            const life = (kind === "leaf" ? rand(0.75, 1.0) : rand(1.1, 1.5)) / S.flowerSpeed;
            const g = this.grow(this.L);
            blooms.push({ tpl, x, y, ang: Math.atan2(this.dir.y, this.dir.x), flip: Math.random() < 0.5 ? 1 : -1, k: this.k * g * rand(0.92, 1.08),
                          age: 0, life: reduced ? 0.01 : life, L: this.L, chain: this.chain, leaf: kind === "leaf", seed: rand(0, 6.3) });
            this.leaf = !this.leaf;
            this.next += rand(85, 125) * this.k * g * S.flowerGap * (kind === "leaf" ? 0.9 : 1.1);
          }
        }
        ink.restore();
        this.mid = mid;
      },
      // between committed pieces, a live tail runs from the end of the stem to the pencil tip every frame,
      // so the line grows continuously instead of in small jumps
      drawTail(c) {
        if (!this.raw || !this.mid) return;
        const last = this.pts[this.pts.length - 1], a = this.mid, sm = this.sm, r = this.raw;
        const sf = flowerGrain(FLOWER_STEM); if (typeof sf !== "string" && sf.setTransform) sf.setTransform(new DOMMatrix());
        c.save(); c.strokeStyle = sf; c.lineCap = "round"; c.lineJoin = "round";
        c.lineWidth = this.width(this.L + 2);
        c.beginPath(); c.moveTo(a.x, a.y); c.quadraticCurveTo(last.x, last.y, (last.x + sm.x) / 2, (last.y + sm.y) / 2);
        c.quadraticCurveTo(sm.x, sm.y, (sm.x + r.x) / 2, (sm.y + r.y) / 2); c.lineTo(r.x, r.y); c.stroke();
        c.restore();
      },
      // when the pencil lifts, finish the stem to where it actually stopped (the smoothing trails slightly behind)
      end() {
        // a wobble ripples back along this chain, from where the pencil lifted towards the start
        // (only after lifting, so while drawing the focus stays on the growing; a piece still opening waits until it has opened)
        for (const b of blooms) if (b.chain === this.chain) b.kickAt = Math.max(clock + 0.12 + (this.L - b.L) / (1100 * this.k), clock + Math.max(0, b.life - b.age));
        if (!this.raw) return;
        const last = this.pts[this.pts.length - 1], r = this.raw;
        if (Math.hypot(r.x - last.x, r.y - last.y) > 1) this.curveTo(r, last);
        const fin = this.pts[this.pts.length - 1];
        this.curveTo({ x: fin.x + (fin.x - this.mid.x) * 0.001, y: fin.y + (fin.y - this.mid.y) * 0.001 }, fin);
        this.raw = null;
      },
    },
    birds: {
      step: 3,
      begin(p) { this.sz = S.size; this.acc = 0; this.first = true; this.dir = { x: 1, y: -0.2 }; this.made = 0; this.at = p; },
      // swallows: no limit per stroke, but they set off one at a time, well spaced, and at most 6 are in the air at once,
      // so a long line keeps sending swallows without crowding the sky
      room() { return S.birdType !== "swallow" || P.filter(q => q.kind === "bird" && q.type === "swallow").length < 6; },
      move(p, prev, d) {
        if (d > 0.5) {
          const nx = (p.x - prev.x) / d, ny = (p.y - prev.y) / d;
          this.dir = this.first ? { x: nx, y: ny } : { x: this.dir.x * 0.8 + nx * 0.2, y: this.dir.y * 0.8 + ny * 0.2 };
        }
        // the first bird lifts off as soon as the pencil moves, so the line answers straight away
        if (this.first) { this.first = false; this.acc = 0; birdSpawn(p, this.dir, this.sz, null); this.made++; return; }
        this.acc += d;
        const gap = 70 * this.sz / S.birdCount;            // a few birds, not a swarm
        let made = 0;
        while (this.acc >= gap && made < 20) {
          this.acc -= gap; made++;
          // sometimes a little group sets off together, keeping roughly the same heading
          const n = S.birdType === "swallow" ? 1 : Math.random() < 0.2 + 0.35 * S.birdFlock ? 2 + (Math.random() * 4 | 0) : 1, da = (Math.random() - 0.5) * 0.5;
          for (let i = 0; i < n && this.room(); i++) { birdSpawn(p, this.dir, this.sz, n > 1 ? { da: da + (Math.random() - 0.5) * 0.08, i } : null); this.made++; }
        }
      },
      // a single click (no movement) still sends a bird off: left or right at random, rising a little
      end() {
        if (this.first && this.at) {
          const right = Math.random() < 0.5;
          birdSpawn(this.at, { x: right ? 1 : -1, y: rand(-0.5, -0.1) }, this.sz, null);
        }
        this.first = false;
      },
    },
    stars: {
      step: 3,
      begin(p) {
        // "combo": the night-sky band with Fiona's drawn stars on top of it
        this.combo = S.starStyle === "combo"; this.night = S.starStyle === "night" || this.combo;
        if (this.night) { BR.nightsky.begin(p); if (!this.combo) return; starComboPend = []; }
        this.sz = S.size; this.L = 0; this.acc = 0; this.ph = [rand(0, 6.3), rand(0, 6.3), rand(0, 6.3)];
        starSpawn(p, this.sz);
      },
      // like a patch of the Milky Way: denser and wider in places, thin and sparse in others, the odd little cluster
      patch() {
        const L = this.L / this.sz, ph = this.ph;
        const n = 0.5 + 0.3 * Math.sin(L / 95 + ph[0]) + 0.2 * Math.sin(L / 38 + ph[1]) + 0.12 * Math.sin(L / 17 + ph[2]);
        return Math.max(0, Math.min(1, n));
      },
      move(p, prev, d) {
        if (this.night) { BR.nightsky.move(p, prev, d); if (!this.combo) return; }
        const V = S.starPatch, steps = Math.min(200, Math.max(1, Math.ceil(d / 3)));
        let made = 0;
        for (let k = 1; k <= steps; k++) {
          const q = { x: prev.x + (p.x - prev.x) * k / steps, y: prev.y + (p.y - prev.y) * k / steps };
          this.L += d / steps; this.acc += d / steps;
          const f = this.patch(), dens = (1 - V) + V * 2.2 * Math.pow(f, 1.6), wide = S.starSpread * ((1 - V) + V * (0.3 + 2.1 * f * f));
          const gap = 11 * this.sz / (S.starDensity * Math.max(0.12, dens));
          if (!(gap > 0.5)) continue;
          while (this.acc >= gap && made < 60) {
            this.acc -= gap; starSpawn(q, this.sz, wide); made++;
            if (Math.random() < 0.3 * V * f * f) {                       // a little cluster of dust
              const keep = S.starTiny; S.starTiny = 1;
              try { for (let j = 0, m = 2 + (Math.random() * 3 | 0); j < m; j++) starSpawn(q, this.sz, wide * 0.6); }
              finally { S.starTiny = keep; }
            }
          }
        }
      },
      end() {
        if (!this.night) return;
        BR.nightsky.end();                       // the band is laid onto the paper now…
        if (starComboPend) {                     // …then the drawn stars go on top of it
          for (const q of starComboPend) stampStarNow(q);
          starComboPend = null;
        }
      },
    },
    bubbles: {
      step: 3,
      begin(p) { this.acc = 0; this.sz = S.size; this.smallRun = 0; this.gap = this.gapAfter(bubbleSpawn(p, this.sz, this.pickR())); },
      // natural mix: spacing follows each bubble's size, so runs of small ones don't leave the stream sparse
      move(p, prev, d) {
        this.acc += d;
        while (this.acc >= this.gap) { this.acc -= this.gap; this.gap = this.gapAfter(bubbleSpawn(p, this.sz, this.pickR())); }
      },
      pickR() {
        if (!S.bubMix) return rand(6, 18);
        let r = 4.5 + 17 * Math.pow(Math.random(), 2.4);
        if (r < 9) { if (++this.smallRun > 3) { r = rand(11, 20); this.smallRun = 0; } } else this.smallRun = 0;
        return r;
      },
      gapAfter(R) { return S.bubMix ? R * 1.35 + 8 * this.sz : 30 * this.sz; },   // R already includes brush size
      end() {},
    },
    rainbow: {
      step: 5,
      begin(p) {
        this.s = { pts: [p], nrm: [], len: [0], W: 42 * S.size, done: 0, phase: rand(0, 600) };
        rainbows.push(this.s);
      },
      move(p, prev, d) {
        const s = this.s; s.pts.push(p); s.len.push(s.len[s.len.length - 1] + d);
        const n = s.pts.length;
        if (n === 2) s.nrm[0] = perp(dir(s.pts[0], s.pts[1]));
        if (n >= 3) {
          const i = n - 2, d1 = dir(s.pts[i - 1], s.pts[i]), d2 = dir(s.pts[i], s.pts[i + 1]);
          const ax = d1.x + d2.x, ay = d1.y + d2.y, m = Math.hypot(ax, ay);
          s.nrm[i] = m < 0.3 ? s.nrm[i - 1] : perp({ x: ax / m, y: ay / m });
          ribbonSeg(ink, s, i - 1, i, 1); s.done = i;
        }
      },
      end() {
        const s = this.s, n = s.pts.length;
        if (n === 1) {
          const p = s.pts[0];
          for (let b = PASTEL.length - 1; b >= 0; b--) { ink.beginPath(); ink.arc(p.x, p.y, (b + 1) * s.W / 12, 0, Math.PI * 2); ink.fillStyle = PASTEL[b]; ink.fill(); }
          rainbows.pop(); return;
        }
        s.nrm[n - 1] = perp(dir(s.pts[n - 2], s.pts[n - 1]));
        ribbonSeg(ink, s, n - 2, n - 1, 1); s.done = n - 1;
      },
    },
    water: {
      step: 3,
      begin(p) {
        acc = 0;
        this.s = { pts: [p], len: [0], W: 46 * S.size, seed: rand(0, 10) };
        waters.push(this.s); waterSeg(this.s, p, p);
      },
      move(p, prev, d) {
        const s = this.s; s.pts.push(p); s.len.push(s.len[s.len.length - 1] + d);
        waterSeg(s, prev, p);
        if (!reduced) every(d, 42 * S.size, () => {
          for (let i = 0; i < 2; i++) spawn({ kind: "dot", x: p.x, y: p.y, vx: rand(-70, 70), vy: -rand(60, 150), g: 480, r: rand(1.5, 3.4) * S.size, life: rand(0.35, 0.6), col: pick(["#7FB8E0", "#A8D3EF", "#5E9FD0"]) });
        });
      },
      end() {},
    },
  };

  const GRADS = {
    aurora: ["#3FD8C2", "#3FA3EE", "#7B6CF0", "#E27BD0"],
    sunset: ["#FFB36B", "#FF7A8A", "#C86BD8", "#6C6FE0"],
    ocean:  ["#9BE7F0", "#3FB7D8", "#2C7FC4", "#243F9E"],
  };
  const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function gradColour(stops, len) {
    const n = stops.length - 1, cyc = 2 * n;
    let t = (len / 280) % cyc; if (t > n) t = cyc - t;
    const i = Math.min(n - 1, Math.floor(t)), f = t - i;
    const a = hexRgb(stops[i]), b = hexRgb(stops[i + 1]);
    return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(",")})`;
  }
  // Gradient strokes are kept as geometry so they can shimmer and wobble.
  // While drawing (and while wobbling) they're drawn on the live canvas; then they're baked into the ink.
  const gradStrokes = [];      // baked, shimmering
  let pending = [];            // drawn, waiting to wobble
  let pendingT = 0, wobble = null;
  BR.gradient = {
    step: 2.5,
    begin(p) {
      if (wobble) { wobble.strokes.forEach(bakeGrad); wobble = null; }
      this.stops = GRADS[S.grad]; this.maxW = 38 * S.size; this.w = this.maxW * 0.3;
      this.s = { pts: [p], w: [this.w], col: [gradColour(this.stops, 0)], n: [null], len: [0], tm: [clock], phase: rand(0, 600), done: false,
                 finish: S.finish, pal: S.grad, specks: [] };
      pending.push(this.s); pendingT = 0;
    },
    move(p, prev, d) {
      const s = this.s, L = s.len[s.len.length - 1] + d;
      const want = S.gradWidth === "swell"
        ? this.maxW * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(L / 60)))
        : this.maxW * (0.14 + 0.86 * Math.exp(-d / 11));
      this.w += (want - this.w) * (S.gradWidth === "swell" ? 1 : 0.3);
      const n = perp(dir(prev, p));
      if (!s.n[s.n.length - 1]) s.n[s.n.length - 1] = n;
      s.pts.push(p); s.w.push(this.w); s.col.push(gradColour(this.stops, L)); s.n.push(n); s.len.push(L); s.tm.push(clock);
      if (s.finish === "grainy") {
        // fixed at draw time so the grain doesn't flicker when the shape wobbles or jumps
        const i = s.pts.length - 1, count = Math.round(d * this.w * 0.1) + 1;
        for (let k = 0; k < count; k++) {
          const r = Math.random();
          if (r < 0.5) {           // paper showing through the pigment
            s.specks.push({ i, a: Math.random(), o: rand(-0.72, 0.72), z: rand(0.8, 2.2), paper: true, al: rand(0.35, 0.85) });
          } else {                 // pigment scattered past the edge, thinning outwards
            const side = Math.random() < 0.5 ? -1 : 1, o = 0.72 + Math.pow(Math.random(), 1.8) * (Math.random() < 0.12 ? 1.1 : 0.55);
            s.specks.push({ i, a: Math.random(), o: side * o, z: rand(0.6, 2) * (o > 1.2 ? 0.7 : 1), paper: false, al: rand(0.45, 1) * (o > 1.1 ? 0.6 : 1) });
          }
        }
      }
    },
    end() {
      const s = this.s; s.done = true; pendingT = 0;
      if (!s.n[0]) s.n[0] = { x: 0, y: 1 };
      if (S.lift === "off" || reduced) { pending.forEach(bakeGrad); pending = []; }
    },
  };
  function bakeGrad(st) { drawGrad(ink, st, null); gradStrokes.push(st); }

  // draw one gradient stroke; `wob` bends it into a jelly wobble
  /* ---- riso: two spot inks, overprinted, with a fine uneven grain ---- */
  const RISO = {
    aurora: ["#5EC8E5", "#FF48B0"],   // aqua + fluorescent pink (overprint = violet)
    sunset: ["#FFE800", "#FF48B0"],   // yellow + fluorescent pink (overprint = warm red)
    ocean:  ["#5EC8E5", "#0078BF"],   // aqua + blue (overprint = deep blue)
  };
  const RISO_LEVELS = 12, riso = {};
  function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function risoTiles(hex, seed) {
    const key = hex + seed; if (riso[key]) return riso[key];
    const T = 160, G = 5, rnd = mulberry(seed * 7919 + 13);
    const grid = Array.from({ length: G * G }, rnd);
    const sm = x => x * x * (3 - 2 * x);
    const noise = new Float32Array(T * T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const gx = x / T * G, gy = y / T * G, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = sm(gx - x0), fy = sm(gy - y0);
      const g = (i, j) => grid[((j % G) * G) + (i % G)];
      const blot = (g(x0, y0) * (1 - fx) + g(x0 + 1, y0) * fx) * (1 - fy) + (g(x0, y0 + 1) * (1 - fx) + g(x0 + 1, y0 + 1) * fx) * fy;
      noise[y * T + x] = 0.7 * rnd() + 0.3 * blot;   // fine grain + gentle blotchy ink density
    }
    const [r, g, b] = hexRgb(hex), tmp = document.createElement("canvas"); tmp.width = tmp.height = T;
    const tc = tmp.getContext("2d"), tiles = [null];
    for (let k = 1; k < RISO_LEVELS; k++) {
      const pth = k / (RISO_LEVELS - 1) * 0.95, img = tc.createImageData(T, T);
      for (let i = 0; i < T * T; i++) {
        const a = Math.max(0, Math.min(1, (pth - noise[i]) / 0.07 + 0.5));
        img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = a * 255;
      }
      tc.putImageData(img, 0, 0);
      const bmp = document.createElement("canvas"); bmp.width = bmp.height = T; bmp.getContext("2d").drawImage(tmp, 0, 0);
      const pat = ink.createPattern(bmp, "repeat"); pat.setTransform(new DOMMatrix().scale(1.4));
      tiles.push(pat);
    }
    return (riso[key] = tiles);
  }
  const pingpong = x => { const f = x % 2; return f > 1 ? 2 - f : f; };
  // each ink is laid down flat on its own buffer, then overprinted (multiply) with a slight misregistration
  const risoBuf = document.createElement("canvas"), rb = risoBuf.getContext("2d");
  function drawRiso(c, st, P, ws) {
    const inks = RISO[st.pal] || RISO.aurora, N = st.pts.length;
    const pts = []; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, wmax = 0;
    for (let i = 0; i < N; i++) { const q = P(i); pts.push(q); x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x); y1 = Math.max(y1, q.y); wmax = Math.max(wmax, st.w[i] * ws); }
    const m = wmax / 2 + 4; x0 = Math.floor(x0 - m); y0 = Math.floor(y0 - m); x1 = Math.ceil(x1 + m); y1 = Math.ceil(y1 + m);
    const bw = Math.ceil((x1 - x0) * R), bh = Math.ceil((y1 - y0) * R);
    if (risoBuf.width < bw) risoBuf.width = bw;
    if (risoBuf.height < bh) risoBuf.height = bh;
    const offs = [{ x: 0, y: 0 }, { x: 2.4, y: -1.8 }];
    for (let L = 0; L < 2; L++) {
      const tiles = risoTiles(inks[L], L + 1);
      rb.setTransform(1, 0, 0, 1, 0, 0); rb.clearRect(0, 0, bw, bh);
      rb.setTransform(R, 0, 0, R, -x0 * R, -y0 * R);   // board coordinates, so the grain stays put on the paper
      const lvl = i => {
        const u = pingpong(st.len[i] / 420), d = 0.05 + 0.8 * (L === 0 ? 1 - u : u);
        return Math.max(1, Math.min(RISO_LEVELS - 1, Math.round(d * (RISO_LEVELS - 1))));
      };
      let a = pts[0], wa = st.w[0] * ws, na = st.n[0] || st.n[1] || { x: 0, y: 1 };
      rb.fillStyle = tiles[lvl(0)]; rb.beginPath(); rb.arc(a.x, a.y, wa / 2, 0, Math.PI * 2); rb.fill();
      for (let i = 1; i < N; i++) {
        const b = pts[i], wb = st.w[i] * ws, nb = st.n[i];
        rb.fillStyle = tiles[lvl(i)];
        rb.beginPath();
        rb.moveTo(a.x + na.x * wa / 2, a.y + na.y * wa / 2); rb.lineTo(b.x + nb.x * wb / 2, b.y + nb.y * wb / 2);
        rb.lineTo(b.x - nb.x * wb / 2, b.y - nb.y * wb / 2); rb.lineTo(a.x - na.x * wa / 2, a.y - na.y * wa / 2);
        rb.closePath(); rb.fill();
        rb.beginPath(); rb.arc(b.x, b.y, wb / 2, 0, Math.PI * 2); rb.fill();
        a = b; wa = wb; na = nb;
      }
      c.save(); c.globalCompositeOperation = "multiply";
      c.drawImage(risoBuf, 0, 0, bw, bh, x0 + offs[L].x, y0 + offs[L].y, bw / R, bh / R);
      c.restore();
    }
  }

  function drawGrad(c, st, wob) {
    const N = st.pts.length;
    const q = wob && wob.pose, t = wob ? wob.t : 0;
    const sx = q ? q.sx : 1, sy = q ? q.sy : 1, rip = q ? q.rip : 0, ax = q ? q.ax : 0, ay = q ? q.ay : 0, dy = q ? q.dy : 0;
    const P = i => {
      const p = st.pts[i], n = st.n[i] || st.n[1] || { x: 0, y: 1 };
      const r = rip ? rip * Math.sin(st.len[i] / 34 - t * 22) : 0;
      return q ? { x: ax + (p.x - ax) * sx + n.x * r, y: ay + (p.y - ay) * sy + n.y * r + dy } : p;
    };
    const ws = (sx + sy) / 2 * (st.finish === "grainy" ? 0.8 : 1);
    if (st.finish === "riso") { drawRiso(c, st, P, ws); return; }
    let a = P(0), wa = st.w[0] * ws, na = st.n[0] || st.n[1] || { x: 0, y: 1 };
    c.fillStyle = st.col[0]; c.beginPath(); c.arc(a.x, a.y, wa / 2, 0, Math.PI * 2); c.fill();
    for (let i = 1; i < N; i++) {
      const b = P(i), wb = st.w[i] * ws, nb = st.n[i];
      c.fillStyle = st.col[i];
      c.beginPath();
      c.moveTo(a.x + na.x * wa / 2, a.y + na.y * wa / 2); c.lineTo(b.x + nb.x * wb / 2, b.y + nb.y * wb / 2);
      c.lineTo(b.x - nb.x * wb / 2, b.y - nb.y * wb / 2); c.lineTo(a.x - na.x * wa / 2, a.y - na.y * wa / 2);
      c.closePath(); c.fill();
      c.beginPath(); c.arc(b.x, b.y, wb / 2, 0, Math.PI * 2); c.fill();
      a = b; wa = wb; na = nb;
    }
    if (st.specks.length) {
      const wf = (sx + sy) / 2 / 2;
      let pi = -1, A, B, n, w;
      for (const k of st.specks) {
        if (k.i !== pi) { pi = k.i; A = P(k.i - 1); B = P(k.i); n = st.n[k.i]; w = st.w[k.i] * wf; }
        const x = A.x + (B.x - A.x) * k.a + n.x * k.o * w, y = A.y + (B.y - A.y) * k.a + n.y * k.o * w;
        c.globalAlpha = k.al; c.fillStyle = k.paper ? "#FAF8F4" : st.col[k.i];
        c.fillRect(x - k.z / 2, y - k.z / 2, k.z, k.z);
      }
      c.globalAlpha = 1;
    }
  }

  function poseAt(w) {
    const t = w.t, k = w.k, bx = (w.x0 + w.x1) / 2;
    if (w.kind === "wobble") {
      const e = Math.exp(-t * 4.2), a = 0.17 * e * Math.sin(t * 16);
      return { ax: w.c.x, ay: w.c.y, sx: 1 + a, sy: 1 - a * 0.9, dy: 0, rip: 6 * e * k, h: 0 };
    }
    const H = Math.min(190, Math.max(70, (w.y1 - w.y0) * 0.7));
    const ground = { ax: bx, ay: w.y1 };                          // squash from the bottom of the shape
    if (t < 0.14) {                                                // crouch
      const u = Math.sin(Math.PI / 2 * t / 0.14);
      return { ...ground, sx: 1 + 0.13 * u, sy: 1 - 0.16 * u, dy: 0, rip: 0, h: 0 };
    }
    if (t < 0.66) {                                                // in the air
      const u = (t - 0.14) / 0.52, h = 4 * u * (1 - u), st = 0.12 * Math.abs(1 - 2 * u);
      return { ...ground, sx: 1 - st * 0.7, sy: 1 + st, dy: -H * h, rip: 2 * k * (1 - h), h };
    }
    const tt = t - 0.66, e = Math.exp(-tt * 5), a = 0.22 * e * Math.cos(tt * 17);   // land and wobble
    return { ...ground, sx: 1 + a, sy: 1 - a, dy: 0, rip: 6 * e * k, h: 0 };
  }

  function updateGradients(dt) {
    if (pending.length && pending.every(st => st.done)) {
      pendingT += dt;
      if (pendingT > 0.45) {
        // everything drawn in quick succession wobbles together, around its shared centre
        let sx = 0, sy = 0, n = 0, x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const st of pending) for (const p of st.pts) { sx += p.x; sy += p.y; n++; x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
        const size = Math.max(x1 - x0, y1 - y0);
        wobble = { kind: S.lift, strokes: pending, t: 0, c: { x: sx / n, y: sy / n }, k: Math.min(1.4, Math.max(0.4, size / 300)), x0, x1, y0, y1 };
        wobble.pose = poseAt(wobble);
        pending = [];
      }
    }
    if (wobble) {
      wobble.t += dt; wobble.pose = poseAt(wobble);
      if (wobble.t > (wobble.kind === "jump" ? 1.5 : 1.1)) { wobble.strokes.forEach(bakeGrad); wobble = null; }
    }
  }

  function drawGradLive(c, t) {
    for (const st of pending) drawGrad(c, st, null);
    if (wobble) for (const st of wobble.strokes) drawGrad(c, st, wobble);
    if (reduced) return;
    if (S.light === "shine") {
      // a faint highlight along one side of the fresh line, fading within a moment of being drawn
      for (const st of pending) {
        const N = st.pts.length;
        for (let i = N - 1; i >= 1; i--) {
          const age = clock - st.tm[i]; if (age > 0.9) break;
          const al = 0.3 * Math.exp(-age / 0.3) * Math.min(1, (clock - st.tm[0]) * 4);
          const a = st.pts[i - 1], b = st.pts[i], na = st.n[i - 1] || st.n[i], nb = st.n[i];
          const sa = (na.x + na.y) < 0 ? 1 : -1, sb = (nb.x + nb.y) < 0 ? 1 : -1;
          const oa = st.w[i - 1] * 0.2 * sa, ob = st.w[i] * 0.2 * sb, ha = st.w[i - 1] * 0.09, hb = st.w[i] * 0.09;
          c.globalAlpha = al; c.fillStyle = "#fff";
          c.beginPath();
          c.moveTo(a.x + na.x * (oa + ha), a.y + na.y * (oa + ha)); c.lineTo(b.x + nb.x * (ob + hb), b.y + nb.y * (ob + hb));
          c.lineTo(b.x + nb.x * (ob - hb), b.y + nb.y * (ob - hb)); c.lineTo(a.x + na.x * (oa - ha), a.y + na.y * (oa - ha));
          c.closePath(); c.fill();
        }
      }
      c.globalAlpha = 1;
      return;
    }
    if (S.light !== "shimmer") return;
    // a soft band of light travels along each finished gradient line
    for (const st of gradStrokes) {
      const N = st.pts.length; if (N < 2) continue;
      const L = st.len[N - 1], band = 70, at = ((t * 400 + st.phase) % (L + 600)) - 300;
      if (at < -band || at > L + band) continue;
      for (let i = 1; i < N; i++) {
        const mid = (st.len[i - 1] + st.len[i]) / 2, off = Math.abs(mid - at);
        if (off > band) { if (mid > at) break; continue; }
        if (st.gone && (st.gone[i] || st.gone[i - 1])) continue;
        const al = Math.pow(1 - off / band, 1.6) * 0.55;
        const a = st.pts[i - 1], b = st.pts[i], na = st.n[i - 1] || st.n[i], nb = st.n[i];
        const wa = st.w[i - 1] * 0.42, wb = st.w[i] * 0.42;
        c.globalAlpha = al; c.fillStyle = "#fff";
        c.beginPath();
        c.moveTo(a.x + na.x * wa, a.y + na.y * wa); c.lineTo(b.x + nb.x * wb, b.y + nb.y * wb);
        c.lineTo(b.x - nb.x * wb, b.y - nb.y * wb); c.lineTo(a.x - na.x * wa, a.y - na.y * wa);
        c.closePath(); c.fill();
      }
      c.globalAlpha = 1;
    }
  }

  /* ---- spray: time-based paint into its own buffer, so the whole shape can jump as one image ---- */
  const SPRAYS = {
    dreamy:  ["#5B5BF0", "#4E8EEA", "#B79CE8", "#FF86C8", "#FFB3A7", "#FFD98C"],
    sherbet: ["#FFE11A", "#FFC857", "#FFB0A0", "#FF94BE", "#F56CCB"],
    // Fiona's colours (9 Nov), laid out like Dreamy, stop for stop, so the mix and rhythm match:
    // indigo → her blue → lilac (between her blue and pink) → her pink → coral-peach (between pink and gold) → her gold
    candy:   ["#5B64EF", "#5B8BEF", "#B888F6", "#FF83FE", "#FFA59A", "#FFC800"],
    night:   ["#0E2A48", "#123A5E", "#1A4C74", "#255F82", "#3C8090"],   // the header's sky: deep navy to a hint of teal
    // from the gradient pencil (Fiona liked these)
    aurora: ["#3FD8C2", "#3FA3EE", "#7B6CF0", "#E27BD0"],
    sunset: ["#FFB36B", "#FF7A8A", "#C86BD8", "#6C6FE0"],
    ocean:  ["#9BE7F0", "#3FB7D8", "#2C7FC4", "#243F9E"],
  };
  const SPRAY_RGB = Object.fromEntries(Object.entries(SPRAYS).map(([k, v]) => [k, v.map(hexRgb)]));
  // Dreamy with an adjustable balance: the same gradient re-sampled so the stroke lingers longer in the blues (−) or the pinks and peach (+)
  function setDreamyMix(v) {
    const base = SPRAY_RGB.dreamy, n = base.length - 1, g = Math.pow(2, -v * 1.3);
    const old = SPRAYS.dreamyMix || [];
    const hex = Array.from({ length: base.length }, (_, k) => {
      const t = n * Math.pow(k / n, g), i = Math.min(n - 1, Math.floor(t)), f = t - i, a = base[i], b = base[i + 1];
      return "#" + [0, 1, 2].map(j => Math.round(a[j] + (b[j] - a[j]) * f).toString(16).padStart(2, "0")).join("").toUpperCase();
    });
    for (const h of old) if (!hex.includes(h) && !SPRAYS.dreamy.includes(h)) delete dither[h];   // free grain tiles no longer used
    SPRAYS.dreamyMix = hex; SPRAY_RGB.dreamyMix = hex.map(hexRgb);
  }
  function sprayRGB(st, x) {
    const n = st.length - 1; let t = x % (2 * n); if (t < 0) t += 2 * n; if (t > n) t = 2 * n - t;
    const i = Math.min(n - 1, Math.floor(t)), f = t - i, a = st[i], b = st[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }
  // position along the palette -> which two colours, and how far between them
  function palPos(n, x) { let t = x % (2 * n); if (t < 0) t += 2 * n; if (t > n) t = 2 * n - t; const i = Math.min(n - 1, Math.floor(t)); return { i, f: t - i }; }
  // pixel-grain dither tiles: at level k, that fraction of grains is this colour; the rest let the colour beneath show
  const DLEV = 16, dither = {};
  setDreamyMix(S.glitMix);
  function ditherTiles(hex) {
    if (dither[hex]) return dither[hex];
    const T = 128, rnd = mulberry(4242), [r, g, b] = hexRgb(hex), tiles = [null];
    const noise = Float32Array.from({ length: T * T }, rnd);
    for (let k = 1; k < DLEV; k++) {
      const c = document.createElement("canvas"); c.width = c.height = T;
      const x = c.getContext("2d"), img = x.createImageData(T, T), th = k / DLEV;
      for (let i = 0; i < T * T; i++) { img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = noise[i] < th ? 255 : 0; }
      x.putImageData(img, 0, 0);
      const pat = ink.createPattern(c, "repeat"); pat.setTransform(new DOMMatrix().scale(1.35));
      tiles.push(pat);
    }
    return (dither[hex] = tiles);
  }
  const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random() * 0.9999)) * Math.cos(6.2832 * Math.random());
  const sprayBuf = document.createElement("canvas"); let sctx = null;
  const SP = { pending: false, idle: 0, anim: null, box: null, core: null };
  function growBox(b, x, y, m) {
    if (!b) return { x0: x - m, y0: y - m, x1: x + m, y1: y + m };
    b.x0 = Math.min(b.x0, x - m); b.y0 = Math.min(b.y0, y - m); b.x1 = Math.max(b.x1, x + m); b.y1 = Math.max(b.y1, y + m); return b;
  }
  function boxPx(b) {
    const x0 = Math.max(0, Math.floor(b.x0)), y0 = Math.max(0, Math.floor(b.y0)), x1 = Math.min(BW, Math.ceil(b.x1)), y1 = Math.min(BH, Math.ceil(b.y1));
    return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
  }
  function bakeSpray() {
    if (SP.box) {
      const b = boxPx(SP.box);
      ink.drawImage(sprayBuf, b.x * R, b.y * R, b.w * R, b.h * R, b.x, b.y, b.w, b.h);
      sctx.clearRect(b.x, b.y, b.w, b.h);
    }
    SP.pending = false; SP.anim = null; SP.box = null; SP.core = null; SP.groups = [];
  }
  BR.spray = {
    id: "spray", step: 2,
    cfg: () => ({ pal: S.sprayPal, fin: S.sprayFinish, width: S.sprayWidth, lift: S.sprayLift }),
    begin(p) {
      if (SP.anim) bakeSpray();
      if (!sctx) { sprayBuf.width = Math.round(BW * R); sprayBuf.height = Math.round(BH * R); sctx = sprayBuf.getContext("2d"); sctx.setTransform(R, 0, 0, R, 0, 0); }
      this.len = 0; this.n = null; this.hwPrev = null; this.kCur = null;   // start at this stroke's own thickness, not the last one's
      const cfg = this.cfg();
      this.mode = cfg.width; this.k = this.mode === "even" ? 1 : 0.45;
      this.st = SPRAY_RGB[cfg.pal]; this.hex = SPRAYS[cfg.pal]; this.R0 = 34 * S.size; this.fin = cfg.fin;
      SP.pending = true; SP.idle = 0; SP.lift = cfg.lift; SP.brush = this.id;
      this.paint(p, p, 0);
    },
    // solid, opaque paint laid down by distance (not time), in small steps so fast strokes stay continuous
    move(p, prev, d) {
      // thickness, as on the gradient pencil: fat when slow / swelling along the line / even
      const k0 = this.k;
      let k1 = 1;
      if (this.mode === "speed") k1 = k0 + ((0.22 + 0.78 * Math.exp(-d / 11)) - k0) * 0.3;
      else if (this.mode === "swell") k1 = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((this.len + d) / 60));
      this.k = k1;
      const steps = Math.max(1, Math.ceil(d / (this.R0 * 0.2)));
      let a = prev;
      for (let k = 1; k <= steps; k++) {
        const b = { x: prev.x + (p.x - prev.x) * k / steps, y: prev.y + (p.y - prev.y) * k / steps };
        this.kCur = k0 + (k1 - k0) * k / steps;
        this.paint(a, b, d / steps); a = b;
      }
    },
    paint(a, b, d) {
      const R0 = this.R0 * (this.kCur || this.k), hw = R0 * (this.fin === "grainy" ? 0.52 : 0.62), c = sctx;
      const hwA = this.hwPrev || hw, ra = hwA / hw; this.hwPrev = hw;
      const n = d > 0.01 ? { x: -(b.y - a.y) / d, y: (b.x - a.x) / d } : (this.n || { x: 0, y: 1 });
      const na = this.n || n; this.n = n;
      const L = (this.len + d) / 150;
      const rgb = x => { const v = sprayRGB(this.st, x); return `rgb(${v[0] | 0},${v[1] | 0},${v[2] | 0})`; };
      if (this.fin === "smooth") {
        // soft feathered edge, tucked underneath what's already painted
        const m = sprayRGB(this.st, L).map(v => v | 0), hr = R0 * 1.05;
        const g = c.createRadialGradient(b.x, b.y, hw * 0.8, b.x, b.y, hr);
        g.addColorStop(0, `rgba(${m},.16)`); g.addColorStop(1, `rgba(${m},0)`);
        c.globalCompositeOperation = "destination-over"; c.fillStyle = g;
        c.fillRect(b.x - hr, b.y - hr, hr * 2, hr * 2);
        c.globalCompositeOperation = "source-over";
      }
      // opaque core, blending across its width as well as along it
      const lg = c.createLinearGradient(b.x - n.x * hw, b.y - n.y * hw, b.x + n.x * hw, b.y + n.y * hw);
      lg.addColorStop(0, rgb(L - 0.8)); lg.addColorStop(0.5, rgb(L)); lg.addColorStop(1, rgb(L + 0.8));
      c.fillStyle = lg;
      if (d > 0.01) {
        c.beginPath();
        c.moveTo(a.x + na.x * hwA, a.y + na.y * hwA); c.lineTo(b.x + n.x * hw, b.y + n.y * hw);
        c.lineTo(b.x - n.x * hw, b.y - n.y * hw); c.lineTo(a.x - na.x * hwA, a.y - na.y * hwA);
        c.closePath(); c.fill();
      }
      c.beginPath(); c.arc(b.x, b.y, hw, 0, Math.PI * 2);
      if (this.fin === "grainy") {
        // round ends: the same grain strips across the width as the stroke, so the start and end blend in
        if (d < hw * 0.6) this.capStrips(b, n, hw, L);   // slow: round ends would cover the thin strips, so they get strips too
        else {
          const { i, f } = palPos(this.hex.length - 1, L), lv = Math.round(f * DLEV);
          c.fillStyle = lv >= DLEV ? this.hex[i + 1] : this.hex[i]; c.fill();
          if (lv > 0 && lv < DLEV) { c.fillStyle = ditherTiles(this.hex[i + 1])[lv]; c.fill(); }
        }
      } else c.fill();

      if (this.fin === "grainy" && d > 0.01) {
        // replace the smooth blend with a pixel-grain one: strips across the width, each a pure colour
        // with grains of the next colour scattered in at the right density
        const K = 10, n = this.hex.length - 1, ext = 1;
        for (let sI = 0; sI < K; sI++) {
          const o0 = (-1 + 2 * sI / K) * hw * ext, o1 = (-1 + 2 * (sI + 1) / K) * hw * ext, om = (o0 + o1) / 2;
          const { i, f } = palPos(n, L + (om / hw) * 0.8);
          const lv = Math.round(f * DLEV);
          c.beginPath();
          c.moveTo(a.x + na.x * o0 * ra, a.y + na.y * o0 * ra); c.lineTo(b.x + n.x * o0, b.y + n.y * o0);
          c.lineTo(b.x + n.x * o1, b.y + n.y * o1); c.lineTo(a.x + na.x * o1 * ra, a.y + na.y * o1 * ra); c.closePath();
          c.fillStyle = lv >= DLEV ? this.hex[i + 1] : this.hex[i]; c.fill();
          if (lv > 0 && lv < DLEV) { c.fillStyle = ditherTiles(this.hex[i + 1])[lv]; c.fill(); }
        }
      }

      if (this.fin === "grainy") {
        // the edge dissolves: specks start just inside the solid edge, are densest there, then thin and fade outwards
        const zs = Math.sqrt(S.size), dd = Math.max(d, 0.6), k = R0 / 34;
        const edge = Math.round(95 * dd * k * (this.edgeK || 1)), paper = this.noPaper ? 0 : Math.round(9 * dd * k);
        for (let i = 0; i < edge; i++) {
          const t = Math.random(), bx = a.x + (b.x - a.x) * t, by = a.y + (b.y - a.y) * t;
          const far = Math.random() < 0.18;
          const rr = far ? hw * 0.9 + R0 * 0.75 * Math.abs(gauss()) : hw * 0.82 + R0 * 0.32 * Math.abs(gauss());
          const ang = Math.random() * 6.283, ox = Math.cos(ang) * rr, oy = Math.sin(ang) * rr;
          const side = Math.max(-1, Math.min(1, (ox * n.x + oy * n.y) / hw));
          const pp = palPos(this.st.length - 1, (this.len + d * t) / 150 + side * 0.8);
          const v = this.st[Math.random() < pp.f ? pp.i + 1 : pp.i];
          const out = Math.max(0, (rr - hw) / R0);                   // 0 at the solid edge, growing outwards
          const al = rand(0.45, 1) * Math.max(0.2, 1 - out * 1.3);
          const z = rand(0.7, 1.9) * zs * (out > 0.6 ? 0.8 : 1);
          c.fillStyle = `rgba(${v[0] | 0},${v[1] | 0},${v[2] | 0},${al.toFixed(2)})`;
          c.fillRect(bx + ox - z / 2, by + oy - z / 2, z, z);
        }
        for (let i = 0; i < paper; i++) {                             // flecks of paper inside
          const t = Math.random(), rr = hw * 0.85 * Math.sqrt(Math.random()), ang = Math.random() * 6.283, z = rand(0.7, 1.7) * zs;
          c.fillStyle = `rgba(250,248,244,${rand(0.3, 0.65).toFixed(2)})`;
          c.fillRect(a.x + (b.x - a.x) * t + Math.cos(ang) * rr - z / 2, a.y + (b.y - a.y) * t + Math.sin(ang) * rr - z / 2, z, z);
        }
      }
      this.len += d;
      SP.core = growBox(SP.core, b.x, b.y, hw);
      SP.box = growBox(SP.box, b.x, b.y, R0 * 2.8);
    },
    capStrips(b, n, hw, L) {
      const c = sctx, K = 10, N = this.hex.length - 1, tx = n.y, ty = -n.x;
      c.save(); c.beginPath(); c.arc(b.x, b.y, hw, 0, Math.PI * 2); c.clip();
      for (let sI = 0; sI < K; sI++) {
        const o0 = (-1 + 2 * sI / K) * hw, o1 = (-1 + 2 * (sI + 1) / K) * hw, om = (o0 + o1) / 2;
        const { i, f } = palPos(N, L + (om / hw) * 0.8), lv = Math.round(f * DLEV);
        c.beginPath();
        c.moveTo(b.x + n.x * o0 - tx * hw, b.y + n.y * o0 - ty * hw); c.lineTo(b.x + n.x * o0 + tx * hw, b.y + n.y * o0 + ty * hw);
        c.lineTo(b.x + n.x * (o1 + 0.3) + tx * hw, b.y + n.y * (o1 + 0.3) + ty * hw); c.lineTo(b.x + n.x * (o1 + 0.3) - tx * hw, b.y + n.y * (o1 + 0.3) - ty * hw); c.closePath();
        c.fillStyle = lv >= DLEV ? this.hex[i + 1] : this.hex[i]; c.fill();
        if (lv > 0 && lv < DLEV) { c.fillStyle = ditherTiles(this.hex[i + 1])[lv]; c.fill(); }
      }
      c.restore();
    },
    end() { SP.idle = 0; if (SP.lift === "off" || reduced) bakeSpray(); },
  };
  // ---- Stars, night-sky style: the pencil lays down a band of the header's sky, with tiny round stars twinkling in it ----
  const NIGHT_TINTS = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFF3E0", "#E6F0FF", "#E2FCF3"];
  const nightStars = [];
  BR.nightsky = Object.assign(Object.create(BR.spray), {
    id: "stars", noPaper: true,
    cfg: () => ({ pal: "night", fin: "grainy", width: "swell", lift: "off" }),
    begin(p) { this.pend = []; this.acc = 0; BR.spray.begin.call(this, p); },
    paint(a, b, d) {
      const L0 = this.len;
      BR.spray.paint.call(this, a, b, d);
      if (d <= 0.01) return;
      const hw = this.R0 * (this.kCur || this.k) * 0.52, n = this.n;
      this.acc += d * hw * 2 * 0.0065;
      while (this.acc >= 1) {
        this.acc -= 1;
        const t = Math.random(), side = rand(-0.85, 0.85), u = Math.random();
        const x = a.x + (b.x - a.x) * t + n.x * side * hw, y = a.y + (b.y - a.y) * t + n.y * side * hw;
        const bg = sprayRGB(this.st, (L0 + d * t) / 150 + side * 0.8).map(v => v | 0);
        this.pend.push({ x, y, r: (0.45 + 1.9 * u * u * u) * Math.sqrt(S.size), col: pick(NIGHT_TINTS), bg: `rgb(${bg})`, born: clock });
      }
    },
    end() {
      BR.spray.end.call(this);       // lift is off, so the band is laid onto the paper now
      for (const st of this.pend) { stampNightStar(ink, st, 1); if (nightStars.length < 6000) nightStars.push(st); }
      this.pend = [];
    },
  });
  function stampNightStar(c, st, s) {
    if (st.r > 1.25) {               // the bigger ones carry a soft little halo, as in the header
      if (!ORBS) ORBS = makeOrbs();
      const d = st.r * 7 * s; c.save(); c.globalAlpha = 0.4; c.drawImage(ORBS[0], st.x - d / 2, st.y - d / 2, d, d); c.restore();
    }
    c.beginPath(); c.arc(st.x, st.y, st.r * s, 0, Math.PI * 2); c.fillStyle = st.col; c.fill();
  }
  function drawNightPending(c) {
    const B = BR.nightsky;
    if (B.pend) for (const st of B.pend) stampNightStar(c, st, Math.min(1, (clock - st.born) / 0.25));   // stars come out just behind the pencil
    if (starComboPend) for (const q of starComboPend) blitDrawn(c, q.x, q.y, q.r, q.rot, q.v, q.col, 1);
  }
  // the header's twinkle: most dim and shrink back a little, the odd one brightens with a soft glow
  function drawNightTwinkle(c, p) {
    const m = 0.5 - 0.5 * Math.cos(2 * Math.PI * p.age / p.life);
    c.save();
    if (p.glow) {
      if (!ORBS) ORBS = makeOrbs();
      const d = p.r * (6 + 6 * m); c.globalAlpha = 0.55 * m; c.drawImage(ORBS[0], p.x - d / 2, p.y - d / 2, d, d);
      c.globalAlpha = 1; c.beginPath(); c.arc(p.x, p.y, p.r * (1 + 0.35 * m), 0, Math.PI * 2); c.fillStyle = p.col; c.fill();
    } else {
      c.globalAlpha = 0.7 * m; c.fillStyle = p.bg;
      c.beginPath(); c.arc(p.x, p.y, p.r + 0.5, 0, Math.PI * 2); c.fill();
    }
    c.restore();
  }
  const GLINT = ["#FFFFFF", "#FFFFFF", "#FFF4C2", "#F0D98C", "#E9C46A", "#FFD1EC", "#D8E6FF", "#C9F2EC"];
  const glitGroups = [];
  // soft 2D value noise, fixed to the paper: decides where glitter clumps
  const NZ = 64, nzGrid = (() => { const r = mulberry(909); return Float32Array.from({ length: NZ * NZ }, r); })();
  function clumpNoise(x, y) {
    const sm = t => t * t * (3 - 2 * t);
    const gx = x / S.glitClump, gy = y / S.glitClump, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = sm(gx - x0), fy = sm(gy - y0);
    const g = (i, j) => nzGrid[(((j % NZ) + NZ) % NZ) * NZ + (((i % NZ) + NZ) % NZ)];
    const a = g(x0, y0) * (1 - fx) + g(x0 + 1, y0) * fx, b = g(x0, y0 + 1) * (1 - fx) + g(x0 + 1, y0 + 1) * fx;
    return a * (1 - fy) + b * fy;
  }
  BR.glitter = Object.assign(Object.create(BR.spray), {
    id: "glitter",
    begin(p) {
      this.group = { flecks: [], L: 0, phase: rand(0, 4), rest: rand(2.2, 4), ptr: 0, lastAt: -1e9 };
      glitGroups.push(this.group);
      if (SP.anim) bakeSpray();
      (SP.groups = SP.groups || []).push(this.group);
      BR.spray.begin.call(this, p);
    },
    cfg: () => ({ pal: S.glitPal === "dreamy" ? "dreamyMix" : S.glitPal, fin: "grainy", width: S.glitWidth, lift: S.glitLift }),
    paint(a, b, d) {
      const clumpy = S.glitEdge === "dots";
      // how clumped the glitter is here (0 sparse … 1 dense), from a pattern fixed to the paper
      const C = S.glitContrast, cl = clumpy ? clumpNoise(b.x, b.y) : 0.5;
      const dens = clumpy ? Math.max(0.05, 1 + C * (0.2 + 2 * Math.pow(cl, 1.6) - 1)) * S.glitDensity : S.glitDensity;
      const kc = this.kCur;
      if (clumpy) { this.edgeK = Math.max(0.2, 1 + C * 0.7 * (cl - 0.5)); this.kCur = (kc || this.k) * (0.92 + 0.16 * cl); }   // edge density and width waver with the clumps
      else this.edgeK = 1;
      BR.spray.paint.call(this, a, b, d);
      this.kCur = kc;
      const R0 = this.R0 * (this.kCur || this.k), hw = R0 * 0.52, zs = Math.sqrt(S.size), c = sctx;
      const count = Math.round(Math.max(d, 0.8) * (S.glitAmount === "lots" ? 2.2 : 0.7) * (R0 / 34) * (clumpy ? 0.4 * S.glitDensity + 0.9 * dens : S.glitDensity) + Math.random() * 0.6);
      for (let i = 0; i < count; i++) {
        const t = Math.random(), bx = a.x + (b.x - a.x) * t, by = a.y + (b.y - a.y) * t;
        const rr = Math.random() < 0.8 ? hw * 1.05 * Math.sqrt(Math.random()) : hw + R0 * 0.5 * Math.abs(gauss());
        const ang = Math.random() * 6.283, f = { x: bx + Math.cos(ang) * rr, y: by + Math.sin(ang) * rr, col: pick(GLINT), L: this.len - d + d * t };
        if (this.group) { this.group.flecks.push(f); this.group.L = Math.max(this.group.L, f.L); }
        const z = rand(1.6, 3.8) * zs;
        c.save(); c.translate(f.x, f.y); c.rotate(rand(0, 6.3));
        c.fillStyle = f.col; c.fillRect(-z / 2, -z * 0.36, z, z * 0.72);
        if (Math.random() < 0.3) { c.fillStyle = "rgba(255,255,255,.9)"; c.fillRect(-z / 4, -z * 0.15, z / 2, z * 0.3); }
        c.restore();
        if (flecks.length < 12000) flecks.push(f); else flecks[(Math.random() * flecks.length) | 0] = f;
      }
      if (clumpy) {
        // clumpy glitter across the whole stroke: piles up in dense patches (centre and edge), a few strays in sparse ones
        const n = this.st.length - 1, dots = Math.round(Math.max(d, 0.8) * 1.5 * (R0 / 34) * dens + Math.random() * 0.5);
        const nx = -(b.y - a.y) / Math.max(d, 0.01), ny = (b.x - a.x) / Math.max(d, 0.01);
        for (let i = 0; i < dots; i++) {
          const t = Math.random(), bx = a.x + (b.x - a.x) * t, by = a.y + (b.y - a.y) * t;
          const inside = Math.random() < 0.45;
          const rr = inside ? hw * 0.95 * Math.sqrt(Math.random()) : hw * 0.8 + R0 * 0.5 * Math.abs(gauss()) * (Math.random() < 0.18 ? 2 : 1);
          const ang = Math.random() * 6.283, x = bx + Math.cos(ang) * rr, y = by + Math.sin(ang) * rr;
          const out = Math.max(0, (rr - hw) / R0), z = rand(0.9, 2.2) * zs * (1 - Math.min(0.5, out * 0.4));
          const side = Math.max(-1, Math.min(1, ((x - bx) * nx + (y - by) * ny) / hw));
          const pp = palPos(n, (this.len - d + d * t) / 150 + side * 0.8);
          let col;
          if (inside) {
            // inside the paint: metallic or the neighbouring paint colour, so the dots show against the stroke
            col = Math.random() < 0.55 ? pick(GLINT) : (v => `rgb(${v[0] | 0},${v[1] | 0},${v[2] | 0})`)(this.st[pp.f < 0.5 ? Math.min(n, pp.i + 1) : pp.i]);
          } else {
            col = Math.random() < 0.6 ? (v => `rgb(${v[0] | 0},${v[1] | 0},${v[2] | 0})`)(this.st[Math.random() < pp.f ? pp.i + 1 : pp.i]) : pick(GLINT);
          }
          c.globalAlpha = Math.max(0.45, 1 - out * 0.5);
          c.fillStyle = col; c.beginPath(); c.arc(x, y, z, 0, Math.PI * 2); c.fill();
          c.globalAlpha = 1;
          if (Math.random() < 0.35) {          // some of the loose glitter twinkles too
            const f = { x, y, col, L: this.len - d + d * t };
            if (this.group) this.group.flecks.push(f);
            if (flecks.length < 12000) flecks.push(f);
          }
        }
      }
      if (!reduced && d > 0) {
        this.fall = (this.fall || 0) + d;
        while (this.fall > 24 * S.size) {
          this.fall -= 24 * S.size;
          spawn({ kind: "fleck", x: b.x + rand(-8, 8), y: b.y, vx: rand(-30, 30), vy: rand(-20, 20), g: 220, rot: rand(0, 6.3), vr: rand(-4, 4), r: rand(1.4, 2.8) * zs, life: rand(0.6, 1), col: pick(GLINT.slice(2)) });
        }
      }
    },
  });

  // glitter shaken by the jump: a few flecks drop off at take-off; on landing some hop and resettle, and the glitter twinkles
  function glitterSettle(A, t0, t1) {
    const fl = (SP.groups || []).flatMap(g => g.flecks).filter(f => !f.gone);
    if (!fl.length) return;
    const gs = SIZES.glitter || 1, tint = () => (Math.random() * ORB_TINTS.length) | 0;
    if (t0 < 0.14 && t1 >= 0.14) {
      for (let i = 0; i < 10; i++) {
        const f = pick(fl);
        spawn({ kind: "fleck", x: f.x, y: f.y, vx: rand(-15, 15), vy: rand(0, 30), g: 320, rot: rand(0, 6.3), vr: rand(-5, 5), r: rand(1.3, 2.4) * Math.sqrt(gs), life: rand(0.6, 0.9), col: pick(GLINT.slice(2)) });
      }
    }
    if (t0 < 0.66 && t1 >= 0.66) {
      for (let i = 0; i < 22; i++) {
        const f = pick(fl);
        spawn({ kind: "fleck", x: f.x, y: f.y, vx: rand(-60, 60), vy: rand(-170, -70), g: 540, rot: rand(0, 6.3), vr: rand(-7, 7), r: rand(1.3, 2.6) * Math.sqrt(gs), life: rand(0.6, 0.95), col: pick(GLINT.slice(1)) });
      }
      for (let i = 0; i < 28; i++) {
        const f = pick(fl);
        spawn({ kind: "orb", x: f.x, y: f.y, vx: 0, vy: 0, r: rand(3.5, 7.5) * gs, life: rand(0.25, 0.45), tint: tint(), boost: 0.6 });
        P[P.length - 1].age = -rand(0, 0.55);        // staggered, so the twinkle ripples out as it settles
      }
    }
  }
  function updateSpray(dt) {
    if (SP.pending && !(stroking && S.brush === SP.brush)) {
      SP.idle += dt;
      if (SP.idle > 0.45 && SP.core) {
        if (SP.lift === "off" || reduced) { bakeSpray(); return; }
        const c = SP.core, size = Math.max(c.x1 - c.x0, c.y1 - c.y0);
        SP.anim = { kind: SP.lift, t: 0, x0: c.x0, x1: c.x1, y0: c.y0, y1: c.y1, c: { x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 }, k: Math.min(1.4, Math.max(0.4, size / 300)) };
        SP.pending = false;
      }
    }
    if (SP.anim) {
      const A = SP.anim, t0 = A.t; A.t += dt;
      if (SP.brush === "glitter" && A.kind === "jump" && S.glitSettle && !reduced) glitterSettle(A, t0, A.t);
      if (A.t > (A.kind === "jump" ? 1.5 : 1.1)) bakeSpray();
    }
  }
  function drawSprayLive(c) {
    if (!SP.box || (!SP.pending && !SP.anim)) return;
    const b = boxPx(SP.box);
    c.save();
    if (SP.anim) {
      const q = poseAt(SP.anim);
      c.translate(q.ax, q.ay + q.dy); c.scale(q.sx, q.sy); c.translate(-q.ax, -q.ay);
    }
    c.drawImage(sprayBuf, b.x * R, b.y * R, b.w * R, b.h * R, b.x, b.y, b.w, b.h);
    c.restore();
  }

  function dir(a, b) { const dx = b.x - a.x, dy = b.y - a.y, m = Math.hypot(dx, dy) || 1; return { x: dx / m, y: dy / m }; }
  function perp(v) { return { x: -v.y, y: v.x }; }

  // one quad per colour band between two points; normals are shared so quads tile without gaps
  function ribbonSeg(c, s, i, j, alpha, colour) {
    const bw = s.W / PASTEL.length, a = s.pts[i], b = s.pts[j], na = s.nrm[i], nb = s.nrm[j];
    if (colour) {
      const h = s.W / 2;
      c.beginPath();
      c.moveTo(a.x - na.x * h, a.y - na.y * h); c.lineTo(a.x + na.x * h, a.y + na.y * h);
      c.lineTo(b.x + nb.x * h, b.y + nb.y * h); c.lineTo(b.x - nb.x * h, b.y - nb.y * h); c.closePath();
      c.globalAlpha = alpha; c.fillStyle = colour; c.fill(); c.globalAlpha = 1;
      return;
    }
    for (let k = 0; k < PASTEL.length; k++) {
      const o0 = -s.W / 2 + k * bw, o1 = o0 + bw;
      c.beginPath();
      c.moveTo(a.x + na.x * o0, a.y + na.y * o0); c.lineTo(a.x + na.x * o1, a.y + na.y * o1);
      c.lineTo(b.x + nb.x * o1, b.y + nb.y * o1); c.lineTo(b.x + nb.x * o0, b.y + nb.y * o0); c.closePath();
      c.fillStyle = PASTEL[k]; c.fill();
      c.lineWidth = 0.8; c.strokeStyle = PASTEL[k]; c.stroke();
    }
  }

  // water: the darker edge goes underneath everything already there, so crossing streams merge into one body
  function waterSeg(s, a, b) {
    const c = waterCtx;
    c.lineCap = "round"; c.lineJoin = "round";
    c.globalCompositeOperation = "destination-over";
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x + 0.01, b.y);
    c.strokeStyle = "#5E9FD0"; c.lineWidth = s.W; c.stroke();
    c.globalCompositeOperation = "source-over";
    c.strokeStyle = "#8EC6EA"; c.lineWidth = s.W * 0.58; c.stroke();
  }

  function pointAt(s, d) {
    const L = s.len; let lo = 0, hi = L.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] < d) lo = m; else hi = m; }
    const a = s.pts[lo], b = s.pts[hi], span = (L[hi] - L[lo]) || 1, t = Math.min(1, Math.max(0, (d - L[lo]) / span));
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, ang: Math.atan2(b.y - a.y, b.x - a.x), i: t < 0.5 ? lo : hi };
  }

  /* ---------- ambient animation for things already on the paper ---------- */
  let twinkAcc = 0, glintAcc = 0, rainGlintAcc = 0, starGlintAcc = 0, nightTwAcc = 0, gradGlintAcc = 0;
  let approachT = 4;
  function bubbleApproach(dt) {
    if (!S.bubApproach || reduced) return;
    for (const q of P) {
      if (q.kind === "bubble" && q.approach && clock - q.approach.start >= q.approach.dur) {
        q.r *= 2.5; q.approach = null; q.life = q.age;          // pop, at its new size
      }
    }
    approachT -= dt;
    if (approachT > 0 || P.some(q => q.approach)) return;
    const big = P.filter(q => q.kind === "bubble" && q.life === Infinity && q.age > 2 && q.r >= 11 * (SIZES.bubbles || 1));
    if (!big.length) { approachT = 1.5; return; }
    pick(big).approach = { start: clock, dur: rand(2.4, 3.4) };
    approachT = rand(7, 13);                                     // rare: one every 7–13 s at most
  }
  function ambient(dt) {
    bubbleApproach(dt);
    if (reduced) return;
    if (flecks.length) {
      const gs = SIZES.glitter || 1, mode = S.glitSparkle, tint = () => (Math.random() * ORB_TINTS.length) | 0;
      // the soft glows from before (fewer of them when the other styles are on)
      glintAcc += dt * Math.min(16, 2 + flecks.length / 220) * (mode === "gentle" ? 1 : 0.35);
      while (glintAcc >= 1) {
        glintAcc -= 1;
        const f = pick(flecks);
        spawn({ kind: "orb", x: f.x, y: f.y, vx: 0, vy: 0, r: rand(7, 14) * gs, life: rand(0.35, 0.7), tint: tint() });
      }
      // twinkling: lots of tiny, quick catches of light, like real glitter
      if (mode === "twinkle" || mode === "both") {
        // strength 0 = the original subtle twinkle; 1 = about 2.5× as many, bigger, brighter and slightly longer
        const v = S.glitTwinkle;
        twinkAcc += dt * Math.min(48 + 70 * v, (6 + flecks.length / 70) * (1 + 1.5 * v));
        while (twinkAcc >= 1) {
          twinkAcc -= 1;
          const f = pick(flecks);
          spawn({ kind: "orb", x: f.x, y: f.y, vx: 0, vy: 0, r: rand(3, 6.5) * gs * (1 + 0.6 * v), life: rand(0.16, 0.36) + 0.12 * v, tint: tint(), boost: v });
        }
      }
      // catch the light: every few seconds a soft wave runs along each glitter stroke, lighting flecks as it passes
      if (mode === "wave" || mode === "both") {
        const speed = 520;
        for (const g of glitGroups) {
          if (!g.flecks.length) continue;
          const T = g.L / speed + g.rest, tc = (clock + g.phase) % T, at = tc * speed - 40;
          if (at < g.lastAt) g.ptr = 0;
          g.lastAt = at;
          while (g.ptr < g.flecks.length && g.flecks[g.ptr].L <= at) {
            const f = g.flecks[g.ptr++];
            if (f.gone || Math.random() > 0.5) continue;
            spawn({ kind: "orb", x: f.x, y: f.y, vx: 0, vy: 0, r: rand(3.5, 8) * gs, life: rand(0.28, 0.5), tint: tint() });
          }
        }
      }
    }
    if (nightStars.length) {
      nightTwAcc += dt * Math.min(24, 1 + nightStars.length / 10);
      while (nightTwAcc >= 1) {
        nightTwAcc -= 1;
        const st = pick(nightStars), glow = Math.random() < 0.15;
        spawn({ kind: "nighttw", x: st.x, y: st.y, vx: 0, vy: 0, r: st.r, col: st.col, bg: st.bg, glow, life: glow ? rand(1, 1.8) : rand(1.6, 3.2) });
      }
    }
    if (settled.length && S.starSparkle === "glitter") {
      // the glitter pencil's sparkle (Fiona, 10 Nov: "back to basics"): soft round glints in white, pale gold, pale blue,
      // mint and blush wink on and off across the stars; the stars themselves stay exactly as drawn.
      // Twinkle strength 100% ≈ the glitter's 30%; Twinkle amount scales how many.
      const v = 0.3 * S.starTwStr, gs = S.size;
      starGlintAcc += dt * Math.min(48 + 70 * v, (5 + settled.length / 5) * (1 + 1.5 * v)) * S.starTwAmt * 0.75;
      while (starGlintAcc >= 1) {
        starGlintAcc -= 1;
        const st = pick(settled), a = rand(0, 6.3), d = st.r * 0.45 * Math.sqrt(Math.random());
        spawn({ kind: "orb", x: st.x + Math.cos(a) * d, y: st.y + Math.sin(a) * d, vx: 0, vy: 0,
                r: rand(3, 6.5) * gs * (1 + 0.6 * v) * Math.min(1.3, Math.max(0.6, st.r / 9)), life: rand(0.16, 0.36) + 0.12 * v,
                tint: (Math.random() * ORB_TINTS.length) | 0, boost: Math.min(1, 0.65 * S.starTwStr) });
      }
    } else if (settled.length) {
      starGlintAcc += dt * Math.min(28, 1.5 + settled.length / 5) * S.starTwAmt;
      while (starGlintAcc >= 1) {
        starGlintAcc -= 1;
        // mostly glints, with the odd star fading back for a moment
        const st = pick(settled), glow = Math.random() < 0.85;
        spawn({ kind: "startw", x: st.x, y: st.y, vx: 0, vy: 0, r: st.r, col: st.col, rot: st.rot, v: st.v, glow, life: glow ? rand(0.7, 1.3) : rand(1.2, 2.2) });
      }
    }
    if (S.light === "shimmer" && gradStrokes.length) {
      gradGlintAcc += dt * Math.min(5, 0.6 * gradStrokes.length);
      while (gradGlintAcc >= 1) {
        gradGlintAcc -= 1;
        const st = pick(gradStrokes), i = (Math.random() * st.pts.length) | 0;
        if (st.gone && st.gone[i]) continue;
        spawn({ kind: "glint", x: st.pts[i].x, y: st.pts[i].y, vx: 0, vy: 0, rot: 0, r: Math.max(5, st.w[i] * 0.35), life: rand(0.4, 0.7), col: st.col[i] });
      }
    }
    const rs = rainbows.filter(s => s.done > 0);
    if (rs.length) {
      rainGlintAcc += dt * Math.min(6, 0.8 * rs.length);
      while (rainGlintAcc >= 1) {
        rainGlintAcc -= 1;
        const s = pick(rs), q = pointAt(s, rand(0, s.len[s.done])), o = rand(-0.4, 0.4) * s.W;
        if (s.gone && s.gone[q.i]) continue;
        spawn({ kind: "glint", x: q.x - Math.sin(q.ang) * o, y: q.y + Math.cos(q.ang) * o, vx: 0, vy: 0, rot: 0, r: rand(5, 9), life: rand(0.4, 0.7), col: pick(PASTEL) });
      }
    }
  }

  function drawShimmer(c, t) {
    for (const s of rainbows) {
      const n = s.done; if (n < 1) continue;
      const L = s.len[n], period = L + 700, band = 80;
      const at = ((t * 380 + s.phase) % period) - 350;
      for (let i = 0; i < n; i++) {
        const mid = (s.len[i] + s.len[i + 1]) / 2, off = Math.abs(mid - at);
        if (off > band || (s.gone && (s.gone[i] || s.gone[i + 1]))) continue;
        const a = Math.pow(1 - off / band, 1.6) * 0.62;
        ribbonSeg(c, s, i, i + 1, a, "#FFFFFF");
      }
    }
  }

  function drawWaves(c, t) {
    c.lineCap = "round"; c.lineJoin = "round";
    for (const s of waters) {
      const L = s.len[s.len.length - 1]; if (L < 20) continue;
      const k = s.W / 46, sp = 56 * k, drift = t * 34;
      c.lineWidth = 2.2 * k;
      for (let d = drift % sp; d < L; d += sp) {
        const id = Math.round((d - drift) / sp);
        const edge = Math.min(1, d / 30, (L - d) / 30);
        const a = (0.45 + 0.4 * Math.sin(t * 1.7 + id * 1.3)) * edge;
        if (a <= 0.02) continue;
        const q = pointAt(s, d);
        if (s.gone && s.gone[q.i]) continue;
        const lat = s.W * 0.22 * Math.sin(id * 2.1 + s.seed * 7) + Math.sin(t * 1.2 + id) * 2 * k;
        c.save();
        c.translate(q.x - Math.sin(q.ang) * lat, q.y + Math.cos(q.ang) * lat);
        c.rotate(q.ang);
        c.scale(k, k * (0.8 + 0.3 * Math.sin(t * 3 + id)));
        c.beginPath();
        c.moveTo(-10, 3); c.quadraticCurveTo(-5, -4, 1, -3.5); c.quadraticCurveTo(7, -2.5, 7.5, 1.5); c.quadraticCurveTo(5, 3.5, 3, 0.8);
        c.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`; c.stroke();
        c.restore();
      }
    }
  }

  /* ---------- pencil + pointer ---------- */
  const pencil = $("pencil"), pencilUse = $("pencilUse"), shadow = $("tipShadow"), hint = $("hint");
  const hx = () => (S.hand === "right" ? -1 : 1);
  const restPos = () => (S.hand === "right" ? { x: 1450, y: 1050 } : { x: 1610, y: 1050 });
  const restAngle = () => (S.hand === "right" ? 34 : -34);
  let target = restPos(), pos = restPos(), last = null;
  let inside = false, down = false, touch = false, stroking = false;
  let tilt = restAngle(), lift = 0, flip = 0;

  const toBoard = e => { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * BW, y: (e.clientY - r.top) / r.height * BH }; };
  stage.addEventListener("pointerenter", e => { if (e.pointerType !== "mouse" || auto) return; inside = true; target = toBoard(e); pos = { ...target }; stage.classList.add("on-paper"); });
  stage.addEventListener("pointerleave", () => { if (down || auto) return; inside = false; stage.classList.remove("on-paper"); });
  stage.addEventListener("pointerdown", e => {
    e.preventDefault(); stopAuto();
    if (!picked && !erasing) { toast("Pick a pencil from the box first"); nudgeBox(); return; }
    if (S.brush === "birds" || S.brush === "bubbles") audio();             // birdsong may only start after a press

    touch = e.pointerType !== "mouse";
    stage.setPointerCapture(e.pointerId);
    down = true; target = toBoard(e);
    if (touch || !inside) { inside = true; pos = { ...target }; }
    stage.classList.add("on-paper");
  });
  stage.addEventListener("pointermove", e => {
    if (auto || (e.pointerType !== "mouse" && !down)) return;
    target = toBoard(e);
    if (!inside) { inside = true; pos = { ...target }; stage.classList.add("on-paper"); }
  });
  const release = e => {
    // a quick tap that ended before the pencil drew a single frame: the birds pencil still sends a bird off from there
    if (down && picked && !stroking && !erasing && S.brush === "birds") { const b = BR.birds; b.begin({ ...target }); b.end(); }
    down = false;
    if (touch) { inside = false; touch = false; return; }
    const r = stage.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { inside = false; stage.classList.remove("on-paper"); }
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  /* ---------- demo autopilot ---------- */
  let auto = null;
  function demoStrokes() {
    const water = [], rain = [], glit = [], stars = [], bub = [];
    for (let x = 250; x <= 1480; x += 6) water.push({ x, y: 905 + 26 * Math.sin(x / 120) });
    for (let a = Math.PI * 1.02; a <= Math.PI * 1.98; a += 0.012) rain.push({ x: 864 + 520 * Math.cos(a), y: 700 + 430 * Math.sin(a) });
    for (let t = -0.4; t <= Math.PI * 2 + 0.6; t += 0.03) glit.push({ x: 1330 + 38 * t - 80 * Math.sin(t), y: 230 + 80 * Math.cos(t) });
    for (let x = 520; x <= 1200; x += 6) stars.push({ x, y: 560 - 70 * Math.sin((x - 520) / 680 * Math.PI) });
    for (let t = 0; t <= 1; t += 0.01) bub.push({ x: 230 + 60 * Math.sin(t * 9), y: 760 - 380 * t });
    const grad = [];
    for (let t = 0; t <= Math.PI * 2 + 0.001; t += 0.012) {
      const x = 16 * Math.pow(Math.sin(t), 3), y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      grad.push({ x: 380 + 9 * x, y: 235 - 9 * y });
    }
    const spray = [];
    for (let t = 0; t <= 1; t += 0.006) spray.push({ x: 700 + 520 * t, y: 150 + 38 * Math.sin(t * Math.PI * 2) - 20 * t });
    return [["water", water], ["rainbow", rain], ["glitter", glit], ["gradient", grad], ["spray", spray], ["stars", stars], ["bubbles", bub]];
  }
  const frame = () => new Promise(r => requestAnimationFrame(r));
  async function runDemo() {
    stopAuto();
    if (erasing) setEraser(false, true);
    const tok = auto = { pos: { ...pos }, down: false };
    inside = true;
    const keep = S.brush;
    for (const [brush, pts] of demoStrokes()) {
      if (auto !== tok) return;
      selectBrush(brush, true);
      // travel with the pencil lifted
      const from = { ...tok.pos }, to = pts[0], t0 = performance.now(), ms = 420;
      tok.down = false;
      while (auto === tok) {
        const t = Math.min(1, (performance.now() - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        tok.pos = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
        if (t === 1) break; await frame();
      }
      // draw along the points
      let dist = 0; const total = pts.length - 1, speed = 1150, t1 = performance.now();
      tok.down = true;
      const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
      let i = 0, tPrev = t1;
      while (auto === tok) {
        const nowT = performance.now(), step = (nowT - tPrev) / 1000 * speed; tPrev = nowT;
        // the gradient pencil speeds up and slows down so its thickness changes
        dist += brush === "gradient" || brush === "spray" || brush === "glitter" ? step * (0.12 + 1.1 * Math.pow(Math.sin(Math.PI * dist / cum[total] * 2), 2)) : step;
        while (i < total && cum[i + 1] < dist) i++;
        if (i >= total) { tok.pos = { ...pts[total] }; break; }
        const f = (dist - cum[i]) / (cum[i + 1] - cum[i]);
        tok.pos = { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f };
        await frame();
      }
      await frame(); tok.down = false; await frame();
    }
    if (auto === tok) { auto = null; inside = false; selectBrush(keep === "rainbow" ? "rainbow" : keep, true); }
  }
  function stopAuto() { if (auto) { auto = null; inside = false; } }

  function drawInstantly() {
    // reduced motion: lay the demo down without animation
    for (const [brush, pts] of demoStrokes()) {
      if (brush === "stars" || brush === "bubbles") continue;
      const b = BR[brush]; b.begin(pts[0]);
      for (let i = 1; i < pts.length; i++) b.move(pts[i], pts[i - 1], Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
      b.end();
    }
  }

  /* ---------- main loop ---------- */
  const r1 = n => Math.round(n * 10) / 10;
  let running = true, lastT = performance.now(), clock = 0;
  const fpsHist = [];
  let fpsFrames = 0, fpsT = performance.now();

  function tick(now) {
    try { tickBody(now); } catch (err) { console.error(err); }   // never let one bad frame stop the page
    if (running) requestAnimationFrame(tick);
  }
  function tickBody(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    const k = dt * 60;
    if (!reduced) clock += dt;
    const prev = { ...pos };

    let active, onPaper;
    if (auto) { pos = { ...auto.pos }; active = auto.down; onPaper = true; }
    else {
      onPaper = inside;
      const dest = onPaper ? target : restPos();
      const f = 1 - Math.pow(onPaper ? S.lag : 0.8, k);
      pos = { x: pos.x + (dest.x - pos.x) * f, y: pos.y + (dest.y - pos.y) * f };
      active = onPaper && down && (picked || erasing);
    }

    const brush = BR[S.brush];
    if (erasing && !auto) { eraseStep(active); active = false; }
    if (active && !stroking) { stroking = true; last = { ...pos }; brush.begin({ ...pos }); hint.classList.add("gone"); }
    else if (active) {
      const d = Math.hypot(pos.x - last.x, pos.y - last.y);
      if (d >= brush.step) { brush.move({ ...pos }, last, d); last = { ...pos }; }
    } else if (stroking) { stroking = false; brush.end(); if (!triedOne) { triedOne = true; setBoxTitle("Try another…"); } }
    if (active && stroking && brush.hold) brush.hold({ ...pos }, dt);

    if (onPaper) {
      for (const q of P) {
        if (q.kind === "bubble" && q.life === Infinity && q.age > 1.2 && Math.hypot(q.x - pos.x, q.y - pos.y) < q.r * 1.1) { q.life = q.age; q.byPencil = true; }
      }
    }
    stepParticles(dt);
    updateGradients(dt);
    updateSpray(dt);
    ambient(dt);

    live.clearRect(0, 0, BW, BH);
    drawWaves(live, clock);
    drawShimmer(live, clock);
    drawGradLive(live, clock);
    drawSprayLive(live);
    drawNightPending(live);
    drawBlooms(live, dt);
    if (BR.flowers) BR.flowers.drawTail(live);
    for (const p of P) if (!p.approach) DRAW[p.kind](live, p);
    for (const p of P) if (p.approach) DRAW[p.kind](live, p);

    const vx = (pos.x - prev.x) / (k || 1);
    const want = onPaper ? Math.max(-20, Math.min(20, -vx * 0.8)) * 0.6 : restAngle();
    tilt += (want - tilt) * (1 - Math.pow(0.86, k));
    lift += ((onPaper ? (active || (erasing && down) ? 0 : 1) : 0) - lift) * (1 - Math.pow(0.7, k));
    const sc = 1.3 * (1 - 0.035 * (onPaper ? 1 - lift : 0));
    // flip: the pencil spins half a turn so the eraser end meets the paper
    flip += ((erasing ? 1 : 0) - flip) * (1 - Math.pow(0.8, k));
    const fe = flip < 0.001 ? 0 : flip > 0.999 ? 1 : flip * flip * (3 - 2 * flip);
    const ax = TIP.x + (ERASER_END.x - TIP.x) * fe, ay = TIP.y + (ERASER_END.y - TIP.y) * fe;
    const hop = Math.sin(Math.PI * fe) * 22;          // it lifts a little while turning
    pencil.setAttribute("transform",
      `translate(${r1(pos.x - hx() * 9 * lift * 1.3)} ${r1(pos.y - 13 * lift * 1.3 - hop)}) rotate(${(tilt + 180 * fe).toFixed(2)}) scale(${(hx() * sc).toFixed(3)} ${sc.toFixed(3)}) translate(${-ax} ${-ay})`);
    shadow.setAttribute("cx", r1(pos.x)); shadow.setAttribute("cy", r1(pos.y));
    shadow.setAttribute("opacity", onPaper ? (lift * 0.16).toFixed(3) : 0);

    fpsFrames++;
    if (now - fpsT >= 500) {
      const fps = Math.round(fpsFrames * 1000 / (now - fpsT)); fpsFrames = 0; fpsT = now;
      const el = $("fps"); el.textContent = fps + " fps"; el.className = fps >= 50 ? "" : fps >= 35 ? "warn" : "bad";
      fpsHist.push(fps); if (fpsHist.length > 16) fpsHist.shift();      // last ~8 s
      const low = Math.min(...fpsHist), badge = $("fpsBadge");
      badge.textContent = `${fps} fps · low ${low}`;
      badge.className = "fps-badge" + (low >= 50 ? "" : low >= 35 ? " warn" : " bad");
      $("count").textContent = P.length; $("flecks").textContent = flecks.length.toLocaleString();
    }
  }

  // pause everything while the paper is off screen
  new IntersectionObserver(([e]) => {
    const was = running; running = e.isIntersecting;
    if (running && !was) { lastT = performance.now(); fpsT = lastT; fpsFrames = 0; requestAnimationFrame(tick); }
    if (!running) $("fps").textContent = "paused";
  }).observe(stage);

  /* ---------- pencil box ---------- */
  const slots = $("slots");
  BRUSHES.forEach((b, i) => {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "slot"; btn.id = "slot-" + b.id; btn.dataset.brush = b.id;
    btn.innerHTML =
      `<svg viewBox="0 0 40 170" aria-hidden="true"><g transform="translate(20 86) rotate(-135) translate(-54.5 -53.5)"><use href="#pencilArt" width="109" height="107" style="--body:${b.body}"/></g></svg>` +
      `<span class="name">${b.name}</span><span class="key">${i + 1}</span>`;
    btn.setAttribute("aria-label", `${b.name} pencil: ${b.note}`);
    btn.addEventListener("click", () => { stopAuto(); if (erasing) setEraser(false, true); selectBrush(b.id); });
    slots.append(btn);
  });

  const cap = w => w[0].toUpperCase() + w.slice(1);
  const bodyOf = id => id === "gradient" ? `url(#g${cap(S.grad)})` : id === "spray" ? `url(#g${cap(S.sprayPal)})` : byId[id].body;
  function syncOpts() {
    let any = false;
    document.querySelectorAll("#opts [data-for]").forEach(el => {
      const show = el.dataset.for === S.brush; el.hidden = !show; any = any || show;
    });
    document.querySelector('#opts [data-for="none"]').hidden = any;
    const mark = (id, v) => document.querySelectorAll(`#${id} button`).forEach(b => b.setAttribute("aria-pressed", b.dataset.v === v));
    mark("starsSeg", S.stars); mark("starStyleSeg", S.starStyle); mark("starShapesSeg", S.starShapes); mark("starSparkleSeg", S.starSparkle); mark("bubStyleSeg", S.bubStyle); mark("bubPalSeg", S.bubPal); mark("birdModeSeg", S.birdMode); mark("birdTypeSeg", S.birdType); mark("birdSongSeg", S.birdSong ? "on" : "off"); mark("birdColSeg", S.birdCol);
    for (const id of ["flowerGap", "flowerScale", "flowerSpeed", "flowerWind", "flowerVary", "flowerGrain", "flowerWobble"]) { $(id).value = Math.round(S[id] * 100); $(id + "Out").textContent = Math.round(S[id] * 100) + "%"; }
    mark("bubSoundSeg", S.bubSound ? "on" : "off"); $("bubSoundVol").value = Math.round(S.bubSoundVol * 100); $("bubSoundVolOut").textContent = Math.round(S.bubSoundVol * 100) + "%";
    $("birdSongVol").value = Math.round(S.birdSongVol * 100); $("birdSongVolOut").textContent = Math.round(S.birdSongVol * 100) + "%";
    for (const id of ["birdCount", "birdDist", "birdSpeed", "birdFlock", "birdFlap", "birdGrain"]) { $(id).value = Math.round(S[id] * 100); $(id + "Out").textContent = Math.round(S[id] * 100) + "%"; }
    for (const id of ["starDensity", "starPatch", "starSpread", "starTiny", "starBig", "starTwAmt", "starTwStr", "starGrain"]) { $(id).value = Math.round(S[id] * 100); $(id + "Out").textContent = Math.round(S[id] * 100) + "%"; } mark("starPalSeg", S.starPal); mark("bubblesSeg", S.bubbles);
    for (const [id, key] of [["bubMixSeg", "bubMix"], ["bubWobbleSeg", "bubWobble"], ["bubGrainSeg", "bubGrain"], ["bubOverlapSeg", "bubOverlap"], ["bubStarHiSeg", "bubStarHi"]]) mark(id, S[key] ? "on" : "off");
    for (const [id, key] of [["bubColour", "bubColour"], ["bubEdge", "bubEdge"], ["bubShine", "bubShine"], ["bubShift", "bubShift"], ["bubGlint", "bubGlint"], ["bubWarm", "bubWarm"], ["bubGrainAmt", "bubGrainAmt"]]) {
      $(id).value = Math.round(S[key] * 100); $(id + "Out").textContent = Math.round(S[key] * 100) + "%";
    } mark("gradSeg", S.grad); mark("widthSeg", S.gradWidth);
    mark("finishSeg", S.finish);
    mark("sprayPalSeg", S.sprayPal); mark("sprayFinSeg", S.sprayFinish); mark("sprayLiftSeg", S.sprayLift); mark("sprayWidthSeg", S.sprayWidth);
    mark("glitPalSeg", S.glitPal); mark("glitSettleSeg", S.glitSettle ? "on" : "off");
    $("glitDensity").value = Math.round(S.glitDensity * 100); $("glitDensityOut").textContent = Math.round(S.glitDensity * 100) + "%"; mark("glitEdgeSeg", S.glitEdge);
    $("glitMix").value = Math.round(S.glitMix * 100); $("glitMixOut").textContent = S.glitMix === 0 ? "even" : (S.glitMix < 0 ? "bluer " : "pinker ") + Math.abs(Math.round(S.glitMix * 100)) + "%";
    $("glitTwinkle").value = Math.round(S.glitTwinkle * 100); $("glitTwinkleOut").textContent = Math.round(S.glitTwinkle * 100) + "%"; mark("glitSparkSeg", S.glitSparkle); mark("glitAmtSeg", S.glitAmount); mark("glitWidthSeg", S.glitWidth); mark("glitLiftSeg", S.glitLift);
    const sUse = document.querySelector("#slot-spray use"); if (sUse) sUse.style.setProperty("--body", bodyOf("spray"));
    if (S.brush === "spray") pencilUse.style.setProperty("--body", bodyOf("spray")); mark("lightSeg", S.light); mark("wobSeg", S.lift);
    $("optsLbl").textContent = `${byId[S.brush].name} pencil`;
    const gUse = document.querySelector("#slot-gradient use"); if (gUse) gUse.style.setProperty("--body", bodyOf("gradient"));
    if (S.brush === "gradient") pencilUse.style.setProperty("--body", bodyOf("gradient"));
  }
  [["starShapesSeg", "starShapes"], ["starSparkleSeg", "starSparkle"], ["bubStyleSeg", "bubStyle"], ["bubPalSeg", "bubPal"], ["birdTypeSeg", "birdType"], ["birdModeSeg", "birdMode"], ["birdColSeg", "birdCol"], ["starsSeg", "stars"], ["starStyleSeg", "starStyle"], ["starPalSeg", "starPal"], ["bubblesSeg", "bubbles"], ["gradSeg", "grad"], ["widthSeg", "gradWidth"], ["wobSeg", "lift"], ["finishSeg", "finish"], ["lightSeg", "light"], ["sprayPalSeg", "sprayPal"], ["sprayFinSeg", "sprayFinish"], ["sprayLiftSeg", "sprayLift"], ["sprayWidthSeg", "sprayWidth"], ["glitPalSeg", "glitPal"], ["glitAmtSeg", "glitAmount"], ["glitWidthSeg", "glitWidth"], ["glitLiftSeg", "glitLift"], ["glitSparkSeg", "glitSparkle"], ["glitEdgeSeg", "glitEdge"]].forEach(([id, key]) =>
    $(id).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; S[key] = b.dataset.v; if (key === "bubPal" && BUBBLE_SPRITES) makeBubbleSprites(); syncOpts(); }));
  [].forEach(([id, key]) =>
    $(id).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; S[key] = b.dataset.v === "on"; syncOpts(); }));

  $("glitDensity").addEventListener("input", e => { S.glitDensity = e.target.value / 100; syncOpts(); });
  $("glitSettleSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; S.glitSettle = b.dataset.v === "on"; syncOpts(); });
  for (const [id, key] of [["bubMixSeg", "bubMix"], ["bubWobbleSeg", "bubWobble"], ["bubGrainSeg", "bubGrain"], ["bubOverlapSeg", "bubOverlap"], ["bubStarHiSeg", "bubStarHi"]])
    $(id).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; S[key] = b.dataset.v === "on"; syncOpts(); });
  for (const id of ["bubColour", "bubEdge", "bubShine", "bubShift", "bubGlint"]) $(id).addEventListener("input", e => { S[id] = e.target.value / 100; syncOpts(); });
  let warmRAF = 0;    // warmth changes the pre-drawn bubbles, so rebuild them (once per frame at most)
  $("bubGrainAmt").addEventListener("input", e => { S.bubGrainAmt = e.target.value / 100; syncOpts();
    if (!warmRAF) warmRAF = requestAnimationFrame(() => { warmRAF = 0; if (BUBBLE_SPRITES) makeBubbleSprites(); }); });
  $("bubWarm").addEventListener("input", e => { S.bubWarm = e.target.value / 100; syncOpts();
    if (!warmRAF) warmRAF = requestAnimationFrame(() => { warmRAF = 0; if (BUBBLE_SPRITES) makeBubbleSprites(); }); });
  $("glitTwinkle").addEventListener("input", e => { S.glitTwinkle = e.target.value / 100; syncOpts(); });
  for (const id of ["flowerGap", "flowerScale", "flowerSpeed", "flowerWind", "flowerVary", "flowerGrain", "flowerWobble"]) $(id).addEventListener("input", e => { S[id] = e.target.value / 100; syncOpts(); });
  $("birdSongSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; S.birdSong = b.dataset.v === "on"; if (S.birdSong) audio(); syncOpts(); });
  $("birdSongVol").addEventListener("input", e => { S.birdSongVol = e.target.value / 100; syncOpts(); });
  $("bubSoundSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; S.bubSound = b.dataset.v === "on"; if (S.bubSound) audio(); syncOpts(); });
  $("bubSoundVol").addEventListener("input", e => { S.bubSoundVol = e.target.value / 100; syncOpts(); });
  for (const id of ["birdCount", "birdDist", "birdSpeed", "birdFlock", "birdFlap", "birdGrain"]) $(id).addEventListener("input", e => { S[id] = e.target.value / 100; syncOpts(); });
  for (const id of ["starDensity", "starPatch", "starSpread", "starTiny", "starBig", "starTwAmt", "starTwStr", "starGrain"]) $(id).addEventListener("input", e => {
    S[id] = e.target.value / 100; syncOpts();
    if (id === "starGrain") for (const k in DRAWN) delete DRAWN[k];      // new stars use the new grain; stars already drawn keep theirs
  });
  $("glitMix").addEventListener("input", e => { S.glitMix = e.target.value / 100; setDreamyMix(S.glitMix); syncOpts(); });
  function selectBrush(id, quiet) {
    if ((id === "birds" || id === "bubbles") && !quiet) audio();       // picking the pencil is a tap: start the birdsong engine now, not mid-stroke
    if (stroking) { stroking = false; BR[S.brush].end(); }
    S.brush = id; picked = true; stage.classList.remove("unpicked");
    if (!erasing) hint.textContent = "Press and drag to draw";
    S.size = SIZES[id] || 1; if (typeof sync === "function") sync();
    document.querySelectorAll(".slot").forEach(s => s.setAttribute("aria-pressed", s.dataset.brush === id));
    pencilUse.style.setProperty("--body", bodyOf(id));
    syncOpts();
    $("boxNote").textContent = byId[id].name;
    if (!quiet) toast(`${byId[id].name} pencil`);
  }

  /* ---------- controls ---------- */
  function sync() {
    document.querySelectorAll("#handSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.hand === S.hand));
    $("size").value = S.size; $("sizeOut").textContent = S.size.toFixed(2) + "×";
    $("lag").value = Math.round(S.lag * 100); $("lagOut").textContent = Math.round(S.lag * 100) + "%";
  }
  $("handSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; S.hand = b.dataset.hand; sync(); });
  $("size").addEventListener("input", e => { S.size = +e.target.value; SIZES[S.brush] = S.size; sync(); });
  $("lag").addEventListener("input", e => { S.lag = e.target.value / 100; sync(); });
  function clearAll() {
    stopAuto(); if (stroking) { stroking = false; BR[S.brush].end(); }
    ink.clearRect(0, 0, BW, BH); waterCtx.clearRect(0, 0, BW, BH);
    rainbows.length = 0; waters.length = 0; flecks.length = 0; P.length = 0; settled.length = 0; nightStars.length = 0; blooms.length = 0; glitGroups.length = 0;
    gradStrokes.length = 0; pending = []; wobble = null;
    if (sctx) sctx.clearRect(0, 0, BW, BH); SP.pending = false; SP.anim = null; SP.box = null; SP.core = null;
  }

  function inPlace(arr, keep) { let j = 0; for (let i = 0; i < arr.length; i++) if (keep(arr[i])) arr[j++] = arr[i]; arr.length = j; }
  function settleAll() {
    if (stroking) { stroking = false; BR[S.brush].end(); }
    pending.forEach(bakeGrad); pending = [];
    if (wobble) { wobble.strokes.forEach(bakeGrad); wobble = null; }
    if (SP.pending || SP.anim) bakeSpray();
  }
  // erase a round-ended band from a to b: pixels, plus any sparkle/shimmer/wave/bubble living there
  function eraseSeg(a, b, r) {
    for (const c of [ink, waterCtx]) {
      c.save(); c.globalCompositeOperation = "destination-out"; c.lineCap = "round";
      c.strokeStyle = "rgba(0,0,0,.45)"; c.lineWidth = r * 2 + 6;
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x + 0.01, b.y); c.stroke();
      c.strokeStyle = "#000"; c.lineWidth = r * 2;
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x + 0.01, b.y); c.stroke();
      c.restore();
    }
    const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy || 1;
    const hit = p => { const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L2)); return Math.hypot(p.x - a.x - dx * t, p.y - a.y - dy * t) < r; };
    const keep = o => !hit(o);
    inPlace(flecks, o => { const k = keep(o); if (!k) o.gone = true; return k; }); inPlace(settled, keep); inPlace(nightStars, keep); inPlace(blooms, keep); inPlace(P, q => q.kind === "crumb" || keep(q));
    for (const list of [rainbows, waters, gradStrokes]) {
      for (const st of list) {
        if (!st.gone || st.gone.length < st.pts.length) { const g = new Uint8Array(st.pts.length); if (st.gone) g.set(st.gone); st.gone = g; }
        st.pts.forEach((p, i) => { if (hit(p)) st.gone[i] = 1; });
      }
      inPlace(list, st => st.gone.some(v => !v));
    }
  }

  /* ---------- eraser ---------- */
  let erasing = false, erLast = null, crumbAcc = 0;
  const CRUMBS = ["#E8B4B8", "#DDA0A8", "#EFC6C4", "#CFC6C2"];
  function setEraser(on, quiet) {
    if (on === erasing) return;
    stopAuto(); settleAll();
    erasing = on; erLast = null;
    $("eraserBtn").setAttribute("aria-pressed", on);
    $("eraserBtn").firstChild.textContent = on ? "Back to pencil " : "Flip to eraser ";
    hint.textContent = on ? "Rub to erase" : picked ? "Press and drag to draw" : "Pick a pencil from the box";
    if (on) { $("boxNote").textContent = "Eraser: rub out anything on the paper. Crumbs included."; if (!quiet) toast("Eraser"); }
    else if (picked) selectBrush(S.brush, quiet);
    else $("boxNote").textContent = "Pick a pencil";
  }
  function eraseStep(active) {
    if (!active) { erLast = null; return; }
    const r = 22 * S.size, p = { ...pos };
    if (!erLast) { settleAll(); eraseSeg(p, p, r); erLast = p; return; }
    const d = Math.hypot(p.x - erLast.x, p.y - erLast.y);
    if (d < 1.5) return;
    eraseSeg(erLast, p, r);
    if (!reduced) {
      crumbAcc += d;
      while (crumbAcc > 26) {
        crumbAcc -= 26;
        const ux = (p.x - erLast.x) / d, uy = (p.y - erLast.y) / d;
        spawn({ kind: "crumb", x: p.x + rand(-r, r) * 0.6, y: p.y + rand(-r, r) * 0.6, vx: -ux * rand(20, 90) + rand(-40, 40), vy: -uy * rand(20, 90) - rand(10, 60),
          g: 380, rot: rand(0, 6.3), vr: rand(-6, 6), r: rand(1.6, 3.2) * Math.sqrt(S.size), life: rand(0.7, 1.2), col: pick(CRUMBS) });
      }
    }
    erLast = p;
  }
  DRAW.crumb = (c, p) => {
    const k = p.age / p.life;
    c.save(); c.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3; c.translate(p.x, p.y); c.rotate(p.rot);
    c.fillStyle = p.col; c.beginPath(); c.ellipse(0, 0, p.r * 1.5, p.r * 0.8, 0, 0, Math.PI * 2); c.fill();
    c.restore();
  };
  $("eraserBtn").addEventListener("click", () => setEraser(!erasing));

  /* ---------- tear off the page ---------- */
  let tearing = false;
  function tearPage() {
    if (tearing) return;
    stopAuto(); settleAll();
    if (triedOne) { triedOne = false; setBoxTitle("Try one out…"); }   // a fresh page: back to the first invitation
    if (reduced) { clearAll(); toast("New page"); return; }
    tearing = true;
    const rc = stage.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    const snap = document.createElement("canvas");
    snap.width = Math.round(rc.width * dpr); snap.height = Math.round(rc.height * dpr);
    const sc = snap.getContext("2d");
    sc.fillStyle = "#FAF8F4"; sc.fillRect(0, 0, snap.width, snap.height);
    for (const id of ["waterCanvas", "inkCanvas", "liveCanvas"]) sc.drawImage($(id), 0, 0, snap.width, snap.height);

    // a ragged tear line along the top, shared by the flying sheet and the stub left behind
    const pts = []; let y = 2.2;
    for (let x = 0; x <= 100.01; x += 1.6) { y = Math.max(1.2, Math.min(3.1, y + rand(-0.45, 0.45))); pts.push([x, y]); }
    const sheet = document.createElement("div"); sheet.className = "sheet";
    const noise = stage.querySelector("svg").cloneNode(true); noise.removeAttribute("id");
    sheet.append(noise, snap);
    sheet.style.clipPath = `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(",")}, 100% 100%, 0% 100%)`;
    const stub = document.createElement("div"); stub.className = "stub";
    stub.style.clipPath = `polygon(0% 0%, 100% 0%, ${pts.slice().reverse().map(([x, y]) => `${x}% ${y / 3.2 * 100}%`).join(",")})`;
    const cursorEl = $("cursor");
    stage.insertBefore(sheet, cursorEl); stage.insertBefore(stub, cursorEl);

    clearAll();                              // the fresh page is already underneath

    const side = Math.random() < 0.5 ? -1 : 1;
    sheet.style.transformOrigin = side < 0 ? "0% 0%" : "100% 0%";
    const anim = sheet.animate([
      { transform: "translate(0,0) rotate(0deg)" },
      { transform: `translate(0, 1.4%) rotate(${side * -0.6}deg)`, offset: 0.16, easing: "cubic-bezier(.5,0,.8,.4)" },
      { transform: `translate(${side * 4}%, -18%) rotate(${side * 7}deg)`, offset: 0.45 },
      { transform: `translate(${side * 14}%, -125%) rotate(${side * 16}deg)` },
    ], { duration: 950, easing: "cubic-bezier(.3,0,.6,1)", fill: "forwards" });
    anim.onfinish = () => { sheet.remove(); tearing = false; };
    requestAnimationFrame(() => stub.classList.add("fade"));
    setTimeout(() => stub.remove(), 3200);
  }
  $("clear").addEventListener("click", tearPage);
  $("demoBtn").addEventListener("click", () => { if (reduced) { drawInstantly(); return; } runDemo(); });
  document.addEventListener("keydown", e => {
    if (e.target.matches("input")) return;
    if (e.key === "e" || e.key === "E") { setEraser(!erasing); return; }
    const n = +e.key; if (n >= 1 && n <= BRUSHES.length) { stopAuto(); if (erasing) setEraser(false, true); selectBrush(BRUSHES[n - 1].id); }
  });

  // box layout preview: along the bottom, or down the side with the pencils pointing at the paper
  function setLayout(v) {
    const side = v === "side";
    $("desk").classList.toggle("side", side);
    document.querySelectorAll("#layoutSeg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === v));
    const flat = side && matchMedia("(min-width: 700px)").matches;
    document.querySelectorAll(".slot svg").forEach(svg => {
      svg.setAttribute("viewBox", flat ? "0 0 170 40" : "0 0 40 170");
      svg.firstElementChild.setAttribute("transform", flat ? "translate(86 20) rotate(-45) translate(-54.5 -53.5)" : "translate(20 86) rotate(-135) translate(-54.5 -53.5)");
    });
  }
  $("layoutSeg").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setLayout(b.dataset.v); });
  matchMedia("(min-width: 700px)").addEventListener("change", () => setLayout($("desk").classList.contains("side") ? "side" : "bottom"));

  // the box's invitation: "Try one out…" until the first line is drawn, then "Try another…" (soft fade between them)
  function setBoxTitle(t) {
    const el = $("boxTitle"); el.classList.add("swap");
    setTimeout(() => { el.textContent = t; el.classList.remove("swap"); }, reduced ? 0 : 400);
  }

  let toastTimer;
  function toast(msg) { $("toast").textContent = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $("toast").textContent = ""; }, 1800); }

  sync();
  pencilUse.style.setProperty("--body", bodyOf(S.brush)); syncOpts();
  $("boxNote").textContent = "Pick a pencil";
  // tapping the paper before choosing: the pencils give a little hop to show where to look
  function nudgeBox() {
    document.querySelectorAll(".slot").forEach((s, i) => {
      s.classList.remove("nudge"); void s.offsetWidth;
      s.style.setProperty("--d", i * 60 + "ms"); s.classList.add("nudge");
    });
  }
  requestAnimationFrame(t => { lastT = t; tick(t); });

  /* ---------- warm-up (Fiona's phone test, 10 Nov): build every pencil's pieces in small steps while the page is
     idle, so the first stroke with each pencil doesn't stutter while they're made ---------- */
  const idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 1500 }) : f => setTimeout(f, 60);
  const warm = [
    () => { if (!ORBS) ORBS = makeOrbs(); },
    () => { if (!BUBBLE_SPRITES) makeBubbleSprites(); },
    () => { if (!BUBBLE_SHINE) makeBubbleSprites(); },
    ...(SPRAYS.candy || []).map(h => () => ditherTiles(h)),
    ...(SPRAYS.dreamyMix || []).map(h => () => ditherTiles(h)),
    ...STAR_COLS[S.starPal].map(h => () => {
      for (let v = 100; v < 100 + FIONA_STARS.length; v++) { drawnSprite(v, h); drawnSprite(v, lighten(h, 0.35)); }
    }),
    () => { for (let v = 100; v < 100 + FIONA_STARS.length; v++) drawnSprite(v, "#FAF8F4", true); },
    ...["#336FED", "#345089", "#FD1BED", "#FFC800"].map(h => () => flowerGrain(h)),
    () => { for (let hz = 0; hz <= 0.6; hz += 0.05) for (const f of SW.fills) speckle(birdColour(f, Math.round(hz * 20) / 20), S.birdGrain); },
    () => { for (let v = 8; v < 11; v++) if (!FIONA_STAR_PATHS[100 + v]) FIONA_STAR_PATHS[100 + v] = new Path2D(FIONA_STARS[v].d); },
  ];
  const warmNext = () => { const f = warm.shift(); if (!f) return; try { f(); } catch (e) { console.warn(e); } idle(warmNext); };
  setTimeout(() => idle(warmNext), 1200);
  // sound on/off for the bubble pops and the birdsong
  $("soundBtn").addEventListener("click", () => {
    const on = !(S.birdSong || S.bubSound);
    S.birdSong = S.bubSound = on; if (on) audio();
    $("soundBtn").textContent = on ? "Sound on" : "Sound off"; $("soundBtn").setAttribute("aria-pressed", on);
  });

  // Site addition: change the paper's shape while nothing is drawn (the tin page calls this when the window changes)
  return {
    reshape(w, h) {
      BW = w; BH = h;
      R = Math.max(1, Math.min(2, (devicePixelRatio || 1) * stage.clientWidth / BW));
      setup($("waterCanvas")); setup($("inkCanvas")); setup($("liveCanvas"));
      if (sctx) { sprayBuf.width = Math.round(BW * R); sprayBuf.height = Math.round(BH * R); sctx.setTransform(R, 0, 0, R, 0, 0); }
    }
  };
};

  /* ---------- 3. the tin: open / close, sizes, round controls, download ---------- */
/* ======== the tin: open / close, sizes, round controls, download ======== */
(() => {
  const $ = id => document.getElementById(id);
  const tin = $('pbTin'), box = $('pbBox'), inner = $('pbInner'), lid = $('pbLid'), card = $('pbCard');
  const openBtn = $('pbOpen'), front = $('pbFront'), inside = $('pbInside');
  const RATIO = 1240 / 540, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let state = 'closed', anims = [], started = false;

  /* ---------- grain tile (as the postcard's) and the faint pencils on the band ---------- */
  (function textures() {
    const T = 160, c = document.createElement('canvas'); c.width = c.height = T;
    let s = 1717; const r = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const x = c.getContext('2d'), img = x.createImageData(T, T);
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.max(0, Math.min(255, 128 + (r() - .5) * 300)); img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    x.putImageData(img, 0, 0);
    const root = document.documentElement.style;
    root.setProperty('--pb-grain', `url(${c.toDataURL()})`);
    root.setProperty('--pb-grain-size', T / Math.min(2, devicePixelRatio || 1) + 'px');   // one grain = one screen pixel
    // the same grain, a third as strong: blended straight into the tin's blue and navy surfaces (≈ the lid's 0.3 overlay)
    const d2 = x.getImageData(0, 0, T, T);
    for (let i = 0; i < d2.data.length; i += 4) { const v = 128 + (d2.data[i] - 128) * .32; d2.data[i] = d2.data[i + 1] = d2.data[i + 2] = v; }
    x.putImageData(d2, 0, 0);
    root.setProperty('--pb-grain-soft', `url(${c.toDataURL()})`);
    const d = document.querySelector('#pencilArt path[style]').getAttribute('d');
    const spots = [[40, 60, 20], [250, 30, 110], [380, 190, 60], [120, 260, 160], [300, 360, 15], [30, 400, 95], [200, 150, 230]];
    const g = spots.map(([px, py, a]) => `<path d="${d}" transform="translate(${px} ${py}) rotate(${a + 45}) scale(.62) translate(-70 -23)"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="460" viewBox="0 0 460 460"><g fill="#B3415A" fill-opacity=".09">${g}</g></svg>`;
    card.style.setProperty('--pb-pattern', `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`);
  })();

  /* ---------- two ways to open: in place (desktop) or full screen (phones, decided at the first open) ---------- */
  const hinges = [...tin.querySelectorAll('.pb-hinge')];
  const fullEl = $('pbFull'), peek = $('pbPeek'), area = $('pbArea'), paper = $('pbPaper'), html = document.documentElement;
  document.body.append(fullEl);                       // above everything on the page, including the site's bar
  const wantsFull = () => matchMedia('(max-width: 699px), (max-height: 499px)').matches;
  let mode = null, full = false, board = null;
  // the inside (tray + paper) lives in the box (in place) or in the full-screen view
  function setMode(m) {
    if (m === mode) return;
    mode = m; tin.dataset.mode = m;
    if (m === 'full') { fullEl.append(inner); inner.hidden = false; peek.hidden = false; }
    else { box.append(inner); inner.hidden = state !== 'open'; peek.hidden = true; }
    fitPaper();
  }
  const decideMode = () => setMode(wantsFull() ? 'full' : 'inline');   // each time the tin opens

  /* ---------- sizes ---------- */
  const px = (el, p) => parseFloat(getComputedStyle(el)[p]) || 0;
  const gap = () => parseFloat(getComputedStyle(tin).getPropertyValue('--gap')) || 12;
  const HL = () => tin.clientWidth / RATIO;
  const boxH = hl => {                                // the open box's height (phones: the box stays the lid's size)
    if (mode === 'full') return hl;
    const was = box.style.height; box.style.height = 'auto'; const h = box.offsetHeight; box.style.height = was; return h;
  };
  function layout() {
    if (anims.length) return;
    const hl = HL(), g = gap();
    tin.style.setProperty('--hl', hl + 'px');
    if (state === 'open') {
      const hb = boxH(hl);
      box.style.height = mode === 'full' ? hl + 'px' : 'auto';
      tin.style.setProperty('--hb', hb + 'px'); tin.style.setProperty('--d', (hb - hl) + 'px');
      tin.style.height = hb + g + hl + 'px';
    } else { box.style.height = hl + 'px'; tin.style.height = hl + 'px'; }
  }
  function fitPaper() {                               // blank: reshape; drawn on: keep the shape, as big as fits
    if (!board) return;
    reshapeIfBlank();
    const ar = board.w / board.h, w = area.clientWidth;
    if (mode === 'full') { paper.style.width = Math.min(w, area.clientHeight * ar) + 'px'; return; }
    // in place: no taller than the box at the lid's height (matters only if it first opened full screen)
    const th = HL() - 2 * px(box, 'paddingTop') - px(inner, 'paddingTop') - px(inner, 'paddingBottom');
    paper.style.width = th * ar < w - 1 ? th * ar + 'px' : '';
  }
  new ResizeObserver(layout).observe(tin);
  new ResizeObserver(layout).observe(inner);
  new ResizeObserver(fitPaper).observe(area);

  /* ---------- the drawing engine wakes on the first open, at the paper's shape ---------- */
  // the paper's shape for the current view: fills the box (in place) or the space below the tray (full screen)
  function targetBoard() {
    if (mode === 'full') {
      // artboard 1100 wide on phones so marks read larger; before the engine has built the tray,
      // stand-in pencils give it its real height while measuring
      const slots = $('slots'), empty = !slots.children.length;
      if (empty) slots.innerHTML = '<button class="slot" tabindex="-1" aria-hidden="true"><svg viewBox="0 0 40 170"></svg><span class="name">Flowers</span></button>'.repeat(5);
      const b = { w: 1100, h: Math.round(1100 * area.clientHeight / area.clientWidth) };
      if (empty) slots.innerHTML = '';
      return b;
    }
    const th = HL() - 2 * px(box, 'paddingTop') - px(inner, 'paddingTop') - px(inner, 'paddingBottom');
    return { w: 1728, h: Math.round(1728 * th / area.clientWidth) };
  }
  function applyBoard(b) {
    const st = $('stage');
    board = b;
    st.style.aspectRatio = `${b.w} / ${b.h}`;
    st.querySelectorAll('svg').forEach(s => s.setAttribute('viewBox', `0 0 ${b.w} ${b.h}`));
    st.querySelectorAll('#paperNoise, #paperNoise + rect, svg > rect').forEach(el => { el.setAttribute('width', b.w); el.setAttribute('height', b.h); });
  }
  function ensureEngine() {
    if (started) return; started = true;
    const b = targetBoard();
    applyBoard(b); fitPaper();
    api = window.startPencilBox(b.w, b.h);
    $('layoutSeg').querySelector('[data-v="side"]').click();   // Final Five's side tray (a row along the top on a phone held upright)
    watchEngine();
  }
  // While the paper is blank (before the first mark, or after tearing off the page) it reshapes to fit
  // the window; once something is drawn it keeps its shape (and is fitted, letterboxed, if the window changes).
  let api = null, drawn = false;
  function reshapeIfBlank() {
    if (!api || drawn || !area.clientWidth || !area.clientHeight && mode === 'full') return;
    const b = targetBoard();
    if (!(b.h > 0) || (b.w === board.w && Math.abs(b.h - board.h) < 4)) return;
    applyBoard(b); paper.style.width = '';
    api.reshape(b.w, b.h);
  }

  /* ---------- open and close the lid (the Section's movement, 1.25 s / 1.05 s) ---------- */
  const ease = { lift: 'cubic-bezier(.3,0,.3,1)', swing: 'cubic-bezier(.42,0,.22,1)', settle: 'cubic-bezier(.3,0,.4,1)' };
  const stopAnims = () => { anims.forEach(a => a.cancel()); anims = []; };
  function setOpen(open) {
    state = open ? 'open' : 'closed'; tin.dataset.state = state;
    inside.inert = !open; front.inert = open; openBtn.setAttribute('aria-expanded', open);
    if (!open && mode !== 'full') inner.hidden = true;
    $('pbMore').hidden = !(open && mode !== 'full');
    layout();
  }
  function open() {
    if (state !== 'closed') return;
    decideMode();
    if (mode === 'full') { peek.hidden = false; drawPeek(); } else { inner.hidden = false; ensureEngine(); }
    const hl = HL(), g = gap(), hb = boxH(hl);
    box.style.height = hl + 'px';
    tin.style.setProperty('--hb', hb + 'px'); tin.style.setProperty('--d', (hb - hl) + 'px');
    if (reduced) { setOpen(true); mode === 'full' ? enterFull() : afterOpen(); return; }
    state = 'opening'; tin.dataset.state = 'opening';
    const d = hb - hl, dur = mode === 'full' ? 900 : 1250, o = { duration: dur, fill: 'forwards' };   // phones: a quicker flip, then full screen
    lid.style.transition = 'none';
    const from = getComputedStyle(lid).transform;
    anims = [
      lid.animate([
        { transform: from === 'none' ? 'translateY(0px) rotateX(0deg)' : from, easing: ease.lift },
        { transform: 'translateY(0px) rotateX(-16deg)', offset: .14, easing: ease.swing },
        { transform: `translateY(${d}px) rotateX(-186deg)`, offset: .8, easing: ease.settle },
        { transform: `translateY(${d}px) rotateX(-180deg)` },
      ], o),
      ...hinges.map(h => h.animate([{ transform: 'translateY(0px)', easing: ease.lift }, { transform: 'translateY(0px)', offset: .14, easing: ease.swing }, { transform: `translateY(${d}px)`, offset: .8 }, { transform: `translateY(${d}px)` }], o)),
      tin.animate([{ height: hl + 'px' }, { height: hl + 'px', offset: .12, easing: ease.swing }, { height: hb + g + hl + 'px', offset: .82 }, { height: hb + g + hl + 'px' }], o),
      box.animate([{ height: hl + 'px' }, { height: hl + 'px', offset: .12, easing: ease.swing }, { height: hb + 'px', offset: .82 }, { height: hb + 'px' }], o),
      $('pbShadeFront').animate([{ opacity: 0 }, { opacity: 0, offset: .14 }, { opacity: .45, offset: .47 }, { opacity: .45 }], o),
      $('pbShadeInside').animate([{ opacity: .45 }, { opacity: .45, offset: .47 }, { opacity: 0, offset: .8 }, { opacity: 0 }], o),
    ];
    if (mode === 'full') {
      // phones: once the lid is down, the box grows to fill the screen
      setTimeout(() => { if (state === 'opening') enterFull(); }, dur * .86);
    } else {
      // keep the paper in view on a short screen
      const r = box.getBoundingClientRect(), want = Math.min(r.top + hb + 24 - innerHeight, r.top - 16);
      if (want > 0) setTimeout(() => scrollBy({ top: want, behavior: 'smooth' }), dur * .2);
    }
    anims[0].onfinish = () => {
      stopAnims(); setOpen(true);
      requestAnimationFrame(() => { lid.style.transition = ''; });
      if (mode !== 'full') afterOpen();
      if (closeWhenOpen) { closeWhenOpen = false; close(); }
    };
  }
  function afterOpen() {
    const s = document.querySelector('#slots .slot[aria-pressed="true"]') || document.querySelector('#slots .slot');
    s && s.focus({ preventScroll: true });
  }
  // closing: bring the front of the lid back into view (the closed tin keeps its top edge, so we know where it will
  // be). Only if it would end up partly off screen; then it settles with room for the site's bar above it, or centred.
  function showClosedTin(hl, smooth) {
    const top = tin.getBoundingClientRect().top, bar = 80, vh = innerHeight;
    if (top >= bar && top + hl <= vh - 16) return;
    const want = top - Math.max(bar, (vh - hl) / 2);
    scrollBy({ top: want, behavior: smooth ? 'smooth' : 'auto' });
  }
  function close() {
    if (state !== 'open' || full) return;
    const hl = HL(), g = gap(), hb = boxH(hl), d = hb - hl;
    showClosedTin(hl, !reduced);
    if (reduced) { setOpen(false); openBtn.focus({ preventScroll: true }); return; }
    state = 'closing'; tin.dataset.state = 'closing'; inside.inert = true; $('pbMore').hidden = true;
    const dur = mode === 'full' ? 800 : 1050, o = { duration: dur, fill: 'forwards' };
    lid.style.transition = 'none';
    anims = [
      lid.animate([
        { transform: `translateY(${d}px) rotateX(-180deg)`, easing: ease.swing },
        { transform: 'translateY(0px) rotateX(3deg)', offset: .82, easing: ease.settle },
        { transform: 'translateY(0px) rotateX(0deg)' },
      ], o),
      ...hinges.map(h => h.animate([{ transform: `translateY(${d}px)`, easing: ease.swing }, { transform: 'translateY(0px)', offset: .82 }, { transform: 'translateY(0px)' }], o)),
      tin.animate([{ height: hb + g + hl + 'px', easing: ease.swing }, { height: hl + 'px', offset: .82 }, { height: hl + 'px' }], o),
      box.animate([{ height: hb + 'px', easing: ease.swing }, { height: hl + 'px', offset: .82 }, { height: hl + 'px' }], o),
      $('pbShadeInside').animate([{ opacity: 0 }, { opacity: .45, offset: .42 }, { opacity: .45 }], o),
      $('pbShadeFront').animate([{ opacity: .45 }, { opacity: .45, offset: .42 }, { opacity: 0, offset: .82 }, { opacity: 0 }], o),
    ];
    anims[0].onfinish = () => {
      stopAnims(); setOpen(false);
      requestAnimationFrame(() => { lid.style.transition = ''; });
      openBtn.focus({ preventScroll: true });
    };
  }

  /* ---------- phones: full screen in, and back out to the open tin (lid down, author's note showing) ---------- */
  const boxClip = () => {
    const r = box.getBoundingClientRect(), rad = parseFloat(getComputedStyle(box).borderTopLeftRadius) || 16;
    return `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round ${rad}px)`;
  };
  function enterFull() {
    if (full) return; full = true;
    fullEl.hidden = false; html.classList.add('pb-locked');
    ensureEngine(); fitPaper();
    try { if (!(history.state && history.state.pbFull)) history.pushState({ pbFull: true }, ''); } catch (e) {}
    if (!reduced) {
      const o = { duration: 560, easing: 'cubic-bezier(.3,0,.2,1)' };
      fullEl.animate([{ clipPath: boxClip() }, { clipPath: 'inset(0px round 0px)' }], o);
      inner.animate([{ opacity: 0 }, { opacity: 0, offset: .35 }, { opacity: 1 }], o);
    }
    afterOpen();
  }
  let closeWhenOpen = false;
  let leaving = false;
  function exitFull() {
    if (!full || leaving) return;   // once only (the back gesture and its safety timer can both ask)
    leaving = true;
    drawPeek();
    const done = () => {
      full = false; leaving = false; fullEl.hidden = true; html.classList.remove('pb-locked');
      // straight on: the lid swings shut, then the author's note appears under the tin
      if (state === 'open') close(); else closeWhenOpen = true;
    };
    if (reduced) { done(); return; }
    const o = { duration: 440, easing: 'cubic-bezier(.4,0,.2,1)' };
    inner.animate([{ opacity: 1 }, { opacity: 0, offset: .5 }, { opacity: 0 }], o);
    fullEl.animate([{ clipPath: 'inset(0px round 0px)' }, { clipPath: boxClip() }], o).onfinish = done;
  }
  // the × and Esc go "back", so the phone's own back gesture does exactly the same
  function leaveFull() {
    if (!full) return;
    if (history.state && history.state.pbFull) {
      history.back();
      setTimeout(() => { if (full && !leaving) exitFull(); }, 450);   // in case the browser doesn't report it
    } else exitFull();
  }
  addEventListener('popstate', () => { if (full && !(history.state && history.state.pbFull)) exitFull(); });
  try { if (history.state && history.state.pbFull) history.replaceState(null, ''); } catch (e) {}

  // the peek: a small copy of the paper inside the box
  function drawPeek() {
    const c = $('pbPeekCanvas'), dpr = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(c.clientWidth * dpr), h = Math.round(c.clientHeight * dpr);
    if (!w || !h) return;
    c.width = w; c.height = h;
    const x = c.getContext('2d'); x.fillStyle = '#FAF8F4'; x.fillRect(0, 0, w, h);
    const src = ['waterCanvas', 'inkCanvas', 'liveCanvas'].map($);
    const sw = src[1].width, sh = src[1].height;
    if (!sw) return;
    const k = Math.max(w / sw, h / sh), dw = sw * k, dh = sh * k;   // fill, centred
    src.forEach(s => x.drawImage(s, (w - dw) / 2, (h - dh) / 2, dw, dh));
  }

  // the window changes size while the tin is open (a laptop window narrowed, a tablet turned): switch views
  matchMedia('(max-width: 699px), (max-height: 499px)').addEventListener('change', () => {
    if (state !== 'open' || anims.length || leaving) return;   // a closed tin decides when it next opens
    const want = wantsFull() ? 'full' : 'inline';
    if (want === mode) return;
    if (want === 'full') { setMode('full'); layout(); enterFull(); }
    else {
      full = false; fullEl.hidden = true; html.classList.remove('pb-locked');
      try { if (history.state && history.state.pbFull) history.replaceState(null, ''); } catch (e) {}
      setMode('inline'); inner.hidden = false; layout();
    }
  });

  openBtn.addEventListener('click', open);
  front.addEventListener('click', e => { if (!openBtn.contains(e.target)) open(); });
  $('pbFullClose').addEventListener('click', leaveFull);
  // anywhere on the open lid closes it (the flipped face doesn't always get the click itself, so listen on the lid)
  lid.addEventListener('click', () => { if (state === 'open') close(); });
  $('pbCloseLid').addEventListener('click', e => { e.stopPropagation(); close(); });
  $('pbCloseText').addEventListener('click', close);

  // keys: Esc steps back (full screen → open tin → closed); the engine's E and 1–5 only work while the paper is showing
  addEventListener('keydown', e => {
    const drawing = full || (mode === 'inline' && state === 'open');
    if (!drawing && /^[eE1-5]$/.test(e.key)) { e.stopImmediatePropagation(); return; }
    if (e.key === 'Escape') {
      if (full) { e.preventDefault(); leaveFull(); }
      else if (state === 'open') { e.preventDefault(); close(); }
    }
  }, true);

  /* ---------- round controls (they press the engine's own buttons, which stay hidden) ---------- */
  const controls = document.querySelector('.pb-controls'), stageEl = $('stage');
  controls.addEventListener('pointerenter', () => stageEl.classList.add('pb-over-controls'));
  stageEl.addEventListener('pointerenter', () => stageEl.classList.remove('pb-over-controls'));
  $('pbEraser').addEventListener('click', () => $('eraserBtn').click());
  $('pbTear').addEventListener('click', () => {
    $('clear').click();
    setTimeout(() => { drawn = false; fitPaper(); }, 1300);   // a fresh page can take the window's shape again
  });
  // the first mark (a pencil or the eraser on the paper) fixes the paper's shape
  stageEl.addEventListener('pointerdown', () => {
    if (document.querySelector('#slots .slot[aria-pressed="true"]') || $('eraserBtn').getAttribute('aria-pressed') === 'true') drawn = true;
  });
  // left / right hand: presses the engine's own Hand switch (it mirrors the pencil and its lean)
  const handNow = () => (document.querySelector('#handSeg button[aria-pressed="true"]') || {}).dataset?.hand || 'right';
  $('pbHand').addEventListener('click', () => {
    const next = handNow() === 'right' ? 'left' : 'right';
    $('handSeg').querySelector(`[data-hand="${next}"]`).click();
    say(next === 'left' ? 'Left hand' : 'Right hand');
  });
  $('pbSound').addEventListener('click', () => { $('soundBtn').click(); say($('soundBtn').getAttribute('aria-pressed') === 'true' ? 'Sound on' : 'Sound off'); });
  function watchEngine() {
    const mirror = () => {
      const er = $('eraserBtn').getAttribute('aria-pressed') === 'true', e = $('pbEraser');
      e.setAttribute('aria-pressed', er); e.setAttribute('aria-label', er ? 'Flip back to pencil' : 'Flip to eraser'); e.dataset.tip = er ? 'Back to pencil' : 'Flip to eraser'; e.classList.toggle('alt', er);
      const on = $('soundBtn').getAttribute('aria-pressed') === 'true', s = $('pbSound');
      s.setAttribute('aria-pressed', on); s.classList.toggle('alt', !on); s.setAttribute('aria-label', on ? 'Sound on. Turn sound off' : 'Sound off. Turn sound on'); s.dataset.tip = on ? 'Turn sound off' : 'Turn sound on';
      const left = handNow() === 'left', hb = $('pbHand');
      hb.classList.toggle('alt', left); hb.setAttribute('aria-pressed', left);
      hb.setAttribute('aria-label', left ? 'Left-handed. Switch to right hand' : 'Right-handed. Switch to left hand');
      hb.dataset.tip = left ? 'Switch to right hand' : 'Switch to left hand';
      
    };
    const mo = new MutationObserver(mirror);
    mo.observe($('eraserBtn'), { attributes: true, attributeFilter: ['aria-pressed'] });
    mo.observe($('soundBtn'), { attributes: true, attributeFilter: ['aria-pressed'] });
    mo.observe($('handSeg'), { attributes: true, subtree: true, attributeFilter: ['aria-pressed'] });
    mo.observe($('slots'), { attributes: true, subtree: true, attributeFilter: ['aria-pressed'] });
    mirror();
  }

  /* ---------- download: the paper as a PNG with a small credit (share sheet on phones) ---------- */
  let toastT = 0;
  const say = m => { const t = $('toast'); t.textContent = m; clearTimeout(toastT); toastT = setTimeout(() => { t.textContent = ''; }, 2400); };
  $('pbSave').addEventListener('click', async () => {
    const src = ['waterCanvas', 'inkCanvas', 'liveCanvas'].map($), W = src[1].width, H = src[1].height;
    if (!W) return;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#FAF8F4'; x.fillRect(0, 0, W, H);
    src.forEach(s => x.drawImage(s, 0, 0));
    const f = Math.round(Math.max(11, W * .011));
    x.font = `500 ${f}px Jost, system-ui, sans-serif`;
    if ('letterSpacing' in x) x.letterSpacing = (f * .12) + 'px';
    x.fillStyle = 'rgba(15, 45, 71, .55)'; x.textAlign = 'right'; x.textBaseline = 'bottom';
    x.fillText('FIONACOWIE.GITHUB.IO', W - f * 1.6, H - f * 1.3);
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    if (!blob) { say('Sorry, the drawing could not be saved'); return; }
    const file = new File([blob], 'pencil-box-drawing.png', { type: 'image/png' });
    try {
      if (matchMedia('(pointer: coarse)').matches && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Pencil Box' }); return;
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    say('Drawing saved');
  });

  /* ---------- a smooth first opening (Fiona, 13 Nov: in a new window the first flip was janky) ----------
     Two things were left until the moment the lid moved: starting the drawing engine (a long pause for the
     browser), and drawing the pressed-in relief inside the lid (heavy SVG filters, so the plain blue panel showed
     first and the detail arrived over it). Both now happen while the page is idle, before anyone opens the tin. */
  const whenIdle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 2000 }) : f => setTimeout(f, 200);

  // 1. the relief, drawn once into a picture (redrawn if the lid changes size); the live SVG stays as a fallback
  const reliefSvg = inside.querySelector('.pb-reverse');
  let reliefCanvas = null, reliefW = 0, reliefBusy = false;
  function bakeRelief() {
    const note = reliefSvg && reliefSvg.parentNode;
    if (!note || reliefBusy) return;
    const w = note.offsetWidth, h = note.offsetHeight, dpr = Math.min(2, devicePixelRatio || 1);
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (!w || !h || Math.abs(W - reliefW) < 2) return;
    reliefBusy = true;
    const defs = [...document.querySelectorAll('filter[id^="pbS-"]')].map(f => f.outerHTML).join('');
    const style = '.pb-s-plate{filter:url(#pbS-plate)}.pb-s-letters{filter:url(#pbS-letters)}.pb-s-dots{filter:url(#pbS-dots)}.pb-s-vine{filter:url(#pbS-vine)}.pb-join{display:none}';
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${reliefSvg.getAttribute('viewBox')}" fill="none"><style>${style}</style><defs>${defs}</defs>${reliefSvg.innerHTML}</svg>`;
    const img = new Image(), url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
    const done = ok => { URL.revokeObjectURL(url); reliefBusy = false; if (!ok && reliefCanvas) { reliefCanvas.remove(); reliefCanvas = null; reliefSvg.style.display = ''; } };
    img.onload = () => {
      try {
        const c = reliefCanvas || document.createElement('canvas');
        c.width = W; c.height = H; c.className = 'pb-reverse'; c.setAttribute('aria-hidden', 'true');
        c.getContext('2d').drawImage(img, 0, 0, W, H);
        if (!reliefCanvas) { reliefSvg.after(c); reliefCanvas = c; }
        reliefSvg.style.display = 'none'; reliefW = W; done(true);
      } catch (e) { done(false); }
    };
    img.onerror = () => done(false);
    img.src = url;
  }
  let reliefTimer = 0;
  new ResizeObserver(() => { clearTimeout(reliefTimer); reliefTimer = setTimeout(() => whenIdle(bakeRelief), 300); }).observe(inside);

  // 2. the engine, started behind the closed lid (desktop) once the card is about a screen away, then paused
  function warmUp() {
    if (reliefSvg) bakeRelief();
    if (started || state !== 'closed' || wantsFull()) return;
    decideMode();
    inner.hidden = false; ensureEngine(); layout();
    if (state === 'closed') inner.hidden = true;     // hidden again: the engine pauses until the tin opens
  }
  new IntersectionObserver((es, io) => {
    if (es.some(e => e.isIntersecting)) { io.disconnect(); whenIdle(warmUp); }
  }, { rootMargin: '100% 0px' }).observe(card);

  setOpen(false);
})();

})();
