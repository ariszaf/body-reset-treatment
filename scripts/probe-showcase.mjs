/**
 * The treatments showcase, measured rather than eyeballed.
 *
 *   QA_BASE=http://localhost:4321 node scripts/probe-showcase.mjs
 *
 * On a phone the section is a full-screen photograph with the words printed on
 * top of it, so "does it look fine" is not a question a screenshot can answer:
 * six frames × several screen sizes, and the picture moves under the text as
 * `cover` re-crops. This walks every combination and measures.
 *
 * How the contrast reading works: the text is hidden (visibility, so layout is
 * untouched), the area BEHIND it is photographed, and its darkest 2% is taken
 * as the background. Measuring with the glyphs visible is worthless — the
 * anti-aliased edges sit between ink and background and flatter the result.
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://localhost:4321';
const HIDE =
  '#ypiresies .pinned-step-copy > *, #ypiresies .pinned-eyebrow, #ypiresies .pinned-foot > *';

/** [selector, label, minimum ratio] — 4.5 for text, 3 for meaningful marks. */
const TARGETS = [
  ['.pinned-eyebrow', 'ετικέτα', 4.5],
  ['.pinned-step.is-active h3', 'τίτλος', 4.5],
  ['.pinned-step.is-active .pinned-step-text', 'κείμενο', 4.5],
  ['.pinned-arrow[data-dir="1"]', 'βελάκι', 3],
  ['.pinned-tick.is-active .pinned-bar', 'γραμμή', 3],
];

const VIEWPORTS = [
  ['desktop', 1440, 900], ['laptop', 1280, 800], ['small-lap', 1024, 768],
  ['tablet', 768, 1024], ['tablet-sm', 600, 900],
  ['mobile', 390, 844], ['mobile-sm', 360, 640], ['tall', 390, 932],
];

const browser = await chromium.launch();
let failures = 0;

