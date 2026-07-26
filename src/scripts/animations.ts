/**
 * Reveal engine (from the starter; catalog/moods: animate.md)
 * One IntersectionObserver, reveals ONCE, sets --i for staggered children.
 * No-JS / reduced-motion fallback: everything visible instantly
 * (base CSS is gated on html.reveal-ready — see tokens.css).
 *
 * Re-binds after a view transition. Astro swaps the document on navigation, so
 * the <html> class and every observed node are replaced — without the
 * astro:after-swap hook the next page would render with .reveal elements stuck
 * at opacity 0 and no observer watching them.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function bind() {
  if (reduce) return;
  document.documentElement.classList.add('reveal-ready');

  // stagger index for children of a .reveal-stagger container
  document.querySelectorAll('.reveal-stagger').forEach((group) => {
    group.querySelectorAll(':scope > .reveal').forEach((el, i) =>
      (el as HTMLElement).style.setProperty('--i', String(i)));
  });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);          // reveal once
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
}

bind();
document.addEventListener('astro:after-swap', bind);

export {};
