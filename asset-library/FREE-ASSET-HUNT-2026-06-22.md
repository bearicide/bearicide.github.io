# MATTBEAR Free Asset Hunt - 2026-06-22

Purpose: keep a legal, reusable list of free asset sources for MATTBEAR, Lovable, Unity, web games, music pages, and local project builds.

## License rule

Preferred order:

1. CC0 / Public Domain - safest for reuse.
2. MIT / Apache / OFL - good for code and fonts.
3. CC-BY - usable with credit.
4. CC-BY-SA / GPL - only use when the project can handle share-alike/copyleft obligations.
5. CC-BY-NC / random free downloads - avoid for public/business-facing work.

## Clean sources

| Source | Best use | License notes | MATTBEAR use |
|---|---|---|---|
| Kenney | Game UI, icons, input prompts, 2D kits, 3D kits, audio | Kenney support says game assets on asset pages are CC0/public-domain licensed and commercial use is allowed. Attribution is not required, but crediting Kenney is appreciated. | First stop for Unity/Lovable game shells. |
| Poly Haven | HDRIs, textures, 3D models | Poly Haven states all assets are CC0 and can be used commercially without attribution. | Backgrounds, materials, Unity scenes, 3D spaces. |
| OpenGameArt | 2D art, 3D art, music, sound effects | Commercial use can be allowed, but each item has license terms. Track attribution carefully. | Use when Kenney/Poly Haven do not cover the style. |
| Freesound | SFX, ambience, button sounds, arcade bleeps | Freesound uses CC0, CC-BY, and CC-BY-NC. Prefer CC0. CC-BY needs attribution. Avoid NC for public/business work. | SFX library only, not full songs. |

## First-pick asset types

### Unity / 3D

- Kenney 3D Platformer Kit
- Kenney Modular Dungeon Kit
- Kenney Modular Space Kit
- Kenney City Kits
- Poly Haven HDRIs for skies and lighting
- Poly Haven concrete, metal, road, neon-compatible textures

### Web / Lovable UI

- Kenney Input Prompts
- Kenney UI assets
- Kenney Interface Sounds
- Google Fonts / OFL fonts, self-host later if needed

### Arcade / casino-style demo games

- Kenney Casino Audio
- Kenney UI Audio
- Kenney Interface Sounds
- Freesound CC0 coin/drop/button/bleep sounds
- Existing MATTBEAR slot art:
  - `/assets/slots/wordplay-slot-machine-design.png`
  - `/assets/slots/wordplay-letter-symbol-sheet.png`

### MATTBEAR music/game portals

- Existing MATTBEAR cover art:
  - `/assets/music/album-most-things-single.png`
  - `/assets/music/album-all-fall-down-bubble.png`
- Kenney UI and audio for buttons/menus
- Poly Haven HDRIs/textures for Unity album rooms

## Target repo structure

```txt
/assets-vault/
  kenney/
    ui/
    audio/
    2d/
    3d/
  poly-haven/
    hdri/
    textures/
    models/
  opengameart/
    cc0/
    attribution-required/
  freesound/
    cc0/
    attribution-required/
  fonts/
  credits.md
  licenses.md
  asset-index.json
```

## Asset intake checklist

For every new asset:

```txt
asset name:
source:
source url:
license:
credit required: yes/no
author:
download date:
project use:
repo path:
notes:
```

## Build rule

Before generating new art or UI:

1. Check existing repo assets.
2. Check this free asset hunt list.
3. Use CC0 assets first.
4. Track credits in `credits.md` when needed.
5. Only generate new assets when the vault does not fit.

## Immediate next pulls

1. Kenney Input Prompts - for game controls and mobile UI.
2. Kenney Interface Sounds / UI Audio - for button clicks and menus.
3. Kenney Casino Audio - for WORDSLOTS / arcade demo polish.
4. Kenney Modular Space Kit - for Unity music room / Giant Moon style build.
5. Poly Haven HDRIs and metal/concrete textures - for polished Unity lighting and industrial MATTBEAR vibe.
6. Freesound CC0 arcade bleeps, coin drops, mechanical clicks, ambience.

## Notes

Do not pull Nintendo, Disney, Marvel, Pokemon, Roblox, movie/celebrity, or random Pinterest assets. Free-looking is not free. Future legal problems are not a design language.
