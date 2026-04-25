/**
 * @file useAppStore.js
 * @description Global Zustand store for Find Podo UI state.
 * Holds selected evidence, active filters, search query, and detail drawer state.
 * Components read from and write to this store instead of prop-drilling.
 */

import { create } from 'zustand';
import { FORM_TYPE_KEYS } from '../constants/formConfig.js';

/**
 * @typedef {Object} ActiveFilters
 * @property {string[]}               types     - Which evidence types are visible (all by default)
 * @property {[Date, Date] | null}    dateRange  - Optional date range filter [start, end]
 */

const useAppStore = create((set, get) => ({
  // ── Selected evidence & detail drawer ────────────────────────────────────
  /** @type {EvidenceItem | null} */
  selectedEvidence: null,

  /** @type {boolean} */
  isDetailOpen: false,

  /**
   * Open the detail drawer for a specific evidence item.
   * @param {EvidenceItem} item
   */
  openDetail: (item) => set({ selectedEvidence: item, isDetailOpen: true }),

  /** Close the detail drawer and clear the selection. */
  closeDetail: () => set({ selectedEvidence: null, isDetailOpen: false }),

  // ── Search ────────────────────────────────────────────────────────────────
  /** @type {string} */
  searchQuery: '',

  /**
   * Update the global search query.
   * @param {string} query
   */
  setSearchQuery: (query) => set({ searchQuery: query }),

  // ── Filters ───────────────────────────────────────────────────────────────
  /** @type {ActiveFilters} */
  activeFilters: {
    types: [...FORM_TYPE_KEYS],
    dateRange: null,
  },

  /**
   * Update a specific filter key.
   * @param {'types' | 'dateRange'} key - Which filter to update
   * @param {unknown} value - New value for the filter
   */
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),

  /** Reset all filters to defaults. */
  clearFilters: () =>
    set({
      activeFilters: { types: [...FORM_TYPE_KEYS], dateRange: null },
      searchQuery: '',
    }),

  // ── Active tab in EvidencePanel ───────────────────────────────────────────
  /** @type {'all' | string} */
  activeTab: 'all',

  /**
   * Switch the evidence panel tab.
   * @param {string} tab - 'all' or a FORM_TYPE_KEYS value
   */
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ── Computed helper ───────────────────────────────────────────────────────
  /**
   * Returns true if any non-default filter is currently active.
   * @returns {boolean}
   */
  hasActiveFilters: () => {
    const { activeFilters, searchQuery } = get();
    return (
      searchQuery.trim() !== '' ||
      activeFilters.types.length !== FORM_TYPE_KEYS.length ||
      activeFilters.dateRange !== null
    );
  },
}));

export default useAppStore;
