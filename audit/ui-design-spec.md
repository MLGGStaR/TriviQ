# Trivic — UI Design Spec: "Midnight Glass" (supersedes "Game Show", "Paper & Pop" and "Arena")

The owner rejected three earlier passes (dark-glass "Arena": "looks the same"; flat "Paper & Pop": "you just changed colors"; bright "Game Show": "all the colors suck … use the skill, do the best glassmorphism/liquid glass, but dark colors across the whole site"). The current direction is **dark liquid glass**: a near-black stage lit by an aurora, with frosted glass surfaces and tinted glass tiles.

## Non-negotiables (repeat offenders — never regress)
1. **No horizontal page scroll.** Page roots: `overflow-x: clip; width:100%; max-width:100vw`.
2. **Images zoom-to-fill.** People/characters/products: `object-fit: cover; object-position: center top` in a fixed-aspect frame. Flags / maps / logos: `contain` on a plate.
3. **Nothing overlaps the fixed EN/theme toggle cluster** (top-left, 18px inset, 44px buttons). CategoryScreen sticky bar has `paddingLeft` 122/130; ScoreBar/BoardHeader have `paddingLeft` 74 on phones.
4. **Movie-scene player masks stay** (black bars + hover overlay + `youtube-nocookie`).
5. `className` hooks `tap / pop / fadein / page-enter / hit44 / glass / lg-tile` must keep existing.
6. Both themes are dark: `theme-dark` = Midnight (`#05070D`), `theme-light` = Dusk (`#0B1020`, brighter aurora). Never ship a light/paper theme again.
7. Build must pass after every change.
8. **Home layout:** Teams are stacked rows (one glass row per team), Modes are stacked rows — never side by side.
9. **Board layout:** category blocks are glass panels that wrap **3 per row** on desktop (6 → 3 over 3), 2 on tablets, 1 on phones. Inside a block, tiles flank the art: `200 (art) 200 / 400 (art) 400 / 600 (art) 600` (FFA: `(art) tile` × 5). Category name in a tinted glass pill above.

## Tokens (in `const CSS`)
- Stage: `--bg #05070D`, `--bg-image` = three aurora radial blobs (cyan `#22D3EE`, violet `#A78BFA`, magenta `#F472B6`) over a vertical near-black gradient.
- Glass: `--surface rgba(255,255,255,.055)`, `--surface-strong rgba(16,20,34,.72)`, `--surface-2 rgba(255,255,255,.09)`, `--border rgba(255,255,255,.14)`, `--border-strong .28`, `--blur blur(18px) saturate(160%)`, `--glass-edge` inset top highlight. Helper classes `.glass` / `.glass-strong`.
- Text: `--text #F4F6FF`, `--text-muted rgba(244,246,255,.62)`; on-stage text uses `--on-bg` / `--on-bg-muted` (same values — kept separate so surfaces can diverge later).
- Accent: cyan `#22D3EE` (primary CTAs, timer ring, selected states); `--accent-2` violet, `--accent-3` magenta.
- Tiers (`PT_COLORS` / `PT_COLORS_2`): 100 lime, 200 cyan, 300 sky, 400 violet, 500 amber, 600 magenta. Tiles are tinted glass (`withAlpha(tint, 66→2E)` gradient, tint border, number with tint glow) with the `.lg-tile` specular highlight and hover sheen — this is the signature element.
- Category tints: `CATEGORY_TINT_PALETTE` (12 saturated glass tints) is applied to `BANK[id].color` in order after `CAT_IDS`; use `category.color` for label pills, card plates and selected glows.
- Type: **Syne** 700/800 for display (wordmark, headings, tile numbers, buttons, pills). **DM Sans** for body and for score digits (Syne's zero reads as a pill at large sizes — keep scores in DM Sans).

## Components
- Buttons (`getGlassButtonStyle`): primary = tinted glass slab (tint gradient, white edge, tint glow, dark ink on bright tints); subtle = 20% tint glass with tinted text; disabled = 4% white.
- Cards (`ARENA_CARD_STYLE`, `QuestionPanel`): `--surface` + border + blur + `--shadow-2`.
- Category cards: portrait 3:4, image fills the card, bottom scrim, frosted title plate (blur 14px) with a tinted icon disc and a Syne 15–19px title. Selected = tint border + tint glow + tinted check disc.
- Score bar / board header: floating glass card (12px inset, radius 22).
- Timer: glass disc, cyan ring (danger under 20%), Reset/Start row under the disc.
- Answer panel: tier-tinted glass with a tint glow.

## Clutter rules
- One idea per row; no numbered markers unless the content is a sequence; no extra decoration beyond the aurora + glass.
- Empty states render nothing.

## Tooling gotcha
- superpowers-chrome headed windows get occluded → `visibilityState: hidden` → animations stall, lazy images never load, screenshots time out. Use `hide_browser` (headless) before capturing.
