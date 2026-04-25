/**
 * @file PodoTrail.jsx
 * @description Renders a Polyline connecting checkin and sighting markers
 * in chronological order (oldest → newest), showing Podo's path of travel.
 * Only items with valid coordinates are included.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.evidence - All evidence items (filtered here to checkins+sightings)
 */

import { Polyline } from 'react-leaflet';

export default function PodoTrail({ evidence }) {
  const trailPoints = evidence
    .filter(
      (item) =>
        (item.type === 'checkin' || item.type === 'sighting') &&
        item.coordinates
    )
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
    .map((item) => [item.coordinates.lat, item.coordinates.lng]);

  if (trailPoints.length < 2) return null;

  return (
    <Polyline
      positions={trailPoints}
      pathOptions={{
        color: '#f59e0b',
        weight: 2,
        opacity: 0.5,
        dashArray: '6 4',
      }}
    />
  );
}
