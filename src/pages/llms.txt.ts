/**
 * /llms.txt — light GEO (BAKED, both tiers). Auto-generated business summary for
 * AI engines (ChatGPT/Perplexity/Claude/Gemini), from site.ts + services + faq.
 * Premium `/geo` adds llms-full.txt + entity building + citation blocks on top.
 */
import type { APIRoute } from 'astro';
import { site } from '../content/site';
import { services } from '../content/services';
import { faq } from '../content/faq';

export const GET: APIRoute = () => {
  const L: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.tagline}`,
    '',
    site.description,
    '',
    '## Services',
    ...(services.length
      ? services.map((s) => `- ${s.title}: ${s.short}`)
      : ['- (δείτε τον ιστότοπο για τις υπηρεσίες)']),
    '',
    '## Contact',
    `- Phone: ${site.phone}`,
    `- Email: ${site.email}`,
    /* Mobile service — there is no premises to give. Publishing "‚ Αθήνα " with
       an empty street told AI engines the address was simply missing; the
       coverage area is the fact that actually describes this business. */
    `- Service area: ${site.serviceArea} (κατ’ οίκον — no premises)`,
    ...(site.hours ? [`- Hours: ${site.hours}`] : []),
    '',
    '## Location',
    `${site.name} — ${site.location}, ${site.address.country === 'GR' ? 'Ελλάδα' : site.address.country}.`,
    '',
    '## Website',
    site.url,
  ];

  if (faq.length) {
    L.push('', '## FAQ');
    for (const f of faq.slice(0, 5)) L.push(`Q: ${f.question}`, `A: ${f.answer}`, '');
  }

  return new Response(L.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
