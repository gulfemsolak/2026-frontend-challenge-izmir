/**
 * @file PodoMap.jsx
 * @description Leaflet map with CartoDB Dark Matter tiles, typed evidence markers,
 * the Podo trail polyline, and a legend. Shows LoadingState and EmptyState overlays.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence  - All evidence items
 * @param {boolean}        props.isLoading - Show loading overlay when true
 */

import { MapContainer, TileLayer } from 'react-leaflet';
import { DEFAULT_CENTER, DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../constants/mapConfig.js';
import EvidenceMarker from './EvidenceMarker.jsx';
import PodoTrail from './PodoTrail.jsx';
import MapLegend from './MapLegend.jsx';
import LoadingState from '../ui/LoadingState.jsx';

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
