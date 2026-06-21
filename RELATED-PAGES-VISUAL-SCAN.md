# Related Pages Visual Scan

Updated: 2026-06-21

## Scope

Human-facing pass across pages related to Project Focus:

- `/projects.html`
- `/MATTBEARCADE/`
- `/music/`
- `/music-toys/`
- `/trading-cards/`
- `/wordplay/`
- `/fallen-earth/`
- `/HiberNation/`
- `/the-launcha/`
- `/the-loopa/`
- `/examples/`
- `/project-packages.html`

Goal: find visible flaws, not pretend HTML is a personality.

---

## Fixed in this pass

### MATTBEARCADE

Problem:

- Page title said `MATTBEAR Interactive Map`.
- Page content behaved like the spatial map, not an arcade district.
- Some links referenced missing or confusing routes.

Fix:

- Rebuilt arcade landing page around real arcade/game routes.
- Added clear paths to RETROCADE, WORD$LOTS, WORDPLAY, and Project Focus.
- Updated duplicate `/MATTBEARCADE/` folder inside main repo.
- Updated separate `bearicide/MATTBEARCADE` repo landing page.
- Bumped service worker cache in `bearicide/MATTBEARCADE`.

### Fallen Earth

Problem:

- `/music/` referenced `/fallen-earth/`.
- `/fallen-earth/` did not exist in the main repo.

Fix:

- Added `/fallen-earth/index.html` bridge route.
- Classified it as experimental/atmospheric, not music-release content.

### Trading Cards

Problem:

- Nav still used older `Interactive` language.
- Footer did not clearly route back to Project Focus.

Fix:

- Replaced `Interactive` nav with `Project Focus`.
- Added Project Focus CTA and footer link.
- Updated FAQ wording.

### WORDPLAY

Problem:

- Nav still used older `Interactive` language.
- Build-plan actions did not point clearly back to the current route board.

Fix:

- Replaced `Interactive` with `Project Focus`.
- Added `Game Routes` CTA.
- Updated footer route.

### The Launcha

Problem:

- Visible `Admin / backend hooks` panel on public page.
- Nav did not route clearly to Project Focus.

Fix:

- Removed visible admin panel.
- Kept hidden `window.MATTBEAR_TOY` hook in JS.
- Added Project Focus to nav/footer.

### The Loopa

Problem:

- Visible `Admin / backend hooks` panel on public page.
- Nav did not route clearly to Project Focus or sibling toy.

Fix:

- Removed visible admin panel.
- Kept hidden `window.MATTBEAR_TOY` hook in JS.
- Added Project Focus and The Launcha route.

---

## Pages that passed basic scan

### Music

Pass:

- Uses shared `site-polish.css`.
- Clear purpose.
- Featured art assets exist.
- Connects Music, The Choppa, Music Tools, All Fall Down, and Fallen Earth.

Remaining note:

- Good enough for now. Do not overwork it until the rest of the ecosystem catches up.

### Music Tools

Pass:

- Uses shared shell.
- Explains the tools quickly.
- Inline Pad Lab works as a visible toy.
- Links to Launcha/Loopa folders exist inside main repo.

Remaining note:

- The tool pages are older visual shells, but functional.

### WORDPLAY

Pass after fix:

- Strong visual source page.
- Machine art and symbol sheet assets exist.
- Clear next step: playable prototype.

Remaining note:

- Needs actual playable logic later.

### Trading Cards

Pass after fix:

- Card assets and sheet source exist.
- Good gallery/promo role.
- Mobile grid rules are acceptable.

Remaining note:

- Could eventually add print/download guidance.

### Examples

Pass:

- Cleaner, warmer, more professional than the neon districts.
- Good first-stop business proof.
- Better restraint.

Remaining note:

- Keep this page less chaotic than the rest. It is the suit-friendly lane, tragic as that may be.

### Project Packages

Pass:

- Earlier feedback appears addressed: clickable package cards, clear price ranges, explanations for bundle pricing, custom scope, and connected deliverables.

Remaining note:

- Contact email consistency should be checked later across all service pages.

### HiberNation

Pass:

- Strong identity.
- Links to About, Music Tools, The Choppa, Sampla, Noise Generator, Suno, and SoundCloud are logical.

Remaining note:

- It uses an older custom shell instead of current shared `site-polish.css`.
- Not urgent, but it visually feels like a previous generation.

---

## Remaining flaws / next pass

1. **Shared shell drift**
   - HiberNation, Launcha, Loopa, and some tool pages use custom older shells.
   - They work, but they do not fully match the current doctrine.

2. **Project vs repo ambiguity**
   - Some routes are folders in `bearicide.github.io`.
   - Some routes are separate repos.
   - Public visitors do not care, but maintenance does.

3. **Interactive Map duplication**
   - `/interactive/` is now the actual spatial launcher.
   - Avoid reusing it as the arcade page again.

4. **Playable gaps**
   - WORDPLAY is still a visual/source page, not a playable machine.
   - Some music toys use placeholder synth audio.

5. **Contact consistency**
   - Service pages should be checked for one canonical contact email.

6. **Mobile visual scan still needed in-browser**
   - Code-level mobile rules look acceptable.
   - Real device/browser screenshots should still be checked manually where possible.

---

## Current route hierarchy

```txt
Main
Examples
Project Focus
HiberNation
MATTBEARCADE / RETROCADE
Music / Music Tools / The Choppa
WORDPLAY / WORD$LOTS
Trading Cards
Fallen Earth
Lab / Archive
```

That is now substantially less like a glowing junk drawer. Still a drawer, but at least the forks are not in the sock pile.