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

  // ─── animated background: twinkling stars + shooting stars ───
  (function () {
    const cv = document.getElementById("bgCanvas");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars = [], meteors = [], W = 0, H = 0, nextMeteor = 0;

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
        b: 0.25 + Math.random() * 0.5
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnMeteor() {
      meteors.push({
        x: W * 0.1 + Math.random() * W * 0.8,
        y: Math.random() * H * 0.3,
        vx: 5 + Math.random() * 4,
        vy: 2.2 + Math.random() * 1.6,
        life: 0,
        maxLife: 70 + Math.random() * 50
      });
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (const st of stars) {
        const a = st.b + Math.sin(t * 0.001 * st.s + st.p) * 0.25;
        ctx.globalAlpha = Math.max(0.05, a);
        ctx.fillStyle = "#c9b8ff";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx; m.y += m.vy; m.life++;
        const fade = 1 - m.life / m.maxLife;
        if (fade <= 0) { meteors.splice(i, 1); continue; }
        const tail = 11;
        const tx = m.x - m.vx * tail, ty = m.y - m.vy * tail;
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

    if (reduced) {
      draw(0);
    } else {
      function loop(t) {
        draw(t);
        if (t > nextMeteor) {
          spawnMeteor();
          nextMeteor = t + 7000 + Math.random() * 9000;
        }
        requestAnimationFrame(loop);
      }
      nextMeteor = performance.now() + 3500;
      requestAnimationFrame(loop);
    }
  })();
