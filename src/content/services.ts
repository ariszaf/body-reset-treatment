/**
 * Services — the client's actual list. SIX treatments, named as the client
 * names them (Greek and English mixed, deliberately: that is how they are sold).
 *
 * COPY: supplied by the client, 31/07/2026, and used as written. Every
 * `description`, `forWhom`, `benefits` and `cautions` line here is theirs. The
 * `@draft` markers that stood on three of these are gone — this is the voice
 * they were waiting for.
 *
 * ⚠ CAUTIONS ARE NOT DECORATION. `cautions` is a contraindications list on a
 * health page: who should NOT have this treatment. It renders on the treatment's
 * own page, in full, never folded away behind a control. If a treatment is added
 * without one, the page will show nothing there — and that is a bug, not a
 * styling choice.
 *
 * NO DURATIONS and NO PRICES anywhere. Both were supplied so the site would be
 * accurate about what is offered, not for publication — and the client has since
 * asked for the lengths to come off the page too. The `durations` field stays in
 * the type and the page still renders it when present, so putting them back is
 * one line per treatment; nothing else is holding them out.
 *
 * ⚠ Chiropractic is deliberately absent. An earlier draft advertised it
 * throughout; it is not on the client's list, and a health page must not
 * advertise a treatment that is not performed. The face treatment left the list
 * for the same reason — it was on an earlier version and is not on this one.
 *
 * CMS Schema (Sanity): document "service"
 *   { title, slug, durations, short, description, forWhom, benefits[], cautions[] }
 */
export type Service = {
  title: string;
  slug: string;          // latin-transliterated, hyphenated; also the image key
  durations?: string[];  // length options, e.g. ['60′', '80′'] — omit when fixed
  /* 1 sentence — the showcase on the homepage, the cards on /therapeies/, and
     the line under the H1 of the treatment's own page. COMPRESSED FROM THE
     CLIENT'S `description`, not written beside it: the two are read seconds
     apart on the same page, so anything invented here would be a second,
     competing account of the same treatment. */
  short: string;
  description: string;   // what the technique is, in the client's words
  forWhom: string;       // who it is for
  benefits: string[];    // what it does
  cautions: string[];    // contraindications — see the warning above
};

