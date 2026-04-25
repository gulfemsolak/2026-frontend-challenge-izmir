/**
 * @file EvidencePanel.jsx
 * @description Tabbed panel showing All evidence or filtered by type.
 * Tab state is stored in Zustand so other components can react to it.
 * Renders EvidenceList with the appropriate filtered subset.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence  - All evidence items (pre-sorted)
 * @param {boolean}        props.isLoading
 * @param {boolean}        props.isError
 * @param {Function}       props.onRefetch - Called when user taps retry
 */

import { useMemo } from 'react';
import { FORM_TYPES, FORM_TYPE_KEYS } from '../../constants/formConfig.js';
import useAppStore from '../../store/useAppStore.js';
import EvidenceList from './EvidenceList.jsx';

const TABS = [
  { key: 'all', label: 'All' },
  ...FORM_TYPE_KEYS.map((key) => ({ key, label: FORM_TYPES[key].label })),
];

export default function EvidencePanel({ evidence, isLoading, isError, onRefetch }) {
  const activeTab  = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return evidence;
    return evidence.filter((item) => item.type === activeTab);
  }, [evidence, activeTab]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-zinc-800 shrink-0 scrollbar-none">
        {TABS.map((tab) => {
          const count = tab.key === 'all'
            ? evidence.length
            : evidence.filter((i) => i.type === tab.key).length;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider border-b-2 shrink-0 transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
              <span
                className={`text-[9px] px-1 rounded ${
                  activeTab === tab.key ? 'bg-amber-400/20 text-amber-400' : 'bg-zinc-800 text-zinc-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content area */}
      {isLoading && (
        <div className="flex flex-1 items-center justify-center font-mono text-xs text-amber-400 uppercase tracking-widest animate-pulse">
          Scanning for clues…
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col flex-1 items-center justify-center gap-3">
          <p className="font-mono text-xs text-red-400 uppercase tracking-widest">
            Signal lost.
          </p>
          <button
            type="button"
            onClick={onRefetch}
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 border border-zinc-700 hover:border-zinc-500 rounded px-3 py-1.5 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <EvidenceList items={filteredItems} />
      )}
    </div>
  );
}