for (const [name, width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });

  const track = await page.evaluate(() => {
    const t = document.querySelector('#ypiresies .pinned-track');
    return { top: t.getBoundingClientRect().top + scrollY, travel: t.offsetHeight - innerHeight };
  });

  const readings = [];
  let seen = new Set();
  let cropped = 0;
  let buried = 0;

  for (let i = 0; i < 6; i++) {
    // Sample by PROGRESS, not by the track's raw height: progress is
    // -rect.top / (trackHeight - viewportHeight), and using the height instead
    // skips a step entirely.
    await page.evaluate((y) => scrollTo(0, y), track.top + (track.travel * (i + 0.5)) / 6);
    await page.waitForTimeout(750); // outlast the 0.55s cross-fade

    const frame = await page.evaluate(() => {
      const step = document.querySelector('#ypiresies .pinned-step.is-active');
      const img = step.querySelector('img');
      const box = img.getBoundingClientRect();
      const natural = img.naturalWidth / img.naturalHeight;
      const rendered = box.width / box.height;
      const onePhone = innerWidth < 1024;
      const label = document.querySelector('#ypiresies .pinned-eyebrow');
      const lb = label.getBoundingClientRect();
      const topmost = document.elementFromPoint(lb.x + lb.width / 2, lb.y + lb.height / 2);
      return {
        title: step.querySelector('h3').textContent.trim(),
        src: img.currentSrc.split('/').pop(),
        // On a phone it fills the screen (cropping is the point); elsewhere the
        // box must match the frame's own ratio so nothing is cut.
        ok: onePhone
          ? box.width >= innerWidth - 1 && box.height >= innerHeight - 1
          : Math.abs(rendered - natural) < 0.01,
        textOnTop: topmost === label || label.contains(topmost),
      };
    });
    seen.add(`${frame.title} · ${frame.src}`);
    if (!frame.ok) cropped++;
    if (!frame.textOnTop) buried++;

    for (const [selector, label, min] of TARGETS) {
      const box = await page.evaluate((s) => {
        const el = document.querySelector('#ypiresies ' + s);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.width < 2) return null;
        const cs = getComputedStyle(el);
        return {
          x: r.x, y: r.y, width: r.width, height: Math.max(r.height, 2),
          colour: s.includes('bar') ? cs.backgroundColor : cs.color,
        };
      }, selector);
      if (!box) continue;

      await page.evaluate((h) => document.querySelectorAll(h).forEach((e) => (e.style.visibility = 'hidden')), HIDE);
      const shot = await page.screenshot({
        clip: {
          x: Math.max(0, box.x), y: Math.max(0, box.y),
          width: Math.min(box.width, width - Math.max(0, box.x)),
          height: Math.min(box.height, height - Math.max(0, box.y)),
        },
      });
      await page.evaluate((h) => document.querySelectorAll(h).forEach((e) => (e.style.visibility = '')), HIDE);

      const ratio = await page.evaluate(async ([data, colour]) => {
        const chan = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        const lum = (c) => {
          const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map(chan);
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const img = new Image();
        img.src = data;
        await img.decode();
        const canvas = Object.assign(document.createElement('canvas'), { width: img.width, height: img.height });
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const L = [];
        for (let k = 0; k < px.length; k += 4) L.push(0.2126 * chan(px[k]) + 0.7152 * chan(px[k + 1]) + 0.0722 * chan(px[k + 2]));
        L.sort((a, b) => a - b);
        const bg = L[Math.floor(L.length * 0.02)];   // worst 2% of the backdrop
        const [hi, lo] = [bg, lum(colour)].sort((m, n) => n - m);
        return (hi + 0.05) / (lo + 0.05);
      }, ['data:image/png;base64,' + shot.toString('base64'), box.colour]);

      readings.push({ label, min, ratio, step: frame.title });

      // Paint order, checked by PIXEL rather than by hit-testing. A scrim with
      // `pointer-events: none` is invisible to elementFromPoint, so the label
      // can be reported "on top" while something is painting over it. If the
      // darkest pixel inside the box is much lighter than the ink itself, the
      // element is being washed out.
      if (['ετικέτα', 'τίτλος', 'κείμενο'].includes(label)) {
        const painted = await page.screenshot({
          clip: {
            x: Math.max(0, box.x), y: Math.max(0, box.y),
            width: Math.min(box.width, width - Math.max(0, box.x)),
            height: Math.min(box.height, height - Math.max(0, box.y)),
          },
        });
        const washed = await page.evaluate(async ([data, colour]) => {
          const chan = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          const lum = (c) => { const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map(chan);
            return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
          const img = new Image(); img.src = data; await img.decode();
          const cv = Object.assign(document.createElement('canvas'), { width: img.width, height: img.height });
          const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
          const px = cx.getImageData(0, 0, cv.width, cv.height).data;
          let darkest = 1;
          for (let k = 0; k < px.length; k += 4) {
            const L = 0.2126 * chan(px[k]) + 0.7152 * chan(px[k + 1]) + 0.0722 * chan(px[k + 2]);
            if (L < darkest) darkest = L;
          }
          // the real ink should show up somewhere in its own box
          return darkest > lum(colour) + 0.06;
        }, ['data:image/png;base64,' + painted.toString('base64'), box.colour]);
        if (washed) readings.push({ label: label + ' (σκεπασμένο)', min: 99, ratio: 0, step: frame.title });
      }
    }
  }

  const failed = readings.filter((r) => r.ratio < r.min);
  const tightest = readings.reduce((a, b) => (b.ratio - b.min < a.ratio - a.min ? b : a));
  const ok = !failed.length && !cropped && !buried && seen.size === 6 && !errors.length;
  if (!ok) failures++;

  console.log(
    `  ${ok ? '✅' : '❌'} ${name.padEnd(11)}${String(width).padStart(5)}×${String(height).padEnd(5)}` +
      ` ζεύγη ${seen.size}/6 · εικόνα ${cropped ? `❌ ${cropped}` : 'σωστή'} · κείμενο από πάνω ${buried ? `❌ ${buried}` : 'ναι'}` +
      ` · οριακό ${tightest.label} ${tightest.ratio.toFixed(2)}:1 (όριο ${tightest.min})`,
  );
  if (failed.length) {
    for (const f of failed.slice(0, 4)) {
      console.log(`       ❌ ${f.label} ${f.ratio.toFixed(2)}:1 < ${f.min} — «${f.step}»`);
    }
  }
  if (errors.length) console.log(`       ❌ ${errors[0]}`);
  await page.close();
}

await browser.close();
console.log(failures ? `\n  ❌ ${failures} μεγέθη με πρόβλημα\n` : '\n  όλα πέρασαν\n');
process.exit(failures ? 1 : 0);
