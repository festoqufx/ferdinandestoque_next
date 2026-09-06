// Code By Webdevtrick (https://webdevtrick.com) - Optimized Vanilla JS
(function () {
  const text = document.querySelectorAll('.wrap_text .text');
  if (!text.length) return;

  const coarseQuery = window.matchMedia('(pointer: coarse)');
  let halfX = window.innerWidth / 2;
  let halfY = window.innerHeight / 2;

  function isCoarse() {
    return coarseQuery.matches || window.innerWidth <= 991;
  }

  function parallaxFactor() {
    if (window.innerWidth <= 575) return 0.004;
    if (window.innerWidth <= 991) return 0.006;
    return 0.01;
  }

  function layerOffset(i) {
    if (!isCoarse()) return { x: 0, y: 0 };
    const step = window.innerWidth <= 400 ? 0.8 : 1.15;
    return { x: i * step, y: i * step * 1.85 };
  }

  function restPose(el, i, duration) {
    const offset = layerOffset(i);
    const z = 1 * (i + 8);
    el.style.transition = duration ? `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)` : 'none';
    el.style.transform = `translate3d(calc(-50% + ${offset.x}px), ${offset.y}px, ${z}px)`;
  }

  text.forEach((el, i) => restPose(el, i, 1));

  window.addEventListener('resize', () => {
    halfX = window.innerWidth / 2;
    halfY = window.innerHeight / 2;
    text.forEach((el, i) => restPose(el, i, 0.35));
  }, { passive: true });

  let rafId = null;
  document.addEventListener('mousemove', e => {
    if (isCoarse()) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const factor = parallaxFactor();
      const dx = e.clientX - halfX;
      const dy = e.clientY - halfY;
      text.forEach((el, i) => {
        const x = dx * (i + 1) * factor;
        const y = dy * (i + 1) * factor;
        const z = 1 * (i + 8);
        el.style.transition = 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), ${y.toFixed(2)}px, ${z}px)`;
      });
    });
  }, { passive: true });
})();

(function () {
  const container = document.querySelector('.portfolio-container');
  if (!container) return;

  container.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.portfolio-item');
    if (!item || !container.contains(item)) return;
    const target = item.querySelector('img') || item;
    const rect = target.getBoundingClientRect();
    item.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    item.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, { passive: true });
})();
