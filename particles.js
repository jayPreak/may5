// Two particle systems: ambient dust (everywhere) + drifting petals (slow)

window.Particles = {
  init(canvas, opts = {}) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w, h;
    const dust = [];
    const petals = [];
    const count = opts.count || 80;
    const petalCount = opts.petals || 14;
    const hue = opts.hue || [330, 350];
    const speed = opts.speed || 0.3;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    function spawn() {
      for (let i = 0; i < count; i++) {
        dust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.3,
          vx: (Math.random() - 0.5) * speed * 0.4,
          vy: -(Math.random() * speed + 0.05),
          a: Math.random() * 0.6 + 0.2,
          tw: Math.random() * Math.PI * 2,
          twS: Math.random() * 0.04 + 0.01,
          h: hue[0] + Math.random() * (hue[1] - hue[0]),
        });
      }
      for (let i = 0; i < petalCount; i++) {
        petals.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 14 + 6,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.02,
          vx: (Math.random() - 0.5) * 0.3,
          vy: Math.random() * 0.4 + 0.1,
          a: Math.random() * 0.5 + 0.3,
          sway: Math.random() * 2 + 1,
          swayS: Math.random() * 0.01 + 0.005,
          t: Math.random() * 100,
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);

      // Dust
      dust.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.tw += p.twS;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        const tw = (Math.sin(p.tw) + 1) * 0.5;
        const a = p.a * (0.4 + tw * 0.6);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.h}, 90%, 80%, ${a})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${p.h}, 90%, 70%, ${a * 0.8})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Petals
      petals.forEach(p => {
        p.t += p.swayS;
        p.x += p.vx + Math.sin(p.t) * 0.3;
        p.y += p.vy;
        p.rot += p.vRot;
        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, `rgba(255,217,228,${p.a})`);
        grad.addColorStop(0.6, `rgba(255,143,182,${p.a * 0.7})`);
        grad.addColorStop(1, `rgba(255,62,127,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(frame);
    }

    resize(); spawn(); frame();
    window.addEventListener('resize', resize);
  }
};
