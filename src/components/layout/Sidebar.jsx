/**
 * @file Sidebar.jsx
 * @description Left panel container (40% on desktop, full width on mobile).
 * Hosts the Header at top and passes remaining vertical space to children.
 *
 * @param {Object}    props
 * @param {React.ReactNode} props.children
 * @param {Date|null}       props.lastUpdated
 * @param {boolean}         props.isLive
 * @param {{ location: string, score: number }|null} props.topLocation
 */

import Header from './Header.jsx';

export default function Sidebar({ children, lastUpdated = null, isLive = true, topLocation = null }) {
  return (
    <aside className="flex flex-col w-full md:w-2/5 h-full bg-zinc-900 border-r border-zinc-800 overflow-hidden shrink-0">
      <Header lastUpdated={lastUpdated} isLive={isLive} topLocation={topLocation} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </aside>
  );
}
