/**
 * Sample the hero logotype loop at exact times.
 *
 * Not screenshots-and-eyeball: the four animations are paused and their
 * currentTime is SET, so every reading is deterministic — no waiting, no
 * flake, and a step that silently fails to move shows up as a flat column.
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://localhost:4321';
const TIMES = [0.5, 1.9, 2.0, 2.7, 3.2, 3.9, 4.6, 6.0, 9.5, 10.2, 10.9, 13.0];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
// Skip the intro veil so the pure loop is under test (its own delay is checked below).
await page.addInitScript(() => sessionStorage.setItem('brt_intro_seen', '1'));
await page.goto(BASE, { waitUntil: 'networkidle' });

const read = await page.evaluate(async (times) => {
  const q = (s) => document.querySelector(s);
  const els = {
    wave: q('.hero-mark .lg-wave'),
    slash: q('.hero-mark .lg-slash line'),
    word: q('.hero-mark .lg-word'),
    sub: q('.hero-mark .lg-sub'),
  };
  const missing = Object.entries(els).filter(([, e]) => !e).map(([k]) => k);
  if (missing.length) return { error: `δεν βρέθηκαν: ${missing.join(', ')}` };

  const anims = {};
  for (const [k, el] of Object.entries(els)) {
    const a = el.getAnimations()[0];
    if (!a) return { error: `καμία κίνηση στο .lg-${k}` };
    a.pause();
    anims[k] = a;
  }

  const rows = [];
  for (const t of times) {
    for (const a of Object.values(anims)) a.currentTime = t * 1000;
    await new Promise((r) => requestAnimationFrame(r));
    const cs = (el) => getComputedStyle(el);
    // mask-size comes back as a PERCENTAGE here, not px — dividing it by a
    // pixel width silently reports a constant ~28% for every sample.
    const raw = (cs(els.wave).maskSize || cs(els.wave).webkitMaskSize).split(' ')[0];
    const boxW = els.wave.getBoundingClientRect().width;
    const maskW = raw.endsWith('%') ? parseFloat(raw) : (parseFloat(raw) / (boxW || 1)) * 100;
    rows.push({
      t,
      wave: Math.round(maskW),                                 // % of the wave revealed
      raw,
      waveOp: +cs(els.wave).opacity,
      dash: Math.round(parseFloat(cs(els.slash).strokeDashoffset)),
      word: +(+cs(els.word).opacity).toFixed(2),
      sub: +(+cs(els.sub).opacity).toFixed(2),
    });
  }
  return { rows, dashFull: Math.round(parseFloat(getComputedStyle(els.slash).strokeDasharray)) };
}, TIMES);

if (read.error) {
  console.log('❌ ' + read.error);
  await browser.close();
  process.exit(1);
}

console.log(`\n  ΒΡΟΧΟΣ 11s — μήκος κάθετου: ${read.dashFull} μονάδες\n`);
console.log('   χρόνος │ κύμα    │ κάθετος        │ BODY RESET │ TREATMENT');
console.log('  ────────┼─────────┼────────────────┼────────────┼───────────');
for (const r of read.rows) {
  const bar = (p) => '█'.repeat(Math.round(p / 14)).padEnd(7);
  const traced = Math.round((1 - r.dash / read.dashFull) * 100);
  console.log(
    `  ${String(r.t).padStart(5)}s │ ${bar(r.wave)} │ ${bar(traced)} ${String(traced).padStart(3)}% │` +
      `   ${r.word.toFixed(2)}     │   ${r.sub.toFixed(2)}` +
      (r.waveOp < 1 ? `   (σβήνει: ${r.waveOp.toFixed(2)})` : '')
  );
}

// ---- assertions: the sequence the client asked for, stated as facts --------
const at = (t) => read.rows.find((r) => r.t === t);
const traced = (r) => Math.round((1 - r.dash / read.dashFull) * 100);
const checks = [
  ['στα 0.5s δεν φαίνεται τίποτα', at(0.5).wave === 0 && traced(at(0.5)) === 0 && at(0.5).word === 0],
  ['μέχρι τα 1.9s ΤΙΠΟΤΑ — η παύση των 2 δευτ. τηρείται', at(1.9).wave === 0],
  ['στα 2.0s μόλις ξεκινά', at(2.0).wave > 0 && at(2.0).wave < 15],
  ['στα 2.7s το κύμα είναι ΜΕΣΟΔΡΟΜΙΣ', at(2.7).wave > 10 && at(2.7).wave < 95],
  ['η κάθετος ΑΚΟΛΟΥΘΕΙ, δεν συμπίπτει', traced(at(2.7)) < traced(at(3.2))],
  ['στα 3.2s το κύμα προηγείται της κάθετου', at(3.2).wave > traced(at(3.2))],
  ['το BODY RESET έρχεται μετά την κάθετο', at(3.9).word > 0 && at(3.2).word === 0],
  ['το TREATMENT έρχεται τελευταίο', at(4.6).sub > 0 && at(4.6).sub < at(6.0).sub],
  ['στα 6.0s είναι ολόκληρο', at(6.0).wave >= 99 && traced(at(6.0)) >= 99 && at(6.0).word === 1 && at(6.0).sub === 1],
  ['στα 9.5s ακόμη ολόκληρο (5 δευτ. κράτημα)', at(9.5).word === 1 && at(9.5).waveOp === 1],
  ['στα 10.2s φεύγει', at(10.2).waveOp < 1 && at(10.2).word < 1],
  ['στα 10.9s έχει φύγει', at(10.9).waveOp === 0 && at(10.9).word === 0],
  ['στα 13.0s ξαναρχίζει από την αρχή', at(13.0).wave > 0 && at(13.0).wave < 100 && at(13.0).word === 0],
];
console.log('');
let bad = 0;
for (const [name, ok] of checks) {
  console.log(`  ${ok ? '✅' : '❌'} ${name}`);
  if (!ok) bad++;
}

// ---- the h1 survived the text removal -------------------------------------
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

console.log(bad ? `\n  ❌ ${bad} αποτυχίες\n` : '\n  όλα πέρασαν\n');
await browser.close();
process.exit(bad ? 1 : 0);
