/**
 * @file formConfig.js
 * @description Central registry for all five Jotform forms used in Find Podo.
 * Keeps IDs, display metadata, map colors, and reliability scores in one place
 * so nothing is hardcoded across the app.
 */

/**
 * Per-form configuration object.
 * @typedef {Object} FormConfig
 * @property {string}  id          - Jotform form ID
 * @property {string}  type        - Internal evidence type key
 * @property {string}  label       - Human-readable label for tabs and badges
 * @property {string}  color       - Tailwind color name (without shade) for class generation
 * @property {string}  mapColor    - Hex color for Leaflet CircleMarker fill
 * @property {string}  icon        - Lucide icon component name
 * @property {number}  reliability - 0–1 weight used in confidence scoring
 */

/** @type {Record<string, FormConfig>} */
export const FORM_TYPES = {
  checkin: {
    id: '261134527667966',
    type: 'checkin',
    label: 'Check-in',
    color: 'blue',
    mapColor: '#60a5fa',
    icon: 'MapPin',
    reliability: 0.9,
  },
  sighting: {
    id: '261133720555956',
    type: 'sighting',
    label: 'Sighting',
    color: 'green',
    mapColor: '#4ade80',
    icon: 'Eye',
    reliability: 0.75,
  },
  message: {
    id: '261133651963962',
    type: 'message',
    label: 'Message',
    color: 'purple',
    mapColor: '#c084fc',
    icon: 'MessageSquare',
    reliability: 0.6,
  },
  note: {
    id: '261134449238963',
    type: 'note',
    label: 'Personal Note',
    color: 'yellow',
    mapColor: '#facc15',
    icon: 'FileText',
    reliability: 0.8,
  },
  tip: {
    id: '261134430330946',
    type: 'tip',
    label: 'Anonymous Tip',
    color: 'red',
    mapColor: '#f87171',
    icon: 'AlertTriangle',
    reliability: 0.4,
  },
};

/** Ordered array of all form type keys — use for iteration in tabs and filters */
export const FORM_TYPE_KEYS = Object.keys(FORM_TYPES);

/** Quick reverse lookup: form ID → FormConfig */
export const FORM_CONFIG_BY_ID = Object.fromEntries(
  Object.values(FORM_TYPES).map((config) => [config.id, config])
);

/** Quick reverse lookup: type string → FormConfig */
export const FORM_CONFIG_BY_TYPE = FORM_TYPES;
