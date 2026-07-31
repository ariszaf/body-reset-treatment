/**
 * FAQ — feeds /llms.txt (AI engines) and, when an FAQ section is added, the
 * FAQPage JSON-LD schema (seo.md §5).
 *
 * Every answer restates something the site already establishes: at-home service,
 * what the space needs, no packages, appointment only. Nothing is invented —
 * no credentials, no durations, no prices — only the treatment names.
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
      'Ναι. Το Body Reset Treatment λειτουργεί αποκλειστικά κατ’ οίκον. Η συνεδρία πραγματοποιείται στον δικό σας χώρο, σε όλη την Αθήνα και τα περίχωρα. Δεν διατηρούμε φυσικό κατάστημα ή studio.',
  },
  {
    question: 'Τι χρειάζεται να έχω στο σπίτι;',
    answer:
      'Το μόνο που χρειάζεται είναι ένας ελεύθερος χώρος περίπου δύο επί δύο μέτρα — το σαλόνι ή το υπνοδωμάτιο είναι ιδανικά. Τον επαγγελματικό εξοπλισμό, το κρεβάτι, τα καθαρά λινά και τα έλαια τα φέρνουμε εμείς σε κάθε επίσκεψη.',
  },
  {
    question: 'Τι θεραπείες κάνετε;',
    answer:
      'Προσφέρουμε έξι θεραπείες: σουηδικό μασάζ, deep tissue, θεραπευτικό μασάζ, sports massage, cupping therapy και Theragun therapy. Ποια ταιριάζει κρίνεται στην αξιολόγηση, στην αρχή της συνεδρίας.',
  },
  {
    question: 'Πώς κλείνω ραντεβού;',
    answer:
      'Μπορείτε να αφήσετε τα στοιχεία σας στη φόρμα επικοινωνίας του ιστότοπου και θα σας καλέσουμε άμεσα για να βρούμε την πρώτη διαθέσιμη ώρα. Φυσικά, μπορείτε να τηλεφωνήσετε και απευθείας. Δεχόμαστε επισκέψεις αποκλειστικά κατόπιν ραντεβού.',
  },
  {
    question: 'Πουλάτε πακέτα συνεδριών;',
    answer:
      'Όχι. Το επόμενο ραντεβού ορίζεται μόνο εφόσον κρίνεται σκόπιμο για την αποκατάστασή σας. Δεν προπωλούμε σειρές συνεδριών και δεν υπάρχει καμία δέσμευση με πακέτα.',
  },
  {
    question: 'Πόσα ραντεβού δέχεστε ταυτόχρονα;',
    answer:
      'Μόνο ένα. Δεν υπάρχει ποτέ επόμενος πελάτης στην αναμονή, διασφαλίζοντας πως ο χρόνος που κλείνετε είναι ο χρόνος που απολαμβάνετε εξ ολοκλήρου, χωρίς καμία πίεση χρόνου.',
  },
];
