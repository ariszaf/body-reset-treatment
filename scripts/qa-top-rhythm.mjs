// Polarzee — έλεγχος ρυθμού κορυφής. Ships with the starter, never regenerated.
//
// Η τρύπα που κλείνει, σε δύο μισά — και τα δύο χτύπησαν σε πραγματικό site:
//
// 1. ΤΟ ΠΕΡΙΕΧΟΜΕΝΟ ΠΙΣΩ ΑΠΟ ΤΗ ΜΠΑΡΑ. Μια `position: fixed` κεφαλίδα είναι εκτός
//    ροής: κανένα section από κάτω δεν ξέρει ότι υπάρχει, και το py-section είναι
//    μικρότερο από τη μπάρα σε κάθε breakpoint. Ο h1 μιας σελίδας μετρήθηκε 24px
//    ΠΙΣΩ από τη μπάρα. Κανένα υπάρχον test δεν το έπιανε: δεν ξεχείλιζε τίποτα,
//    δεν έσπαγε τίποτα, το screenshot έδειχνε μια σελίδα που απλώς «ξεκινά ψηλά».
//
// 2. Η ΑΣΥΜΦΩΝΙΑ ΜΕΤΑΞΥ ΣΕΛΙΔΩΝ. Δύο σελίδες πλήρωναν μόνες τους τη μπάρα με δικό
//    τους νούμερο — δεύτερο αντίγραφο της γεωμετρίας της, που είχε ήδη αποκλίνει
//    (137px εκεί που η μπάρα μετριέται 166px). Αποτέλεσμα: δύο σελίδες με έναν
//    ρυθμό κορυφής και τρεις με άλλον. Καθεμιά ΞΕΧΩΡΙΣΤΑ έμοιαζε μια χαρά. Μόνο
//    η σύγκριση το δείχνει — γι' αυτό ο έλεγχος είναι εδώ και όχι σε screenshot.
//
// Τι μετράει: την απόσταση από το ΚΑΤΩ ΑΚΡΟ της κολλημένης κεφαλίδας μέχρι το
// πρώτο πράγμα που πραγματικά βάφει η <main>. Αυτή η απόσταση πρέπει να είναι
// (α) θετική — αλλιώς η σελίδα ξεκινά κάτω από τη μπάρα, και
// (β) Η ΙΔΙΑ σε κάθε σελίδα του site στο ίδιο πλάτος.
//
// Εξαίρεση: σελίδα που ΘΕΛΕΙ να περνά κάτω από τη μπάρα (full-bleed hero) το
// δηλώνει με `data-under-nav` στο πρώτο παιδί της <main>. Opt-in, ποτέ opt-out.
//
// Χρήση: QA_BASE="http://localhost:4321" node scripts/qa-top-rhythm.mjs
//        QA_ROUTES="/,/therapeies/"        (προαιρετικό — αλλιώς από pages.ts)
//        QA_RHYTHM_TOLERANCE="2"           (px· υποδιαστολές, όχι σχεδιαστικές διαφορές)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:4321';
const TOLERANCE = Number(process.env.QA_RHYTHM_TOLERANCE ?? 2);

/* Από pages.ts, όχι hardcoded: σελίδα που μπαίνει αύριο ελέγχεται από τη στιγμή
   που υπάρχει. Αυτό είναι το μισό του «δεν θα ξαναγίνει» — ένας έλεγχος που
   καλύπτει μόνο τις σελίδες που θυμήθηκες να γράψεις δεν καλύπτει τίποτα. */
const ROUTES = process.env.QA_ROUTES?.split(',') || (() => {
  try {
    const src = readFileSync('src/content/pages.ts', 'utf8');
    const slugs = [...src.matchAll(/^\s*slug:\s*'([^']*)'/gm)].map((m) => m[1]);
    const routes = slugs.filter((s) => s !== '404').map((s) => (s === '' ? '/' : `/${s}/`));
    if (routes.length) return routes;
  } catch { /* χωρίς content file — μόνο η αρχική */ }
  return ['/'];
})();

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1920, height: 1080 },
];

/* Μετριέται ΜΕΣΑ στη σελίδα: ποιο είναι το κάτω άκρο της κολλημένης κεφαλίδας,
   και πού ξεκινά το πρώτο πράγμα που βάφει η main. Η κεφαλίδα εντοπίζεται από
   τη ΣΥΜΠΕΡΙΦΟΡΑ της (fixed/sticky, κολλημένη στην κορυφή, πιάνει το πλάτος),
   όχι από κλάση — ώστε ο έλεγχος να δουλεύει σε κάθε site του εργοστασίου
   ανεξάρτητα από το ποιο nav module διάλεξε. */
