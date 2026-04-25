/**
 * @file Header.jsx
 * @description Top header bar for Find Podo.
 * Shows the app title with detective styling, a "MISSING" badge for Podo,
 * a live monitoring pulse indicator, and the last-updated timestamp.
 *
 * @param {Object}  props
 * @param {Date|null} props.lastUpdated - Timestamp of the most recent evidence fetch
 * @param {boolean}   props.isLive      - Whether background polling is active
 */

import { formatRelative } from '../../utils/dateHelpers.js';

export default function Header({ lastUpdated = null, isLive = true }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0">
      {/* Left: logo + missing badge */}
      <div className="flex items-center gap-3">
        <img
          src="https://cdn.jotfor.ms/assets/resources/podo/n_podo_2.png"
          alt="Podo mascot"
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

      {/* Right: live indicator + last updated */}
      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="hidden sm:block font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            Updated {formatRelative(lastUpdated)}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {/* Animated pulse dot */}
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
    </header>
  );
}
