/**
 * @file useSightings.js
 * @description React Query hook for sighting submissions.
 * Refreshes every 60 seconds. Data is considered fresh for 5 minutes.
 */

import { useQuery } from '@tanstack/react-query';
import { getSightingSubmissions } from '../api/forms.js';
import { parseSubmissions } from '../utils/parseSubmission.js';

/**
 * Fetch and parse sighting submissions.
 * @returns {Promise<EvidenceItem[]>} Normalised sighting evidence items
 */
async function fetchSightings() {
  const rawSubmissions = await getSightingSubmissions();
  return parseSubmissions(rawSubmissions, 'sighting');
}

/**
 * Hook for sighting evidence items with automatic background refresh.
 *
 * @returns {{ data: EvidenceItem[], isLoading: boolean, isError: boolean, error: Error | null, refetch: Function }}
 */
export function useSightings() {
  return useQuery({
    queryKey: ['submissions', 'sighting'],
    queryFn: fetchSightings,
    staleTime: 300_000,
    gcTime: 600_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });
}
