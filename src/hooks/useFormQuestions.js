/**
 * @file useFormQuestions.js
 * @description Fetches and caches question schemas for all 5 Jotform forms.
 * Questions never change, so staleTime is Infinity — one fetch per session.
 * Returns a map: { [formId]: { [questionId]: fieldName } }
 */

import { useQuery } from '@tanstack/react-query';
import { getFormQuestions } from '../api/forms.js';
import { FORM_TYPES } from '../constants/formConfig.js';

/**
 * Build a questionId → fieldName map from a raw questions response.
 *
 * @param {Record<string, { name: string }>} rawQuestions - Jotform questions object
 * @returns {Record<string, string>} Map of question ID to field name
 */
function buildQuestionMap(rawQuestions) {
  const questionMap = {};
  for (const [questionId, question] of Object.entries(rawQuestions)) {
    questionMap[questionId] = question.name;
  }
  return questionMap;
}

/**
 * Fetch question schemas for all 5 forms in parallel and combine into one map.
 * @returns {Promise<Record<string, Record<string, string>>>} formId → questionId → fieldName
 */
async function fetchAllFormQuestions() {
  const formEntries = Object.values(FORM_TYPES);
  const results = await Promise.all(
    formEntries.map(async (formConfig) => {
      const rawQuestions = await getFormQuestions(formConfig.id);
      return [formConfig.id, buildQuestionMap(rawQuestions)];
    })
  );
  return Object.fromEntries(results);
}

/**
 * React Query hook for all form question schemas.
 * Fetched once per session — staleTime is Infinity.
 *
 * @returns {{ data: Record<string, Record<string, string>>, isLoading: boolean, error: Error | null }}
 */
export function useFormQuestions() {
  return useQuery({
    queryKey: ['formQuestions'],
    queryFn: fetchAllFormQuestions,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
