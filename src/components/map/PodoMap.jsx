/**
 * @file PodoMap.jsx
 * @description Main Leaflet map component for Find Podo.
 * Renders all evidence markers (colored by type), the Podo trail polyline,
 * and the map legend. Uses CartoDB Dark Matter tiles (no API key required).
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence  - All evidence items to plot
 * @param {boolean}        props.isLoading - Show loading overlay when true
 */

import { MapContainer, TileLayer } from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../constants/mapConfig.js';
import EvidenceMarker from './EvidenceMarker.jsx';
import PodoTrail from './PodoTrail.jsx';
import MapLegend from './MapLegend.jsx';

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
        <TileLayer
          url={TILE_URL}
          attribution={TILE_ATTRIBUTION}
          maxZoom={19}
        />

        <PodoTrail evidence={evidence} />

        {mappableEvidence.map((item) => (
          <EvidenceMarker key={item.id} item={item} />
        ))}
      </MapContainer>

      <MapLegend />

      {isLoading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm">
          <p className="font-mono text-xs text-amber-400 uppercase tracking-widest animate-pulse">
            Scanning for clues…
          </p>
        </div>
      )}
    </div>
  );
}
