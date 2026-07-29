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
  /* One or two words above the title in the showcase. ⚠ NEW COPY — not from the
     client's edited round; each is lifted from that treatment's own approved
     `short` line so nothing new is being claimed. Needs a nod before launch. */
  category: string;
  slug: string;          // latin-transliterated, hyphenated
  durations?: string[];  // length options, e.g. ['60′', '80′'] — omit when fixed
  short: string;         // 1 sentence (list / preview)
  description: string;   // 2–3 paragraphs
};

export const services: Service[] = [
  {
    title: 'Αθλητικό Μασάζ',
    slug: 'athlitiko-masaz',
    category: 'Αποκατάσταση',
    icon: 'depth',
    durations: ['60′', '80′'],
    short: 'Στοχευμένη δουλειά στις μυϊκές ομάδες που καταπονούνται από την προπόνηση — αποκατάσταση, όχι απλή χαλάρωση.',
    description:
      'Η συνεδρία εστιάζει στην περιοχή που σας απασχολεί: πού εντοπίζεται η ένταση, μετά από ποια κίνηση εμφανίστηκε, τι την επιδεινώνει. Η πίεση προσαρμόζεται στις ανάγκες των ιστών σας και όχι σε ένα προκαθορισμένο πρωτόκολλο.\n\nΤα 60 λεπτά αρκούν όταν η ένταση εντοπίζεται σε ένα συγκεκριμένο σημείο. Τα 80 λεπτά δίνουν τον απαραίτητο χρόνο για να καλύψουμε περισσότερες περιοχές ή για να δουλέψουμε την ίδια περιοχή σε μεγαλύτερο βάθος.',
  },
  {
    title: 'Σουηδικό Μασάζ',
    slug: 'souidiko-masaz',
    category: 'Κλασική τεχνική',
    icon: 'flow',
    durations: ['60′', '80′'],
    short: 'Η κλασική τεχνική, σωστά εκτελεσμένη: συνεχής ροή, σταθερός ρυθμός.',
    description:
      'Συνεχείς, ρυθμικές κινήσεις σε όλο το σώμα, χωρίς απότομες μεταβάσεις. Αποτελεί τη βάση πάνω στην οποία χτίζεται κάθε πιο εξειδικευμένη παρέμβαση.\n\nΗ μεγαλύτερη διάρκεια αλλάζει ουσιαστικά την εμπειρία: μας επιτρέπει να καλύψουμε όλο το σώμα διεξοδικά, δίνοντας σε κάθε σημείο τον χρόνο που του αναλογεί.',
  },
  {
    title: 'Θεραπεία προσώπου και Μασάζ',
    slug: 'therapeia-prosopou-masaz',
    category: 'Πρόσωπο & αυχένας',
    icon: 'face',
    short: 'Θεραπεία προσώπου σε συνδυασμό με αυχένα και ώμους — τα σημεία όπου συσσωρεύεται πρώτα η ένταση της ημέρας.',
    description:
      'Η θεραπεία προσώπου συνδυάζεται με μάλαξη στον αυχένα και τους ώμους, καθώς η συσσωρευμένη ένταση σπάνια σταματά στο σαγόνι.\n\nΉπιες πιέσεις, με απόλυτη ηρεμία και χωρίς βιασύνη.',
  },
  {
    title: 'Θεραπεία με βεντούζες και μασάζ',
    slug: 'therapeia-ventouzes-masaz',
    category: 'Επίμονη ένταση',
    icon: 'cups',
    short: 'Βεντούζες σε συνδυασμό με μασάζ, για περιοχές όπου η ένταση δεν υποχωρεί μόνο με την πίεση.',
    description:
      'Οι βεντούζες συνδυάζονται αρμονικά με μασάζ σε περιοχές όπου η ένταση επιμένει. Η τοποθέτηση και ο χρόνος εφαρμογής προσαρμόζονται πλήρως στην κατάσταση των ιστών.\n\nΛαμβάνουμε πάντα εκ των προτέρων πλήρες ιστορικό, για τη δική σας ασφάλεια.',
  },
];
