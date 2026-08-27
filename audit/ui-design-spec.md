# Trivic — UI Design Spec: "Paper & Pop" (supersedes the earlier "Arena" glass look)

The owner rejected the dark-glass "Arena" pass as looking the same as before. The current direction is **flat, bright, playful, uncluttered**. Any restyle or new screen must follow this.

## Non-negotiables (repeat offenders — never regress)
1. **No horizontal page scroll.** Page roots: `overflow-x: clip; width:100%; max-width:100vw`. The board grid is the only element allowed to scroll sideways, inside its own wrapper.
2. **Images zoom-to-fill.** People/characters/products: `object-fit: cover; object-position: center top` in a fixed-aspect frame. Flags / maps / logos: `contain` on a white plate.
3. **Nothing overlaps the fixed EN/theme toggle cluster** (top-left, 18px inset, 44px buttons). CategoryScreen sticky bar has `paddingLeft` 122/130; ScoreBar/BoardHeader have `paddingLeft` 74 on phones.
4. **Movie-scene player masks stay** (black bars + hover overlay + `youtube-nocookie`).
5. `className` hooks `tap / pop / fadein / page-enter / hit44` must keep existing.
6. Both themes fully defined (`:root.theme-light`, `:root.theme-dark`); light is the default look.
7. Build must pass after every change.

## Look
- **Background:** flat warm paper `#F6F5F0` with two very soft color glows (indigo top-left, coral bottom-right). Dark: `#0F1117`. **No background images, textures, or blur anywhere.**
- **Surfaces:** flat white cards (`--surface-strong`), 1px `--border` (`#E4E1D7`), radius 16 (`--radius`) / 22 (`--radius-lg`), soft shadow (`--shadow-1/2`). No gradients, no inner highlights, no glows, no accent top-lines.
- **One accent:** indigo `--accent #5B5CE6` (dark: `#7B7CF0`). Used for primary buttons, selected rings, active segments, the timer ring. That's it.
- **Tier colors (PT_COLORS):** 100 mint `#2FB57F`, 200 sun `#FFB020` (dark ink), 300 sky `#4FA3FF`, 400 coral `#FF6B6B`, 500/600 indigo `#5B5CE6`. `PT_INK` gives the text color on each fill.
- **Team colors:** `TEAM_COLORS` unchanged; active pill = solid team color + white text, inactive = 10% tint fill + team-color text. No glows.
- **Type:** Sora 700/800 for display (wordmark, headings, tile numbers, scores), Inter for body. Labels 11px uppercase `.08em` muted.
- **Buttons (`getGlassButtonStyle`):** primary = solid accent/tint with white (or dark on sun) text; subtle = `--surface-2` (or 12% tint) with ink text; disabled = `--surface-2` muted. Circles (`getGlassCircleButtonStyle`) = `--surface-2` fill, tinted glyph.
- **Cards:** `QuestionPanel` / `ARENA_CARD_STYLE` = flat white, border, shadow-2. Answer panel = 2px border in the tile's tier color.
- **Category cards:** art on top (cover), white label bar below with icon + name. No scrims, badges, captions or accent lines. Selected = accent border + soft ring + check. The "+ copy" button only appears on selected cards.
- **Board:** no container chrome around column headers (art square + label only). Tiles are solid tier-colored pills with bold numbers; used tiles become dashed empty slots at 45%.
- **Timer:** 124px white disc, 9px single-color ring (accent → danger under 20%).
- **Motion:** keep `.tap` lift, `.pop` reveal, `.page-enter`. Nothing else.

## Clutter rules
- One idea per row. Prefer plain headings over chips-in-pills. No decorative dots/dividers.
- Never stack more than one badge on a card.
- Empty states render nothing (no "appears here" placeholders).
