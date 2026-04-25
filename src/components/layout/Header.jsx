/**
 * @file Header.jsx
 * @description Top header bar: app title, Podo mascot, live pulse dot,
 * last-updated time, and a compact confidence meter for the top-scoring location.
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
    <header className="flex flex-col border-b border-zinc-800 bg-zinc-900 shrink-0">
      {/* Main row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: mascot + title */}
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.jotfor.ms/assets/resources/podo/n_podo_2.png"
            alt="Podo - Missing Mascot"
            className="h-8 w-8 object-contain"
          />
          <div>
            <h1 className="font-mono text-sm font-bold tracking-widest text-zinc-100 uppercase">
              Find Podo
            </h1>
            <span className="font-mono text-[10px] tracking-widest text-red-400 uppercase">
              ● Missing
            </span>
          </div>
        </div>

        {/* Right: last updated + live dot */}
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden sm:block font-mono text-[10px] text-zinc-600 uppercase tracking-wider">
              {formatRelative(lastUpdated)}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLive ? 'bg-green-400' : 'bg-zinc-600'
                }`}
              />
            </span>
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
              {isLive ? 'Monitoring' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Confidence row — only shown when we have a scored location */}
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
