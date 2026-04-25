/**
 * @file LoadingState.jsx
 * @description Detective-themed loading indicator with a radar-sweep animation.
 * Used whenever evidence data is being fetched.
 *
 * @param {Object} props
 * @param {string} [props.message] - Override the default loading message
 */

export default function LoadingState({ message = 'Scanning for clues…' }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 py-12">
      {/* Radar sweep: two concentric rings + spinning arc */}
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border border-zinc-800" />
        <div className="absolute inset-2 rounded-full border border-zinc-800/50" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 animate-spin" />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        </div>
      </div>
      <p className="font-mono text-xs text-amber-400 uppercase tracking-widest animate-pulse">
        {message}
      </p>
    </div>
  );
}
