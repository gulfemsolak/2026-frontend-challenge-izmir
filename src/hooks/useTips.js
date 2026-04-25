/**
 * @file useTips.js
 * @description React Query hook for anonymous tip submissions.
 * Refreshes every 60 seconds. Data is considered fresh for 5 minutes.
 */

import { useQuery } from '@tanstack/react-query';
import { getTipSubmissions } from '../api/forms.js';
import { parseSubmissions } from '../utils/parseSubmission.js';

/**
 * Fetch and parse anonymous tip submissions.
 * @returns {Promise<EvidenceItem[]>} Normalised tip evidence items
 */
async function fetchTips() {
  const rawSubmissions = await getTipSubmissions();
  return parseSubmissions(rawSubmissions, 'tip');
}

/**
 * Hook for anonymous tip evidence items with automatic background refresh.
 *
 * @returns {{ data: EvidenceItem[], isLoading: boolean, isError: boolean, error: Error | null, refetch: Function }}
 */
export function useTips() {
  return useQuery({
    queryKey: ['submissions', 'tip'],
    queryFn: fetchTips,
    staleTime: 300_000,
    gcTime: 600_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });
}
