/**
 * @file useCheckins.js
 * @description React Query hook for check-in submissions.
 * Refreshes every 60 seconds. Data is considered fresh for 5 minutes.
 */

import { useQuery } from '@tanstack/react-query';
import { getCheckinSubmissions } from '../api/forms.js';
import { parseSubmissions } from '../utils/parseSubmission.js';

/**
 * Fetch and parse check-in submissions.
 * @returns {Promise<EvidenceItem[]>} Normalised check-in evidence items
 */
async function fetchCheckins() {
  const rawSubmissions = await getCheckinSubmissions();
  return parseSubmissions(rawSubmissions, 'checkin');
}

/**
 * Hook for check-in evidence items with automatic background refresh.
 *
 * @returns {{ data: EvidenceItem[], isLoading: boolean, isError: boolean, error: Error | null, refetch: Function }}
 */
export function useCheckins() {
  return useQuery({
    queryKey: ['submissions', 'checkin'],
    queryFn: fetchCheckins,
    staleTime: 300_000,
    gcTime: 600_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });
}
