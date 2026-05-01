// ============ Cinematic App ============
(function () {
  // Mount all florals
  Florals.mountAll();

  const isMobile = window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(hover: none)').matches;
  const m = isMobile ? 0.4 : 1;

  // Particles only on entry + final scenes
  [0, 5].forEach(i => {
    const cv = document.getElementById('particles-' + i);
    if (!cv) return;
    Particles.init(cv, {
      count: Math.round((i === 5 ? 140 : 100) * m),
      petals: Math.round((i === 5 ? 22 : 14) * m),
      hue: [325, 350],
      speed: i === 5 ? 0.4 : 0.25,
    });
  });

  // ============ Word reveal on scroll ============
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.word-reveal').forEach(el => io.observe(el));

  // ============ Scene tracking + video play/pause for perf ============
  const scenes = document.querySelectorAll('.scene');
  const sceneIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const v = e.target.querySelector('.bg-video');
      if (e.isIntersecting) {
        if (v && v.paused) v.play().catch(() => {});
        const idx = parseInt(e.target.id.split('-')[1], 10);
        try { window.parent.postMessage({ slideIndexChanged: idx }, '*'); } catch (e) {}
      } else {
        if (v && !v.paused) v.pause();
      }
    });
  }, { threshold: 0.25 });
  scenes.forEach(s => sceneIO.observe(s));

  // ============ Preload curtain ============
  const preload = document.getElementById('preload');
  const videos = document.querySelectorAll('.bg-video');
  let readyCount = 0;
  const need = Math.min(videos.length, 2); // wait for first 2

  function tryHide() {
    if (readyCount >= need || performance.now() > 6000) {
      preload.classList.add('gone');
    }
  }
  videos.forEach((v, i) => {
    if (i < need) {
      v.addEventListener('canplay', () => {
        readyCount++;
        tryHide();
      }, { once: true });
    }
  });
  // Failsafe — hide after 4s no matter what
  setTimeout(() => preload.classList.add('gone'), 4000);

  // ============ Audio toggle ============
  const audio = document.getElementById('ambient');
  const audioBtn = document.getElementById('audioToggle');
  if (audio && audioBtn) {
    audio.volume = 0.35;
    audioBtn.addEventListener('click', () => {
      const muted = audioBtn.classList.contains('muted');
      if (muted) {
        audio.play().then(() => {
          audioBtn.classList.remove('muted');
          audioBtn.querySelector('span:last-child').textContent = 'Sound on';
        }).catch(() => {});
      } else {
        audio.pause();
        audioBtn.classList.add('muted');
        audioBtn.querySelector('span:last-child').textContent = 'Sound off';
      }
    });
  }

  // ============ Scroll progress bar ============
  const fill = document.getElementById('scrollBarFill');
  if (fill) {
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      fill.style.width = p + '%';
    }, { passive: true });
  }

  // ============ Begin button flourish ============
  const begin = document.getElementById('beginBtn');
  if (begin) {
    begin.addEventListener('click', () => {
      begin.style.transition = 'all 0.6s cubic-bezier(0.2,0.8,0.2,1)';
      begin.style.boxShadow = '0 0 120px rgba(255,62,127,0.8)';
      begin.style.letterSpacing = '0.7em';
    });
  }
})();

window.addEventListener('load', () => {
  try { window.parent.postMessage({ slideIndexChanged: 0 }, '*'); } catch (e) {}
});
