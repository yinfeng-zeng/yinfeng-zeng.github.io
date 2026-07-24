/* ============================================================
   Personal site — generative + interactive. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ============================================================
     EDIT YOUR RESEARCH MAP HERE
     Each node: { id, label, text }.  edges connect ids.
     ============================================================ */
  var RESEARCH_NODES = [
    { id: "core",  label: "Factor Models" },
    { id: "rmt",   label: "Random Matrix Theory" },
    { id: "inter", label: "Interactive Effects" },
    { id: "score", label: "Score-driven Models" },
    { id: "miss",  label: "Missing Data Imputation" }
  ];
  var RESEARCH_EDGES = [
    ["core", "rmt"], ["core", "inter"], ["core", "score"], ["core", "miss"],
    ["rmt", "score"], ["inter", "miss"]
  ];

  /* ---------- Theme ---------- */
  var toggle = document.getElementById("themeToggle");
  var saved = null; try { saved = localStorage.getItem("theme"); } catch (e) {}
  root.setAttribute("data-theme", saved || "dark");
  toggle && toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Custom cursor ---------- */
  if (finePointer) {
    document.body.classList.add("cursor-on");
    var cur = document.getElementById("cursor");
    var curLabel = document.getElementById("cursorLabel");
    var cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });
    (function follow() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      if (cur) cur.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(follow);
    })();
    var hoverables = document.querySelectorAll("[data-cursor]");
    hoverables.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cur.classList.add("is-hover");
        cur.classList.toggle("is-big", el.hasAttribute("data-cursor-big"));
        if (curLabel) curLabel.textContent = el.getAttribute("data-cursor") || "";
      });
      el.addEventListener("mouseleave", function () {
        cur.classList.remove("is-hover", "is-big");
        if (curLabel) curLabel.textContent = "";
      });
    });
  }

  /* ---------- Nav / scroll ---------- */
  var nav = document.getElementById("nav");
  addEventListener("scroll", function () { nav.classList.toggle("is-scrolled", (scrollY || 0) > 12); }, { passive: true });

  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");
  burger && burger.addEventListener("click", function () { links.classList.toggle("is-open"); });
  links && links.addEventListener("click", function (e) { if (e.target.closest("a")) links.classList.remove("is-open"); });

  /* ---------- Scrollspy ---------- */
  var navLinks = [].slice.call(document.querySelectorAll(".nav__link"));
  var spySections = navLinks.map(function (l) { return document.querySelector(l.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window && spySections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          navLinks.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spySections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Live clock ---------- */
  var clockEl = document.getElementById("clock");
  if (clockEl) {
    var renderClock = function () {
      try {
        clockEl.textContent = "CAMBRIDGE · " + new Date().toLocaleTimeString("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" });
      } catch (e) { clockEl.textContent = "CAMBRIDGE"; }
    };
    renderClock(); setInterval(renderClock, 1000 * 20);
  }

  /* ---------- Split statement into words (kinetic) ---------- */
  var statement = document.querySelector(".kin-lines");
  if (statement && !reduceMotion) {
    var walk = function (node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) { // text
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (/^\s+$/.test(part) || part === "") { frag.appendChild(document.createTextNode(part)); }
            else { var s = document.createElement("span"); s.className = "word"; s.textContent = part; frag.appendChild(s); }
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    };
    walk(statement);
    var words = statement.querySelectorAll(".word");
    words.forEach(function (w, i) { w.style.transitionDelay = (i * 28) + "ms"; });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal, .kin, .kin-lines");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.18 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Marquee ---------- */
  var marqRow = document.getElementById("marqRow");
  if (marqRow && !reduceMotion) {
    marqRow.innerHTML += marqRow.innerHTML; // duplicate for seamless loop
    var mpos = 0, mhalf = 0, mpaused = false;
    marqRow.parentNode.addEventListener("mouseenter", function () { mpaused = true; });
    marqRow.parentNode.addEventListener("mouseleave", function () { mpaused = false; });
    var measure = function () { mhalf = marqRow.scrollWidth / 2; };
    setTimeout(measure, 300); addEventListener("resize", measure);
    (function marq() {
      if (!mpaused && mhalf) { mpos -= 0.6; if (-mpos >= mhalf) mpos = 0; marqRow.style.transform = "translateX(" + mpos + "px)"; }
      requestAnimationFrame(marq);
    })();
  }

  /* ---------- Publication filtering ---------- */
  var filterBar = document.getElementById("pubFilters");
  var pubs = document.querySelectorAll(".pub");
  filterBar && filterBar.addEventListener("click", function (e) {
    var btn = e.target.closest(".chip"); if (!btn) return;
    filterBar.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
    btn.classList.add("is-active");
    var f = btn.getAttribute("data-filter");
    pubs.forEach(function (p) { p.classList.toggle("is-hidden", !(f === "all" || p.getAttribute("data-type") === f)); });
  });

  /* ---------- Footer year ---------- */
  var yEl = document.getElementById("year"); if (yEl) yEl.textContent = new Date().getFullYear();

  /* ============================================================
     GENERATIVE FLOW-FIELD HERO
     ============================================================ */
  (function flowField() {
    var canvas = document.getElementById("flow");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    var W, H, DPR, particles = [], running = true, mx = -9999, my = -9999;
    var hero = document.getElementById("hero");

    function accentRGB() {
      // read accent color for lines
      var c = getComputedStyle(root).getPropertyValue("--accent").trim() || "#ff4a1c";
      return c;
    }
    var lineColor = accentRGB();

    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var count = Math.min(900, Math.floor((W * H) / 1500));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({ x: Math.random() * W, y: Math.random() * H, px: 0, py: 0 });
      }
      lineColor = accentRGB();
      // paint background once
      ctx.fillStyle = getComputedStyle(root).getPropertyValue("--bg").trim() || "#0a0a0b";
      ctx.fillRect(0, 0, W, H);
    }

    function field(x, y, t) {
      // cheap pseudo-flow using layered sines
      return (Math.sin(x * 0.0026 + t) + Math.cos(y * 0.0031 - t * 0.8) + Math.sin((x + y) * 0.0015 + t * 0.5)) * 1.4;
    }

    var t = 0;
    function step() {
      if (!running) return;
      t += 0.0016;
      // fade toward bg for trails
      var bg = getComputedStyle(root).getPropertyValue("--bg").trim() || "#0a0a0b";
      ctx.globalAlpha = 0.06; ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;

      ctx.lineWidth = 1;
      ctx.strokeStyle = lineColor;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.px = p.x; p.py = p.y;
        var a = field(p.x, p.y, t);
        p.x += Math.cos(a) * 1.1;
        p.y += Math.sin(a) * 1.1;
        // cursor repulsion
        var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 16000) { var d = Math.sqrt(d2) || 1; p.x += (dx / d) * 2.2; p.y += (dy / d) * 2.2; }
        // wrap
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          p.x = Math.random() * W; p.y = Math.random() * H; p.px = p.x; p.py = p.y;
        }
        ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(step);
    }

    resize();
    addEventListener("resize", resize);
    if (hero) {
      hero.addEventListener("mousemove", function (e) { var r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
      hero.addEventListener("mouseleave", function () { mx = my = -9999; });
    }
    // pause when hero off-screen
    if ("IntersectionObserver" in window && hero) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { if (!running) { running = true; requestAnimationFrame(step); } }
          else { running = false; }
        });
      }, { threshold: 0.02 }).observe(hero);
    }
    requestAnimationFrame(step);
  })();

  /* ============================================================
     FORCE-DIRECTED RESEARCH MAP
     ============================================================ */
  (function researchMap() {
    var wrap = document.getElementById("graph");
    var edgesCanvas = document.getElementById("graphEdges");
    if (!wrap || !edgesCanvas) return;
    var ctx = edgesCanvas.getContext("2d");
    var W, H, DPR;
    var idxOf = {}; RESEARCH_NODES.forEach(function (n, i) { idxOf[n.id] = i; });

    // build node elements + physics state
    var nodes = RESEARCH_NODES.map(function (data, i) {
      var el = document.createElement("button");
      el.className = "node"; el.type = "button";
      el.textContent = data.label;
      el.setAttribute("data-cursor", "Drag");
      wrap.appendChild(el);
      return { data: data, el: el, x: 0, y: 0, vx: 0, vy: 0, fixed: false, i: i };
    });
    var edges = RESEARCH_EDGES.map(function (e) { return [idxOf[e[0]], idxOf[e[1]]]; })
      .filter(function (e) { return e[0] != null && e[1] != null; });

    // detail panel
    var panelIdx = document.getElementById("panelIdx");
    var panelTitle = document.getElementById("panelTitle");
    var panelText = document.getElementById("panelText");
    function activate(n) {
      nodes.forEach(function (o) { o.el.classList.toggle("is-active", o === n); });
      if (panelIdx) panelIdx.textContent = "✦ " + String(n.i + 1).padStart(2, "0");
      if (panelTitle) panelTitle.textContent = n.data.label;
      if (panelText) panelText.textContent = n.data.text;
    }

    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = wrap.clientWidth; H = wrap.clientHeight;
      edgesCanvas.width = W * DPR; edgesCanvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    // initial layout: circle around center
    function layout() {
      var cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.32;
      nodes.forEach(function (n, i) {
        if (i === 0) { n.x = cx; n.y = cy; }        // core in the middle
        else {
          var ang = ((i - 1) / (nodes.length - 1)) * Math.PI * 2;
          n.x = cx + Math.cos(ang) * R; n.y = cy + Math.sin(ang) * R;
        }
      });
    }

    var running = true;
    function tick() {
      if (!running) return;
      // forces
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        if (a.fixed) continue;
        // centering
        a.vx += (W / 2 - a.x) * 0.0009;
        a.vy += (H / 2 - a.y) * 0.0009;
        // repulsion
        for (var j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy || 1;
          if (d2 < 90000) { var f = 2600 / d2; a.vx += (dx) * f * 0.02; a.vy += (dy) * f * 0.02; }
        }
      }
      // springs
      edges.forEach(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var rest = 170, f = (d - rest) * 0.006;
        var fx = (dx / d) * f, fy = (dy / d) * f;
        if (!a.fixed) { a.vx += fx; a.vy += fy; }
        if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
      });
      // integrate + bounds
      var pad = 70;
      nodes.forEach(function (n) {
        if (n.fixed) return;
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += n.vx; n.y += n.vy;
        if (n.x < pad) { n.x = pad; n.vx *= -0.5; }
        if (n.x > W - pad) { n.x = W - pad; n.vx *= -0.5; }
        if (n.y < 40) { n.y = 40; n.vy *= -0.5; }
        if (n.y > H - 40) { n.y = H - 40; n.vy *= -0.5; }
      });
      // draw
      ctx.clearRect(0, 0, W, H);
      var lc = getComputedStyle(root).getPropertyValue("--line-2").trim() || "rgba(255,255,255,.28)";
      var ac = getComputedStyle(root).getPropertyValue("--accent").trim() || "#ff4a1c";
      edges.forEach(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        var hot = a.el.classList.contains("is-active") || b.el.classList.contains("is-active");
        ctx.strokeStyle = hot ? ac : lc; ctx.lineWidth = hot ? 1.6 : 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      nodes.forEach(function (n) { n.el.style.transform = "translate(" + n.x + "px," + n.y + "px) translate(-50%,-50%)"; });
      requestAnimationFrame(tick);
    }

    // dragging + hover
    var dragging = null;
    nodes.forEach(function (n) {
      n.el.addEventListener("pointerdown", function (e) {
        dragging = n; n.fixed = true; n.el.classList.add("is-dragging");
        n.el.setPointerCapture && n.el.setPointerCapture(e.pointerId);
        activate(n);
      });
      n.el.addEventListener("pointermove", function (e) {
        if (dragging !== n) return;
        var r = wrap.getBoundingClientRect();
        n.x = e.clientX - r.left; n.y = e.clientY - r.top;
      });
      var release = function () { if (dragging === n) { n.fixed = false; n.el.classList.remove("is-dragging"); dragging = null; } };
      n.el.addEventListener("pointerup", release);
      n.el.addEventListener("pointercancel", release);
      n.el.addEventListener("mouseenter", function () { activate(n); });
    });

    resize(); layout();
    addEventListener("resize", function () { resize(); });
    activate(nodes[0]);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { if (!running) { running = true; requestAnimationFrame(tick); } }
          else { running = false; }
        });
      }, { threshold: 0.05 }).observe(wrap);
    }
    if (reduceMotion) { // static: just place + draw once
      running = false; ctx.clearRect(0, 0, W, H);
      nodes.forEach(function (n) { n.el.style.transform = "translate(" + n.x + "px," + n.y + "px) translate(-50%,-50%)"; });
    } else {
      requestAnimationFrame(tick);
    }
  })();
})();