const measure = () => {
  const vw = document.documentElement.clientWidth;
  let chrome = 0;
  let chromeName = '';
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.top > 2 || r.height === 0) continue;      // κολλημένη στην κορυφή
    if (r.width < vw * 0.6) continue;               // μπάρα, όχι κουμπί στη γωνία
    if (r.bottom > chrome) {
      chrome = r.bottom;
      chromeName = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\s+/)[0] : '');
    }
  }

  const main = document.getElementById('main') || document.querySelector('main');
  if (!main) return { skip: 'no <main>' };
  if (!chrome) return { skip: 'no fixed/sticky top chrome' };

  /* Η δηλωμένη εξαίρεση. Ελέγχεται σε ΟΛΑ τα άμεσα παιδιά: το πρώτο παιδί μπορεί
     να είναι <script type="application/ld+json"> (JSON-LD), που δεν βάφει τίποτα
     — και ένα `:first-child` που πέφτει πάνω του θα έψαχνε σε λάθος στοιχείο. */
  for (const child of main.children) {
    if (child.hasAttribute('data-under-nav')) return { exempt: true, chrome: Math.round(chrome) };
  }

  let top = Infinity;
  let what = '';
  for (const el of main.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
    const paints =
      el.tagName === 'IMG' ||
      el.tagName === 'SVG' ||
      [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!paints) continue;
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.width === 0) continue;
    if (r.top < top) {
      top = r.top;
      what = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\s+/)[0] : '');
    }
  }
  if (top === Infinity) return { skip: 'main paints nothing' };
  return { gap: Math.round(top - chrome), chrome: Math.round(chrome), chromeName, what };
};

const browser = await chromium.launch();
const rows = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 });
    } catch (e) {
      rows.push({ vp: vp.name, route, error: e.message.split('\n')[0] });
      await page.close();
      continue;
    }
    /* Το intro/veil καλύπτει τη σελίδα στην πρώτη επίσκεψη και τα reveals ξεκινούν
       στο opacity 0 — και τα δύο θα έδιναν λάθος «πρώτο μελάνι». Περίμενε το ένα,
       ξεκλείδωσε το άλλο. */
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    }).catch(() => {});
    await page.waitForTimeout(3200);
    const d = await page.evaluate(measure).catch((e) => ({ skip: 'measure failed: ' + e.message }));
    rows.push({ vp: vp.name, route, ...d });
    await page.close();
  }
  await ctx.close();
}
await browser.close();

// ── Αναφορά ───────────────────────────────────────────────────────────────
let failures = 0;
const pad = (s, n) => String(s).padEnd(n);
const widest = Math.max(...ROUTES.map((r) => r.length), 8);

for (const vp of VIEWPORTS) {
  const mine = rows.filter((r) => r.vp === vp.name);
  const measured = mine.filter((r) => typeof r.gap === 'number');
  const gaps = measured.map((r) => r.gap);
  const spread = gaps.length ? Math.max(...gaps) - Math.min(...gaps) : 0;

  console.log(`\n── ${vp.name} (${vp.width}px) ${'─'.repeat(30)}`);
  for (const r of mine) {
    if (r.error) { console.log(`   ${pad(r.route, widest)}  ⚠️  ${r.error}`); continue; }
    if (r.exempt) { console.log(`   ${pad(r.route, widest)}  ⤵️  data-under-nav (δηλωμένη εξαίρεση)`); continue; }
    if (r.skip) { console.log(`   ${pad(r.route, widest)}  —   ${r.skip}`); continue; }
    const behind = r.gap <= 0;
    const odd = spread > TOLERANCE && gaps.length > 1 && (r.gap === Math.min(...gaps) || r.gap === Math.max(...gaps));
    const mark = behind ? '❌' : odd ? '⚠️ ' : '✅';
    console.log(`   ${pad(r.route, widest)}  ${mark} ${String(r.gap).padStart(5)}px κάτω από ${r.chromeName} (${r.what})`);
    if (behind) failures++;
  }

  if (gaps.length > 1 && spread > TOLERANCE) {
    failures++;
    console.log(`   ${pad('', widest)}  ❌ ΔΙΑΣΠΟΡΑ ${spread}px — οι σελίδες δεν ξεκινούν στο ίδιο ύψος`);
  } else if (gaps.length > 1) {
    console.log(`   ${pad('', widest)}  ✅ διασπορά ${spread}px — ένας ρυθμός σε ${gaps.length} σελίδες`);
  }
}

if (failures) {
  console.log(`\n❌ ΡΥΘΜΟΣ ΚΟΡΥΦΗΣ: ${failures} αστοχίες.`);
  console.log(`   Αρνητικό/μηδενικό κενό = η σελίδα ξεκινά κάτω από τη μπάρα.`);
  console.log(`   Διασπορά = κάποια σελίδα πληρώνει τη μπάρα δεύτερη φορά με δικό της νούμερο,`);
  console.log(`   ή κρατά margin που οι υπόλοιπες δεν έχουν. Μία πηγή, ή καμία αρμονία.`);
  process.exit(1);
}
console.log(`\n✅ ΡΥΘΜΟΣ ΚΟΡΥΦΗΣ: κάθε σελίδα ξεκινά στο ίδιο ύψος κάτω από τη μπάρα, σε ${VIEWPORTS.length} πλάτη.`);
process.exit(0);
