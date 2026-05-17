# MATTBEAR Audio Assets

Place connected-site audio here.

Required mini-player theme file:

```txt
assets/audio/hibernation-theme.mp3
```

Current connected player config expects this exact path:

```txt
/assets/audio/hibernation-theme.mp3
```

Behavior once the file exists:
- starts on first site interaction / site join
- loops
- uses local MP3 playback
- defaults to 35% volume
- keeps SoundCloud as fallback link

Notes:
- Keep filenames lowercase and hyphenated.
- Avoid spaces in audio filenames.
- For future backend/admin uploads, this folder becomes the static fallback asset location.
