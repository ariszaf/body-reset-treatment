/**
 * The line marks, as data.
 *
 * They live here rather than inside BrandIcon.astro because content files
 * (src/content/services.ts) need the IconName type, and a .astro file cannot be
 * imported for its types — the bundler tries to parse the component markup as
 * TypeScript and fails.
 *
 * Deliberately NOT an icon set. Generic wellness iconography (lotus flowers,
 * stacked stones, cupped hands) would undercut a brand whose entire identity is
 * two hairlines. Every glyph is built from the same vocabulary the logo uses —
 * single-weight strokes, open curves, no fills, no containers.
 *
 * All share a 48×48 box and a 1.25 stroke, which lands at roughly one device
 * pixel at the sizes they are used, matching the logo's own hairline.
 */

/* First group: how the service works. Second: the treatments themselves. */
export type IconName = 'home' | 'table' | 'focus' | 'time' | 'one' | 'calendar'
  | 'depth' | 'flow' | 'face' | 'cups';

export const ICON_PATHS: Record<IconName, string> = {
  // A house whose floor is the brand wave — the clearest statement that the
  // treatment comes to you.
  home: `<path d="M7 22 L24 9 L41 22"/><path d="M11.5 21 V39"/><path d="M36.5 21 V39"/>
         <path d="M6 39 C 12 36.4, 18 41.4, 24 39 S 36 36.4, 42 39"/>`,

  // A treatment table: padded surface, legs, and a towel over the edge. Drawn as
  // a closed bar rather than a single rule — at 44px a hairline reads as a stray
  // line, while a bar reads as a table.
  table: `<path d="M6 20 H42 V25 H6 Z"/>
          <path d="M12 25 V39"/><path d="M36 25 V39"/>
          <path d="M24 25 C 25.6 30, 23.4 33.5, 25 38"/>`,

  // Concentric rings closing on a point — targeted work.
  focus: `<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="7.5"/><circle cx="24" cy="24" r="1.6"/>`,

  // An hour held open rather than counted down.
  time: `<circle cx="24" cy="24" r="15"/><path d="M24 14 V24 L31 28"/>`,

  // A single mark — one appointment at a time.
  one: `<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="3"/>`,

  // A calendar with the slot already ticked — self-service booking, confirmed
  // on the spot. Used to signal that the CTA opens a scheduler, not a phone.
  calendar: `<path d="M8 14 H40 V40 H8 Z"/><path d="M8 21.5 H40"/>
             <path d="M16 9 V15"/><path d="M32 9 V15"/>
             <path d="M17.5 30.5 L22 35 L31 26"/>`,

  // ---- the treatments ----

  // Pressure entering layered tissue — the athletic work. Three nested arcs
  // (the layers) with a stroke pushing down into them.
  depth: `<path d="M6 32 C 14 17, 34 17, 42 32"/>
          <path d="M12.5 32 C 17.5 22.5, 30.5 22.5, 35.5 32"/>
          <path d="M19 32 C 21.5 28, 26.5 28, 29 32"/>
          <path d="M24 6 V17"/><path d="M20.2 13.4 L24 17.2 L27.8 13.4"/>`,

  // Three passes of the same continuous stroke — the Swedish rhythm.
  flow: `<path d="M6 17 C 12 13.4, 18 20.6, 24 17 S 36 13.4, 42 17"/>
         <path d="M6 24 C 12 20.4, 18 27.6, 24 24 S 36 20.4, 42 24"/>
         <path d="M6 31 C 12 27.4, 18 34.6, 24 31 S 36 27.4, 42 31"/>`,

  // A profile in one open line: brow, nose, lip, chin, jaw. The nose has to
  // protrude properly — a softer notch reads as a plain "C" at icon size.
  face: `<path d="M33 8 C 22 8, 14 15, 14 23 C 14 25.6, 15.6 26.6, 15.6 26.6
                  L 10.5 31.4 L 15.4 33.6 C 15.4 37, 18 39.6, 22 40.2
                  C 27 40.8, 31 38, 33 35"/>`,

  // Three cups set down in a line, diminishing.
  cups: `<circle cx="13" cy="22" r="7"/><circle cx="28" cy="24" r="5.5"/><circle cx="39" cy="25.5" r="4"/>
         <path d="M5 36 H43"/>`,
};
