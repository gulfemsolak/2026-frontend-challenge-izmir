/**
 * @file Header.jsx
 * @description Top header bar: Podo mascot, title, live status, last-updated,
 * and a compact confidence meter. Minimum height 80px.
 * All text uses whitespace-nowrap to prevent wrapping in narrow sidebars.
 *
 * @param {Object}                           props
 * @param {Date|null}                        props.lastUpdated  - Most recent evidence timestamp
 * @param {boolean}                          props.isLive       - Whether polling is active
 * @param {{ location: string, score: number }|null} props.topLocation - Highest-confidence location
 */

import ConfidenceMeter from '../ui/ConfidenceMeter.jsx';
import { formatRelative } from '../../utils/dateHelpers.js';

export default function Header({ lastUpdated = null, isLive = true, topLocation = null }) {
  return (
    <header className="min-h-[80px] flex flex-col border-b border-zinc-800 bg-zinc-900 shrink-0">

      {/* ── Main row ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 flex-1">

        {/* Mascot: fixed 40×40, never shrinks */}
        <img
          src="https://cdn.jotfor.ms/assets/resources/podo/n_podo_2.png"
          alt="Podo - Missing Mascot"
          className="h-10 w-10 flex-shrink-0 object-contain"
        />

        {/* Title block: fills available space, never truncates "FIND PODO" */}
        <div className="flex flex-col flex-1 min-w-0">
          <h1 className="font-mono text-sm font-bold tracking-widest text-zinc-100 uppercase whitespace-nowrap">
            Find Podo
          </h1>
          <span className="font-mono text-[10px] tracking-widest text-red-400 uppercase whitespace-nowrap">
            ● Missing
          </span>
        </div>

        {/* Right block: live dot + last-updated, stacked, shrink-0 so it stays intact */}
        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2 shrink-0">
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLive ? 'bg-green-400' : 'bg-zinc-600'
                }`}
              />
            </span>
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider whitespace-nowrap">
              {isLive ? 'Monitoring' : 'Offline'}
            </span>
          </div>

          {lastUpdated && (
            <span className="font-mono text-[10px] text-zinc-600 whitespace-nowrap">
              {formatRelative(lastUpdated)}
            </span>
          )}
        </div>
      </div>

      {/* ── Confidence row — full width below the main row ──────────── */}
      {topLocation && (
        <div className="px-4 pb-3">
          <ConfidenceMeter
            score={topLocation.score}
            location={topLocation.location}
            compact
          />
        </div>
      )}
    </header>
  );
}
