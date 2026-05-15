# RunRoutine

A personal Progressive Web App for tracking strength training, physical therapy exercises, and Strava cardio activity (Run + Ride). Single-file vanilla HTML, no build step, deploys as a static site.

## What it does

- **Today** — read-only display of today's scheduled exercises as blue pill cards with prescribed sets, reps, and weight
- **Schedule** — weekly pattern picker (which weekday maps to which category)
- **Exercises** — library + custom exercises grouped by category, with variation suggestions when adding new exercises
- **Cardio** (coming in Phase 5) — Strava-synced runs and rides with a weekly mileage chart, blue for Run, lime green for Ride

## Tech stack

- Vanilla HTML5 + ES2022 JavaScript (single file, no build step)
- [Alpine.js](https://alpinejs.dev/) for reactive UI bindings
- [Dexie.js](https://dexie.org/) for IndexedDB wrapper
- Service Worker + Web App Manifest for PWA install
- Hosted on Netlify, auto-deployed from this repo's `main` branch

## Local dev

```bash
# Serve the static files
python3 -m http.server 8765
# Open http://localhost:8765 in your browser
```

## Deploy

Pushes to `main` auto-deploy to Netlify.

## Data

All data lives in IndexedDB on your phone. Settings tab has JSON export/import for iCloud Drive backup.
