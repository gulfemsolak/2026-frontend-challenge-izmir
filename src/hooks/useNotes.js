/**
 * @file useNotes.js
 * @description React Query hook for personal note submissions.
 * Refreshes every 60 seconds. Data is considered fresh for 5 minutes.
 */

import { useQuery } from '@tanstack/react-query';
import { getNoteSubmissions } from '../api/forms.js';
import { parseSubmissions } from '../utils/parseSubmission.js';

/**
 * Fetch and parse personal note submissions.
 * @returns {Promise<EvidenceItem[]>} Normalised note evidence items
 */
async function fetchNotes() {
  const rawSubmissions = await getNoteSubmissions();
  return parseSubmissions(rawSubmissions, 'note');
}

/**
 * Hook for personal note evidence items with automatic background refresh.
 *
 * @returns {{ data: EvidenceItem[], isLoading: boolean, isError: boolean, error: Error | null, refetch: Function }}
 */
export function useNotes() {
  return useQuery({
    queryKey: ['submissions', 'note'],
    queryFn: fetchNotes,
    staleTime: 300_000,
    gcTime: 600_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });
}
