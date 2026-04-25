/**
 * @file FilterBar.jsx
 * @description Collapsible filter panel: type checkboxes and date range picker.
 * Type filters only apply when on the "All" tab (tabs already handle single-type filtering).
 * Uses mapColor (hex) for checkbox indicator colors to avoid Tailwind dynamic class issues.
 */

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { FORM_TYPES, FORM_TYPE_KEYS } from '../../constants/formConfig.js';
import useAppStore from '../../store/useAppStore.js';

export default function FilterBar() {
  const [isOpen, setIsOpen] = useState(false);
  const activeFilters = useAppStore((state) => state.activeFilters);
  const setFilter     = useAppStore((state) => state.setFilter);
  const clearFilters  = useAppStore((state) => state.clearFilters);

  const hasActiveFilters =
    activeFilters.types.length < FORM_TYPE_KEYS.length ||
    activeFilters.dateRange !== null;

  function toggleType(typeKey) {
    const current = activeFilters.types;
    const next = current.includes(typeKey)
      ? current.filter((t) => t !== typeKey)
      : [...current, typeKey];
    setFilter('types', next);
  }

  function handleStartDate(event) {
    const start = event.target.value ? new Date(event.target.value) : null;
    const end   = activeFilters.dateRange?.[1] ?? new Date();
    setFilter('dateRange', start ? [start, end] : null);
  }

  function handleEndDate(event) {
    const end   = event.target.value ? new Date(event.target.value) : null;
    const start = activeFilters.dateRange?.[0] ?? new Date(0);
    setFilter('dateRange', end ? [start, end] : null);
  }

  return (
    <div className="border-b border-zinc-800 shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 w-full px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
          hasActiveFilters ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <SlidersHorizontal className="h-3 w-3" />
        Filters
        {hasActiveFilters && (
          <span className="ml-auto text-[9px] text-amber-400 tracking-widest">Active</span>
        )}
      </button>

      {isOpen && (
        <div className="px-3 pb-3 space-y-3">
          {/* Type checkboxes */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-2">
              Evidence Type
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {FORM_TYPE_KEYS.map((key) => {
                const config    = FORM_TYPES[key];
                const isChecked = activeFilters.types.includes(key);
                return (
                  <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                    <span
                      className="h-3 w-3 rounded border flex-shrink-0 transition-colors"
                      style={{
                        backgroundColor: isChecked ? config.mapColor : 'transparent',
                        borderColor: isChecked ? config.mapColor : '#52525b',
                      }}
                    />
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isChecked}
                      onChange={() => toggleType(key)}
                    />
                    <span
                      className="font-mono text-[10px] transition-colors"
                      style={{ color: isChecked ? '#e4e4e7' : '#71717a' }}
                    >
                      {config.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date range */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 mb-2">
              Date Range
            </p>
            <div className="flex gap-2">
              <input
                type="date"
                onChange={handleStartDate}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-300 text-[10px] font-mono px-2 py-1 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
              <input
                type="date"
                onChange={handleEndDate}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-300 text-[10px] font-mono px-2 py-1 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
