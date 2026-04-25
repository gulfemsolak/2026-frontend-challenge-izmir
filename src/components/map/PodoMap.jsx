/**
 * @file PodoMap.jsx
 * @description Leaflet map with CartoDB Dark Matter tiles, typed evidence markers,
 * the Podo trail polyline, and a legend. Auto-fits to all markers on first load.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence  - All evidence items
 * @param {boolean}        props.isLoading - Show loading overlay when true
 */

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../constants/mapConfig.js';
import EvidenceMarker from './EvidenceMarker.jsx';
import PodoTrail from './PodoTrail.jsx';
import MapLegend from './MapLegend.jsx';
import LoadingState from '../ui/LoadingState.jsx';

/**
 * Child component (must live inside MapContainer to access the Leaflet map instance).
 * Fits the viewport to all markers once, on initial evidence load.
 * Uses a ref so it doesn't re-fit when the user has panned/zoomed manually.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence - Items with coordinates to fit to
 */
function MapBoundsController({ evidence }) {
  const map = useMap();
  const hasFitRef = useRef(false);

  useEffect(() => {
    // Only auto-fit once — don't disrupt the user after initial load
    if (hasFitRef.current) return;

    const pointsWithCoords = evidence.filter((item) => item.coordinates);
    if (pointsWithCoords.length === 0) return;

    const latLngs = pointsWithCoords.map((item) => [
      item.coordinates.lat,
      item.coordinates.lng,
    ]);

    map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    hasFitRef.current = true;
  }, [evidence, map]);

  return null;
}

export default function PodoMap({ evidence = [], isLoading = false }) {
  const mappableEvidence = evidence.filter((item) => item.coordinates);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
        <MapBoundsController evidence={mappableEvidence} />
        <PodoTrail evidence={evidence} />
        {mappableEvidence.map((item) => (
          <EvidenceMarker key={item.id} item={item} />
        ))}
      </MapContainer>

      <MapLegend />

      {isLoading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
          <LoadingState message="Plotting evidence…" />
        </div>
      )}
    </div>
  );
}
