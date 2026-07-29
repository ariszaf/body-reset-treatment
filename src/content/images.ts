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
  'souidiko-masaz': {
    src: '/images/services/souidiko-masaz-kat-oikon-athina.webp',
    alt: 'Σουηδικό μασάζ κατ’ οίκον στην Αθήνα — συνεχείς ρυθμικές κινήσεις',
    width: 1200, height: 1800,
  },
  'deep-tissue': {
    src: '/images/services/deep-tissue-masaz-kat-oikon-athina.webp',
    alt: 'Deep tissue μασάζ κατ’ οίκον στην Αθήνα — αργή πίεση σε βάθος',
    width: 1200, height: 1800,
  },
  'therapeftiko-masaz': {
    src: '/images/services/therapeftiko-masaz-kat-oikon-athina.webp',
    alt: 'Θεραπευτικό μασάζ κατ’ οίκον στην Αθήνα — στοχευμένη δουλειά στην πλάτη',
    width: 1200, height: 1800,
  },
  'sports-massage': {
    src: '/images/services/sports-massage-kat-oikon-athina.webp',
    alt: 'Sports massage κατ’ οίκον στην Αθήνα — αθλητικό μασάζ αποκατάστασης',
    width: 1200, height: 1800,
  },
  'cupping-therapy': {
    src: '/images/services/cupping-therapy-ventouzes-athina.webp',
    alt: 'Cupping therapy — βεντούζες σε συνδυασμό με μασάζ, κατ’ οίκον στην Αθήνα',
    width: 1200, height: 1800,
  },
  /* ⚠ PLACEHOLDER. No frame from the shoot shows the device, so this is a
     manual-massage image standing in for a percussive treatment. It is the one
     pairing here that is not honest about what it depicts — a photograph with
     the Theragun in it is needed before launch. */
  'theragun-therapy': {
    src: '/images/services/theragun-therapy-masaz-athina.webp',
    alt: 'Theragun therapy κατ’ οίκον στην Αθήνα — κρουστική θεραπεία με μάλαξη',
    width: 1200, height: 1800,
  },
};
