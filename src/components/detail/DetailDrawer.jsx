/**
 * @file DetailDrawer.jsx
 * @description Slide-in panel from the right showing full details of a selected
 * evidence item: all fields, submitter, timestamp, and related evidence.
 * Closes on ESC key or clicking the backdrop.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.allEvidence - Used by RelatedEvidence to find nearby items
 */

import { useEffect } from 'react';
import { X, MapPin, Clock, User } from 'lucide-react';
import useAppStore from '../../store/useAppStore.js';
import { FORM_TYPES } from '../../constants/formConfig.js';
import Badge from '../ui/Badge.jsx';
import RelatedEvidence from './RelatedEvidence.jsx';
import { formatFull, formatRelative } from '../../utils/dateHelpers.js';

export default function DetailDrawer({ allEvidence }) {
  const selectedEvidence = useAppStore((state) => state.selectedEvidence);
  const isDetailOpen     = useAppStore((state) => state.isDetailOpen);
  const closeDetail      = useAppStore((state) => state.closeDetail);

  // Close on ESC key
  useEffect(() => {
    if (!isDetailOpen) return;
    function handleKeyDown(event) {
      if (event.key === 'Escape') closeDetail();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDetailOpen, closeDetail]);

  const formConfig = selectedEvidence ? FORM_TYPES[selectedEvidence.type] : null;

  // Fields to skip in the "All Fields" section (already displayed prominently above)
  const SKIP_FIELDS = new Set(['note', 'message', 'tip', 'location', 'coordinates']);

  return (
    <>
      {/* Backdrop */}
      {isDetailOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm"
          onClick={closeDetail}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`detail-drawer fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-zinc-900 border-l border-zinc-800 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          isDetailOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {!selectedEvidence ? null : (
          <>
            {/* Header row */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                {formConfig && <Badge label={formConfig.label} color={formConfig.color} />}
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Meta */}
              <div className="space-y-1.5">
                {selectedEvidence.person && (
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <User className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                    <span>{selectedEvidence.person}</span>
                  </div>
                )}
                {selectedEvidence.location && (
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <MapPin className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                    <span>{selectedEvidence.location}</span>
                    {selectedEvidence.coordinates && (
                      <span className="font-mono text-[10px] text-zinc-600">
                        ({selectedEvidence.coordinates.lat.toFixed(4)}, {selectedEvidence.coordinates.lng.toFixed(4)})
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                  <span>{formatFull(selectedEvidence.submittedAt)}</span>
                  <span className="text-zinc-700">·</span>
                  <span>{formatRelative(selectedEvidence.submittedAt)}</span>
                </div>
              </div>

              {/* Main content */}
              {selectedEvidence.content && (
                <div className="p-3 bg-zinc-800 rounded text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {selectedEvidence.content}
                </div>
              )}

              {/* All other fields */}
              {(() => {
                const extraFields = Object.entries(selectedEvidence.fields ?? {}).filter(
                  ([key]) => !SKIP_FIELDS.has(key)
                );
                if (extraFields.length === 0) return null;
                return (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-2">
                      All Fields
                    </p>
                    <dl className="space-y-1.5">
                      {extraFields.map(([key, value]) => (
                        <div key={key} className="flex gap-2 text-xs">
                          <dt className="font-mono text-zinc-600 shrink-0 w-24 truncate">{key}</dt>
                          <dd className="text-zinc-300 break-words">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })()}

              {/* Related evidence at same location */}
              <RelatedEvidence
                selectedItem={selectedEvidence}
                allEvidence={allEvidence}
              />
            </div>
          </>
        )}
      </aside>
    </>
  );
}
