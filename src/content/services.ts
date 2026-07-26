/**
 * Services — the client's actual list.
 *
 * FOUR treatments, not six. The 60′/80′ split is a length OPTION inside one
 * treatment, not a separate service — listing them twice implied four kinds of
 * massage where there are two.
 *
 * Durations therefore DO appear, as options. That is the only way to express the
 * choice at all. PRICES still appear nowhere: they were supplied so the site
 * would be accurate about what is offered, not for publication.
 *
 * ⚠ Chiropractic is deliberately absent. An earlier draft of this site
 * advertised it throughout; it is not on the client's list, and a health page
 * must not advertise a treatment that is not performed.
 *
 * CMS Schema (Sanity): document "service" { title, slug, durations, short, description }
 */
import type { IconName } from '@lib/icons';

export type Service = {
  title: string;
  icon: IconName;        // the treatment's line mark (BrandIcon)
  slug: string;          // latin-transliterated, hyphenated
  durations?: string[];  // length options, e.g. ['60′', '80′'] — omit when fixed
  short: string;         // 1 sentence (list / preview)
  description: string;   // 2–3 paragraphs
};

export const services: Service[] = [
  {
    title: 'Αθλητικό Μασάζ',
    slug: 'athlitiko-masaz',
    icon: 'depth',
    durations: ['60′', '80′'],
    short: 'Στοχευμένη δουλειά στις μυϊκές ομάδες που καταπονεί η προπόνηση — αποκατάσταση, όχι χαλάρωση.',
    description:
      'Η συνεδρία ξεκινά από την περιοχή που σας απασχολεί: πού εντοπίζεται η ένταση, μετά από ποια κίνηση εμφανίστηκε, τι την επιδεινώνει. Η πίεση προσαρμόζεται στον ιστό και όχι σε ένα προκαθορισμένο πρωτόκολλο.\n\nΤα 60 λεπτά αρκούν όταν η ένταση είναι εντοπισμένη. Τα 80 δίνουν χρόνο για περισσότερες περιοχές, ή για την ίδια περιοχή σε μεγαλύτερο βάθος.',
  },
  {
    title: 'Σουηδικό Μασάζ',
    slug: 'souidiko-masaz',
    icon: 'flow',
    durations: ['60′', '80′'],
    short: 'Η κλασική τεχνική, εκτελεσμένη σωστά: συνεχής ροή, σταθερός ρυθμός.',
    description:
      'Συνεχείς, ρυθμικές κινήσεις σε όλο το σώμα, χωρίς απότομες μεταβάσεις. Είναι η βάση πάνω στην οποία χτίζεται κάθε πιο εξειδικευμένη παρέμβαση.\n\nΗ μεγαλύτερη διάρκεια αλλάζει ουσιαστικά τη συνεδρία: υπάρχει χρόνος να καλυφθεί όλο το σώμα χωρίς να επισπευστεί κανένα μέρος του.',
  },
  {
    title: 'Θεραπεία προσώπου και Μασάζ',
    slug: 'therapeia-prosopou-masaz',
    icon: 'face',
    short: 'Δουλειά στο πρόσωπο μαζί με αυχένα και ώμους — εκεί όπου μαζεύεται πρώτα η ένταση της ημέρας.',
    description:
      'Η θεραπεία προσώπου συνδυάζεται με δουλειά στον αυχένα και τους ώμους, γιατί η ένταση σπάνια σταματά στο σαγόνι.\n\nΉπια πίεση, χωρίς βιασύνη.',
  },
  {
    title: 'Θεραπεία με βεντούζες και μασάζ',
    slug: 'therapeia-ventouzes-masaz',
    icon: 'cups',
    short: 'Βεντούζες σε συνδυασμό με μασάζ, για περιοχές που δεν υποχωρούν μόνο με πίεση.',
    description:
      'Οι βεντούζες συνδυάζονται με μασάζ σε περιοχές όπου η ένταση επιμένει. Η τοποθέτηση και ο χρόνος παραμονής προσαρμόζονται στον ιστό.\n\nΕνημερωνόμαστε πάντα εκ των προτέρων για το ιστορικό σας.',
  },
];
