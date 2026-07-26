# Body Reset Treatment — project notes

Μασάζ **κατ' οίκον** στην Αθήνα. Δεν υπάρχει κατάστημα: η θεραπεία πηγαίνει στον
πελάτη. Αυτό καθορίζει σχεδόν κάθε απόφαση παρακάτω.

- **Starter:** v1.6.1 (Astro rail) · **Tier:** Premium · **Host:** Cloudflare Pages
- **Εκκρεμότητες & αποφάσεις:** `TODO.md` — διάβασέ το πριν αγγίξεις περιεχόμενο
- **Πλάνο τελευταίας φάσης:** `~/.claude/plans/bubbly-dreaming-thacker.md`

## Standing rules (πέρα από το contract του starter)

| Κανόνας | Γιατί |
|---|---|
| **Καμία τιμή, καμία στήλη διάρκειας** | Ρητή απόφαση πελάτη. Οι τιμές δόθηκαν για ακρίβεια, όχι για δημοσίευση. |
| **Καμία χειροπρακτική** | Δεν παρέχεται. Σε σελίδα υγείας δεν διαφημίζουμε υπηρεσία που δεν γίνεται. |
| **Καμία διεύθυνση** | Υπηρεσία κατ' οίκον. Παντού μπαίνει `site.serviceArea`, ποτέ `address.street`. |
| **Μία φωτογραφία, μόνο στο hero** | Δεν υπάρχει χώρος να δείξουμε· η επανάληψη διαβαζόταν σαν γέμισμα. |
| **Μηδέν ισχυρισμοί προσόντων** | Δεν δόθηκαν πτυχία/χρόνια εμπειρίας. Δεν εφευρίσκονται. |
| **Τυπογραφικό όριο 17px** | Η αναφορά (nikoskoulis.com) τρέχει στα 13px· εμείς όχι. |

## Design tokens (`src/styles/tokens.css`)

Παλέτα από τις CSS μεταβλητές του nikoskoulis.com: `--light #f6f3ee` (φόντο),
`--gray #edebe8` (alt ζώνες). Το μελάνι μαλάκωσε σε **`#33302c`** (11.9:1) και το
accent σκούρυνε σε **`#75644e`** επειδή το προηγούμενο έκοβε το AA (3.25:1).

Γραμματοσειρές: **Manrope** (τίτλοι) + **Commissioner** (σώμα) — επιλέχθηκαν επειδή
έχουν **ελληνικό subset**. Montserrat / Poppins / Jost / Raleway / Cormorant **δεν
έχουν** και θα έπεφταν σε fallback.

## Τι είναι ιδιαίτερο εδώ

| Component | Τι κάνει |
|---|---|
| `BrandMark.astro` | Το λογότυπο, `draw` prop → ξανασχηματίζεται σε κάθε σελίδα στο header |
| `BrandVeil.astro` | Το intro (μία φορά ανά session). **ΔΕΝ** καλύπτει πλοήγηση — αυτό προκαλούσε καθυστέρηση |
| `WaveRule.astro` | Το κύμα του λογότυπου ως διαχωριστικό, ανοίγει στο scroll |
| `BrandIcon.astro` + `lib/icons.ts` | Εννέα γραμμικά σύμβολα, χαράζονται στο scroll |
| `HeroFullBleed.astro` | Full-screen, art direction κατά **προσανατολισμό** όχι πλάτος |
| `NavOverlay.astro` | Διάφανη μπάρα, hamburger σε όλα τα breakpoints |
| `BookingDialog.astro` | Native `<dialog>`, 4 πεδία, `[data-booking]` το ανοίγει |

## Παγίδες που κόστισαν bugs

1. **Ποτέ `clip-path` σε στοιχείο που παρακολουθεί ο IntersectionObserver.** Μετράει
   την επιφάνεια μετά το clip → μηδέν → δεν αποκαλύπτεται ποτέ. Χρησιμοποίησε
   `mask-size` (διορθώθηκε και στο starter v1.6.1).
2. **`:global()` σε `is:global` style block είναι ΑΚΥΡΟ** και ακυρώνει σιωπηλά όλο τον
   selector. Σε *scoped* block χρειάζεται. Αντίθετοι κανόνες.
3. **Δεν γίνεται `import type` από `.astro`** — ο bundler διαβάζει το markup σαν TS.
   Γι' αυτό τα σύμβολα είναι σε `lib/icons.ts`.
4. **Το ύψος του λογότυπου είναι μία μεταβλητή** (`--nav-logo`). Όταν ήταν δύο, η
   μπάρα κάλυπτε τον πρώτο σύνδεσμο του μενού και έτρωγε το κλικ.

## Εντολές

```bash
npm run dev        # ανάπτυξη
npm run build      # παραγωγή
npm run preview    # έλεγχος του build
QA_BASE="http://localhost:4321" QA_ROUTES="/,/poioi-eimaste,/oroi-xrisis-kai-politiki-aporritou" \
  node scripts/qa-screenshots.mjs     # launch gate, οπτικό μέρος
```

Τα build scripts για λογότυπο/σύμβολα/φωτογραφίες ζουν στο scratchpad της συνεδρίας —
τα πρωτότυπα αρχεία είναι στο `raw/`.
