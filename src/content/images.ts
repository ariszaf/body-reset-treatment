/**
 * Central image registry — components reference THIS, never raw paths.
 * Files live in public/images/<folder>/ with SEO keyword filenames.
 * alt: Greek, keyword+location, ≤125 chars — MANDATORY (decorative → alt: '').
 *
 * These are the client's real photographs (originals in raw/). They are used
 * as supplied — no grading, no duotone: they already sit exactly on the brief.
 */
export type ImageEntry = { src: string; alt: string; width: number; height: number; mobile?: string };

export const images: Record<string, ImageEntry> = {
  og: { src: '/images/general/og.jpg', alt: '', width: 1200, height: 630 }, // TODO: replace with brand og image

  /* Hero — one still frame, art-directed by orientation. */
  hero: {
    src: '/images/hero/therapeftiko-masaz-body-reset-01.webp',
    mobile: '/images/hero/therapeftiko-masaz-body-reset-01-mobile.webp',
    alt: 'Κρεβάτι μασάζ σε χαμηλό φωτισμό — μασάζ κατ’ οίκον από το Body Reset Treatment',
    width: 1920, height: 818,
  },
};

/** The hero sequence. One entry = a still hero; add more to start a crossfade. */
export const heroSequence = [images.hero];
