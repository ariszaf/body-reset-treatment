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

/**
 * One photograph per treatment, keyed by the service slug so services.ts stays
 * free of file paths. Same shoot as the hero, same high-key grade.
 *
 * The pairing is not arbitrary: the cupping frame is the only one showing cups,
 * the face/neck frame is the only one with the therapist's hands up at the head,
 * and the remaining two split on posture — weight-bearing pressure for the
 * sports work, an even two-handed stroke for the Swedish.
 * Three more frames from the shoot are unused and kept in raw/.
 */
export const serviceImages: Record<string, ImageEntry> = {
  'athlitiko-masaz': {
    src: '/images/services/athlitiko-masaz-kat-oikon-athina.webp',
    alt: 'Αθλητικό μασάζ κατ’ οίκον στην Αθήνα — στοχευμένη πίεση στην πλάτη',
    width: 1200, height: 1800,
  },
  'souidiko-masaz': {
    src: '/images/services/souidiko-masaz-kat-oikon-athina.webp',
    alt: 'Σουηδικό μασάζ κατ’ οίκον στην Αθήνα — συνεχείς ρυθμικές κινήσεις',
    width: 1200, height: 1800,
  },
  'therapeia-prosopou-masaz': {
    src: '/images/services/therapeia-prosopou-afhena-masaz-athina.webp',
    alt: 'Θεραπεία προσώπου με μάλαξη αυχένα και ώμων, κατ’ οίκον στην Αθήνα',
    width: 1200, height: 1800,
  },
  'therapeia-ventouzes-masaz': {
    src: '/images/services/therapeia-ventouzes-masaz-athina.webp',
    alt: 'Θεραπεία με βεντούζες σε συνδυασμό με μασάζ, κατ’ οίκον στην Αθήνα',
    width: 1200, height: 1800,
  },
};
