# 🧊 Fridge Hub

A fridge-mounted tablet dashboard / kitchen command center.

Designed to run always-on on a tablet attached to a refrigerator, in landscape,
dark mode, with big touch-friendly controls.

## Features

- **📷 Camera scanning** — add fridge items by scanning a barcode (looked up via
  [Open Food Facts](https://world.openfoodfacts.org/)) or by snapping a photo /
  receipt for quick multi-item entry.
- **🧊 Fridge inventory** — categories, quantities, and per-item expiry dates.
- **⏳ Expiry tracking** — items sorted soonest-first with badges: ❌ Expired,
  ⚠️ Expiring soon (≤3 days), 🔔 Use this week (≤7 days), ✅ Fresh, plus an
  "Expiring Soon" strip you can read from across the kitchen.
- **🛒 Shopping list** — linked to inventory (mark "need more" → adds to list,
  "bought it" → adds to fridge).
- **🌤️ Weather** — via the free [Open-Meteo](https://open-meteo.com/) API (no key).
- **⏲️ Kitchen timer** — presets + custom, with an alarm.
- **📝 Family notes** — sticky-note message board.
- **🏠 Home Assistant** — quick-launch tile / embed for your HA dashboard.
- **💾 Persistence** — everything saved in the browser's `localStorage`.

## Project structure

```
fridge-hub-app/
├── public/
│   └── index.html      # the entire app (self-contained HTML/CSS/JS)
├── vercel.json         # Vercel static hosting config
├── .gitignore
└── README.md
```

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Go to <https://vercel.com>, sign in with GitHub, and **Import** the repo.
3. Framework preset: **Other**. Output directory: `public`. Deploy.
4. Open the resulting `https://...vercel.app` URL on your tablet.

> **Camera note:** browser camera access requires **HTTPS** (which Vercel provides
> automatically) or `localhost`. It will *not* work when opening the HTML file
> directly from disk.

## Local development

It's a single static file — just open `public/index.html` in a browser, or serve
the folder locally (e.g. `npx serve public`) to test camera features over
`localhost`.

## Data & privacy

All data lives in the browser's `localStorage`, tied to the specific browser +
URL. Nothing is sent to a server (aside from the weather and Open Food Facts
lookups). There is no cross-device sync yet.
