(() => {
  const canvas = document.getElementById("universe");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  let w = 0, h = 0;
  let stars = [];
  let dust = [];
  let nebulas = [];

  const rand = (a, b) => a + Math.random() * (b - a);

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    init();
  }

  function init() {
    // Estrellas
    const starCount = Math.floor((w * h) / 9000);
    stars = new Array(starCount).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: rand(0.2, 1.0),
      r: rand(0.4, 1.4),
      tw: rand(0, Math.PI * 2),
    }));

    // Polvo/partículas “cuánticas”
    const dustCount = Math.floor((w * h) / 18000);
    dust = new Array(dustCount).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: rand(-0.06, -0.01),
      vy: rand(-0.02, 0.02),
      a: rand(0.03, 0.11),
      s: rand(0.6, 1.7),
    }));

    // Nebulosas (blobs con gradiente que se mueven muy lento)
    const nebCount = Math.max(3, Math.floor((w * h) / 350000));
    nebulas = new Array(nebCount).fill(0).map(() => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(220, 520),
      vx: rand(-0.06, 0.06),
      vy: rand(-0.04, 0.04),
      hue: rand(190, 320),     // azules->magenta
      a: rand(0.06, 0.12),
      wob: rand(0, Math.PI * 2)
    }));
  }

  function drawNebula(n, t) {
    n.wob += 0.002;
    const wobble = Math.sin(n.wob) * 18;

    const gx = n.x + wobble;
    const gy = n.y - wobble * 0.4;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, n.r);
    grad.addColorStop(0, `hsla(${n.hue}, 90%, 65%, ${n.a})`);
    grad.addColorStop(0.45, `hsla(${n.hue + 40}, 85%, 55%, ${n.a * 0.55})`);
    grad.addColorStop(1, `hsla(${n.hue + 80}, 80%, 40%, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gx, gy, n.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStar(s, t) {
    // twinkle
    s.tw += 0.02 * s.z;
    const tw = (Math.sin(s.tw) + 1) * 0.5;
    const alpha = 0.22 + tw * 0.55 * s.z;

    // velocidad “deriva”
    s.x -= 0.15 * s.z;
    if (s.x < -5) {
      s.x = w + 5;
      s.y = Math.random() * h;
      s.z = rand(0.2, 1.0);
      s.r = rand(0.4, 1.5);
    }

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    // bloom suave para algunas
    if (s.z > 0.75 && tw > 0.7) {
      ctx.fillStyle = `rgba(160,200,255,${alpha * 0.25})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 4.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawDust(p) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -20) p.x = w + 20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
    ctx.fillRect(p.x, p.y, p.s, p.s);
  }

  function vignette() {
    const g = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(32, now - last);
    last = now;

    // fondo base (muy sutil) + “persistencia” para estela suave
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(0, 0, w, h);

    // nebulosas
    for (const n of nebulas) {
      n.x += n.vx * (dt * 0.06);
      n.y += n.vy * (dt * 0.06);
      if (n.x < -n.r) n.x = w + n.r;
      if (n.x > w + n.r) n.x = -n.r;
      if (n.y < -n.r) n.y = h + n.r;
      if (n.y > h + n.r) n.y = -n.r;
      drawNebula(n, now);
    }

    // estrellas
    for (const s of stars) drawStar(s, now);

    // polvo
    for (const p of dust) drawDust(p);

    vignette();
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  requestAnimationFrame(tick);
})();
