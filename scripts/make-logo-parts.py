#!/usr/bin/env python3
"""Split the client's logo into its four drawable parts so it can be animated.

    python3 scripts/make-logo-parts.py "/path/to/BODY RESET_logo_final.svg"

The Illustrator export is structured perfectly for this — four top-level
children, verified by getBBox:

  0  <g>     "TREATMENT"   x 172.80..248.80  y 288.70..294.20   → .lg-sub
  1  <g>     the wave      x  80.00..345.83  y 224.16..240.36   → .lg-wave
  2  <line>  the slash     x  80.60..201.30  y 131.60..310.90   → .lg-slash
  3  <g>     "BODY RESET"  x 126.20..297.10  y 259.90..275.30   → .lg-word

Each gets its OWN class and sits as a SIBLING of the others, so the four can be
timed independently. Path data is untouched: only the black backing rect is
dropped and the hard-coded #FFFFFF bound to currentColor.

Two things this script gets right that a quick regex does not:

1. `<g>...</g>` cannot be matched with a non-greedy `.*?` — the export nests
   groups three deep, so the first `</g>` closes an INNER group and the capture
   ends mid-structure. Concatenating such captures yields an SVG with unclosed
   tags: browsers silently repair it by nesting the later parts INSIDE the
   first, which quietly made .lg-slash and .lg-word children of .lg-wave — so
   the wave's reveal mask clipped the whole logotype. `split_top_level` counts
   depth instead.
2. The intermediate wrapper groups carry no attributes, so they are flattened
   away (asserted, not assumed) — one <g class> per part, nothing nested.

The slash is a real <line> with a stroke, so it can be drawn with
stroke-dashoffset. Its length is computed from its own x1/y1/x2/y2 and written
into the file as --slash-len, so no animation ever has to guess it.
"""
import math
import os
import re
import sys
import xml.etree.ElementTree as ET

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser(
    "~/Downloads/BODY RESET_logo_final.svg"
)
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "logo-parts.svg")


def split_top_level(markup: str) -> list[str]:
    """Top-level <g>…</g> / self-closing elements, depth-aware."""
    parts, depth, start = [], 0, None
    for m in re.finditer(r"<(/?)(g)\b[^>]*?(/?)>|<(line|path|rect)\b[^>]*?/>", markup):
        if m.group(4):                              # self-closing shape
            if depth == 0:
                parts.append(m.group(0))
            continue
        if m.group(1):                              # </g>
            depth -= 1
            if depth == 0:
                parts.append(markup[start:m.end()])
        else:                                       # <g>
            if depth == 0:
                start = m.start()
            depth += 1
    assert depth == 0, f"unbalanced markup — {depth} group(s) left open"
    return parts


raw = open(SRC, encoding="utf-8").read()
body = re.sub(r"<\?xml[^>]*\?>\s*", "", raw)
body = re.sub(r"<!--.*?-->\s*", "", body, flags=re.S)
body = re.sub(r'<rect x="-14\.2"[^>]*/>\s*', "", body)          # black backing
inner = re.search(r"<svg[^>]*>(.*)</svg>", body, flags=re.S).group(1).strip()

# Fold the <style> block into presentation attributes, binding to currentColor.
inner = re.sub(r"<style[^>]*>.*?</style>\s*", "", inner, flags=re.S)
inner = inner.replace('class="st0"', 'fill="currentColor"')
inner = inner.replace(
    'class="st1"',
    'fill="none" stroke="currentColor" stroke-width="1.4143" stroke-miterlimit="10"',
)

parts = split_top_level(inner)
assert len(parts) == 4, f"expected 4 top-level parts, found {len(parts)}"
treatment, wave, slash, wordmark = parts

# Flatten the bare wrapper groups — asserted to carry nothing, so dropping them
# cannot move a single coordinate.
def shapes_of(part: str) -> str:
    for attrs in re.findall(r"<g\b([^>]*)>", part):
        assert attrs.strip() == "", f"wrapper <g{attrs}> carries attributes"
    return "".join(re.findall(r"<(?:path|line)\b[^>]*?/>", part))


x1, y1, x2, y2 = (
    float(re.search(rf'{a}="([-\d.]+)"', slash).group(1)) for a in ("x1", "y1", "x2", "y2")
)
length = math.hypot(x2 - x1, y2 - y1)

# Source order = paint order. The four never overlap, but keeping it means the
# file stays a faithful reordering of the export rather than a re-composition.
svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="79 130.6 267.9 181.3"
     style="--slash-len:{length:.1f}" role="img" aria-label="Body Reset Treatment">
<g class="lg-wave">{shapes_of(wave)}</g>
<g class="lg-slash">{shapes_of(slash)}</g>
<g class="lg-word">{shapes_of(wordmark)}</g>
<g class="lg-sub">{shapes_of(treatment)}</g>
</svg>
"""

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(svg)

# Well-formed or it does not ship — this is the check that was missing.
root = ET.fromstring(svg)
assert [c.get("class") for c in root] == ["lg-wave", "lg-slash", "lg-word", "lg-sub"]

print(f"slash length: {length:.1f} user units")
print(f"parts: " + ", ".join(f"{c.get('class')}({len(list(c))})" for c in root))
print(f"→ {os.path.normpath(OUT)}  {os.path.getsize(OUT)} bytes")
