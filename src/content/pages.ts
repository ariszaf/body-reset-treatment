/**
 * Active pages + per-page SEO meta — feeds src/lib/meta.ts (auto-meta contract).
 * Add a page here → title/description/canonical/OG auto-generate. NEVER write manual meta tags.
 * Slugs: latin-transliterated ONLY (map in seo.md) — never Greek chars / %-encoding.
 */
export type PageMeta = {
  slug: string;            // '' = home · 'ypiresies', 'epikoinonia', …
  nameEl: string;          // 'Υπηρεσίες'
  keyword: string;         // primary (focus) keyword — must be UNIQUE per page
  descriptionHint: string; // one-line hint — meta.ts expands it (≤155 final)
  excerpt?: string;        // 1–2 sentence summary (≤160) — cards, RSS, OG fallback
  ogImage?: string;
  inNav?: boolean;         // main navigation (legal pages: footer only)
};

export const pages: PageMeta[] = [
  {
    slug: '',
    nameEl: 'Αρχική',
    keyword: 'μασάζ κατ’ οίκον Αθήνα',
    descriptionHint: 'Αθλητικό και σουηδικό μασάζ, θεραπεία προσώπου και βεντούζες, στον δικό σας χώρο.',
    excerpt: 'Θεραπείες σώματος στον δικό σας χώρο — αθλητικό μασάζ, σουηδικό μασάζ, βεντούζες.',
    inNav: true,
  },
  {
    slug: 'poioi-eimaste',
    nameEl: 'Ποιοι Είμαστε',
    keyword: 'αθλητικό μασάζ κατ’ οίκον',
    descriptionHint: 'Η προσέγγιση πίσω από κάθε συνεδρία — μία επίσκεψη τη φορά, στον δικό σας χώρο.',
    excerpt: 'Μια προσέγγιση που ξεκινά από το σώμα, όχι από το πρόγραμμα — στον δικό σας χώρο.',
    inNav: true,
  },
  // Φάση 2: ypiresies, epikoinonia

  /* Legal page — ONE combined page (Όροι + Απόρρητο + Cookies), ALWAYS present, footer-linked (spec: legal.md) */
  { slug: 'oroi-xrisis-kai-politiki-aporritou', nameEl: 'Όροι Χρήσης & Πολιτική Απορρήτου', keyword: 'όροι χρήσης πολιτική απορρήτου', descriptionHint: 'Όροι χρήσης, πολιτική απορρήτου και cookies του ιστότοπου.', inNav: false },

  /* Custom 404 — ALWAYS present, branded (spec: pages.md) */
  { slug: '404', nameEl: 'Η σελίδα δεν βρέθηκε', keyword: '404', descriptionHint: 'Η σελίδα που ψάχνετε δεν υπάρχει ή έχει μετακινηθεί.', inNav: false },
];
