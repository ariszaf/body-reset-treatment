// Polarzee QA runner — ships with the starter, never regenerated.
// Usage: QA_BASE="http://localhost:4321" QA_ROUTES="/,/therapeies" node scripts/qa-screenshots.mjs
// Requires playwright (npx --yes playwright@latest install chromium)
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:4321';
const ROUTES = process.env.QA_ROUTES?.split(',') || ['/'];
const VIEWPORTS = [
  { name: 'mobile-sm', width: 360,  height: 780 },  // narrow Android — overflow worst-case
  { name: 'mobile',    width: 390,  height: 844 },  // iPhone-class
  { name: 'tablet',    width: 768,  height: 1024 }, // iPad-class
  { name: 'desktop',   width: 1440, height: 900 },  // laptop/desktop
];

mkdirSync('qa-report', { recursive: true });
const browser = await chromium.launch();
const findings = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('requestfailed', r => errors.push('requestfailed: ' + r.url() + ' ' + (r.failure()?.errorText || '')));

    const url = BASE + route;
    let status = 0;
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      status = resp?.status() || 0;
    } catch (e) { errors.push('navigation: ' + e.message); }

    // Scroll through the page so IntersectionObserver reveals fire (otherwise
    // below-fold .reveal content screenshots as empty at opacity:0)
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      // settle: force any straggler reveals to their final state, wait out transitions
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      await new Promise((r) => setTimeout(r, 850));
    }).catch(() => {});

    // Horizontal overflow — per-element culprit scan (scrollWidth is blind when
    // html/body use overflow-x: clip). Reports the widest offender + a name.
    const overflowInfo = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const isClipped = (el) => {
        for (let a = el.parentElement; a; a = a.parentElement) {
          const o = getComputedStyle(a).overflowX;
          if (o === 'hidden' || o === 'clip') return true;
        }
        return false;
      };
      let worst = 0, name = '';
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.display === 'none') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        const over = Math.max(r.right - docW, -r.left);
        if (over > 1 && over > worst && !isClipped(el)) {
          worst = Math.round(over);
          name = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.') : '');
        }
      }
      return { px: worst, name };
    }).catch(() => ({ px: 0, name: '' }));
    const overflow = overflowInfo.px;

    // Tap-target check on mobile: links/buttons smaller than 40px
    const smallTargets = vp.name.startsWith('mobile') ? await page.evaluate(() => {
      const els = [...document.querySelectorAll('a, button, [role=button]')];
      return els.filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40);
      }).length;
    }).catch(() => 0) : 0;

    // Typography floor: any visible text computed below 17px (hard floor — Polarzee standing rule)
    const tinyText = await page.evaluate(() => {
      const offenders = [];
      for (const el of document.querySelectorAll('body *')) {
        if (!el.childNodes.length) continue;
        const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!hasText) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const px = parseFloat(cs.fontSize);
        if (px && px < 17) offenders.push(`${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 40)} ${px.toFixed(1)}px`);
      }
      return offenders.slice(0, 10);
    }).catch(() => []);

    const slug = (route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-|-$/g, '')) || 'home';
    const shot = `qa-report/${vp.name}__${slug}.png`;
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});

    findings.push({ viewport: vp.name, route, status, overflowPx: overflow, overflowCulprit: overflowInfo.name, smallTargets, tinyText, errors, shot });
    await page.close();
  }
  await ctx.close();
}
await browser.close();

writeFileSync('qa-report/report.json', JSON.stringify(findings, null, 2));

// Console summary
let problems = 0;
for (const f of findings) {
  const flags = [];
  if (f.status >= 400) flags.push(`HTTP ${f.status}`);
  if (f.overflowPx > 1) flags.push(`overflow ${f.overflowPx}px (${f.overflowCulprit || '?'})`);
  if (f.smallTargets > 0) flags.push(`${f.smallTargets} tiny tap-targets`);
  if (f.tinyText.length) flags.push(`${f.tinyText.length}+ texts <17px`);
  if (f.errors.length) flags.push(`${f.errors.length} console errors`);
  if (flags.length) {
    problems++;
    console.log(`❌ [${f.viewport}] ${f.route} — ${flags.join(', ')}`);
    f.tinyText.slice(0, 3).forEach(t => console.log(`     ↳ tiny: ${t}`));
    f.errors.slice(0, 5).forEach(e => console.log(`     ↳ ${e}`));
  } else {
    console.log(`✅ [${f.viewport}] ${f.route}`);
  }
}
console.log(`\n${problems} route/viewport combos with issues. Screenshots in qa-report/`);
process.exit(0);
