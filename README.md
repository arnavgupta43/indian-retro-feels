# Smritiyaan (स्मृतियाँ)

A nostalgia trip through six small rooms from an Indian childhood — a bus interior,
a barber shop, a roadside chai stall, a train journey, a village courtyard, and a
local bazaar. Each scene is a full-bleed photo with a looping 15-song playlist of
old Hindi film music, played through a floating glass-style player docked at the
bottom of the screen.

Live: **https://smritiyan.vercel.app**

## Features

- **6 scenes**, each with a bilingual caption (Hindi + English), an ambient sound
  description, and a photo note — switchable from a dropdown in the top bar.
- **90 curated songs** (15 per scene), streamed via the unofficial JioSaavn API,
  playing in order and looping back to the start of the scene's playlist.
- **YouTube fallback** — if every song in a scene's playlist fails to resolve
  (Saavn API unreachable), a hidden YouTube embed takes over playback automatically.
- **Custom player UI** — play/pause, next/prev, seek bar, elapsed/remaining time,
  track counter, and an animated equalizer.
- **Mobile-optimized layout** — the desktop layout is untouched; screens narrower
  than 768px get their own tuned spacing, type scale, and player sizing so nothing
  overflows or requires zooming out.

## Tech stack

- React 19 + Vite
- Plain CSS (custom properties for theming, `oklch` color space)
- [JioSaavn API](https://github.com/sumitkolhe/jiosaavn-api) (hosted at `saavn.sumit.co`) for song search/streaming
- YouTube IFrame Player API as a fallback audio source
- Deployed on Vercel, source on GitHub

## Project structure

```
src/
  components/       UI pieces (IntroScreen, TopBar, SceneCaption, SceneBackdrop,
                     PlayerBar, YouTubeFallbackPlayer) + their CSS
  data/scenes.js     the 6 scenes: copy, photo path, hue, YouTube fallback ID,
                     and each scene's 15-song playlist
  hooks/usePlaylist.js   playlist state: resolves songs against Saavn one by one,
                          skips failures, advances/loops, flags allFailed
  services/saavn.js      Saavn API search + stream URL resolution
public/
  scenes/            background photos, named `<scene-key>.<ext>` to match
                     the `image` path in scenes.js
scripts/
  song-list.json      source-of-truth song list (mirrors scenes.js)
  test-songs.mjs       verifies every song resolves against the Saavn API
```

## Getting started

```bash
npm install
npm run dev       # starts the Vite dev server
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint        # oxlint
```

No API keys or environment variables are required — the Saavn API and YouTube
IFrame API are both used unauthenticated/client-side.

## Verifying the song list

`scripts/test-songs.mjs` queries the Saavn API for every song in
`scripts/song-list.json` and reports which ones fail to resolve:

```bash
node scripts/test-songs.mjs
```

Run this after editing any scene's `songs` array in `src/data/scenes.js` (and
keep `song-list.json` in sync) to make sure every entry still resolves to a
real, playable track.

## Adding/replacing a scene photo

Drop an image at `public/scenes/<key>.<ext>` where `<key>` matches the scene's
`key` in `src/data/scenes.js`, and point that scene's `image` field at it. Until
a matching file exists, the scene falls back to a generated stripe pattern
tinted by its `hue` value.

## Deployment

The project is linked to Vercel (`vercel link`) under the project name
`smritiyan`. Deploy manually with:

```bash
vercel --prod
```

Auto-deploy on push requires connecting the GitHub repo in the Vercel
dashboard under **Project Settings → Git**.
