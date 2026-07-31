/**
 * Active pages + per-page SEO meta — feeds src/lib/meta.ts (auto-meta contract).
 * Add a page here → title/description/canonical/OG auto-generate. NEVER write manual meta tags.
 * Slugs: latin-transliterated ONLY (map in seo.md) — never Greek chars / %-encoding.
 */
export type PageMeta = {
  slug: string;
  /** Χειροκίνητος τίτλος/περιγραφή Google. Όταν λείπουν, παράγονται από
   *  site.ts + keyword (meta.ts). Μπαίνουν μόνο όταν το κείμενο είναι
   *  γραμμένο και εγκεκριμένο — αλλιώς η αυτόματη μορφή είναι ασφαλέστερη. */
  title?: string;
  description?: string;            // '' = home · 'therapeies', 'epikoinonia', …
  nameEl: string;          // 'Θεραπείες'
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
    title: 'Body Reset Treatment | Μασάζ κατ’ οίκον Αθήνα',
    description:
      'Εξειδικευμένο αθλητικό και σουηδικό μασάζ, θεραπεία προσώπου και βεντούζες. Απολαύστε τη συνεδρία στον δικό σας χώρο στην Αθήνα, κατόπιν ραντεβού.',
    descriptionHint: 'Αθλητικό και σουηδικό μασάζ, θεραπεία προσώπου και βεντούζες, στον δικό σας χώρο.',
    excerpt: 'Θεραπείες σώματος στον δικό σας χώρο — αθλητικό μασάζ, σουηδικό μασάζ, βεντούζες.',
    inNav: true,
  },
  {
    slug: 'poioi-eimaste',
    nameEl: 'Ποιοι Είμαστε',
    keyword: 'αθλητικό μασάζ κατ’ οίκον',
    title: 'Ποιοι Είμαστε | Μασάζ κατ’ οίκον Αθήνα | Body Reset',
    description:
      'Η προσέγγιση πίσω από κάθε συνεδρία αθλητικού και σουηδικού μασάζ — μία επίσκεψη τη φορά, αποκλειστικά στον δικό σας χώρο στην Αθήνα.',
    descriptionHint: 'Η προσέγγιση πίσω από κάθε συνεδρία — μία επίσκεψη τη φορά, στον δικό σας χώρο.',
    excerpt: 'Μια προσέγγιση που ξεκινά από το σώμα, όχι από το πρόγραμμα — στον δικό σας χώρο.',
    inNav: true,
  },
  {
    slug: 'therapeies',
    nameEl: 'Θεραπείες',
    keyword: 'θεραπείες μασάζ κατ’ οίκον',
    descriptionHint: 'Έξι θεραπείες σώματος στον δικό σας χώρο — σουηδικό, deep tissue, θεραπευτικό, sports, βεντούζες, Theragun.',
    excerpt: 'Οι έξι θεραπείες του Body Reset Treatment, αναλυτικά — τι περιλαμβάνει η καθεμία.',
    inNav: true,
  },

  {
    slug: 'epikoinonia',
    nameEl: 'Επικοινωνία',
    keyword: 'ραντεβού μασάζ κατ’ οίκον Αθήνα',
    descriptionHint: 'Τηλέφωνο, online κράτηση ή μήνυμα — κλείστε ραντεβού για θεραπεία στον δικό σας χώρο.',
    excerpt: 'Τηλέφωνο, online κράτηση ή μήνυμα — διαλέξτε ό,τι σας βολεύει.',
    /* NOT in the menu. Every «Κλείστε ραντεβού» button on the site already
       lands here, and a second entry saying the same thing one line above the
       menu's own appointment item was the menu repeating itself. The page is
       reachable, indexed and in the sitemap — it just is not listed twice. */
    inNav: false,
  },

  /* One page per treatment. `nameEl` is the treatment's own name, so the title,
     the breadcrumb and the navigation all read the same without restating it.
     Each keyword is DISTINCT: two pages competing for the same phrase is two
     pages ranking for neither. */
  {
    slug: 'therapeies/souidiko-masaz',
    nameEl: 'Σουηδικό μασάζ',
    keyword: 'σουηδικό μασάζ κατ’ οίκον',
    descriptionHint: 'Η κλασική τεχνική, σωστά εκτελεσμένη: συνεχής ροή και σταθερός ρυθμός, στον δικό σας χώρο.',
    inNav: false,
  },
  {
    slug: 'therapeies/deep-tissue',
    nameEl: 'Deep tissue',
    keyword: 'deep tissue μασάζ Αθήνα',
    descriptionHint: 'Αργή δουλειά στα βαθύτερα στρώματα, εκεί όπου η επιφανειακή πίεση δεν φτάνει.',
    inNav: false,
  },
  {
    slug: 'therapeies/therapeftiko-masaz',
    nameEl: 'Θεραπευτικό μασάζ',
    keyword: 'θεραπευτικό μασάζ Αθήνα',
    descriptionHint: 'Συνεδρία χτισμένη γύρω από ένα συγκεκριμένο σημείο που σας απασχολεί, μετά από αξιολόγηση.',
    inNav: false,
  },
  {
    slug: 'therapeies/sports-massage',
    nameEl: 'Sports massage',
    keyword: 'sports massage Αθήνα',
    descriptionHint: 'Στοχευμένη δουλειά στις μυϊκές ομάδες που καταπονούνται από την προπόνηση — αποκατάσταση.',
    inNav: false,
  },
  {
    slug: 'therapeies/cupping-therapy',
    nameEl: 'Cupping therapy',
    keyword: 'cupping therapy Αθήνα',
    descriptionHint: 'Βεντούζες σε συνδυασμό με μασάζ, για περιοχές όπου η ένταση δεν υποχωρεί με την πίεση.',
    inNav: false,
  },
  {
    slug: 'therapeies/theragun-therapy',
    nameEl: 'Theragun therapy',
    keyword: 'theragun therapy Αθήνα',
    descriptionHint: 'Κρουστική συσκευή μαζί με δουλειά στα χέρια, για γρήγορη προετοιμασία ή αποφόρτιση.',
    inNav: false,
  },

  /* Legal page — ONE combined page (Όροι + Απόρρητο + Cookies), ALWAYS present, footer-linked (spec: legal.md) */
  { slug: 'oroi-xrisis-kai-politiki-aporritou', nameEl: 'Όροι Χρήσης & Πολιτική Απορρήτου', keyword: 'όροι χρήσης πολιτική απορρήτου', descriptionHint: 'Όροι χρήσης, πολιτική απορρήτου και cookies του ιστότοπου.', inNav: false },

  /* Custom 404 — ALWAYS present, branded (spec: pages.md) */
  { slug: '404', nameEl: 'Η σελίδα δεν βρέθηκε', keyword: '404', descriptionHint: 'Η σελίδα που αναζητάτε δεν υπάρχει πλέον ή έχει μετακινηθεί.', inNav: false },
];
