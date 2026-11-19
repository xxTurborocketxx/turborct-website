  // ─── i18n ───
  let lang = "de";
  const T = {
    de: {
      ign: ["Zündung vorbereitet", "Weiter klicken …"],
      nom: ["Systeme nominal", "Fast startklar …"],
      lift: ["Turbo abgehoben", "Errungenschaft: Bleibt dran."],
      turbo: "Konami-Code eingegeben. Sieht gut aus, oder?",
      root: "Getippt, nicht exploitet. Zählt trotzdem.",
      lang: ["Sprache gewechselt", "Errungenschaft: Polyglott."],
      kick: "Na, DevTools offen. Respekt.",
      hint1: "Wenn du hier bist, weil du den Source liest: turbo@turborct.rip sagt hi.",
      hint2: "Tipps: Konami-Code. Rakete im Logo. Wer sucht, findet mehr."
    },
    en: {
      ign: ["Ignition prepared", "Keep clicking …"],
      nom: ["Systems nominal", "Almost ready for liftoff …"],
      lift: ["Turbo has lifted off", "Achievement: Persistence."],
      turbo: "Konami code entered. Looks good, right?",
      root: "Typed, not exploited. Still counts.",
      lang: ["Language switched", "Achievement: Polyglot."],
      kick: "So, DevTools open. Respect.",
      hint1: "If you are here because you read the source: turbo@turborct.rip says hi.",
      hint2: "Hints: Konami code. Rocket in the logo. Seek and you shall find."
    }
  };

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll("[data-de]").forEach(el => { el.innerHTML = el.dataset[l === "de" ? "de" : "en"]; });
    document.querySelectorAll("[data-tp-de]").forEach(el => {
      el.title = el.getAttribute(l === "de" ? "data-tp-de" : "data-tp-en");
    });
    document.querySelectorAll("#langToggle button").forEach(b => {
      b.classList.toggle("active", b.dataset.lang === l);
    });
    try { localStorage.setItem("tr-lang", l); } catch (e) {}
  }

  document.getElementById("langToggle").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.dataset.lang === lang) return;
    setLang(b.dataset.lang);
    toast("🌐", T[lang].lang[0], T[lang].lang[1]);
  });

  // restore last choice if possible
  let saved = null;
  try { saved = localStorage.getItem("tr-lang"); } catch (e) {}
  if (saved === "en") setLang("en");

  // ─── achievement toast system (nostalgisch, aber dezent) ───
  const unlocked = new Set();
  function toast(icon, title, sub) {
    const key = title;
    if (unlocked.has(key)) return;
    unlocked.add(key);
    document.getElementById("eggFound").textContent = unlocked.size;
    const box = document.getElementById("toastBox");
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = '<span class="icon">' + icon + '</span><div><div class="t-title">' + title + '</div><div class="t-sub">' + sub + '</div></div>';
    box.appendChild(t);
    setTimeout(() => { t.classList.add("bye"); setTimeout(() => t.remove(), 450); }, 4200);
  }

  // ─── Easter Egg 1: Rakete anklicken ───
  let clicks = 0, lastClick = 0;
  const rocketBtn = document.getElementById("rocketBtn");
  const rocketIcon = document.getElementById("rocketIcon");
  document.getElementById("rocketLogo").addEventListener("click", (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastClick > 3000) clicks = 0;
    lastClick = now;
    clicks++;
    rocketBtn.classList.remove("launched");
    void rocketBtn.offsetWidth;
    rocketBtn.classList.add("launched");
    if (clicks === 3) {
      toast("🔥", T[lang].ign[0], T[lang].ign[1]);
    } else if (clicks === 7) {
      toast("🛰️", T[lang].nom[0], T[lang].nom[1]);
    } else if (clicks >= 10) {
      clicks = 0;
      rocketIcon.textContent = "🛸";
      document.body.style.transition = "filter 1.2s";
      toast("🚀", T[lang].lift[0], T[lang].lift[1]);
      setTimeout(() => { rocketIcon.textContent = "🚀"; }, 5000);
    }
  });

  // ─── Easter Egg 2: Konami-Code ───
  const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  window.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kIdx = (k === konami[kIdx]) ? kIdx + 1 : (k === konami[0] ? 1 : 0);
    if (kIdx === konami.length) {
      kIdx = 0;
      const flash = document.getElementById("turboFlash");
      document.body.classList.add("turbo");
      flash.classList.add("on");
      setTimeout(() => flash.classList.remove("on"), 900);
      toast("⚡", "TURBO MODE", T[lang].turbo);
    }
  });

  // ─── Easter Egg 3: Konsole ───
  console.log("%c🚀 TURBOROCKET", "font-size:28px;color:#a855f7;font-weight:bold;text-shadow:0 0 14px #8b5cf6;");
  console.log("%c" + T[lang].kick, "color:#c084fc;font-size:13px");
  console.log("%c" + T[lang].hint1, "color:#6f5f8a;font-size:12px");
  console.log(T[lang].hint2);

  // ─── Egg 4: hidden "root" type-trigger ───
  const typed = [];
  window.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;
    typed.push(e.key.toLowerCase());
    if (typed.length > 4) typed.shift();
    if (typed.join("") === "root") {
      typed.length = 0;
      const h1 = document.querySelector("h1 .tr");
      h1.textContent = "uid=0(root)";
      toast("🔓", "uid=0(root)", T[lang].root);
      setTimeout(() => { h1.textContent = "Rocket"; }, 4000);
    }
  });

  // ─── animated background: stars, meteors, glints + cursor ring ───
  (function () {
    const cv = document.getElementById("bgCanvas");
    const ctx = cv ? cv.getContext("2d") : null;
    const ring = document.getElementById("cursorRing");
    const glow = document.getElementById("cursorGlow");
    const fine = window.matchMedia("(pointer: fine)").matches && !!ring && !!glow;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let stars = [], meteors = [], glints = [];
    let W = 0, H = 0, mX = -200, mY = -200;
    let cx = 0, cy = 0, gx = 0, gy = 0, scale = 1;
    let hover = false, ringOn = false;
    let parX = 0, parY = 0;
    let simT = 0, last = performance.now();
    let nextMeteor = 3.5, nextGlint = 2.5;

    function applyCursor() {
      ring.style.transform = "translate(" + cx + "px," + cy + "px) scale(" + scale.toFixed(3) + ")";
      glow.style.transform = "translate(" + gx + "px," + gy + "px)";
    }

    function snapCursor() {
      cx = gx = mX; cy = gy = mY;
      scale = hover ? 1.5 : 1;
      if (fine) applyCursor();
    }

    window.addEventListener("pointermove", (e) => {
      mX = e.clientX; mY = e.clientY;
      if (!fine) return;
      if (!ringOn) {
        ringOn = true;
        if (!reduced) snapCursor();
        ring.classList.add("show");
        glow.classList.add("show");
      }
      if (reduced) snapCursor();
    }, { passive: true });

    document.addEventListener("mouseover", (e) => {
      if (!fine) return;
      hover = !!(e.target.closest && e.target.closest("a, button, .chip, input, textarea, select, label"));
      ring.classList.toggle("hot", hover);
      if (reduced) { scale = hover ? 1.5 : 1; applyCursor(); }
    });

    document.addEventListener("mouseleave", () => {
      ringOn = false;
      ring.classList.remove("show");
      glow.classList.remove("show");
    });

    function resize() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      const count = Math.min(220, Math.round(W * H / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.4 + Math.random() * 1.1,
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random() * 1.6,
        b: 0.25 + Math.random() * 0.5,
        d: 0.25 + Math.random() * 0.75
      }));
    }

    function spawnMeteor() {
      if (meteors.length >= 5) return;
      const sp = 300 + Math.random() * 220;
      meteors.push({
        x: W * (0.05 + Math.random() * 0.9),
        y: Math.random() * H * 0.25,
        vx: sp,
        vy: sp * (0.38 + Math.random() * 0.14),
        age: 0,
        dur: 1.2 + Math.random() * 0.9
      });
    }

    function spawnGlint() {
      if (glints.length >= 4 || !stars.length) return;
      glints.push({ st: stars[(Math.random() * stars.length) | 0], age: 0, dur: 0.6 + Math.random() * 0.6 });
    }

    // pre-rendered star sprite: one drawImage call per star is much
    // cheaper than ~220 arc paths with fill state changes every frame
    const dot = document.createElement("canvas");
    dot.width = dot.height = 16;
    (function () {
      const d = dot.getContext("2d");
      const g = d.createRadialGradient(8, 8, 0, 8, 8, 8);
      g.addColorStop(0, "rgba(201, 184, 255, 1)");
      g.addColorStop(0.4, "rgba(201, 184, 255, 0.55)");
      g.addColorStop(1, "rgba(201, 184, 255, 0)");
      d.fillStyle = g;
      d.fillRect(0, 0, 16, 16);
    })();

    function drawStars(t) {
      for (const st of stars) {
        const x = st.x + parX * st.d * 52;
        const y = st.y + parY * st.d * 32;
        const a = st.b + Math.sin(t * 0.001 * st.s + st.p) * 0.25;
        ctx.globalAlpha = Math.max(0.05, a);
        const s = st.r * 8;
        ctx.drawImage(dot, x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    }

    function drawGlints(dt) {
      for (let i = glints.length - 1; i >= 0; i--) {
        const g = glints[i];
        g.age += dt;
        const p = g.age / g.dur;
        if (p >= 1) { glints.splice(i, 1); continue; }
        const x = g.st.x + parX * g.st.d * 52;
        const y = g.st.y + parY * g.st.d * 32;
        const len = 3.5 + p * 9;
        ctx.globalAlpha = Math.sin(p * Math.PI);
        ctx.strokeStyle = "#e7dbff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - len, y); ctx.lineTo(x + len, y);
        ctx.moveTo(x, y - len); ctx.lineTo(x, y + len);
        ctx.stroke();
      }
    }

    function drawMeteors(dt) {
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx * dt; m.y += m.vy * dt; m.age += dt;
        const fade = 1 - m.age / m.dur;
        if (fade <= 0 || m.y > H + 120 || m.x > W + 220) { meteors.splice(i, 1); continue; }
        const tx = m.x - m.vx * 0.26, ty = m.y - m.vy * 0.26;
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, "rgba(216, 180, 254, " + (0.85 * fade).toFixed(3) + ")");
        grad.addColorStop(1, "rgba(216, 180, 254, 0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    if (ctx) {
      resize();
      window.addEventListener("resize", resize);
      if (reduced) {
        drawStars(0);
      } else {
        // no meteor backlog while the tab is hidden: clear the sky on hide,
        // resync the clock on return, cap the dt per frame
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) {
            meteors.length = 0;
          } else {
            last = performance.now();
            nextMeteor = simT + 2.5;
          }
        });
        function loop(now) {
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          simT += dt;
          if (fine && ringOn) {
            cx += (mX - cx) * Math.min(1, dt * 9);
            cy += (mY - cy) * Math.min(1, dt * 9);
            gx += (mX - gx) * Math.min(1, dt * 20);
            gy += (mY - gy) * Math.min(1, dt * 20);
            scale += ((hover ? 1.5 : 1) - scale) * Math.min(1, dt * 12);
            applyCursor();
          }
          // gentle mouse parallax: deeper stars move less
          parX += ((mX / W - 0.5) - parX) * Math.min(1, dt * 3);
          parY += ((mY / H - 0.5) - parY) * Math.min(1, dt * 3);
          ctx.clearRect(0, 0, W, H);
          drawStars(simT * 1000);
          drawGlints(dt);
          drawMeteors(dt);
          if (simT > nextGlint) { spawnGlint(); nextGlint = simT + 2 + Math.random() * 5; }
          if (simT > nextMeteor) {
            spawnMeteor();
            const turbo = document.body.classList.contains("turbo");
            nextMeteor = simT + (turbo ? 1.6 + Math.random() * 2.4 : 7 + Math.random() * 9);
          }
          requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
      }
    }
  })();
