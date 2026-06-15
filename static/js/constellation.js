// Cursor-reactive "constellation" background. Sparse drifting points joined by
// faint links; points near the cursor lean toward it and accent links brighten.
// Subtle, consistent site-wide. Colors track the theme via CSS custom properties;
// motion tracks a Full/Calm preference via the `data-motion` attribute (calm
// softens the cursor reach, pull, and drift). Both re-read on a MutationObserver.
(function () {
  var canvas = document.getElementById("constellation");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CFG = {
    maxDist: 110,
    cursor: 150,
    pull: 0.3,
    dotA: 0.16,
    lineA: 0.1,
    cursorA: 0.3,
    speed: 0.18,
  };
  var W = 0,
    H = 0,
    pts = [],
    raf = 0,
    running = false;
  var mouse = { x: -999, y: -999, on: false };
  var dot = "36,31,49",
    line = "26,95,180";

  function triplet(v) {
    v = (v || "").trim();
    if (v.charAt(0) === "#") {
      var h = v.slice(1);
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      var n = parseInt(h, 16);
      return ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
    }
    var m = v.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    return m ? m[1] + "," + m[2] + "," + m[3] : null;
  }
  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    dot = triplet(cs.getPropertyValue("--ink")) || dot;
    line = triplet(cs.getPropertyValue("--accent")) || line;
  }

  // Re-read colors AND opacity per theme. Dark ink on a light background reads
  // faint, so light mode gets more presence; dark mode keeps the lower alphas.
  function applyTheme() {
    readColors();
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    CFG.dotA = dark ? 0.16 : 0.34;
    CFG.lineA = dark ? 0.1 : 0.22;
    CFG.cursorA = dark ? 0.3 : 0.45;
    if (reduce && W) {
      ctx.clearRect(0, 0, W, H);
      dots();
    }
  }

  // Full vs. Calm motion (data-motion). Calm shrinks the cursor reach + pull and
  // slows the ambient drift — softer, not frozen. Existing velocities are rescaled
  // so points keep their positions on a live toggle.
  function applyMotion() {
    var calm = document.documentElement.getAttribute("data-motion") === "calm";
    var newSpeed = calm ? 0.08 : 0.18;
    var ratio = CFG.speed ? newSpeed / CFG.speed : 1;
    CFG.cursor = calm ? 52 : 150;
    CFG.pull = calm ? 0.08 : 0.3;
    CFG.speed = newSpeed;
    for (var i = 0; i < pts.length; i++) {
      pts[i].vx *= ratio;
      pts[i].vy *= ratio;
    }
  }

  function size() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(16, Math.min(70, Math.round((W * H) / 22000)));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * CFG.speed,
        vy: (Math.random() - 0.5) * CFG.speed,
      });
    }
  }

  function dots() {
    for (var j = 0; j < pts.length; j++) {
      ctx.fillStyle = "rgba(" + dot + "," + CFG.dotA + ")";
      ctx.beginPath();
      ctx.arc(pts[j].x, pts[j].y, 1.4, 0, 6.283);
      ctx.fill();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      if (mouse.on) {
        var dx = mouse.x - p.x,
          dy = mouse.y - p.y,
          d = Math.hypot(dx, dy);
        if (d < CFG.cursor && d > 0.01) {
          p.x += (dx / d) * CFG.pull;
          p.y += (dy / d) * CFG.pull;
        }
      }
    }
    for (var a = 0; a < pts.length; a++) {
      for (var b = a + 1; b < pts.length; b++) {
        var lx = pts[a].x - pts[b].x,
          ly = pts[a].y - pts[b].y,
          ld = Math.hypot(lx, ly);
        if (ld < CFG.maxDist) {
          ctx.strokeStyle =
            "rgba(" + line + "," + CFG.lineA * (1 - ld / CFG.maxDist) + ")";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
        }
      }
    }
    if (mouse.on) {
      for (var k = 0; k < pts.length; k++) {
        var cx = mouse.x - pts[k].x,
          cy = mouse.y - pts[k].y,
          cd = Math.hypot(cx, cy);
        if (cd < CFG.cursor) {
          ctx.strokeStyle =
            "rgba(" + line + "," + CFG.cursorA * (1 - cd / CFG.cursor) + ")";
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(pts[k].x, pts[k].y);
          ctx.stroke();
        }
      }
    }
    dots();
  }

  function loop() {
    draw();
    raf = requestAnimationFrame(loop);
  }
  function start() {
    if (!running) {
      running = true;
      loop();
    }
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  applyTheme();
  applyMotion();
  size();

  if (reduce) {
    ctx.clearRect(0, 0, W, H);
    dots();
  } else {
    start();
    window.addEventListener("pointermove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = true;
    });
    window.addEventListener("pointerout", function (e) {
      if (!e.relatedTarget) mouse.on = false;
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      size();
      if (reduce) {
        ctx.clearRect(0, 0, W, H);
        dots();
      }
    }, 200);
  });

  new MutationObserver(function () {
    applyTheme();
    applyMotion();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-motion"],
  });
})();
