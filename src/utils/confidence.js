/**
 * @file confidence.js
 * @description Scores how confident we are that a given location is Podo's current position.
 *
 * Algorithm (weights sum to 1.0):
 *   recency (40%)         — how recently was the last evidence at this location submitted?
 *   source diversity (30%) — how many distinct evidence types confirm this location?
 *   volume (30%)          — how many total pieces of evidence point to this location?
 */

import { FORM_TYPES } from '../constants/formConfig.js';

const WEIGHTS = { recency: 0.4, diversity: 0.3, volume: 0.3 };

/** Max age we consider "fresh" evidence — 48 hours in ms */
const MAX_AGE_MS = 48 * 60 * 60 * 1000;

/** Max evidence count that gives a full volume score */
const MAX_VOLUME = 10;

/**
 * Compute a 0–100 confidence score for a set of evidence items at the same location.
 *
 * @param {Array<{ submittedAt: Date, type: string, fields: Record<string, string> }>} evidenceItems
 *   All evidence items pointing to the location being scored
 * @returns {number} Integer from 0 to 100
 */
export function scoreLocation(evidenceItems) {
  if (!evidenceItems || evidenceItems.length === 0) return 0;

  const recencyScore = computeRecencyScore(evidenceItems);
  const diversityScore = computeDiversityScore(evidenceItems);
  const volumeScore = computeVolumeScore(evidenceItems);

  const raw =
    recencyScore * WEIGHTS.recency +
    diversityScore * WEIGHTS.diversity +
    volumeScore * WEIGHTS.volume;

  return Math.round(raw * 100);
}

/**
 * Score based on how recent the newest evidence item at this location is.
 * 1.0 = submitted right now, 0.0 = older than MAX_AGE_MS.
 *
 * @param {Array<{ submittedAt: Date }>} items
 * @returns {number} 0–1
 */
function computeRecencyScore(items) {
  const latestDate = items.reduce((newest, item) => {
    const itemDate = new Date(item.submittedAt);
    return itemDate > newest ? itemDate : newest;
  }, new Date(0));

  const ageMs = Date.now() - latestDate.getTime();
  return Math.max(0, 1 - ageMs / MAX_AGE_MS);
}

/**
 * Score based on how many distinct evidence types are represented.
 * More source types = higher confidence (cross-corroboration).
 *
 * @param {Array<{ type: string, fields: Record<string, string> }>} items
 * @returns {number} 0–1
 */
function computeDiversityScore(items) {
  const totalTypes = Object.keys(FORM_TYPES).length;
  const uniqueTypes = new Set(items.map((item) => item.type)).size;
  return uniqueTypes / totalTypes;
}

/**
 * Score based on total number of evidence items at this location.
 * Capped at MAX_VOLUME for a full score.
 *
 * @param {Array<unknown>} items
 * @returns {number} 0–1
 */
function computeVolumeScore(items) {
  return Math.min(items.length / MAX_VOLUME, 1);
}
