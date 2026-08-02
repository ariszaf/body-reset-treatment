/**
 * The homepage hero with NO scrim — the photograph published as it was shot.
 *
 *   QA_BASE=http://localhost:4321 node scripts/probe-hero-bare.mjs
 *
 * Taking the wash off is a legibility decision, not a taste one: everything the
 * hero paints is PAGE INK on a photograph, and the wash was what separated them.
 * So this measures what is left — the logotype, the scroll cue, and the bar's
 * own controls, which float over the same frame with nothing under them either.
 *
 * Method: DIFFERENCE IMAGING, then local surround.
 *
 * The crop is photographed twice — as it renders, and again with the element
 * set to `visibility: hidden`, which leaves layout untouched. Pixels that moved
 * between the two belong to the element; the rest are photograph. Of those, the
 * ones that went DARKER are its ink, and the darkest is what it truly paints.
 * Each ink pixel's background is then the brightest RENDERED pixel within three
 * of it — rendered, so the element's own halo counts as background, which is
 * the whole point of having one.
 *
 * Three cruder readings were tried here and every one of them lied:
 *   · Matching ink against its DECLARED colour — probe-showcase.mjs's method —
 *     silently measures NOTHING on this frame. The chevron is a 1.25px stroke,
 *     so every pixel of it is an antialiased blend that lands nowhere near the
 *     declared value, and ΕΛ/EN is declared `color(srgb … / 0.62)`, which has no
 *     fixed rendered colour at all (CLAUDE.md trap 23). Both reported "no ink
 *     found" and were skipped — a silent pass on the two marks with the least
 *     contrast on the page.
 *   · Taking the darkest pixel in the crop as the ink works only while the
 *     photograph is lighter than the ink. Where it is not — the bottom of the
 *     letterboxed crop, which is exactly where the cue sits — the darkest pixel
 *     IS the photograph, and it gets measured against itself: 1.08:1 for a mark
 *     that may well be fine. Trap 21, arrived at from the other direction.
 *   · Comparing the ink to the bare plate behind it (hiding the element and
 *     photographing through) discards the halo and fails things that read.
 *
 * Every animation is paused before any of this: the cue's segment falls on a
 * 2.6s loop, and an unpaused probe measures whichever frame it happened to
 * catch.
 *
 * It runs each target TWICE: once as shipped, once with the halo forced off.
 * The second column is what the photograph gives unaided, so the halo's
 * contribution is a number rather than a belief.
 *
 * Marks and UI graphics are held to 3:1 (WCAG 1.4.11), text to 4.5:1.
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://localhost:4321';

/** [selector, label, minimum] */
const TARGETS = [
  ['.hero-mark svg', 'λογότυπο', 3],
  // The whole control, not the chevron alone: the track and the segment that
  // falls down it are part of what says "there is more below".
  ['.hero-cue', 'δείκτης', 3],
  ['.navov-toggle-box', 'hamburger', 3],
  ['.navov-right [aria-current]', 'ΕΛ ενεργό', 4.5],
  ['.navov-right .lang-opt:not([aria-current])', 'EN ανενεργό', 4.5],
];

const VIEWPORTS = [
  ['desktop', 1440, 900], ['laptop', 1280, 800], ['small-lap', 1024, 768],
  ['ultrawide', 1600, 760], ['tablet', 768, 1024],
  ['mobile', 390, 844], ['mobile-sm', 360, 640], ['tall', 390, 932],
];

/* Runs in the page: it needs a canvas to read pixels from. */
const MEASURE = async ([shown, plate]) => {
  const chan = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const load = async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const cv = Object.assign(document.createElement('canvas'), { width: img.width, height: img.height });
    cv.getContext('2d').drawImage(img, 0, 0);
    return { px: cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, W: cv.width, H: cv.height };
  };
  const A = await load(shown);
  const B = await load(plate);
  if (A.W !== B.W || A.H !== B.H) return null;
  const { W, H } = A;

  const L = new Float32Array(W * H);       // as rendered
  const MINE = new Uint8Array(W * H);      // this element painted here, darker
  let inkL = 1;
  for (let i = 0, k = 0; k < A.px.length; k += 4, i++) {
    L[i] = 0.2126 * chan(A.px[k]) + 0.7152 * chan(A.px[k + 1]) + 0.0722 * chan(A.px[k + 2]);
    const lp = 0.2126 * chan(B.px[k]) + 0.7152 * chan(B.px[k + 1]) + 0.0722 * chan(B.px[k + 2]);
    const moved =
      Math.abs(A.px[k] - B.px[k]) + Math.abs(A.px[k + 1] - B.px[k + 1]) + Math.abs(A.px[k + 2] - B.px[k + 2]);
    // Moved, and moved DOWNWARD in luminance: the halo also moves, upward.
    if (moved > 10 && L[i] < lp - 0.008) {
      MINE[i] = 1;
      if (L[i] < inkL) inkL = L[i];
    }
  }
  if (inkL === 1) return null;             // paints nothing darker than its plate

  const band = inkL + 0.02;                // the core of a stroke, not its edges
  const R = 3;
  const surrounds = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (!MINE[i] || L[i] > band) continue;
      let best = 0;
      for (let dy = -R; dy <= R; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= H) continue;
        for (let dx = -R; dx <= R; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= W) continue;
          if (L[yy * W + xx] > best) best = L[yy * W + xx];
        }
      }
      surrounds.push(best);
    }
  }
  if (!surrounds.length) return null;
  surrounds.sort((a, b) => a - b);
  const bg = surrounds[Math.floor(surrounds.length * 0.02)];   // worst-placed 2%
  const [hi, lo] = [bg, inkL].sort((m, n) => n - m);
  return (hi + 0.05) / (lo + 0.05);
};

