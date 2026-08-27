# Trivic 2.0 — UI Design Spec (shared by all restyle agents)

This is a VISUAL overhaul of `src/App.jsx`. **Do not change game logic, state, props, handler names, data flow, or component signatures.** Every component keeps the same props and calls the same callbacks. Only JSX structure, class names, and styles change.

## Non-negotiables (from the product owner — repeat offenders, do not regress)
1. **No horizontal scroll, ever.** Root/page containers: `overflow-x:hidden; width:100%; max-width:100vw`. Wide content scrolls inside its own container.
2. **Images zoom-to-fill.** Character/product/celebrity images use `object-fit:cover; object-position:center top` inside a fixed-aspect frame. Flags/maps/logos use `contain` on a white plate (they must not crop).
3. **Top score bar never overlaps.** Turn banner stacked ABOVE the team pills (flex column), never absolutely positioned over them. Long team names ellipsize.
4. **Movie-scene player masks stay.** Keep the black mask bars + hover-blocking overlay + `youtube-nocookie` host exactly as implemented. Restyle the frame around it only.
5. **All existing `className="tap"`, `pop`, `fadein`, `page-enter` hooks keep working** (the CSS block may be redesigned, but these classes must still exist).
6. **Both themes.** `:root.theme-dark` and `:root.theme-light` both fully defined. Every color used on screen must come from a token or be explicitly readable on both themes.
7. **Mobile first.** Everything must work at 360px wide and on touch (no hover-only affordances for critical actions).
8. **Build must pass** (`npm run build`) after every agent's edit. Fix any error you introduce before finishing.

## Design language — "Arena"
A polished, high-contrast game-show look: deep ink background, vivid gradient accents, crisp glass cards. Confident and fun, not neon-cheesy.

### Tokens (define in the `CSS` template string as CSS variables on `:root`, `:root.theme-dark`, `:root.theme-light`)
```
--bg:            dark #070A12   | light #F5F7FB
--bg-image:      dark url('/site-bg-glossy.png') | light url('/light-mode-white.jpg')   (keep existing assets)
--surface:       dark rgba(17,22,36,.72) | light rgba(255,255,255,.82)
--surface-strong:dark #121829   | light #FFFFFF
--border:        dark rgba(255,255,255,.10) | light rgba(15,23,42,.10)
--text:          dark #F1F5F9   | light #0F172A
--text-muted:    dark #94A3B8   | light #64748B
--accent:        #7C3AED  (violet)
--accent-2:      #06B6D4  (cyan)
--accent-3:      #F59E0B  (amber)
--danger:        #EF4444
--success:       #22C55E
--grad-accent:   linear-gradient(135deg,#7C3AED 0%,#2563EB 50%,#06B6D4 100%)
--radius-sm: 12px; --radius: 18px; --radius-lg: 26px; --radius-pill: 999px
--shadow-1: 0 6px 18px rgba(2,6,23,.28); --shadow-2: 0 18px 48px rgba(2,6,23,.38)   (light theme: ~40% of that alpha)
--blur: blur(14px) saturate(140%)
```
Header bar (`--header-bg-*` vars) becomes a slim glass strip using `--surface` + `--border` + a 2px top gradient line (`--grad-accent`). Drop the heavy "watercolor" gradients.

### Typography
- Add Google Fonts to `index.html`: `Sora` (600/700/800) for display/headings, `Inter` (400/500/600/700) for body. Keep the existing SF system stack as fallback: `'Sora', <SF_STACK>` for display, `'Inter', <SF_STACK>` for body.
- Scale: display `clamp(28px,5vw,44px)`; h2 `clamp(20px,3.2vw,28px)`; body 15–16px; labels 11–12px uppercase, letter-spacing .08em.

### Components
- **Buttons**: `getGlassButtonStyle` / `getGlassCircleButtonStyle` remain the API (same params) but render: pill/rounded-18 shapes, 1px `--border`, tinted translucent fill, subtle inner highlight, hover lift (`.tap` handles), focus ring `0 0 0 3px rgba(124,58,237,.35)`. Primary = solid `--grad-accent` with white text. Danger = `--danger` tint. Subtle = surface tint.
- **Cards / QuestionPanel**: `--surface` + `--blur` + 1px `--border` + `--shadow-2`, `--radius-lg`. Top-edge 3px gradient accent line using the tile's point color.
- **Point pills** (200/400/600 & FFA 100–500): keep `PT_COLORS`/`PT_BG` semantics; render as bold rounded pills with the color as text + 14% tinted background + 1px same-color border.
- **Team pills** (ScoreBar/BoardHeader): active team = solid team color with white text + glow `0 0 0 4px <teamcolor 25%>`; inactive = outline. Score digits use `Sora` 800, tabular-nums.

### Screens
- **AuthScreen**: centered card (max 420px), big "TRIVIC" wordmark with gradient text, tabs Login/Sign up as a segmented control, inputs with 1px border + focus ring, primary CTA full-width.
- **SetupScreen**: two stacked cards — "Teams" (inline editable team chips with remove ×, add button) and "Mode" (segmented: Teams / Free-for-all with one-line description). Sticky bottom CTA "Choose Categories →". Account chip + logout top-right.
- **CategoryScreen**: sticky top bar (Back, title, selected count, START button). Groups as sections with a label chip; category cards in a responsive grid `repeat(auto-fill,minmax(150px,1fr))` (min 120px on phones), each card = art (cover) + gradient scrim + label; selected state = 3px `--accent` ring + check badge; multi-copy badge kept. Quick actions ALL / RANDOM MIX / CLEAR as pill buttons.
- **BoardScreen**: header = ScoreBar (turn banner + team pills). Board grid: one column per selected category; column header = square category art card with label below; tiles = tall rounded buttons (`--radius`) with the point value in `Sora` 800, tinted by `PT_COLORS`; used tiles = 32% opacity, desaturated, no hover. Board must scroll horizontally INSIDE its own container on narrow screens (`overflow-x:auto` on the board wrapper only), never the page. "End game" button bottom-right pill.
- **Question screens** (all 7): layout = ScoreBar → stage (max 920px) → timer ring (keep `QuestionTimer` logic) → header row (icon, category label, point pill) → QuestionPanel with the prompt (large, centered, `Sora` 700) → media (image frame / map / player / QR) → reveal button (primary) → answer panel (`pop` animation, gradient top line in point color, answer in `Sora` 800) → AwardRow. Lifeline rail: vertical stack of round glass buttons on the right on desktop, horizontal row under the panel on phones. Back-to-board as a subtle pill.
- **GameOverScreen**: full-screen centered; winner card with trophy + confetti-like gradient glow; podium list of all teams sorted by score with medals; buttons Rematch (primary) / New game (subtle).
- **Toggles** (theme/language): small round glass buttons, top-right, unchanged behavior.

### Motion
- Page transitions: keep `.page-enter`. Tile press: scale .96. Answer reveal: `pop`. Board tiles used: fade to 32% over .3s. Reduced-motion media query disables non-essential animation.

### Accessibility
- Every interactive element ≥ 44px tap target on touch. Visible focus rings. `aria-label` on icon-only buttons.
