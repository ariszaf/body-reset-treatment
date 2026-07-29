/**
 * Services — the client's actual list. SIX treatments, named as the client
 * names them (Greek and English mixed, deliberately: that is how they are sold).
 *
 * Durations appear as length OPTIONS inside a treatment, never as separate
 * services — listing "60′" and "80′" as two rows implied twice as many kinds of
 * massage as exist. PRICES appear nowhere: they were supplied so the site would
 * be accurate about what is offered, not for publication.
 *
 * ⚠ Chiropractic is deliberately absent. An earlier draft advertised it
 * throughout; it is not on the client's list, and a health page must not
 * advertise a treatment that is not performed. The face treatment left the list
 * for the same reason — it was on an earlier version and is not on this one.
 *
 * ⚠ NEEDS THE CLIENT'S OWN WORDS, marked `@draft` below. Three treatments
 * arrived as names only. What is written for them describes the technique in
 * plain terms and claims no clinical outcome — enough to ship a page that is
 * not empty, not enough to be the client's voice. Deep tissue, Θεραπευτικό
 * μασάζ and Theragun therapy all need replacing before launch.
 *
 * CMS Schema (Sanity): document "service" { title, slug, category, durations, short, description }
 */
import type { IconName } from '@lib/icons';

export type Service = {
  title: string;
  icon: IconName;        // the treatment's line mark (BrandIcon)
  /* One or two words above the title in the showcase. ⚠ NEW COPY — not from the
     client's edited round. Needs a nod before launch. */
  category: string;
  slug: string;          // latin-transliterated, hyphenated; also the image key
  durations?: string[];  // length options, e.g. ['60′', '80′'] — omit when fixed
  short: string;         // 1 sentence (showcase / preview)
  description: string;   // 2–3 paragraphs (accordion)
};

export const services: Service[] = [
  {
    title: 'Σουηδικό μασάζ',
    slug: 'souidiko-masaz',
    icon: 'flow',
    category: 'Κλασική τεχνική',
    durations: ['60′', '80′'],
    short: 'Η κλασική τεχνική, σωστά εκτελεσμένη: συνεχής ροή, σταθερός ρυθμός.',
    description:
      'Συνεχείς, ρυθμικές κινήσεις σε όλο το σώμα, χωρίς απότομες μεταβάσεις. Αποτελεί τη βάση πάνω στην οποία χτίζεται κάθε πιο εξειδικευμένη παρέμβαση.\n\nΗ μεγαλύτερη διάρκεια αλλάζει ουσιαστικά την εμπειρία: μας επιτρέπει να καλύψουμε όλο το σώμα διεξοδικά, δίνοντας σε κάθε σημείο τον χρόνο που του αναλογεί.',
  },
  {
    /** @draft — όνομα από τον πελάτη, κείμενο δικό μας */
    title: 'Deep tissue',
    slug: 'deep-tissue',
    icon: 'depth',
    category: 'Βάθος',
    short: 'Αργή δουλειά στα βαθύτερα στρώματα, εκεί όπου η επιφανειακή πίεση δεν φτάνει.',
    description:
      'Η πίεση εφαρμόζεται αργά και σταδιακά, ώστε οι ιστοί να προλαβαίνουν να υποχωρήσουν αντί να αντιστέκονται. Δουλεύουμε σε λιγότερες περιοχές, με περισσότερο χρόνο στην καθεμία.\n\nΕίναι εντονότερη τεχνική από το σουηδικό και δεν είναι για κάθε συνεδρία. Η ένταση ρυθμίζεται σε συνεννόηση μαζί σας, σε όλη τη διάρκεια.',
  },
  {
    /** @draft — όνομα από τον πελάτη, κείμενο δικό μας */
    title: 'Θεραπευτικό μασάζ',
    slug: 'therapeftiko-masaz',
    icon: 'focus',
    category: 'Στοχευμένη δουλειά',
    short: 'Συνεδρία χτισμένη γύρω από ένα συγκεκριμένο σημείο που σας απασχολεί.',
    description:
      'Ξεκινά από την αξιολόγηση: πού εντοπίζεται η ενόχληση, από πότε υπάρχει, τι την επιδεινώνει και τι την ανακουφίζει. Η τεχνική επιλέγεται μετά από αυτό, όχι πριν.\n\nΗ συνεδρία μπορεί να συνδυάσει περισσότερες από μία προσεγγίσεις, ανάλογα με το τι χρειάζεται η περιοχή εκείνη τη μέρα.',
  },
  {
    title: 'Sports massage',
    slug: 'sports-massage',
    icon: 'sports',
    category: 'Αποκατάσταση',
    durations: ['60′', '80′'],
    short: 'Στοχευμένη δουλειά στις μυϊκές ομάδες που καταπονούνται από την προπόνηση — αποκατάσταση, όχι απλή χαλάρωση.',
    description:
      'Η συνεδρία εστιάζει στην περιοχή που σας απασχολεί: πού εντοπίζεται η ένταση, μετά από ποια κίνηση εμφανίστηκε, τι την επιδεινώνει. Η πίεση προσαρμόζεται στις ανάγκες των ιστών σας και όχι σε ένα προκαθορισμένο πρωτόκολλο.\n\nΤα 60 λεπτά αρκούν όταν η ένταση εντοπίζεται σε ένα συγκεκριμένο σημείο. Τα 80 λεπτά δίνουν τον απαραίτητο χρόνο για να καλύψουμε περισσότερες περιοχές ή για να δουλέψουμε την ίδια περιοχή σε μεγαλύτερο βάθος.',
  },
  {
    title: 'Cupping therapy',
    slug: 'cupping-therapy',
    icon: 'cups',
    category: 'Επίμονη ένταση',
    short: 'Βεντούζες σε συνδυασμό με μασάζ, για περιοχές όπου η ένταση δεν υποχωρεί μόνο με την πίεση.',
    description:
      'Οι βεντούζες συνδυάζονται αρμονικά με μασάζ σε περιοχές όπου η ένταση επιμένει. Η τοποθέτηση και ο χρόνος εφαρμογής προσαρμόζονται πλήρως στην κατάσταση των ιστών.\n\nΛαμβάνουμε πάντα εκ των προτέρων πλήρες ιστορικό, για τη δική σας ασφάλεια.',
  },
  {
    /** @draft — όνομα από τον πελάτη, κείμενο δικό μας */
    title: 'Theragun therapy',
    slug: 'theragun-therapy',
    icon: 'pulse',
    category: 'Κρουστική θεραπεία',
    short: 'Κρουστική συσκευή μαζί με δουλειά στα χέρια, για γρήγορη προετοιμασία ή αποφόρτιση.',
    description:
      'Η συσκευή δουλεύει σε σύντομα περάσματα πάνω στη μυϊκή ομάδα και συνδυάζεται με μάλαξη στα χέρια — η μία τεχνική προετοιμάζει την περιοχή για την άλλη.\n\nΧρησιμοποιείται στοχευμένα και για λίγο, όχι σε όλη τη συνεδρία. Λαμβάνουμε πάντα ιστορικό πριν την εφαρμογή.',
  },
];
