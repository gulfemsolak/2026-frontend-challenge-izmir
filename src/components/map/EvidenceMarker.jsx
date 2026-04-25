/**
 * @file EvidenceMarker.jsx
 * @description A CircleMarker for a single evidence item on the Leaflet map.
 * Uses CircleMarker (not Marker) to avoid Vite's broken default-icon issue.
 * Color is derived from the evidence type via FORM_TYPES config.
 * Clicking the marker opens the detail drawer via Zustand.
 *
 * @param {Object}       props
 * @param {EvidenceItem} props.item - The evidence item to render
 */

import { CircleMarker, Popup } from 'react-leaflet';
import { FORM_TYPES } from '../../constants/formConfig.js';
import useAppStore from '../../store/useAppStore.js';
import { formatRelative } from '../../utils/dateHelpers.js';

export default function EvidenceMarker({ item }) {
  const openDetail = useAppStore((state) => state.openDetail);
  const formConfig = FORM_TYPES[item.type];

  if (!item.coordinates) return null;

  const { lat, lng } = item.coordinates;

  return (
    <CircleMarker
      center={[lat, lng]}
      radius={7}
      pathOptions={{
        color: formConfig?.mapColor ?? '#ffffff',
        fillColor: formConfig?.mapColor ?? '#ffffff',
        fillOpacity: 0.85,
        weight: 1.5,
      }}
      eventHandlers={{
        click: () => openDetail(item),
      }}
    >
      <Popup className="podo-popup">
        <div className="font-mono text-xs min-w-[140px]">
          <p className="font-bold text-zinc-100 uppercase tracking-wide mb-0.5">
            {formConfig?.label ?? item.type}
          </p>
          {item.location && (
            <p className="text-zinc-400 mb-0.5">{item.location}</p>
          )}
          {item.content && (
            <p className="text-zinc-300 truncate max-w-[180px]">{item.content}</p>
          )}
          <p className="text-zinc-600 mt-1">{formatRelative(item.submittedAt)}</p>
        </div>
      </Popup>
    </CircleMarker>
  );
}
