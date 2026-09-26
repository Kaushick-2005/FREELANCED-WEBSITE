#!/bin/bash
# Resilient image generation loop - keeps running until all images exist
cd /home/z/my-project

OUT="public/products"
mkdir -p "$OUT"

generate() {
  local name="$1"
  local size="$2"
  local prompt="$3"
  local out="$OUT/$name.png"
  if [ -f "$out" ] && [ $(stat -c%s "$out" 2>/dev/null || echo 0) -gt 5000 ]; then
    echo "SKIP $name (exists)"
    return 0
  fi
  echo "GEN $name ($size)"
  timeout 120 z-ai image -p "$prompt" -o "$out" -s "$size" 2>&1 | tail -1
  if [ -f "$out" ] && [ $(stat -c%s "$out" 2>/dev/null || echo 0) -gt 5000 ]; then
    echo "  saved $out ($(stat -c%s "$out") bytes)"
    return 0
  else
    echo "  FAILED $name"
    return 1
  fi
}

# Generate all images
generate "hero-bg" "1344x768" "Ultra luxury hero background, black marble texture with golden veins, scattered sparkling gold dust particles, dramatic cinematic lighting, elegant South Indian gold necklace draped on velvet, deep shadows, premium jewellery brand aesthetic, photorealistic, 8k, opulent dark mood with golden glow, no text"

generate "about-bg" "1344x768" "Elegant luxury jewellery craftsmanship scene, skilled Indian goldsmith hands crafting intricate gold necklace, warm golden ambient lighting, traditional jewellery workshop, soft bokeh, premium cinematic photography, dark moody background with golden glow, heritage and trust feel, no text"

generate "gold-necklace-1" "1024x1024" "Luxury 22k gold traditional South Indian temple necklace, intricate carved design with peacock motifs, displayed on black velvet, studio lighting, sparkling gold, professional product photography, ultra detailed, isolated on dark background, premium jewellery catalog, no text"

generate "gold-necklace-2" "1024x1024" "Elegant 22k gold long haram necklace with ruby and emerald stones, traditional Indian bridal jewellery, displayed on black velvet stand, studio lighting, sparkling, professional product photography, dark background, premium catalogue, no text"

generate "gold-bangles" "1024x1024" "Set of ornate 22k gold bangles with intricate filigree work, stacked elegantly, displayed on black velvet, studio lighting, sparkling gold, professional product photography, dark background, premium jewellery catalog, no text"

generate "gold-ring-diamond" "1024x1024" "Luxury gold diamond engagement ring, solitaire diamond on 22k gold band, macro photography, sparkling, displayed on black velvet, studio lighting, professional product photography, dark background, premium catalogue, no text"

generate "gold-earrings" "1024x1024" "Luxury 22k gold jhumka earrings with pearl drops, traditional South Indian design, intricate work, displayed on black velvet, studio lighting, sparkling gold, professional product photography, dark background, premium catalogue, no text"

generate "silver-necklace" "1024x1024" "Elegant 925 sterling silver necklace with modern minimalist pendant, displayed on black velvet, studio lighting, sparkling silver, professional product photography, dark background, premium jewellery catalogue, no text"

generate "silver-bangles" "1024x1024" "Set of polished sterling silver bangles with subtle engraving, stacked elegantly, displayed on black velvet, studio lighting, sparkling silver, professional product photography, dark background, premium catalogue, no text"

generate "silver-ring" "1024x1024" "Elegant sterling silver ring with blue topaz stone, modern design, macro photography, displayed on black velvet, studio lighting, sparkling, professional product photography, dark background, premium catalogue, no text"

generate "rosegold-necklace" "1024x1024" "Luxury rose gold necklace with delicate heart pendant and small diamonds, modern elegant design, displayed on black velvet, studio lighting, sparkling rose gold, professional product photography, dark background, premium catalogue, no text"

generate "rosegold-ring" "1024x1024" "Luxury rose gold engagement ring with pink diamond, elegant solitaire design, macro photography, displayed on black velvet, studio lighting, sparkling, professional product photography, dark background, premium catalogue, no text"

generate "rosegold-earrings" "1024x1024" "Elegant rose gold stud earrings with morganite stones, modern design, displayed on black velvet, studio lighting, sparkling rose gold, professional product photography, dark background, premium catalogue, no text"

generate "diamond-necklace" "1024x1024" "Luxury diamond necklace set, brilliant cut diamonds in white gold setting, bridal jewellery, displayed on black velvet, studio lighting, sparkling diamonds, professional product photography, dark background, premium catalogue, no text"

generate "bridal-set" "1024x1024" "Complete South Indian bridal jewellery set, 22k gold necklace with matching earrings and maang tikka, adorned with rubies and emeralds, displayed on black velvet, studio lighting, sparkling, professional product photography, dark background, premium bridal catalogue, no text"

generate "temple-necklace" "1024x1024" "Traditional South Indian temple jewellery necklace, 22k gold with goddess motif, intricate antique finish, displayed on black velvet, studio lighting, professional product photography, dark background, premium heritage catalogue, no text"

generate "gold-coin" "1024x1024" "Pure 24k gold coin with Lakshmi goddess engraving, shiny and reflective, displayed on black velvet, studio lighting, sparkling gold, professional product photography, dark background, premium catalogue, no text"

generate "silver-coin" "1024x1024" "Pure silver coin with intricate goddess engraving, shiny and reflective, displayed on black velvet, studio lighting, sparkling silver, professional product photography, dark background, premium catalogue, no text"

generate "mens-chain" "1024x1024" "Heavy 22k gold chain necklace for men, thick link design, displayed on black velvet, studio lighting, sparkling gold, professional product photography, dark background, premium mens jewellery catalogue, no text"

generate "kids-jewellery" "1024x1024" "Delicate 22k gold kids jewellery, small cute anklet and bangle set, displayed on black velvet, studio lighting, sparkling gold, professional product photography, dark background, premium catalogue, no text"

generate "gallery-1" "864x1152" "Luxury jewellery display showcase, gold necklaces and diamond sets on illuminated glass shelves, elegant boutique interior, warm golden lighting, premium cinematic photography, no text"

generate "gallery-2" "864x1152" "Close up of South Indian bride wearing complete gold bridal jewellery set, traditional silk saree, elegant pose, warm golden lighting, premium cinematic photography, no text"

generate "gallery-3" "864x1152" "Artistic macro shot of intricate gold jewellery craftsmanship, hands polishing gold necklace, warm golden lighting, premium cinematic photography, heritage feel, no text"

generate "gallery-4" "1024x1024" "Luxury gold mangalsutra with black beads and gold pendant, traditional Indian design, displayed on black velvet, studio lighting, sparkling, professional product photography, dark background, premium catalogue, no text"

generate "gold-pendant" "1024x1024" "Luxury 22k gold pendant with intricate deity design, traditional South Indian style, displayed on black velvet, studio lighting, sparkling gold, professional product photography, dark background, premium catalogue, no text"

generate "gold-bracelet" "1024x1024" "Luxury 22k gold bracelet with intricate chain design and small diamonds, elegant, displayed on black velvet, studio lighting, sparkling gold, professional product photography, dark background, premium catalogue, no text"

generate "diamond-ring" "1024x1024" "Luxury platinum diamond ring, halo setting with brilliant diamonds, macro photography, displayed on black velvet, studio lighting, sparkling, professional product photography, dark background, premium catalogue, no text"

echo "ALL DONE"
