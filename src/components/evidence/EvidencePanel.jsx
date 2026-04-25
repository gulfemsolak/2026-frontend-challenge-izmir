/**
 * @file EvidencePanel.jsx
 * @description Tabbed panel with search, filters, and scrollable evidence list.
 * Filtering: tab → activeFilters.types (all-tab only) → dateRange → searchQuery.
 */

import { useMemo } from 'react';
import { FORM_TYPES, FORM_TYPE_KEYS } from '../../constants/formConfig.js';
import useAppStore from '../../store/useAppStore.js';
import SearchBar from '../search/SearchBar.jsx';
import FilterBar from '../search/FilterBar.jsx';
import EvidenceList from './EvidenceList.jsx';
import LoadingState from '../ui/LoadingState.jsx';
import ErrorState from '../ui/ErrorState.jsx';

const TABS = [
  { key: 'all', label: 'All' },
  ...FORM_TYPE_KEYS.map((key) => ({ key, label: FORM_TYPES[key].label })),
];

/**
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence
 * @param {boolean}        props.isLoading
 * @param {boolean}        props.isError
 * @param {Function}       props.onRefetch
 */
export default function EvidencePanel({ evidence, isLoading, isError, onRefetch }) {
  const activeTab     = useAppStore((state) => state.activeTab);
  const setActiveTab  = useAppStore((state) => state.setActiveTab);
  const searchQuery   = useAppStore((state) => state.searchQuery);
  const activeFilters = useAppStore((state) => state.activeFilters);

  const filteredItems = useMemo(() => {
    let items = activeTab === 'all'
      ? evidence
      : evidence.filter((item) => item.type === activeTab);

    if (activeTab === 'all' && activeFilters.types.length < FORM_TYPE_KEYS.length) {
      items = items.filter((item) => activeFilters.types.includes(item.type));
    }

    if (activeFilters.dateRange) {
      const [start, end] = activeFilters.dateRange;
      items = items.filter((item) => {
        const date = new Date(item.submittedAt);
        return date >= start && date <= end;
      });
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      items = items.filter(
        (item) =>
          item.content?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query) ||
          item.person?.toLowerCase().includes(query) ||
          Object.values(item.fields ?? {}).some((val) =>
            String(val).toLowerCase().includes(query)
          )
      );
    }

    return items;
  }, [evidence, activeTab, activeFilters, searchQuery]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <SearchBar />
      <FilterBar />

      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-zinc-800 shrink-0" style={{ scrollbarWidth: 'none' }}>
        {TABS.map((tab) => {
          const count =
            tab.key === 'all'
              ? evidence.length
              : evidence.filter((i) => i.type === tab.key).length;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 px-2.5 py-2 font-mono text-[10px] uppercase tracking-wider border-b-2 shrink-0 transition-colors duration-150 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              <span
                className={`text-[9px] px-1 rounded ${
                  activeTab === tab.key
                    ? 'bg-amber-400/20 text-amber-400'
                    : 'bg-zinc-800 text-zinc-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading && <LoadingState />}
      {isError && !isLoading && (
        <ErrorState
          message="Could not fetch evidence from Jotform."
          onRetry={onRefetch}
        />
      )}
      {!isLoading && !isError && <EvidenceList items={filteredItems} />}
    </div>
  );
}
