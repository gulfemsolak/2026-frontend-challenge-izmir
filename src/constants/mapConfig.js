/**
 * @file mapConfig.js
 * @description Leaflet map defaults: tile layer, center, zoom.
 * CartoDB Dark Matter requires no API key and fits the detective dark theme.
 */

/** Default map center — Istanbul (reasonable starting point for Podo sightings) */
export const DEFAULT_CENTER = [41.0082, 28.9784];

/** Default zoom level — city-level view */
export const DEFAULT_ZOOM = 5;

/**
 * CartoDB Dark Matter tile URL.
 * Free, no API key required. Attribution required per OSM license.
 */
export const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';