const browser = await chromium.launch();
const rows = [];
let failures = 0;
let bareWins = 0;

for (const [name, width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // The opening plays for ~3.2s and the mark is translucent while it draws;
  // measuring through it reports the animation, not the design.
  await page.waitForTimeout(4200);
  // Then stop the clock. The cue's segment falls on a 2.6s loop and the frame
  // breathes on a 20s one, so two shots taken a moment apart are two different
  // pictures — and this method compares two shots.
  await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));

  // Nothing may be painted over the photograph. `.hero-scrim` is the wash the
  // scrim prop removes — its mere presence is the failure, whatever it holds.
  const scrimGone = await page.evaluate(() => !document.querySelector('.hero .hero-scrim'));
  if (!scrimGone) { failures++; rows.push({ name, label: 'scrim', ratio: 0, bare: 0, min: 99 }); }

  for (const [selector, label, min] of TARGETS) {
    const box = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return null;
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    }, selector);
    if (!box) continue;

    // Padding, so a 1px rule has actual background inside the crop — without it
    // the clip IS the mark and it measures 1.00:1 against itself.
    const PAD = 6;
    const shotOf = async () => {
      const cx = Math.max(0, box.x - PAD), cy = Math.max(0, box.y - PAD);
      const cw = Math.min(box.width + PAD * 2, width - cx);
      const ch = Math.min(box.height + PAD * 2, height - cy);
      if (cw <= 1 || ch <= 1) return null;
      const s = await page.screenshot({ clip: { x: cx, y: cy, width: cw, height: ch } });
      return 'data:image/png;base64,' + s.toString('base64');
    };

    // `visibility: hidden` and not `display: none`: the plate has to be the
    // same crop of the same layout, minus this one element's paint.
    const hide = (s, on) => page.evaluate(([sel, v]) => {
      document.querySelector(sel).style.visibility = v ? 'hidden' : '';
    }, [s, on]);

    const shipped = await shotOf();
    if (!shipped) continue;
    await hide(selector, true);
    const plate = await shotOf();
    await hide(selector, false);
    const ratio = plate ? await page.evaluate(MEASURE, [shipped, plate]) : null;

    // Same frame, halo forced off — what the photograph gives unaided.
    // Hold the HANDLE and remove through it. `addStyleTag` takes no `id`, so an
    // id passed in the options object is silently dropped and the matching
    // getElementById removes nothing: the override then survives into every
    // later target and the "as shipped" column quietly becomes a second bare
    // one. Both columns read identically, which looks like a finding.
    const nohalo = await page.addStyleTag({
      content: '.hero-mark,.hero-cue-line,.hero-cue svg,.navov-right{filter:none!important}',
    });
    const naked = await shotOf();
    await hide(selector, true);
    const nakedPlate = await shotOf();
    await hide(selector, false);
    const bare = naked && nakedPlate ? await page.evaluate(MEASURE, [naked, nakedPlate]) : null;
    await nohalo.evaluate((el) => el.remove());

    if (ratio === null) continue;
    rows.push({ name, label, ratio, bare, min });
    if (ratio < min) failures++;
    if (bare !== null && bare >= min) bareWins++;
  }

  await page.close();
}
await browser.close();

const fmt = (v) => (v === null || v === undefined ? '  —  ' : v.toFixed(2).padStart(5));
let last = '';
for (const r of rows) {
  if (r.name !== last) { console.log(`\n${r.name}`); last = r.name; }
  const ok = r.ratio >= r.min ? '✓' : '✗';
  const gain = r.bare !== null && r.bare !== undefined ? ` (χωρίς φωτοστέφανο ${fmt(r.bare)})` : '';
  console.log(`  ${ok} ${r.label.padEnd(11)} ${fmt(r.ratio)}:1  ≥${r.min}${gain}`);
}

console.log(
  failures
    ? `\n✗ ${failures} αποτυχίες`
    : `\n✓ όλα περνούν — και ${bareWins}/${rows.length} θα περνούσαν και χωρίς φωτοστέφανο`,
);
process.exit(failures ? 1 : 0);
