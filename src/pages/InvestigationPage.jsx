/**
 * @file InvestigationPage.jsx
 * @description Main investigation page. Composes AppShell with the evidence sidebar
 * and the interactive map. Derives lastUpdated from the most recent evidence item.
 */

import { useMemo } from 'react';
import AppShell from '../components/layout/AppShell.jsx';
import PodoMap from '../components/map/PodoMap.jsx';
import { useAllEvidence } from '../hooks/useAllEvidence.js';

export default function InvestigationPage() {
  const { allEvidence, isLoading, isError } = useAllEvidence();

  const lastUpdated = useMemo(() => {
    if (allEvidence.length === 0) return null;
    return allEvidence[0].submittedAt;
  }, [allEvidence]);

  return (
    <AppShell
      lastUpdated={lastUpdated}
      isLive={!isError}
      sidebar={
        <div className="flex flex-col flex-1 items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
          {isLoading && <span className="animate-pulse text-amber-400">Scanning for clues…</span>}
          {!isLoading && !isError && (
            <span>{allEvidence.length} evidence items — panel in STEP 12</span>
          )}
          {isError && <span className="text-red-400">Signal lost</span>}
        </div>
      }
      map={
        <PodoMap evidence={allEvidence} isLoading={isLoading} />
      }
    />
  );
}
