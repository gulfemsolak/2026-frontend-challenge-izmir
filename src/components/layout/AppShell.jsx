/**
 * @file AppShell.jsx
 * @description Root layout: full-screen flex split — sidebar (40%) left, map (60%) right.
 * On mobile (<md) stacks vertically with map in a 50vh block below sidebar.
 *
 * @param {Object}          props
 * @param {React.ReactNode} props.sidebar
 * @param {React.ReactNode} props.map
 * @param {Date|null}       props.lastUpdated
 * @param {boolean}         props.isLive
 * @param {{ location: string, score: number }|null} props.topLocation
 */

import Sidebar from './Sidebar.jsx';

export default function AppShell({
  sidebar,
  map,
  lastUpdated = null,
  isLive = true,
  topLocation = null,
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-zinc-950 overflow-hidden">
      <Sidebar lastUpdated={lastUpdated} isLive={isLive} topLocation={topLocation}>
        {sidebar}
      </Sidebar>

      <main className="flex-1 relative min-h-[50vh] md:min-h-0">
        {map}
      </main>
    </div>
  );
}
