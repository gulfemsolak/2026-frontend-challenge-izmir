/**
 * @file TimelinePlayback.jsx
 * @description Playback bar overlaid at the bottom of the map.
 * Lets investigators scrub through evidence chronologically to see
 * how Podo's location evolved over time.
 *
 * Behavior:
 *   - Slider range spans minDate → maxDate of all evidence
 *   - Dragging the slider filters map pins to items submitted ≤ slider time
 *   - ▶ Play auto-advances every 800ms (1x) or 400ms (2x), ~50 steps total
 *   - At max position (or on reset): all pins are visible (playbackTime = null)
 *   - Pauses automatically when the end is reached
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.allEvidence   - Full evidence pool (for date range)
 * @param {Function}       props.onTimeChange  - Called with Date | null on every change
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack } from 'lucide-react';
import { format } from 'date-fns';

export default function TimelinePlayback({ allEvidence, onTimeChange }) {
  const [sliderMs, setSliderMs] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);

  const { minMs, maxMs } = useMemo(() => {
    const times = allEvidence
      .map((e) => new Date(e.submittedAt).getTime())
      .filter((t) => !isNaN(t));
    if (!times.length) return { minMs: null, maxMs: null };
    return { minMs: Math.min(...times), maxMs: Math.max(...times) };
  }, [allEvidence]);

  // Initialise slider to max (show all) when evidence first loads
  useEffect(() => {
    if (maxMs !== null && sliderMs === null) {
      setSliderMs(maxMs);
    }
  }, [maxMs, sliderMs]);

  // Each playback tick advances by 1/50th of the total date range
  const stepMs = useMemo(() => {
    if (minMs === null || maxMs === null || minMs === maxMs) return 3_600_000;
    return Math.max((maxMs - minMs) / 50, 60_000);
  }, [minMs, maxMs]);

  const notifyParent = useCallback(
    (ms) => {
      onTimeChange(ms >= maxMs ? null : new Date(ms));
    },
    [maxMs, onTimeChange]
  );

  // Playback interval — clears itself when paused or unmounted
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!isPlaying || minMs === null) return;

    intervalRef.current = setInterval(() => {
      setSliderMs((prev) => {
        const next = (prev ?? minMs) + stepMs;
        if (next >= maxMs) {
          setIsPlaying(false);
          notifyParent(maxMs);
          return maxMs;
        }
        notifyParent(next);
        return next;
      });
    }, speed === 2 ? 400 : 800);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, minMs, maxMs, stepMs, notifyParent]);

  function handleSliderChange(e) {
    const value = Number(e.target.value);
    setIsPlaying(false);
    setSliderMs(value);
    notifyParent(value);
  }

  function handlePlayPause() {
    if (!minMs) return;
    // If already at the end, restart from beginning
    if (!isPlaying && sliderMs >= maxMs) {
      setSliderMs(minMs);
      notifyParent(minMs);
    }
    setIsPlaying((prev) => !prev);
  }

  function handleReset() {
    setIsPlaying(false);
    setSliderMs(maxMs);
    onTimeChange(null);
  }

  if (minMs === null || maxMs === null) return null;

  const currentDate = sliderMs !== null ? new Date(sliderMs) : null;
  const isAtMax = sliderMs === null || sliderMs >= maxMs;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-zinc-950/92 backdrop-blur-sm border-t border-zinc-800 px-4 py-3">
      {/* Date label row */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">
          Timeline
        </span>
        <span className="font-mono text-[10px] text-amber-400">
          {isAtMax
            ? 'Showing all evidence'
            : currentDate
            ? format(currentDate, 'MMM d, yyyy · HH:mm')
            : '—'}
        </span>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          type="button"
          onClick={handlePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
          className="shrink-0 h-7 w-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 transition-colors"
        >
          {isPlaying
            ? <Pause className="h-3.5 w-3.5" />
            : <Play  className="h-3.5 w-3.5" />}
        </button>

        {/* Scrub slider */}
        <input
          type="range"
          min={minMs}
          max={maxMs}
          value={sliderMs ?? maxMs}
          onChange={handleSliderChange}
          className="flex-1 cursor-pointer accent-amber-400"
          style={{ height: '4px' }}
        />

        {/* Reset to show-all */}
        <button
          type="button"
          onClick={handleReset}
          title="Reset — show all"
          className="shrink-0 h-7 w-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <SkipBack className="h-3.5 w-3.5" />
        </button>

        {/* Speed toggle */}
        <div className="flex shrink-0 font-mono text-[10px] border border-zinc-700 rounded overflow-hidden">
          {[1, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 transition-colors ${
                speed === s
                  ? 'bg-amber-400/20 text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
