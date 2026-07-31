/**
 * Embla init for every `[data-embla]` on the page.
 *
 * Ported from the same setup in the aestheticare project, which has been in
 * production long enough to trust. The reason it exists here is specific and
 * was measured, not assumed:
 *
 * A native horizontal scroller (`overflow-x: auto`) is a scroll container on
 * BOTH axes, and on a phone the browser arbitrates the gesture. With a thumb
 * arc carrying about 60px of sideways movement, the rail claimed the touch and
 * then went nowhere, and neither did the page — 0px on both axes, measured with
 * real touch events. That is the "it sticks" the client kept reporting.
 *
 * Embla never creates a scroll container: the viewport is `overflow: hidden`
 * and the container is moved with a transform, with the library deciding the
 * axis and releasing anything vertical straight back to the page.
 *
 * TWO DELIBERATE DIFFERENCES from the reference:
 *
 *  · `is-embla` — the horizontal layout is applied by THIS script, not by the
 *    stylesheet. Without JavaScript the reference shows one slide and hides the
 *    rest; here the markup stays a plain vertical stack, which is readable, and
 *    the strip only appears once it can actually be operated.
 *  · destroy on navigation — the reference guards against double-init but never
 *    tears down, so every client-side navigation leaves another live instance
 *    behind. These are destroyed on `astro:before-swap`.
 */
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';

const live: EmblaCarouselType[] = [];

function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-embla]').forEach((root) => {
    const viewport = root.querySelector<HTMLElement>('.embla');
    if (!viewport || viewport.dataset.emblaReady) return;   // idempotent
    viewport.dataset.emblaReady = '1';

    const embla = EmblaCarousel(viewport, {
      align: 'start',
      containScroll: 'trimSnaps',
      // Off from the large breakpoint up, where the three cards sit side by
      // side and there is nothing to swipe. Matches the CSS breakpoint exactly.
      breakpoints: { '(min-width: 64rem)': { active: false } },
    });
    live.push(embla);

    // Only now does the strip become horizontal.
    root.classList.add('is-embla');

    const dots = [...root.querySelectorAll<HTMLButtonElement>('.embla__dot')];
    dots.forEach((dot, i) => dot.addEventListener('click', () => embla.scrollTo(i)));

    const onSelect = () => {
      const selected = embla.selectedScrollSnap();
      dots.forEach((dot, i) => {
        dot.toggleAttribute('data-on', i === selected);
        dot.setAttribute('aria-current', i === selected ? 'true' : 'false');
      });
    };
    embla.on('select', onSelect);
    embla.on('reInit', onSelect);
    onSelect();

    /* The first time the strip is touched, mark the root. A swipe cue is for
       someone who has not realised the row moves; once they have, it is noise.
       `pointerDown` rather than `select` so it goes the moment a finger lands,
       not when the slide lands. */
    const markMoved = () => root.setAttribute('data-moved', '');
    embla.on('pointerDown', markMoved);
    embla.on('select', markMoved);
  });
}

function destroyCarousels() {
  while (live.length) live.pop()?.destroy();
  document.querySelectorAll<HTMLElement>('.embla').forEach((v) => delete v.dataset.emblaReady);
  document.querySelectorAll<HTMLElement>('[data-embla]').forEach((r) => r.classList.remove('is-embla'));
}

initCarousels();
document.addEventListener('astro:after-swap', initCarousels);
document.addEventListener('astro:before-swap', destroyCarousels);
