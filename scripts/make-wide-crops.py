#!/usr/bin/env python3
"""
Κόβει το φαρδύ κάδρο κάθε θεραπείας για τη σκηνή του υπολογιστή.

ΓΙΑΤΙ ΥΠΑΡΧΕΙ. Στην καρφωμένη ενότητα «Οι θεραπείες» η φωτογραφία πιάνει το ΔΕΞΙ
ΜΙΣΟ του παραθύρου, πάνω ως κάτω. Το μισό ενός παραθύρου 1920×1000 είναι 960×1000 —
σχεδόν τετράγωνο. Ένα κάδρο 2:3 μέσα σε τετράγωνο κουτί χάνει το ένα τρίτο του καθ'
ύψος, και το χάνει ΤΥΦΛΑ: το `object-fit: cover` κόβει από το κέντρο και δεν ξέρει
πού είναι το κεφάλι. Οπότε το κόψιμο γίνεται εδώ, με το χέρι, μία-μία.

ΤΟ ΚΑΔΡΟ. 4000×4500 από τα 4000×6000 του πρωτότυπου — 8:9, το 75% του ύψους. Το 8:9
πέφτει στη μέση των πραγματικών αναλογιών που παίρνει το κουτί (0.8 σε οθόνη 16:10,
1.0 σε κοντό laptop), άρα ό,τι μένει στο `cover` είναι ≤11%: από τα πλάγια στις
ψηλές οθόνες, καθ' ύψος στις κοντές.

ΤΟ OFFSET. Όλες οι λήψεις έχουν άδειο τοίχο πάνω και άδειο πάτωμα κάτω, και το
ενδιαφέρον από ~15% ως ~85%. Το offset είναι πόσα pixels ΑΠΟ ΤΗΝ ΚΟΡΥΦΗ πετάμε, και
διαφέρει επειδή διαφέρει η στάση: όπου ο θεραπευτής είναι σκυμμένος το κεφάλι πέφτει
χαμηλότερα και το κάδρο κατεβαίνει μαζί του.

Τρέξιμο:  python3 scripts/make-wide-crops.py
Απαιτεί:  Pillow  ·  γράφει public/images/services/<slug>-wide.webp
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'raw'
OUT = ROOT / 'public' / 'images' / 'services'

CROP_W, CROP_H = 4000, 4500          # 8:9 από το πρωτότυπο 4000×6000
OUT_W, OUT_H = 1600, 1800            # καλύπτει 1280×1440 (μισό 2560άρι) χωρίς μεγέθυνση
QUALITY = 80

# slug, πρωτότυπο, offset από την κορυφή σε pixels του 6000άρη
FRAMES = [
    ('souidiko-masaz',      'Andrews1162', 480),   # όρθιος, κεφάλι στο 25%
    ('deep-tissue',         'Andrews1164', 480),   # όρθιος, ίδια στάση
    ('therapeftiko-masaz',  'Andrews1123', 720),   # σκυμμένος — κεφάλι στο 35%, πιο κάτω κάδρο
    ('sports-massage',      'Andrews1153', 480),   # όρθιος
    ('cupping-therapy',     'Andrews1201', 480),   # όρθιος, οι βεντούζες στο 64%
    ('theragun-therapy',    'Andrews1136', 240),   # η πιο κλειστή λήψη — κεφάλι ψηλά, ελάχιστο ψαλίδι
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, raw, top in FRAMES:
        src = RAW / f'{raw}.jpeg'
        im = Image.open(src).convert('RGB')
        w, h = im.size
        if (w, h) != (4000, 6000):
            raise SystemExit(f'{src.name}: περίμενα 4000×6000, βρήκα {w}×{h}')
        if top + CROP_H > h:
            raise SystemExit(f'{src.name}: offset {top} + {CROP_H} ξεπερνά το ύψος {h}')

        frame = im.crop((0, top, CROP_W, top + CROP_H)).resize((OUT_W, OUT_H), Image.LANCZOS)
        dst = OUT / f'{slug}-wide.webp'
        frame.save(dst, 'WEBP', quality=QUALITY, method=6)
        print(f'  {dst.name:<44} {OUT_W}×{OUT_H}  {dst.stat().st_size / 1024:.0f}KB'
              f'  (κόπηκε {top}px από πάνω, {h - top - CROP_H}px από κάτω)')


if __name__ == '__main__':
    main()
