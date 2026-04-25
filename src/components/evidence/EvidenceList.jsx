/**
 * @file EvidenceList.jsx
 * @description Scrollable list of evidence cards, filtered to a given type tab.
 * Renders EvidenceCard for most types and AnonymousTipCard for tips.
 * Handles empty state gracefully.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.items - Pre-filtered evidence items to render
 */

import EvidenceCard from './EvidenceCard.jsx';
import AnonymousTipCard from './AnonymousTipCard.jsx';

export default function EvidenceList({ items }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-12 text-zinc-700 font-mono text-xs uppercase tracking-widest">
        <span>No evidence found.</span>
      </div>
    );
  }

  return (
    <ul className="flex flex-col overflow-y-auto flex-1">
      {items.map((item) =>
        item.type === 'tip' ? (
          <li key={item.id}>
            <AnonymousTipCard item={item} />
          </li>
        ) : (
          <li key={item.id}>
            <EvidenceCard item={item} />
          </li>
        )
      )}
    </ul>
  );
}
