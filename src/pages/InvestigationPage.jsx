/**
 * @file InvestigationPage.jsx
 * @description Main investigation page. Composes AppShell with the evidence sidebar
 * and the map panel. Data hooks are called here so lastUpdated can be derived
 * from the most recently fetched evidence item.
 */

import { useMemo } from 'react';
import AppShell from '../components/layout/AppShell.jsx';
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
          {isLoading && <span>Scanning for clues…</span>}
          {!isLoading && !isError && (
            <span>{allEvidence.length} evidence items loaded</span>
          )}
          {isError && <span className="text-red-400">Signal lost</span>}
        </div>
      }
      map={
        <div className="h-full flex items-center justify-center bg-zinc-950 text-zinc-700 font-mono text-xs uppercase tracking-widest">
          Map loading in STEP 11…
        </div>
      }
    />
  );
}
