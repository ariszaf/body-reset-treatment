#!/bin/bash
# Organize + SEO-name + WebP-convert client photos: raw/ → public/images/<folder>/<seo-name>.webp
# Images are born correctly named (transliterated keyword filenames — see seo.md map) and WebP-converted
# at FIRST placement, so no post-hoc rename pass is ever needed.
# Requires: cwebp (brew install webp). Falls back to copying originals if cwebp is missing.
set -e
cd "$(dirname "$0")/.."

QUALITY=80          # bump to 90 for the hero if quality suffers
MAX_DIM=2400        # cap the longest side

place() { # place <raw-file> <folder> <seo-name-without-ext>
  local src="$1" folder="$2" name="$3"
  local out="public/images/$folder/$name.webp"
  [ -f "$src" ] || { echo "⚠️  missing: $src"; return 0; }
  mkdir -p "public/images/$folder"
  if command -v cwebp >/dev/null; then
    cwebp -q "$QUALITY" -resize "$MAX_DIM" 0 "$src" -o "$out" >/dev/null 2>&1 \
      || cwebp -q "$QUALITY" "$src" -o "$out" >/dev/null
    echo "✅ $src → $out"
  else
    cp "$src" "public/images/$folder/$name.${src##*.}"
    echo "⚠️  cwebp not installed — copied original: $src (brew install webp, then re-run)"
  fi
}

# @fill: one place() line per photo from the brief's photo table.
# SEO naming: [klados]-[topothesia]-[perigrafi] — lowercase, hyphens, transliterated (map in seo.md).
# Examples:
#   place raw/IMG_4523.jpg hero     odontiatreio-chalandri-sygchrono-iatreio
#   place raw/team1.jpg    team     odontiatros-chalandri-iatros-papadopoulos

echo "Done. Update src/content/images.ts to match (src + Greek alt with keyword+location)."
