/**
 * @file EmptyState.jsx
 * @description Shown when a filtered/searched evidence list returns no results.
 *
 * @param {Object} props
 * @param {string} [props.message] - Override default empty message
 */

import { Search } from 'lucide-react';

export default function EmptyState({ message = 'No evidence matches your search.' }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-3 py-12">
      <Search className="h-7 w-7 text-zinc-700" />
      <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest text-center">
        {message}
      </p>
    </div>
  );
}
