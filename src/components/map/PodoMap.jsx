/**
 * @file PodoMap.jsx
 * @description Leaflet map with CartoDB Dark Matter tiles, typed evidence markers,
 * and a legend. Shows ALL evidence types that have valid coordinates (checkins,
 * sightings, tips). Messages and personal notes have no coordinates so they
 * appear in the timeline only. Auto-fits to markers on first load.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence    - All evidence items
 * @param {boolean}        props.isLoading   - Show loading overlay when true
 * @param {Date|null}      props.playbackTime - If set, only show items submitted ≤ this time
 */

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../constants/mapConfig.js';
import EvidenceMarker from './EvidenceMarker.jsx';
import MapLegend from './MapLegend.jsx';
import LoadingState from '../ui/LoadingState.jsx';

/**
 * Fits the map viewport to all markers once on initial load.
 * Uses a ref so it never re-fits after the user has panned/zoomed.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence - Only items with coordinates
 */
function MapBoundsController({ evidence }) {
  const map = useMap();
  const hasFitRef = useRef(false);

  useEffect(() => {
    if (hasFitRef.current) return;
    if (evidence.length === 0) return;

    const latLngs = evidence.map((item) => [item.coordinates.lat, item.coordinates.lng]);
    map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    hasFitRef.current = true;
  }, [evidence, map]);

  return null;
}

export default function PodoMap({ evidence = [], isLoading = false, playbackTime = null }) {
  // Show all types with valid coordinates; apply optional playback time filter
  const visibleEvidence = evidence.filter(
    (item) =>
      item.coordinates &&
      (playbackTime === null || new Date(item.submittedAt) <= playbackTime)
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
        <MapBoundsController evidence={visibleEvidence} />
        {visibleEvidence.map((item) => (
          <EvidenceMarker key={item.id} item={item} />
        ))}
      </MapContainer>

      {/* Legend sits above the playback bar; bottom-28 gives ~7rem clearance */}
      <MapLegend />

      {isLoading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
          <LoadingState message="Plotting evidence…" />
        </div>
      )}
    </div>
  );
}
