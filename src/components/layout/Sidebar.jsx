/**
 * @file Sidebar.jsx
 * @description Left panel container (40% width on desktop).
 * Renders the Header at the top and passes the rest of the vertical space
 * to its children (EvidencePanel, SearchBar, etc.).
 *
 * @param {Object}    props
 * @param {React.ReactNode} props.children    - Panel content (evidence list, tabs, etc.)
 * @param {Date|null}       props.lastUpdated - Forwarded to Header for "last updated" display
 * @param {boolean}         props.isLive      - Forwarded to Header for pulse indicator
 */

import Header from './Header.jsx';

export default function Sidebar({ children, lastUpdated = null, isLive = true }) {
  return (
    <aside className="flex flex-col w-full md:w-2/5 h-full bg-zinc-900 border-r border-zinc-800 overflow-hidden shrink-0">
      <Header lastUpdated={lastUpdated} isLive={isLive} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </aside>
  );
}
