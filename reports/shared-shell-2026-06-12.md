# Shared Shell Update — 2026-06-12

## Goal

Make connected MATTBEAR pages share the same behavior instead of each page carrying its own nav/admin/share pattern.

## Shared layer

Updated `assets/mattbear-sitewide.js` into the shared shell.

Shared features:

- One bottom route ring
- One Share button
- One Ctrl+Shift+M panel
- Same core route set: Home, HiberNation, Music, Music Tools, The Choppa, Arcade, Cards, Map
- Local page view count
- Web Share API support with clipboard fallback
- Dynamic OpenGraph/Twitter metadata injection
- Duplicate-load guard

## Pages wired or normalized

- `/`
- `/music/`
- `/wordplay/`
- `/interactive/`
- `/trading-cards/`
- `/music-toys/`
- `/about/`
- `/MATTBEARCADE/`
- `/mattbear-allfalldown/`
- `/retrocade-/`

Already using the shared sitewide layer:

- `/HiberNation/`
- `/examples/`

## Notes

This makes the connected pages behave the same at the route/share/admin level while still allowing each page to keep its subject-specific content.

Some deep older toys may still use isolated app shells. Those should be brought in one at a time after testing because audio/game pages are easy to break, which is very rude of them.
