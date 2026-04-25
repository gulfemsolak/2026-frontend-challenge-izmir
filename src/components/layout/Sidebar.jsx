/**
 * @file Sidebar.jsx
 * @description Left panel container (40% desktop, full-width mobile).
 * Hosts the Header at top, children in the middle, and the "Submit Anonymous Tip"
 * trigger button pinned to the bottom.
 *
 * @param {Object}    props
 * @param {React.ReactNode} props.children
 * @param {Date|null}       props.lastUpdated
 * @param {boolean}         props.isLive
 * @param {{ location: string, score: number }|null} props.topLocation
 */

import { useState } from 'react';
import { Shield } from 'lucide-react';
import Header from './Header.jsx';
import SubmitTipModal from '../submit/SubmitTipModal.jsx';

export default function Sidebar({ children, lastUpdated = null, isLive = true, topLocation = null }) {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  return (
    <>
      <aside className="flex flex-col w-full md:w-2/5 h-full bg-zinc-900 border-r border-zinc-800 overflow-hidden shrink-0">
        <Header lastUpdated={lastUpdated} isLive={isLive} topLocation={topLocation} />

        <div className="flex flex-col flex-1 overflow-hidden">
          {children}
        </div>

        {/* Pinned bottom: submit tip button */}
        <div className="shrink-0 px-4 py-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => setIsTipModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 hover:border-amber-400/60 text-amber-400 font-mono text-[10px] uppercase tracking-widest rounded py-2.5 transition-all duration-150"
          >
            <Shield className="h-3.5 w-3.5" />
            Submit Anonymous Tip
          </button>
        </div>
      </aside>

      <SubmitTipModal
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
      />
    </>
  );
}
