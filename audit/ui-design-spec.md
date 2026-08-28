# Trivic — UI Design Spec: "Fluid Glass" (supersedes "Midnight Glass", "Game Show", "Paper & Pop", "Arena")

The owner's reference is a classic glassmorphism poster: a **vivid fluid gradient** (cyan → blue → purple → magenta → red) with a **thick frosted-glass panel** on top, white text, thin white-outline pills. Any restyle must keep that: color lives in the stage, surfaces are frosted glass over it.

## Non-negotiables (repeat offenders — never regress)
1. **No horizontal page scroll.** Page roots: `overflow-x: clip; width:100%; max-width:100vw`.
2. **Images zoom-to-fill.** People/characters: `object-fit: cover; object-position: center top` in a fixed-aspect frame. Flags / maps / logos: `contain` on a plate.
3. **Nothing overlaps the fixed EN/theme toggle cluster** (top-left, 18px inset, 44px buttons). CategoryScreen sticky bar has `paddingLeft` 122/130; ScoreBar/BoardHeader have `paddingLeft` 74 on phones.
4. **Movie-scene player masks stay** (black bars + hover overlay + `youtube-nocookie`).
5. `className` hooks `tap / pop / fadein / page-enter / hit44 / glass / lg-tile` must keep existing.
6. **Two real modes:** `theme-dark` = deep purple stage with the blobs at ~95% alpha, white text; `theme-light` = VERY light (white/lavender) stage with the same blobs as pastel-vivid washes (~50% alpha), dark ink `#1A0A4A`. Never make light mode dark again.
7. Build must pass after every change.
8. **Home layout:** team rows stacked, mode rows stacked — never side by side.
9. **Board layout:** glass category blocks wrap **3 per row** on desktop (6 → 3 over 3), 2 on tablets, 1 on phones; blocks stretch to fill the viewport height on desktop. Inside a block: `200 (art) 200 / 400 (art) 400 / 600 (art) 600` (FFA: `(art) tile` × 5), name in a frosted pill above.

## Tokens (in `const CSS`)
- Stage: `--bg-image` = six ellipse radial-gradients (cyan `34,211,238`, blue `59,130,246`, purple `147,51,234`, magenta `236,72,153`, red `239,68,68`, indigo `99,102,241`) over a purple base (`#1E0A4E → #3B0764`) in dark; over `#FFFFFF → #F3EEFF → #EEF6FF` in light at ~half alpha.
- Glass: `.glass` = `linear-gradient(var(--glass-top), var(--glass-bottom))` + `--border` + `--blur: blur(26px) saturate(180%)` + `--glass-edge` top highlight. Dark: white 18→8%, border 32%. Light: white 68→46%, border 85%.
- Text: `--text` / `--on-bg` white in dark, `#1A0A4A` in light. Everything that sits on the stage or on glass must use these vars — never hardcode `#FFFFFF` for text (photo-overlay plates are the one exception).
- Primary buttons: `--primary-bg / --primary-ink / --primary-border` (white frosted pill with deep-ink text in dark; deep-indigo pill with white text in light). `getGlassButtonStyle` reads these; tinted glow comes from the tint argument.
- Tiles: `--tile-frost-top/bottom` frost over the tier tint at ~70% (`PT_COLORS`: 100 lime, 200 cyan, 300 blue, 400 purple, 500 amber, 600 pink), `--tile-border`, `--tile-edge`, `--tile-text-shadow`, plus `backdrop-filter: blur(22px)`. `.lg-tile` adds the specular highlight and hover sheen (signature element).
- Category tints: `CATEGORY_TINT_PALETTE` (12 saturated tints) applied to `BANK[id].color` after `CAT_IDS`; shown through frost on name pills, card icon discs and selected glows.
- Type: **Plus Jakarta Sans** — 800 for display (wordmark, headings, tile numbers, pills, buttons), 500/600 body. Scores use the same family.

## Components
- Cards (`ARENA_CARD_STYLE`, `QuestionPanel`, timer disc): `--surface` + border + blur + `--shadow-2`.
- Score bar / board header: floating frosted card (12px inset, radius 22) using the `--header-*` vars.
- Category cards: portrait 3:4, photo fills, bottom scrim, frosted title plate (blur 14px) with tinted icon disc; selected = white ring + tint glow + primary check disc.
- Answer panel: frost over the tier tint with a soft tint glow.

## Clutter rules
- One idea per row; no numbered markers unless the content is a sequence; no decoration beyond stage + glass.
- Empty states render nothing.

## Tooling gotcha
- superpowers-chrome headed windows can be occluded → `visibilityState: hidden` → animations stall, lazy images never load, screenshots time out. Use `hide_browser` (headless) before capturing if that happens.
