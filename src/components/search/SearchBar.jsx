/**
 * @file SearchBar.jsx
 * @description Debounced text search input. Local state updates immediately
 * for a responsive feel; Zustand is updated after 300ms to avoid
 * re-filtering the evidence list on every keystroke.
 */

import { useState, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import useAppStore from '../../store/useAppStore.js';

export default function SearchBar() {
  const searchQuery  = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const [inputValue, setInputValue] = useState(searchQuery);
  const timerRef = useRef(null);

  const handleChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSearchQuery(value), 300);
    },
    [setSearchQuery]
  );

  function handleClear() {
    setInputValue('');
    setSearchQuery('');
  }

  return (
    <div className="relative px-3 py-2 border-b border-zinc-800 shrink-0">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search evidence…"
        className="w-full bg-zinc-800 text-zinc-200 placeholder-zinc-600 text-xs font-mono pl-7 pr-7 py-1.5 rounded border border-zinc-700 focus:outline-none focus:border-amber-400/50 transition-colors"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
