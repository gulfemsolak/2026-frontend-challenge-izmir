/**
 * @file EvidenceList.jsx
 * @description Scrollable list of evidence cards. Renders AnonymousTipCard for tips
 * and EvidenceCard for all other types. Shows EmptyState when no items match.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.items - Pre-filtered evidence items to render
 */

import EvidenceCard from './EvidenceCard.jsx';
import AnonymousTipCard from './AnonymousTipCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function EvidenceList({ items }) {
  if (items.length === 0) {
    return <EmptyState message="No clues found in this category." />;
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
