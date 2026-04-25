# Find Podo — Detective Investigation Board

> **Jotform 2026 Frontend Challenge · Izmir**

Podo, Jotform's beloved mascot, has gone missing. **Find Podo** is a real-time detective investigation board that aggregates live witness data from five Jotform forms — check-ins, sightings, messages, personal notes, and anonymous tips — and plots them on an interactive dark map so investigators can track Podo's movements, cross-reference evidence, and narrow down the most likely current location.

---

## Concept

Every form submission is a clue. The app pulls data from Jotform's API every 60 seconds, normalises it into a unified evidence model, and displays it in two parallel views:

- **The Map** — colored markers per evidence type, a dashed amber trail connecting chronological check-ins and sightings, and click-to-inspect popups.
- **The Evidence Panel** — a tabbed, searchable, filterable list of all clues. Anonymous tips are blurred by default and require a "Decrypt" click to reveal.

A **confidence score** (0–100) is computed for each location using recency (40%), source diversity (30%), and volume (30%), and displayed in the header alongside Podo's last known location.

---

## Setup

**Prerequisites:** Node 18+

```bash
# 1. Clone the repo
git clone <repo-url>
cd 2026-frontend-challenge-izmir

# 2. Install dependencies
npm install

# 3. Create your environment file
echo "VITE_JOTFORM_API_KEY=your_key_here" > .env

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Note:** The `.env` file is gitignored. Never commit your API key.
> The app polls Jotform every 60 seconds. With 5 forms and a 1 000 req/day
> starter plan limit, the budget math is: 10 (startup) + 5 × (3 hrs × 60 refetches) = ~910 requests/day.

---

## Architecture

### Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + Vite 8 | Fast HMR, ES module native |
| Styling | Tailwind CSS v4 | Zero-config, utility-first |
| Map | React Leaflet + CartoDB Dark Matter | No API key, dark theme built-in |
| Data fetching | TanStack React Query v5 | Automatic caching, background refetch, staleTime control |
| Global UI state | Zustand | Minimal boilerplate for selected item, filters, search |
| Icons | Lucide React | Consistent, tree-shakeable |
| Date formatting | date-fns | Lightweight, modular |

### Data Flow

```
Jotform API (/submissions × 5 forms)
    ↓  [jotformClient.js — query-param auth, CORS-safe]
    ↓  [forms.js — one fetcher per form]
    ↓  [useQuery hooks — 5 min stale, 60 s refetch]
    ↓  [parseSubmission.js — normalise to EvidenceItem]
    ↓  [useAllEvidence.js — merge + sort + geocode fallback]
    ↓
InvestigationPage → AppShell → { EvidencePanel, PodoMap, DetailDrawer }
```

### Key Design Decisions

- **Query-param auth over header auth** — Jotform's CORS policy allows `*` origins but only whitelists `Content-Type` as a custom request header. The `APIKEY` header triggers a preflight that Jotform rejects. Using `?apiKey=` avoids the preflight and works from any browser without a proxy.
- **`staleTime: 300 000`, `refetchInterval: 60 000`** — Questions schema is fetched once (staleTime: Infinity). Submissions refresh every 60 s. This keeps the app within Jotform's 1 000 req/day limit.
- **`CircleMarker` not `Marker`** — React Leaflet in Vite has a known broken-icon bug with default markers. CircleMarker is pure SVG, no asset resolution required, and naturally supports per-type coloring.
- **Zustand for UI state, React Query for server state** — clean separation. Zustand holds: selected evidence, active tab, filters, search query, drawer open/close. React Query owns all server data and caching.
- **Geocoding as fallback only** — most submissions include a `coordinates` field as a `"lat,lng"` string. Nominatim is only called for items with a location name but no coordinates. Results are cached in-memory to respect the 1 req/s rate limit.

### Data Sources

| Form | ID | Purpose |
|---|---|---|
| Check-ins | 261134527667966 | Confirmed Podo locations with coordinates |
| Sightings | 261133720555956 | Eyewitness reports — person, location, notes |
| Messages | 261133651963962 | Communications between people about Podo |
| Personal Notes | 261134449238963 | Investigator's private observations |
| Anonymous Tips | 261134430330946 | Unverified crowd-sourced tips with submitter confidence |

### Confidence Score Algorithm

```
score = recency(40%) + sourceDiversity(30%) + volume(30%)

recency:         linear decay from 1.0 (now) → 0.0 (48 hrs ago)
sourceDiversity: unique evidence types at location / total types (5)
volume:          min(evidenceCount / 10, 1.0)
```

---

## Features

- Live evidence map with colored markers per type and a trail polyline
- Tabbed sidebar: All / Check-ins / Sightings / Messages / Notes / Tips
- Debounced full-text search across all evidence fields
- Type checkbox filters + date range picker
- Anonymous tip cards with blur-to-reveal decrypt interaction
- Click any marker or card → slide-in detail drawer with related evidence
- Confidence meter in the header showing the most likely current location
- Submit anonymous tip button → embedded Jotform iframe
- Responsive layout: map above sidebar on mobile, side-by-side on desktop
- Detective theme: scanline overlay, noise texture, amber accent, CartoDB dark tiles
