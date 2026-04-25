/**
 * @file useAllEvidence.js
 * @description Merges all 5 evidence source hooks into a single sorted array.
 * Also runs geocoding for any items that have a location string but no coordinates.
 * Used by the timeline, map, and search/filter features.
 */

import { useMemo, useEffect, useState } from 'react';
import { useCheckins } from './useCheckins.js';
import { useSightings } from './useSightings.js';
import { useMessages } from './useMessages.js';
import { useNotes } from './useNotes.js';
import { useTips } from './useTips.js';
import { sortByDate } from '../utils/dateHelpers.js';
import { geocodeLocation } from '../utils/geocode.js';

/**
 * Merge and sort all 5 evidence sources, then geocode any items missing coordinates.
 *
 * @returns {{
 *   allEvidence: EvidenceItem[],
 *   isLoading: boolean,
 *   isError: boolean,
 *   errors: (Error | null)[],
 *   refetchAll: Function
 * }}
 */
export function useAllEvidence() {
  const checkins  = useCheckins();
  const sightings = useSightings();
  const messages  = useMessages();
  const notes     = useNotes();
  const tips      = useTips();

  const sources = [checkins, sightings, messages, notes, tips];

  const isLoading = sources.some((source) => source.isLoading);
  const isError   = sources.some((source) => source.isError);
  const errors    = sources.map((source) => source.error);

  // Merge and sort evidence once all sources have data
  const mergedEvidence = useMemo(() => {
    const allItems = sources.flatMap((source) => source.data ?? []);
    return sortByDate(allItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checkins.data,
    sightings.data,
    messages.data,
    notes.data,
    tips.data,
  ]);

  // Geocode items that have a location string but no coordinates
  const [allEvidence, setAllEvidence] = useState(mergedEvidence);

  useEffect(() => {
    if (mergedEvidence.length === 0) {
      setAllEvidence([]);
      return;
    }

    const itemsNeedingGeocode = mergedEvidence.filter(
      (item) => item.location && !item.coordinates
    );

    if (itemsNeedingGeocode.length === 0) {
      setAllEvidence(mergedEvidence);
      return;
    }

    let cancelled = false;

    (async () => {
      // Geocode items sequentially to respect Nominatim's rate limit
      const geocodedMap = new Map();
      for (const item of itemsNeedingGeocode) {
        if (cancelled) return;
        const coordinates = await geocodeLocation(item.location);
        geocodedMap.set(item.id, coordinates);
      }

      if (cancelled) return;

      const enrichedEvidence = mergedEvidence.map((item) => {
        if (!geocodedMap.has(item.id)) return item;
        return { ...item, coordinates: geocodedMap.get(item.id) };
      });

      setAllEvidence(enrichedEvidence);
    })();

    return () => { cancelled = true; };
  }, [mergedEvidence]);

  function refetchAll() {
    sources.forEach((source) => source.refetch());
  }

  return { allEvidence, isLoading, isError, errors, refetchAll };
}
