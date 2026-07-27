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

  /* Hero — one still frame, art-directed by orientation. A HIGH-KEY photograph:
     the hero renders in dark ink because of it (HeroFullBleed `ink` prop). */
  hero: {
    src: '/images/hero/masaz-kat-oikon-athina-body-reset.webp',
    mobile: '/images/hero/masaz-kat-oikon-athina-body-reset-mobile.webp',
    alt: 'Γυναίκα ξαπλωμένη σε κρεβάτι μασάζ με λευκά λινά — μασάζ κατ’ οίκον στην Αθήνα, Body Reset Treatment',
    width: 2400, height: 1600,
  },
};

/** The hero sequence. One entry = a still hero; add more to start a crossfade. */
export const heroSequence = [images.hero];
