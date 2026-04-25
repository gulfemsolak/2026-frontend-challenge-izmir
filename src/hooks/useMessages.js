/**
 * @file useMessages.js
 * @description React Query hook for message submissions.
 * Refreshes every 60 seconds. Data is considered fresh for 5 minutes.
 */

import { useQuery } from '@tanstack/react-query';
import { getMessageSubmissions } from '../api/forms.js';
import { parseSubmissions } from '../utils/parseSubmission.js';

/**
 * Fetch and parse message submissions.
 * @returns {Promise<EvidenceItem[]>} Normalised message evidence items
 */
async function fetchMessages() {
  const rawSubmissions = await getMessageSubmissions();
  return parseSubmissions(rawSubmissions, 'message');
}

/**
 * Hook for message evidence items with automatic background refresh.
 *
 * @returns {{ data: EvidenceItem[], isLoading: boolean, isError: boolean, error: Error | null, refetch: Function }}
 */
export function useMessages() {
  return useQuery({
    queryKey: ['submissions', 'message'],
    queryFn: fetchMessages,
    staleTime: 300_000,
    gcTime: 600_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });
}
