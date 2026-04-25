/**
 * @file AppShell.jsx
 * @description Root layout for Find Podo: full-screen flex row split.
 * On mobile: stacks vertically (sidebar on top, map below).
 * On desktop (md+): sidebar takes 40%, map takes 60%.
 *
 * @param {Object}          props
 * @param {React.ReactNode} props.sidebar      - Left panel content
 * @param {React.ReactNode} props.map          - Right map content
 * @param {Date|null}       props.lastUpdated  - Passed to Sidebar → Header
 * @param {boolean}         props.isLive       - Passed to Sidebar → Header
 */

import Sidebar from './Sidebar.jsx';

export default function AppShell({ sidebar, map, lastUpdated = null, isLive = true }) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-zinc-950 overflow-hidden">
      <Sidebar lastUpdated={lastUpdated} isLive={isLive}>
        {sidebar}
      </Sidebar>

      {/* Map panel — grows to fill remaining space */}
      <main className="flex-1 relative min-h-[50vh] md:min-h-0">
        {map}
      </main>
    </div>
  );
}
