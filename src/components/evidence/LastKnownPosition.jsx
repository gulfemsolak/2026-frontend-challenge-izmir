/**
 * @file LastKnownPosition.jsx
 * @description Pinned card at the top of the sidebar answering the key question:
 * "Where is Podo RIGHT NOW?" Shows the highest-confidence location with a
 * pulsing active-zone indicator, clue count, time since last seen, and confidence bar.
 *
 * @param {Object}                                    props
 * @param {{ location: string, score: number } | null} props.topLocation - Pre-computed top location
 * @param {EvidenceItem[]}                            props.allEvidence  - Full evidence pool
 */

import { useMemo } from 'react';
import { formatRelative } from '../../utils/dateHelpers.js';

function getBarColor(score) {
  if (score >= 70) return '#4ade80';
  if (score >= 40) return '#facc15';
  return '#f87171';
}

export default function LastKnownPosition({ topLocation, allEvidence }) {
  const details = useMemo(() => {
    if (!topLocation) return null;
    const key = topLocation.location.trim().toLowerCase();
    // allEvidence is already sorted newest-first
    const items = allEvidence.filter(
      (item) => item.location?.trim().toLowerCase() === key
    );
    return {
      location: topLocation.location,
      score: topLocation.score,
      count: items.length,
      lastSeen: items[0]?.submittedAt ?? null,
    };
  }, [topLocation, allEvidence]);

  if (!details) return null;

  const barColor = getBarColor(details.score);

  return (
    <div className="shrink-0 px-4 pt-3 pb-3 border-b-2 border-white/10 bg-white/[0.06] backdrop-blur-md">
      {/* Row 1: label + active zone badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
          Last Known Position
        </span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-red-400">
            Active Zone
          </span>
        </div>
      </div>

      {/* Row 2: location name — large, amber, the hero of this card */}
      <p className="font-mono text-base font-bold text-amber-400 truncate leading-tight mb-1">
        {details.location}
      </p>

      {/* Row 3: last seen + clue count */}
      <p className="font-mono text-[10px] text-zinc-500 mb-2">
        {details.lastSeen && <span>{formatRelative(details.lastSeen)}</span>}
        <span className="text-zinc-700"> · </span>
        <span>{details.count} clue{details.count !== 1 ? 's' : ''}</span>
      </p>

      {/* Row 4: confidence bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${details.score}%`, backgroundColor: barColor }}
          />
        </div>
        <span
          className="font-mono text-[10px] shrink-0"
          style={{ color: barColor }}
        >
          {details.score}%
        </span>
      </div>
    </div>
  );
}
