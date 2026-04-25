/**
 * @file Sidebar.jsx
 * @description Left panel container (40% desktop, full-width mobile).
 * Hosts the Header at top, children in the scrollable middle.
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
    <aside className="sidebar-scanlines panel-noise flex flex-col w-full h-full bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 border-r border-zinc-800 overflow-hidden">
      <Header lastUpdated={lastUpdated} isLive={isLive} topLocation={topLocation} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </aside>
  );
}
