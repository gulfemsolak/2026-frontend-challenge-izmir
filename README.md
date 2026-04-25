# Find Podo — Detective Investigation Board

> **Jotform 2026 Frontend Challenge · Izmir**

Podo, Jotform's beloved mascot, has gone missing. **Find Podo** is a real-time detective investigation board that aggregates live witness data from five Jotform forms — check-ins, sightings, messages, personal notes, and anonymous tips — and plots them on an interactive dark map so investigators can track Podo's movements, cross-reference evidence, and narrow down the most likely current location.

---

## Features

- **Live evidence map** — animated DivIcon markers per evidence type; the most recent sighting pulses with a red ring, and the top-confidence location gets a rotating amber dashed ring
- **AI Investigator Panel** — one-click OpenAI gpt-4o-mini analysis of the 10 most recent clues; returns a noir-style 3-bullet detective report on Podo's likely whereabouts
- **Glassmorphism UI** — sidebar panels use `backdrop-blur`, `bg-white/[0.06]`, and gradient backgrounds for a polished dark-glass aesthetic
- **Evidence filtering & search** — tabbed by type (All / Check-ins / Sightings / Messages / Notes / Tips), debounced full-text search, type checkboxes, and date range filter; staggered card entrance animations on every filter change
- **Confidence scoring** — 0–100 score per location (recency 40%, source diversity 30%, volume 30%) displayed in the header and highlighted on the map
- **5 live Jotform data sources** — all forms polled every 60 seconds via TanStack Query; shimmer skeleton loaders during initial fetch
- **Detail drawer** — click any card or map marker to slide in full evidence detail with related items
- **Responsive layout** — map above sidebar on mobile, side-by-side on desktop (CSS `order` trick, single React tree)
- **Anonymous tip decrypt** — tip content is blurred by default; a "Decrypt" button reveals it with a transition
- **Detective theme** — CartoDB Dark Matter tiles, scanline overlay, noise texture, amber accent, dark Leaflet popups

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
cp .env.example .env   # or create manually:
```

`.env` (required):
```
VITE_JOTFORM_API_KEY=your_jotform_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

```bash
# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Note:** The `.env` file is gitignored. Never commit your API keys.
> The app polls Jotform every 60 seconds. With 5 forms on a 1 000 req/day starter plan: 10 (startup) + 5 × (3 hrs × 60 refetches) ≈ 910 requests/day.

---

## Architecture

### Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + Vite 8 | Fast HMR, ES module native |
| Styling | Tailwind CSS v4 | Zero-config utility-first, `@import "tailwindcss"` |
| Map | React Leaflet 5 + CartoDB Dark Matter | No API key, dark theme built-in, DivIcon for CSS animations |
| Data fetching | TanStack React Query v5 | Automatic caching, background refetch, staleTime control |
| Global UI state | Zustand | Minimal boilerplate for selected item, filters, search |
| AI analysis | OpenAI gpt-4o-mini | Fast, cheap, dramatically appropriate |
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
InvestigationPage
    ├── PodoMap        (animated DivIcon markers, MapBoundsController)
    ├── LastKnownPosition  (top-confidence location card)
    ├── AIAnalysisPanel    (OpenAI report, collapsible)
    ├── EvidencePanel  (tabs + search + filters + skeleton loaders)
    └── DetailDrawer   (slide-in overlay)
```

### Key Design Decisions

- **Query-param auth over header auth** — Jotform's CORS policy only whitelists `Content-Type` as a custom request header. The `APIKEY` header triggers a preflight that Jotform rejects. Using `?apiKey=` avoids the preflight.
- **`staleTime: 300 000`, `refetchInterval: 60 000`** — Questions schema fetched once (`staleTime: Infinity`). Submissions refresh every 60 s to stay within the daily request budget.
- **DivIcon instead of CircleMarker** — DivIcon renders arbitrary HTML, enabling CSS keyframe animations (pulse ring on latest, rotating ring on top-confidence). CircleMarker is pure SVG with no animation surface.
- **Zustand for UI state, React Query for server state** — clean separation. Zustand: selected evidence, active tab, filters, search, drawer. React Query: all server data and caching.
- **filterKey re-mounts EvidenceList** — passing a computed key string as a React `key` to the list `<ul>` forces remount on every filter/tab change, cleanly triggering stagger entrance animations without imperative DOM manipulation.
- **Geocoding as fallback only** — most submissions include a `coordinates` field as a `"lat,lng"` string. Nominatim is only called for items with a location name but no coordinates, with in-memory caching to respect the 1 req/s rate limit.

### Confidence Score Algorithm

```
score = recency(40%) + sourceDiversity(30%) + volume(30%)

recency:         linear decay 1.0 (now) → 0.0 (48 hrs ago)
sourceDiversity: unique evidence types at location / 5
volume:          min(evidenceCount / 10, 1.0)
```

### Data Sources

| Form | ID | Purpose |
|---|---|---|
| Check-ins | 261134527667966 | Confirmed Podo locations with coordinates |
| Sightings | 261133720555956 | Eyewitness reports — person, location, notes |
| Messages | 261133651963962 | Communications about Podo |
| Personal Notes | 261134449238963 | Investigator's private observations |
| Anonymous Tips | 261134430330946 | Unverified crowd-sourced tips with submitter confidence level |