export const services: Service[] = [
  {
    title: 'Σουηδικό μασάζ',
    slug: 'souidiko-masaz',
    short: 'Απαλές έως μέτριες ρυθμικές πιέσεις που χαλαρώνουν το νευρικό σύστημα και αποβάλλουν το στρες.',
    description:
      'Η κλασική και πλέον αναγνωρισμένη μέθοδος χαλάρωσης, σχεδιασμένη για την αναζωογόνηση του σώματος και του πνεύματος. Με απαλές έως μέτριες ρυθμικές πιέσεις, βελτιώνει την κυκλοφορία του αίματος, αποβάλλει το καθημερινό στρες και χαλαρώνει το νευρικό σύστημα.',
    forWhom:
      'Σε όσους αναζητούν βαθιά χαλάρωση, αποσυμπίεση από το καθημερινό άγχος και βελτίωση της ποιότητας του ύπνου.',
    benefits: [
      'Μείωση του στρες και των επιπέδων κορτιζόλης.',
      'Βελτίωση της αιματικής και λεμφικής κυκλοφορίας.',
      'Ανακούφιση από την ήπια μυϊκή κόπωση.',
    ],
    cautions: [
      'Πυρετός ή οξεία λοίμωξη.',
      'Δερματικές φλεγμονές, ανοιχτές πληγές ή σοβαροί κιρσοί.',
    ],
  },
  {
    title: 'Deep tissue',
    slug: 'deep-tissue',
    short: 'Αργές, στοχευμένες πιέσεις στις βαθύτερες στοιβάδες, εκεί όπου κάθονται οι χρόνιοι κόμποι.',
    description:
      'Εξειδικευμένη τεχνική που εστιάζει στις βαθύτερες στοιβάδες των μυϊκών ινών και του συνδετικού ιστού. Χρησιμοποιώντας αργές, στοχευμένες πιέσεις, απελευθερώνει τις χρόνιες μυϊκές συσπάσεις («κόμπους») και αποκαθιστά τη φυσική ελαστικότητα του μυός.',
    forWhom:
      'Σε άτομα με χρόνιες μυϊκές εντάσεις, κακή στάση σώματος λόγω καθιστικής εργασίας ή έντονη σωματική καταπόνηση.',
    benefits: [
      'Λύση των χρόνιων μυϊκών συσπάσεων και σημείων πυροδότησης πόνου (trigger points).',
      'Αποκατάσταση του εύρους κίνησης των αρθρώσεων.',
      'Βελτίωση της στάσης του σώματος.',
    ],
    cautions: [
      'Πρόσφατοι τραυματισμοί ή οξείες φλεγμονές.',
      'Οστεοπόρωση ή λήψη αντιπηκτικών φαρμάκων.',
    ],
  },
  {
    title: 'Θεραπευτικό μασάζ',
    slug: 'therapeftiko-masaz',
    short: 'Κλινικά προσανατολισμένη δουλειά σε συγκεκριμένη μυοσκελετική ενόχληση: αυχένα, μέση, αρθρώσεις.',
    description:
      'Μια στοχευμένη, κλινικά προσανατολισμένη θεραπεία που συνδυάζει ανατομικές γνώσεις και εξειδικευμένους χειρισμούς. Εστιάζει στην αντιμετώπιση συγκεκριμένων μυοσκελετικών ενοχλήσεων, στην ανακούφιση από τον πόνο και στην αποκατάσταση της λειτουργικότητας.',
    forWhom:
      'Σε όσους ταλαιπωρούνται από αυχενικό σύνδρομο, οσφυαλγία, ισχιαλγία ή πόνους στις αρθρώσεις.',
    benefits: [
      'Στοχευμένη ανακούφιση από μυοσκελετικούς πόνους.',
      'Μείωση της φλεγμονής και της μυϊκής δυσκαμψίας.',
      'Βελτίωση της λειτουργικής ικανότητας του σώματος.',
    ],
    cautions: [
      'Οξεία φάση τραυματισμού (πρώτες 48 ώρες).',
      'Σοβαρές καρδιαγγειακές παθήσεις ή θρομβώσεις.',
    ],
  },
  {
    title: 'Sports massage',
    slug: 'sports-massage',
    short: 'Δυναμικές τεχνικές και διατάσεις, πριν ή μετά την προπόνηση, για απόδοση και ταχεία αποθεραπεία.',
    description:
      'Εξειδικευμένη μέθοδος αποκατάστασης για αθλητές και δραστήρια άτομα. Εφαρμόζεται πριν ή μετά την προπόνηση ή τον αγώνα, συνδυάζοντας δυναμικές τεχνικές και διατάσεις για τη βελτιστοποίηση της απόδοσης και την ταχεία αποθεραπεία.',
    forWhom:
      'Σε αθλητές, ασκούμενους και άτομα με υψηλά επίπεδα σωματικής δραστηριότητας.',
    benefits: [
      'Επιτάχυνση της μυϊκής αποκατάστασης και μείωση του «πιασίματος» (DOMS).',
      'Πρόληψη τραυματισμών και βελτίωση της μυϊκής ελαστικότητας.',
      'Αποβολή του γαλακτικού οξέος από τους μύες.',
    ],
    cautions: [
      'Πρόσφατες μυϊκές θλάσεις ή ρήξεις συνδέσμων.',
      'Ανοιχτές πληγές ή εκδορές.',
    ],
  },
  {
    title: 'Cupping therapy',
    slug: 'cupping-therapy',
    short: 'Αρνητική πίεση που αυξάνει την αιμάτωση, αποσυμφορεί τους ιστούς και απελευθερώνει την περιτονία.',
    description:
      'Παραδοσιακή θεραπευτική τεχνική που χρησιμοποιεί αρνητική πίεση (αναρρόφηση) στην επιφάνεια του δέρματος. Αυξάνει θεαματικά την αιμάτωση στην περιοχή, αποσυμφορεί τους ιστούς, απελευθερώνει την περιτονία (fascia) και αποβάλλει τις τοξίνες.',
    forWhom:
      'Σε άτομα με επίμονες μυϊκές εντάσεις, «κολλημένη» περιτονία ή ανάγκη για βαθιά αποτοξίνωση των ιστών.',
    benefits: [
      'Άμεση αύξηση της αιματικής κυκλοφορίας και οξυγόνωση των ιστών.',
      'Απελευθέρωση της περιτονίας και αύξηση της ευκαμψίας.',
      'Ταχεία ανακούφιση από τον βαθύ μυϊκό πόνο.',
    ],
    cautions: [
      'Ευαίσθητο δέρμα, δερματικές παθήσεις ή τάση για μώλωπες.',
      'Λήψη αντιπηκτικής αγωγής.',
    ],
  },
  {
    /* The client's own text calls this "Percussive Therapy" and describes a
       professional massage gun generically. The NAME stays as they specified it
       when the six were listed. Flagged to them; one line to change if wanted. */
    title: 'Theragun therapy',
    slug: 'theragun-therapy',
    short: 'Ταχείες, στοχευμένες κρούσεις σε βάθος που χαλαρώνουν τις σπασμωδικές ίνες σε ελάχιστο χρόνο.',
    description:
      'Σύγχρονη τεχνολογία αποκατάστασης με τη χρήση επαγγελματικού κρουστικού πιστολιού (massage gun). Προσφέρει ταχείες, στοχευμένες κρούσεις σε βάθος, διεγείροντας τους μυϊκούς υποδοχείς, χαλαρώνοντας τις σπασμωδικές ίνες και επιταχύνοντας την αποθεραπεία.',
    forWhom:
      'Σε όσους επιθυμούν άμεση, τεχνολογικά προηγμένη μυϊκή αποφόρτιση και προετοιμασία ή αποθεραπεία μετά από άσκηση.',
    benefits: [
      'Ταχύτατη χαλάρωση των μυϊκών συσπάσεων σε ελάχιστο χρόνο.',
      'Βελτίωση της λεμφικής παροχέτευσης και μείωση του οιδήματος.',
      'Αύξηση του εύρους τροχιάς των αρθρώσεων.',
    ],
    cautions: [
      'Εφαρμογή απευθείας πάνω σε οστά, αρθρώσεις ή τη σπονδυλική στήλη.',
      'Βηματοδότες, εγκυμοσύνη ή πρόσφατα χειρουργεία.',
    ],
  },
];
