/**
 * @file forms.js
 * @description One async fetcher function per Jotform form used in Find Podo.
 * Also exports getFormQuestions() to build questionId → fieldName maps.
 * All submission fetches request 100 results ordered newest-first.
 */

import { jotformGet } from './jotformClient.js';
import { FORM_TYPES } from '../constants/formConfig.js';

/** Shared params for all submission fetches */
const SUBMISSION_PARAMS = { limit: 100, orderby: 'created_at', direction: 'DESC' };

/**
 * Fetch the questions schema for a given form.
 * Returns a map of questionId → question metadata (name, text, type, etc.).
 * Use this to build the field-name mapping before parsing submissions.
 *
 * @param {string} formId - The Jotform form ID
 * @returns {Promise<Record<string, object>>} Question ID to question metadata map
 */
export async function getFormQuestions(formId) {
  return jotformGet(`/form/${formId}/questions`);
}

/**
 * Fetch check-in submissions (where Podo was confirmed to be).
 * @returns {Promise<Array>} Raw Jotform submission objects
 */
export async function getCheckinSubmissions() {
  return jotformGet(`/form/${FORM_TYPES.checkin.id}/submissions`, SUBMISSION_PARAMS);
}

/**
 * Fetch sighting submissions (eyewitness reports of Podo).
 * @returns {Promise<Array>} Raw Jotform submission objects
 */
export async function getSightingSubmissions() {
  return jotformGet(`/form/${FORM_TYPES.sighting.id}/submissions`, SUBMISSION_PARAMS);
}

/**
 * Fetch message submissions (communications between people about Podo).
 * @returns {Promise<Array>} Raw Jotform submission objects
 */
export async function getMessageSubmissions() {
  return jotformGet(`/form/${FORM_TYPES.message.id}/submissions`, SUBMISSION_PARAMS);
}

/**
 * Fetch personal note submissions (investigator's private notes).
 * @returns {Promise<Array>} Raw Jotform submission objects
 */
export async function getNoteSubmissions() {
  return jotformGet(`/form/${FORM_TYPES.note.id}/submissions`, SUBMISSION_PARAMS);
}

/**
 * Fetch anonymous tip submissions (unverified crowd-sourced tips).
 * @returns {Promise<Array>} Raw Jotform submission objects
 */
export async function getTipSubmissions() {
  return jotformGet(`/form/${FORM_TYPES.tip.id}/submissions`, SUBMISSION_PARAMS);
}
