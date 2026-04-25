/**
 * @file AppShell.jsx
 * @description Root layout with three responsive breakpoints:
 *   mobile  (<768px):   stacked vertically — map 50vh on top (order-1), sidebar below (order-2)
 *   tablet  (768–1024px): sidebar 45%, map 55% side by side
 *   desktop (>1024px):  sidebar 40%, map 60% side by side
 *
 * CSS `order` is used on mobile so the map appears above the sidebar without
 * duplicating the React node (two Leaflet instances would break the map).
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
      {/*
        Sidebar: order-2 on mobile (appears below map), order-1 on md+ (appears left)
        Height: 50vh on mobile, full height on md+
        Width: full on mobile, 45% tablet, 40% desktop
      */}
      <div className="order-2 md:order-1 flex flex-col w-full md:w-[45%] lg:w-[40%] h-[50vh] md:h-full shrink-0">
        <Sidebar lastUpdated={lastUpdated} isLive={isLive} topLocation={topLocation}>
          {sidebar}
        </Sidebar>
      </div>

      {/*
        Map: order-1 on mobile (appears above sidebar), order-2 on md+ (appears right)
        Height: 50vh on mobile, full height on md+
      */}
      <main className="order-1 md:order-2 flex-1 relative h-[50vh] md:h-full">
        {map}
      </main>
    </div>
  );
}
