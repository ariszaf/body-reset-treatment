/**
 * FAQ — feeds /llms.txt (AI engines) and, when an FAQ section is added, the
 * FAQPage JSON-LD schema (seo.md §5).
 *
 * Every answer restates something the site already establishes: at-home service,
 * what the space needs, no packages, appointment only. Nothing is invented —
 * no credentials, no durations beyond the treatment names, no prices.
 *
 * ⚠ The coverage area and the space requirement are still assumptions (TODO.md),
 * and they appear here too — correcting them means correcting both places.
 *
 * CMS Schema (Sanity): document "faq" { question, answer, order }
 */
export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: 'Έρχεστε στο σπίτι;',
    answer:
      'Ναι. Το Body Reset Treatment είναι υπηρεσία κατ’ οίκον — η συνεδρία γίνεται στον δικό σας χώρο, στην Αθήνα και τις γύρω περιοχές. Δεν υπάρχει κατάστημα ή studio.',
  },
  {
    question: 'Τι χρειάζεται να έχω στο σπίτι;',
    answer:
      'Μόνο έναν ελεύθερο χώρο περίπου δύο επί δύο μέτρα — το σαλόνι ή η κρεβατοκάμαρα αρκούν. Το επαγγελματικό κρεβάτι, τα καθαρά λινά και τα έλαια τα φέρνουμε εμείς σε κάθε επίσκεψη.',
  },
  {
    question: 'Τι θεραπείες κάνετε;',
    answer:
      'Τέσσερις: αθλητικό μασάζ και σουηδικό μασάζ — και τα δύο σε διάρκεια 60 ή 80 λεπτών — θεραπεία προσώπου με μασάζ, και θεραπεία με βεντούζες σε συνδυασμό με μασάζ.',
  },
  {
    question: 'Πώς κλείνω ραντεβού;',
    answer:
      'Αφήνετε τα στοιχεία σας στη φόρμα του ιστότοπου και σας καλούμε για να βρούμε μαζί την πρώτη διαθέσιμη ώρα. Μπορείτε επίσης να τηλεφωνήσετε απευθείας. Δεχόμαστε αποκλειστικά κατόπιν ραντεβού.',
  },
  {
    question: 'Πουλάτε πακέτα συνεδριών;',
    answer:
      'Όχι. Η επόμενη συνεδρία ορίζεται μόνο αν έχει νόημα — δεν προπωλούνται σειρές συνεδριών ούτε υπάρχει δέσμευση.',
  },
  {
    question: 'Πόσα ραντεβού δέχεστε ταυτόχρονα;',
    answer:
      'Ένα. Δεν υπάρχει επόμενος στην αναμονή, ώστε ο χρόνος που κλείνετε να είναι ο χρόνος που πραγματικά παίρνετε.',
  },
];
