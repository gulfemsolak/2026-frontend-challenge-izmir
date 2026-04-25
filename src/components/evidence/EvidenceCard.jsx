/**
 * @file EvidenceCard.jsx
 * @description Renders a single evidence item as a compact card.
 * Adapts its layout per type — shows relevant fields and gracefully
 * handles missing/garbage data from test submissions.
 * Clicking opens the detail drawer via Zustand.
 *
 * @param {Object}       props
 * @param {EvidenceItem} props.item      - The evidence item to display
 * @param {boolean}      [props.isNew]   - Highlight with a "NEW" badge if true
 */

import { FORM_TYPES } from '../../constants/formConfig.js';
import useAppStore from '../../store/useAppStore.js';
import Badge from '../ui/Badge.jsx';
import { formatRelative } from '../../utils/dateHelpers.js';

export default function EvidenceCard({ item, isNew = false }) {
  const openDetail = useAppStore((state) => state.openDetail);
  const formConfig = FORM_TYPES[item.type];

  const hasContent  = item.content && item.content.trim() !== '';
  const hasLocation = item.location && item.location.trim() !== '';
  const hasPerson   = item.person && item.person.trim() !== '';

  return (
    <button
      type="button"
      onClick={() => openDetail(item)}
      className="w-full text-left px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors duration-150 focus:outline-none focus:bg-zinc-800/50"
    >
      {/* Top row: type badge + timestamp */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {formConfig && (
            <Badge label={formConfig.label} color={formConfig.color} />
          )}
          {isNew && <Badge label="New" color="amber" variant="new" />}
        </div>
        <span className="font-mono text-[10px] text-zinc-600 shrink-0">
          {formatRelative(item.submittedAt)}
        </span>
      </div>

      {/* Person / location line */}
      {(hasPerson || hasLocation) && (
        <p className="font-mono text-[11px] text-zinc-400 truncate mb-1">
          {hasPerson && <span className="text-zinc-300">{item.person}</span>}
          {hasPerson && hasLocation && <span className="text-zinc-600"> · </span>}
          {hasLocation && <span>{item.location}</span>}
        </p>
      )}

      {/* Content snippet */}
      {hasContent ? (
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {item.content}
        </p>
      ) : (
        <p className="text-xs text-zinc-700 italic">No content recorded.</p>
      )}
    </button>
  );
}
