
## [2026-07-26 19:45] — /qa (launch gate)
- Pages: 3 × 4 viewports · Score: 12/13 · Issues fixed this run: 15
  (12 tiny tap-targets in legal prose, 1 in breadcrumbs, empty address leaking
  into llms.txt, 4 legal placeholders, missing CLAUDE.md, missing breadcrumbs on
  /poioi-eimaste, 2 dead content files, stale @fill markers)
- Status: FAIL → the only blocker is placeholder NAP (phone/email/domain/area).
  Everything else is green. Not deployable until the client's real details land.

## [2026-07-26 20:55] — copy + pinned section + booking switch
- Μότο: «Ένα σώμα τη φορά» → «Καμία συνεδρία δεν είναι ίδια» (3 σημεία)
- PinnedSteps: το «Πώς λειτουργεί» καρφώνει, ένα βήμα τη φορά
- src/lib/booking.ts: ένας διακόπτης για Cal — κενό = διάλογος, γεμάτο = scheduler
- Bug: τα εικονίδια στο pinned δεν χαράζονταν ποτέ (δεν είναι μέσα σε .reveal)
- Gate: 3 σελίδες × 4 viewports, 0 προβλήματα

## [2026-07-26 21:35] — TreatmentList (accordion)
- Οι 6 θεραπείες: native <details>, ένα ανοιχτό τη φορά, μηδέν JS
- Επαληθεύτηκε: κλικ + πληκτρολόγιο (Enter), πάντα 1 ανοιχτό
- ServicesNumbered διαγράφηκε από το project (icon? prop → harvest candidate)
- Gate: 3 σελίδες × 4 viewports, 0 προβλήματα

## [2026-07-26 21:50] — 6 → 4 θεραπείες
- Η διάρκεια έγινε ΕΠΙΛΟΓΗ μέσα στη θεραπεία (60′ · 80′), όχι ξεχωριστή εγγραφή
- Συνέπεια: οι διάρκειες πλέον εμφανίζονται· τιμές παραμένουν πουθενά
- Ενημερώθηκαν: services.ts, TreatmentList, section lead, FAQ, llms.txt
- Gate: 0 προβλήματα

## [2026-07-26 22:20] — CTA + GitHub
- Το κουμπί κράτησης δηλώνει πλέον ρητά τον τρόπο: με Cal → «Κλείσε ραντεβού online»
  + σήμα ημερολογίου + «ανοίγει σε νέα καρτέλα»· χωρίς Cal → ο διάλογος όπως πριν.
  Αλλάζει ΟΛΗ η ενότητα (τίτλος + lead), όχι μόνο το κουμπί.
- git init + push → github.com:ariszaf/body-reset-treatment (master, 74 αρχεία)

## [2026-07-26 23:55] — επιμελημένα κείμενα
- Εφαρμόστηκε η επιμελημένη ελληνική εκδοχή σε ΟΛΑ τα σημεία (site, pages, services,
  faq, booking, index, About, φόρμα, footer, 404)
- Νέο: pages.ts δέχεται χειροκίνητο title/description για Google — τα αυτόματα
  δεν χωρούσαν τα εγκεκριμένα κείμενα (meta.ts τα σέβεται)
- Όρια Google: 45/60, 51/60, 55/60 τίτλοι · 146/155, 133/155, 92/155 περιγραφές
- KEIMENA.md ξαναγράφτηκε ώστε να δείχνει ό,τι είναι live
- Gate: 0 προβλήματα
