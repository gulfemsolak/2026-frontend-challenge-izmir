/**
 * @file ConfidenceMeter.jsx
 * @description Visual progress bar showing location confidence score (0–100).
 * Color transitions: red (<40) → yellow (40–70) → green (>70).
 * Used in the Header to show the most-likely current Podo location.
 *
 * @param {Object} props
 * @param {number} props.score      - Confidence score 0–100
 * @param {string} props.location   - Location name to display
 * @param {boolean} [props.compact] - Smaller inline variant for the header
 */

function getBarColor(score) {
  if (score >= 70) return '#4ade80'; // green-400
  if (score >= 40) return '#facc15'; // yellow-400
  return '#f87171';                  // red-400
}

export default function ConfidenceMeter({ score, location, compact = false }) {
  const barColor = getBarColor(score);

  if (compact) {
    return (
      <div className="flex flex-col gap-0.5" title={`Confidence score: ${score}/100`}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest truncate flex-1 min-w-0">
            {location}
          </span>
          <span className="font-mono text-[9px] shrink-0" style={{ color: barColor }}>
            {score}%
          </span>
        </div>
        <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          Location Confidence
        </p>
        <span className="font-mono text-sm font-bold" style={{ color: barColor }}>
          {score}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: barColor }}
        />
      </div>
      <p className="font-mono text-[10px] text-zinc-400">
        Last known: <span className="text-zinc-200">{location}</span>
      </p>
    </div>
  );
}
