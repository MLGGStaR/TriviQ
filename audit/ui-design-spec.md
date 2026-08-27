# Trivic — UI Design Spec: "Game Show" (supersedes "Paper & Pop" and "Arena")

The owner rejected two previous passes: the dark-glass "Arena" ("looks the same") and the flat "Paper & Pop" ("you just changed colors … fuck the no colors, go all out"). The current direction is **full color, chunky, game-show energy** — but still clean: one idea per row, no clutter.

## Non-negotiables (repeat offenders — never regress)
1. **No horizontal page scroll.** Page roots: `overflow-x: clip; width:100%; max-width:100vw`. The board grid is the only element allowed to scroll sideways, inside its own wrapper.
2. **Images zoom-to-fill.** People/characters/products: `object-fit: cover; object-position: center top` in a fixed-aspect frame. Flags / maps / logos: `contain` on a plate.
3. **Nothing overlaps the fixed EN/theme toggle cluster** (top-left, 18px inset, 44px buttons). CategoryScreen sticky bar has `paddingLeft` 122/130; ScoreBar/BoardHeader have `paddingLeft` 74 on phones.
4. **Movie-scene player masks stay** (black bars + hover overlay + `youtube-nocookie`).
5. `className` hooks `tap / pop / fadein / page-enter / hit44` must keep existing.
6. Both themes fully defined (`:root.theme-light`, `:root.theme-dark`); light is the default.
7. Build must pass after every change.
8. **Board layout is fixed by the owner:** per category, tiles flank the category art — `200 (art) 200 / 400 (art) 400 / 600 (art) 600` (team mode). FFA: `(art) tile` × 5. The category name sits in a colored pill above the block.

## Look
- **Stage (background):** diagonal gradient indigo → violet → pink → orange (`--bg-image`), with a soft white radial highlight top-left. Dark theme = the same gradient, deeper. Text placed directly on the stage uses `--on-bg` (white) / `--on-bg-muted`.
- **Cards:** white (`--surface`, dark: `#1B1930`), radius 20/28, colored drop shadows (`--shadow-1/2`). Text on cards uses `--text` / `--text-muted`.
- **Type:** Fredoka 600/700 for display (wordmark, headings, tile numbers, pills, buttons), Inter for body.
- **Tier colors (`PT_COLORS` → `PT_COLORS_2` gradient end):** 100 cyan, 200 green, 300 blue, 400 orange, 500 pink, 600 violet. Tiles = vertical gradient + `0 5px 0` darker bottom edge + white number with a 2px text-shadow. Used tiles = translucent white dashed slot.
- **Team colors:** `TEAM_COLORS` unchanged. Setup team cards are solid team-color gradient blocks with a numbered badge and a white centered name input.
- **Category cards (CategoryScreen):** portrait art (cover) + a label bar in the category's own color with white, centered Fredoka text. Selected = white 3px border + white ring + green check + lift. Group headings are centered white Fredoka with a count pill and a white "Add all" pill. Grid is `auto-fit` + centered so rows never stretch or left-align.
- **Buttons:** primary = solid accent (or white pill with accent text when on the stage), chunky `0 6px 0` edge shadows allowed on hero CTAs. Timer Reset/Start live in a row *under* the disc, never inside the ring.
- **Lifelines:** white circles with tinted glyphs; active = solid tint.
- **Motion:** keep `.tap` lift, `.pop` reveal, `.page-enter`. Nothing else.

## Clutter rules
- One idea per row. No decorative dots/dividers, no ambient blobs, no blur.
- Never stack more than one badge on a card.
- Empty states render nothing (no "appears here" placeholders).

## Tooling gotcha
- The superpowers-chrome tab reports `visibilityState: hidden` when the headed Chrome window is occluded; compositor animations stall at opacity 0, lazy images never load and screenshots time out. Use `hide_browser` (headless) before capturing.
