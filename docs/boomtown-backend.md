# BOOMTOWN backend prep

## Product loop

1. Player uploads one full song.
2. Backend creates a content hash and checks cache.
3. If new, charge tokens for analysis/stem split.
4. Queue audio analysis.
5. Detect tempo, beat grid, downbeats, loudness sections, likely build, and likely drop/payoff.
6. Split or derive complementary stems/sections.
7. Map 8 playable pads to Player 1 and 8 related pads to Player 2.
8. In Co-Op, reward synchronized hits.
9. In Duel, same song, different stems, first clean ULTRA hit wins.
10. ULTRA can only fire during a detected sync window.

## Required services

- Auth or anonymous session token
- Token wallet and ledger
- Upload storage
- Audio hash/cache
- Analysis queue
- Stem split worker
- Beat/downbeat worker
- Build/drop detector
- Pad-map generator
- Session state endpoint
- Score/leaderboard endpoint, optional

## Suggested storage

Uploaded originals should not live directly in the public GitHub repo. Put generated public preview assets on GitHub Pages if needed, but keep originals in object storage.

Good first backend shape:

- Supabase or Firebase for auth/session/token ledger
- Cloudflare R2, S3, or Supabase Storage for audio files
- Serverless queue for analysis jobs
- Worker process for source separation and beat detection

## Token rules v1

| Action | Cost |
|---|---:|
| Basic demo play | 0 |
| Upload + analyze + stem split | 10 |
| Duel mode unlock | 15 |
| ULTRA retry after miss | 5 |
| Save/share BOOMTOWN mix | 5 |

## Audio analysis outputs

```json
{
  "song_id": "sha256-hash",
  "title": "uploaded-file-name",
  "duration": 134.2,
  "bpm": 128,
  "key": "C#m",
  "beat_grid": [0.12, 0.58, 1.04],
  "downbeats": [0.12, 1.96, 3.80],
  "sections": [
    {"type":"intro","start":0,"end":16.4},
    {"type":"groove","start":16.4,"end":48.1},
    {"type":"build","start":48.1,"end":64.0},
    {"type":"drop","start":64.0,"end":96.0}
  ],
  "ultra_window": {"start":62.5,"end":66.0,"confidence":0.84},
  "pad_map": {
    "player_1": ["stem-a-01","stem-a-02","stem-a-03","stem-a-04","stem-a-05","stem-a-06","stem-a-07","stem-a-08"],
    "player_2": ["stem-b-01","stem-b-02","stem-b-03","stem-b-04","stem-b-05","stem-b-06","stem-b-07","stem-b-08"]
  }
}
```

## UX constraint

No fixed labels like Kick/Snare/Bass because user songs vary. The engine should label pads visually by energy role instead:

- steady
- heavy
- bright
- motion
- lift
- hit
- weird
- payoff

The public arcade UI can keep symbols instead of sound names.
