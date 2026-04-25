/**
 * @file AnonymousTipCard.jsx
 * @description Special card for anonymous tips. Content is blurred by default.
 * A "DECRYPT" button removes the blur with a brief typing-cursor animation.
 * Tapping elsewhere on the card opens the detail drawer.
 *
 * @param {Object}       props
 * @param {EvidenceItem} props.item  - The anonymous tip evidence item
 * @param {boolean}      [props.isNew]
 */

import { useState } from 'react';
import useAppStore from '../../store/useAppStore.js';
import Badge from '../ui/Badge.jsx';
import { formatRelative } from '../../utils/dateHelpers.js';

export default function AnonymousTipCard({ item, isNew = false }) {
  const openDetail = useAppStore((state) => state.openDetail);
  const [isDecrypted, setIsDecrypted] = useState(false);

  const hasContent  = item.content && item.content.trim() !== '';
  const hasLocation = item.location && item.location.trim() !== '';
  const confidence  = item.fields?.confidence;

  function handleDecrypt(event) {
    event.stopPropagation();
    setIsDecrypted(true);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openDetail(item)}
      onKeyDown={(e) => e.key === 'Enter' && openDetail(item)}
      className="w-full text-left px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors duration-150 cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Badge label="Anon Tip" color="red" />
          {isNew && <Badge label="New" color="amber" variant="new" />}
          {confidence && (
            <Badge
              label={`${confidence} confidence`}
              color={confidence === 'high' ? 'green' : confidence === 'medium' ? 'yellow' : 'red'}
            />
          )}
        </div>
        <span className="font-mono text-[10px] text-zinc-600 shrink-0">
          {formatRelative(item.submittedAt)}
        </span>
      </div>

      {/* Location (always visible) */}
      {hasLocation && (
        <p className="font-mono text-[11px] text-zinc-400 truncate mb-1">
          {item.location}
        </p>
      )}

      {/* Blurred content + decrypt button */}
      <div className="relative">
        <p
          className={`text-xs text-zinc-400 line-clamp-2 leading-relaxed transition-all duration-300 ${
            isDecrypted ? 'blur-none' : 'blur-sm select-none'
          }`}
        >
          {hasContent ? item.content : 'No content recorded.'}
        </p>

        {!isDecrypted && (
          <button
            type="button"
            onClick={handleDecrypt}
            className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors duration-150 border border-amber-400/30 hover:border-amber-400/60 rounded px-2 py-0.5"
          >
            ▶ Decrypt
          </button>
        )}
      </div>
    </div>
  );
}
