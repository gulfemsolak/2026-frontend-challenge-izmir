/**
 * @file dateHelpers.js
 * @description Date formatting and sorting utilities used across the evidence timeline.
 * Wraps date-fns to keep formatting calls consistent throughout the app.
 */

import { formatDistanceToNow, format } from 'date-fns';

/**
 * Return a human-friendly relative time string, e.g. "2 hours ago", "3 days ago".
 *
 * @param {Date | string} date - The date to describe
 * @returns {string} Relative time string with "ago" suffix
 */
export function formatRelative(date) {
  const parsedDate = date instanceof Date ? date : new Date(date);
  if (isNaN(parsedDate.getTime())) return 'Unknown time';
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

/**
 * Return a full formatted timestamp, e.g. "January 15, 2024 at 14:23".
 *
 * @param {Date | string} date - The date to format
 * @returns {string} Long-form date and time string
 */
export function formatFull(date) {
  const parsedDate = date instanceof Date ? date : new Date(date);
  if (isNaN(parsedDate.getTime())) return 'Unknown date';
  return format(parsedDate, "MMMM d, yyyy 'at' HH:mm");
}

/**
 * Sort an array of objects by their `submittedAt` date, newest first.
 * Returns a new array — does not mutate the input.
 *
 * @param {Array<{ submittedAt: Date }>} items - Evidence items to sort
 * @returns {Array<{ submittedAt: Date }>} New sorted array, newest first
 */
export function sortByDate(items) {
  return [...items].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}
