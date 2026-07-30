/**
 * The homepage opening, verified rather than eyeballed.
 *
 *   QA_BASE=http://localhost:4321 node scripts/probe-hero-mark.mjs
 *
 * The logotype's four animations are paused and their currentTime is SET, so
 * every reading is deterministic — no waiting, no flake, and a step that
 * silently fails to move shows up as a flat column.
 *
 * What it asserts, beyond the choreography:
 *   · the mark forms ONCE and is still whole 30s later — no loop
 *   · the photograph arrives on its own, after the mark has started
 *   · the page keeps exactly one <h1>, real text, invisible on screen
 *   · only one logotype is on screen at a time (the bar stands its copy down
 *     over the hero, and takes it back on an inner page)
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://localhost:4321';
const TIMES = [0.0, 0.45, 0.75, 1.05, 1.25, 2.4, 30.0];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: 'networkidle' });

const read = await page.evaluate(async (times) => {
  const q = (s) => document.querySelector(s);
  const els = {
    wave: q('.hero-mark .lg-wave'),
    slash: q('.hero-mark .lg-slash line'),
    word: q('.hero-mark .lg-word'),
    sub: q('.hero-mark .lg-sub'),
    frames: q('.hero-frames'),
  };
  const missing = Object.entries(els).filter(([, e]) => !e).map(([k]) => k);
  if (missing.length) return { error: `δεν βρέθηκαν: ${missing.join(', ')}` };

  const anims = {};
  for (const [k, el] of Object.entries(els)) {
    const a = el.getAnimations()[0];
    if (!a) return { error: `καμία κίνηση στο .${k}` };
    a.pause();
    anims[k] = a;
  }

  const rows = [];
  for (const t of times) {
    for (const a of Object.values(anims)) a.currentTime = t * 1000;
    await new Promise((r) => requestAnimationFrame(r));
    const cs = (el) => getComputedStyle(el);
    // mask-size reports a PERCENTAGE here, not px — dividing it by a pixel
    // width silently returns the same constant for every sample.
    const raw = (cs(els.wave).maskSize || cs(els.wave).webkitMaskSize).split(' ')[0];
    const boxW = els.wave.getBoundingClientRect().width;
    rows.push({
      t,
      wave: Math.round(raw.endsWith('%') ? parseFloat(raw) : (parseFloat(raw) / (boxW || 1)) * 100),
      dash: Math.round(parseFloat(cs(els.slash).strokeDashoffset)),
      word: +(+cs(els.word).opacity).toFixed(2),
      sub: +(+cs(els.sub).opacity).toFixed(2),
      photo: +(+cs(els.frames).opacity).toFixed(2),
    });
  }
  return {
    rows,
    dashFull: Math.round(parseFloat(getComputedStyle(els.slash).strokeDasharray)),
    // Nothing in the opening may repeat…
    iterations: Object.fromEntries(
      Object.entries(els).map(([k, el]) => [k, getComputedStyle(el).animationIterationCount]),
    ),
    // …except the photograph's slow drift, which is the one thing that should.
    drift: (() => {
      const cs = getComputedStyle(q('.hero-frame img'));
      return {
        count: cs.animationIterationCount,
        direction: cs.animationDirection,
        seconds: parseFloat(cs.animationDuration),
      };
    })(),
  };
}, TIMES);

if (read.error) {
  console.log('❌ ' + read.error);
  await browser.close();
  process.exit(1);
}

console.log(`\n  ΤΟ ΑΝΟΙΓΜΑ — μήκος κάθετου: ${read.dashFull} μονάδες\n`);
console.log('   χρόνος │ κύμα    │ κάθετος        │ BODY RESET │ TREATMENT │ φωτογραφία');
console.log('  ────────┼─────────┼────────────────┼────────────┼───────────┼───────────');
for (const r of read.rows) {
  const bar = (p) => '█'.repeat(Math.round(p / 14)).padEnd(7);
  const traced = Math.round((1 - r.dash / read.dashFull) * 100);
  console.log(
    `  ${String(r.t.toFixed(1)).padStart(5)}s │ ${bar(r.wave)} │ ${bar(traced)} ${String(traced).padStart(3)}% │` +
      `   ${r.word.toFixed(2)}     │   ${r.sub.toFixed(2)}    │   ${r.photo.toFixed(2)}`,
  );
}

const at = (t) => read.rows.find((r) => r.t === t);
const traced = (r) => Math.round((1 - r.dash / read.dashFull) * 100);
const whole = (r) => r.wave >= 99 && traced(r) >= 99 && r.word === 1 && r.sub === 1;

const checks = [
  ['στο 0.0s η οθόνη είναι κενή — ούτε σήμα ούτε φωτογραφία',
    at(0.0).wave === 0 && traced(at(0.0)) === 0 && at(0.0).word === 0 && at(0.0).photo === 0],
  ['το κύμα ανοίγει πρώτο', at(0.45).wave > 0 && traced(at(0.45)) === 0],
  ['η κάθετος ΑΚΟΛΟΥΘΕΙ, δεν συμπίπτει', traced(at(0.75)) < traced(at(1.05))],
  ['το κύμα προηγείται της κάθετου', at(0.75).wave > traced(at(0.75))],
  ['η φωτογραφία ξεκινά ΑΦΟΥ έχει αρχίσει το σήμα', at(0.45).photo === 0 && at(1.05).photo > 0],
  ['η φωτογραφία έρχεται σταδιακά, όχι απότομα', at(1.05).photo < 0.6 && at(1.05).photo > 0],
  ['το BODY RESET έρχεται μετά την κάθετο', at(1.05).word > 0 && at(0.75).word === 0],
  // "last" means it LAGS the wordmark, not that it finishes at a later sample —
  // once both have landed, comparing end states proves nothing.
  ['το TREATMENT έρχεται τελευταίο', at(1.05).sub > 0 && at(1.05).sub < at(1.05).word],
  ['στα 2.4s όλα στη θέση τους', whole(at(2.4)) && at(2.4).photo === 1],
  ['ΣΤΑ 30s ΕΞΑΚΟΛΟΥΘΕΙ ολόκληρο — δεν ξαναρχίζει', whole(at(30.0)) && at(30.0).photo === 1],
  ['καμία κίνηση του ανοίγματος δεν επαναλαμβάνεται',
    Object.values(read.iterations).every((v) => v === '1')],
  [`η φωτογραφία αναπνέει συνεχώς (${read.drift.seconds}s ανά κατεύθυνση, ${read.drift.direction})`,
    read.drift.count === 'infinite' && read.drift.direction === 'alternate' && read.drift.seconds >= 12],
];

console.log('');
let bad = 0;
for (const [name, ok] of checks) {
  console.log(`  ${ok ? '✅' : '❌'} ${name}`);
  if (!ok) bad++;
}

// ---- one h1, real text, not painted ---------------------------------------
const h1 = await page.evaluate(() => {
  const hs = [...document.querySelectorAll('h1')];
  const box = hs[0]?.querySelector('.sr-only')?.getBoundingClientRect();
  return {
    count: hs.length,
    text: hs[0]?.textContent?.trim() || '',
    invisible: box ? box.width <= 2 && box.height <= 2 : false,
    markHidden: !!document.querySelector('.hero-mark svg[aria-hidden="true"]'),
  };
});
console.log('');
console.log(`  ${h1.count === 1 ? '✅' : '❌'} ακριβώς ένα <h1> (${h1.count})`);
console.log(`  ${h1.text ? '✅' : '❌'} με πραγματικό κείμενο: «${h1.text}»`);
console.log(`  ${h1.invisible ? '✅' : '❌'} αόρατο στην οθόνη`);
console.log(`  ${h1.markHidden ? '✅' : '❌'} το λογότυπο δεν διαβάζεται δεύτερη φορά`);
if (h1.count !== 1 || !h1.text || !h1.invisible || !h1.markHidden) bad++;

// ---- one logotype on screen at a time -------------------------------------
const brandVisible = (p) =>
  p.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.navov-brand'));
    return cs.visibility === 'visible' && +cs.opacity > 0.5;
  });

const atTop = await brandVisible(page);
await page.evaluate(() =>
  window.scrollTo(0, document.querySelector('.hero').getBoundingClientRect().height + 200));
await page.waitForTimeout(700);
const scrolled = await brandVisible(page);

// an inner page has no hero — the bar must keep its mark there
const about = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await about.goto(`${BASE}/poioi-eimaste`, { waitUntil: 'networkidle' });
const inner = await brandVisible(about);
// and no full-screen veil may survive on the homepage
const veil = await page.evaluate(() => !!document.getElementById('brand-veil'));

console.log('');
console.log(`  ${!atTop ? '✅' : '❌'} στην κορυφή της Αρχικής η μπάρα ΔΕΝ δείχνει λογότυπο`);
console.log(`  ${scrolled ? '✅' : '❌'} μετά το hero το λογότυπο επιστρέφει στη μπάρα`);
console.log(`  ${inner ? '✅' : '❌'} σε εσωτερική σελίδα (χωρίς hero) φαίνεται κανονικά`);
console.log(`  ${!veil ? '✅' : '❌'} καμία πλήρης οθόνη preload στην Αρχική`);
if (atTop || !scrolled || !inner || veil) bad++;

console.log(bad ? `\n  ❌ ${bad} αποτυχίες\n` : '\n  όλα πέρασαν\n');
await browser.close();
process.exit(bad ? 1 : 0);
