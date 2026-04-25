/**
 * @file ErrorState.jsx
 * @description Displayed when an API fetch fails. Shows a "signal lost" message
 * and a retry button.
 *
 * @param {Object}   props
 * @param {string}   [props.message] - Override default error message
 * @param {Function} [props.onRetry] - Called when user clicks "Retry"
 */

import { WifiOff } from 'lucide-react';

export default function ErrorState({
  message = 'Signal lost. Could not reach Jotform.',
  onRetry,
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 py-12">
      <WifiOff className="h-8 w-8 text-red-400/60" />
      <div className="text-center space-y-1">
        <p className="font-mono text-xs text-red-400 uppercase tracking-widest">
          Signal Lost
        </p>
        <p className="text-xs text-zinc-600 max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200 rounded px-4 py-2 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
