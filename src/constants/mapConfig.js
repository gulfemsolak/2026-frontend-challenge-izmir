/**
 * @file mapConfig.js
 * @description Leaflet map defaults: tile layer, center, zoom.
 * CartoDB Dark Matter requires no API key and fits the detective dark theme.
 */

/** Default map center — Izmir, Turkey (where all evidence data is located) */
export const DEFAULT_CENTER = [38.4192, 27.1287];

/** Default zoom level — street level for Izmir */
export const DEFAULT_ZOOM = 13;

/**
 * CartoDB Dark Matter tile URL.
 * Free, no API key required. Attribution required per OSM license.
 */
export const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';
