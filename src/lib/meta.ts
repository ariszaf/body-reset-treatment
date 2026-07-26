/**
 * Auto-meta system — NO page ever writes its own <title>/<meta description>.
 * Everything derives from src/content/pages.ts + site.ts (contract: foundation.md).
 * To change a page's Google appearance: edit its pages.ts entry, never the page file.
 */
import { site } from '../content/site';
import { pages, type PageMeta } from '../content/pages';

export function getPage(slug: string): PageMeta {
  const page = pages.find((p) => p.slug === slug);
  if (!page) throw new Error(`[meta] No pages.ts entry for slug "${slug}" — add one (auto-meta contract).`);
  return page;
}

/** Title ≤60 chars. Home: "{Business} | {Tagline}" · inner: "{Page} | {Business} {Location}" */
export function generateTitle(page: PageMeta): string {
  if (page.title) return page.title;   // εγκεκριμένο κείμενο — δεν το πειράζουμε
  const title =
    page.slug === ''
      ? `${site.name} | ${site.tagline}`
      : `${page.nameEl} | ${site.name} ${site.location}`;
  return title.length > 60 ? `${page.nameEl} | ${site.name}`.slice(0, 60) : title;
}

/** Description ≤155 chars — keyword + location (+ CTA/phone where it fits). */
export function generateDescription(page: PageMeta): string {
  if (page.description) return page.description;   // εγκεκριμένο κείμενο
  let desc = page.descriptionHint || page.excerpt || `${page.keyword} — ${site.name}, ${site.location}.`;
  if (!desc.includes(site.location)) desc = `${desc.replace(/\.?\s*$/, '')} στ${site.locationArticle ?? 'ην'} ${site.location}.`;
  const cta = ` Καλέστε: ${site.phone}.`;
  if (site.phone && desc.length + cta.length <= 155) desc += cta;
  return desc.length > 155 ? desc.slice(0, 152).replace(/\s+\S*$/, '') + '…' : desc;
}

export function canonicalFor(slug: string): string {
  const path = slug === '' ? '/' : `/${slug}/`;
  return new URL(path, site.url).href;
}

export function generateOgData(page: PageMeta) {
  return {
    title: generateTitle(page),
    description: generateDescription(page),
    url: canonicalFor(page.slug),
    image: new URL(page.ogImage ?? '/images/general/og.jpg', site.url).href,
    locale: 'el_GR',
    type: 'website',
    siteName: site.name,
  };
}
