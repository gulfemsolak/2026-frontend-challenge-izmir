/**
 * @file EvidenceMarker.jsx
 * @description Animated Leaflet DivIcon marker for a single evidence item.
 * Uses DivIcon (not CircleMarker) so CSS keyframe animations can be applied.
 *
 * - Default pins: solid colored circle matching evidence type
 * - isLatest=true: permanent pulsing red ring ("LAST SEEN HERE")
 * - isTopLocation=true: rotating amber dashed ring (highest-confidence zone)
 * - Both flags combine: latest + top shows both effects simultaneously
 *
 * @param {Object}       props
 * @param {EvidenceItem} props.item           - The evidence item to render
 * @param {boolean}      [props.isLatest]     - Most recent submission in the dataset
 * @param {boolean}      [props.isTopLocation] - Belongs to the top-confidence location
 */

import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FORM_TYPES } from '../../constants/formConfig.js';
import useAppStore from '../../store/useAppStore.js';
import { formatRelative } from '../../utils/dateHelpers.js';

export default function EvidenceMarker({ item, isLatest = false, isTopLocation = false }) {
  const openDetail = useAppStore((state) => state.openDetail);
  const formConfig = FORM_TYPES[item.type];

  if (!item.coordinates) return null;

  const { lat, lng } = item.coordinates;
  const color = formConfig?.mapColor ?? '#ffffff';

  const classes = [
    'map-pin',
    isLatest      ? 'map-pin--latest'  : '',
    isTopLocation ? 'map-pin--top' : '',
  ].filter(Boolean).join(' ');

  const icon = useMemo(
    () =>
      L.divIcon({
        className: '',
        html: `<div class="${classes}" style="--pin-color:${color}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classes, color]
  );

  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      eventHandlers={{ click: () => openDetail(item) }}
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
    </Marker>
  );
}
