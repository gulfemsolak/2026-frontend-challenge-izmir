/**
 * @file RelatedEvidence.jsx
 * @description Shows other evidence items that share the same location as
 * the currently selected item. Capped at 5 results to keep the drawer compact.
 *
 * @param {Object}       props
 * @param {EvidenceItem} props.selectedItem - The currently open evidence item
 * @param {EvidenceItem[]} props.allEvidence - Full evidence pool to search through
 */

import { useMemo } from 'react';
import { FORM_TYPES } from '../../constants/formConfig.js';
import useAppStore from '../../store/useAppStore.js';
import { formatRelative } from '../../utils/dateHelpers.js';
import Badge from '../ui/Badge.jsx';

export default function RelatedEvidence({ selectedItem, allEvidence }) {
  const openDetail = useAppStore((state) => state.openDetail);

  const relatedItems = useMemo(() => {
    if (!selectedItem.location) return [];
    const normalizedLocation = selectedItem.location.trim().toLowerCase();

    return allEvidence
      .filter(
        (item) =>
          item.id !== selectedItem.id &&
          item.location?.trim().toLowerCase() === normalizedLocation
      )
      .slice(0, 5);
  }, [selectedItem, allEvidence]);

  if (relatedItems.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-zinc-800">
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 mb-3">
        Also at this location
      </p>
      <ul className="flex flex-col gap-2">
        {relatedItems.map((item) => {
          const config = FORM_TYPES[item.type];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => openDetail(item)}
                className="w-full text-left p-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  {config && <Badge label={config.label} color={config.color} />}
                  <span className="font-mono text-[10px] text-zinc-600">
                    {formatRelative(item.submittedAt)}
                  </span>
                </div>
                {item.content && (
                  <p className="text-xs text-zinc-400 truncate">{item.content}</p>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
