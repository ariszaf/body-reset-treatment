import { chromium } from 'playwright';
const ROUTES = ['/','/poioi-eimaste','/therapeies','/epikoinonia','/therapeies/cupping-therapy'];
const STOP = new Set(['το','τη','την','του','της','των','και','σε','στο','στη','στην','στον','με','για','από','ένα','μια','μία','που','δεν','είναι','σας','μας','ο','η','οι','τα','ή']);
const norm = (w) => w.toLowerCase().replace(/[·.,—–:;!?()«»"']/g,'')
  .replace(/[άΆ]/g,'α').replace(/[έΈ]/g,'ε').replace(/[ήΉ]/g,'η').replace(/[ίΊϊΐ]/g,'ι')
  .replace(/[όΌ]/g,'ο').replace(/[ύΎϋΰ]/g,'υ').replace(/[ώΏ]/g,'ω').replace(/ς$/,'σ');
const stem = (w) => norm(w).replace(/(εσ|ων|ασ|ουσ|οι|ου|ο|α|η|ι|υ|ε)$/,'');
const b = await chromium.launch();
let bad = 0;
for (const r of ROUTES) {
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto('http://localhost:4321'+r, { waitUntil:'networkidle' });
  await p.waitForTimeout(2500);
  const blocks = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('section, .pinned-inner').forEach((sec) => {
      if (sec.closest('footer')) return;
      const eb = sec.querySelector('.text-eyebrow');
      const hd = sec.querySelector('h1, h2');
      if (eb && hd && eb === hd) return;          // η ίδια η επικεφαλίδα, όχι ζεύγος
      const lead = sec.querySelector('.text-lead, .page-lead');
      if (!eb && !hd) return;
      out.push({ eyebrow: eb?.textContent.trim() || '', head: hd?.textContent.trim() || '',
                 lead: lead?.textContent.trim().slice(0,120) || '' });
    });
    return out;
  });
  const hits = [];
  const words = (t) => t.split(/\s+/).filter(w => w && !STOP.has(norm(w))).map(stem).filter(w => w.length > 3);
  for (const bl of blocks) {
    const e = new Set(words(bl.eyebrow));
    for (const w of words(bl.head)) if (e.has(w)) hits.push(`${bl.eyebrow} ／ ${bl.head}  → «${w}»`);
    const eh = new Set([...e, ...words(bl.head)]);
    for (const w of words(bl.lead)) if (eh.has(w)) hits.push(`${bl.eyebrow||bl.head} ／ εισαγωγή  → «${w}»`);
  }
  if (hits.length) bad++;
  console.log(`${r.padEnd(30)} ${hits.length ? '❌' : '✅'}`);
  [...new Set(hits)].forEach(h => console.log('     ' + h));
  await p.close();
}
await b.close();
