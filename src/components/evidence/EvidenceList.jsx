/**
 * @file EvidenceList.jsx
 * @description Scrollable list of evidence cards. Renders AnonymousTipCard for tips
 * and EvidenceCard for all other types. Shows EmptyState when no items match.
 * Re-keys the list on filterKey change so cards re-enter with staggered animation.
 *
 * @param {Object}         props
 * @param {EvidenceItem[]} props.items      - Pre-filtered evidence items to render
 * @param {string}         props.filterKey  - Changes when tab/search/filters change
 */

import EvidenceCard from './EvidenceCard.jsx';
import AnonymousTipCard from './AnonymousTipCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function EvidenceList({ items, filterKey = '' }) {
  if (items.length === 0) {
    return <EmptyState message="No clues found in this category." />;
  }

  return (
    <ul key={filterKey} className="flex flex-col overflow-y-auto flex-1">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="card-enter"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {item.type === 'tip'
            ? <AnonymousTipCard item={item} />
            : <EvidenceCard item={item} />}
        </li>
      ))}
    </ul>
  );
}
