/**
 * @file InvestigationPage.jsx
 * @description Main investigation page. Composes AppShell with EvidencePanel
 * on the left and the interactive PodoMap on the right.
 */

import { useMemo } from 'react';
import AppShell from '../components/layout/AppShell.jsx';
import PodoMap from '../components/map/PodoMap.jsx';
import EvidencePanel from '../components/evidence/EvidencePanel.jsx';
import { useAllEvidence } from '../hooks/useAllEvidence.js';

export default function InvestigationPage() {
  const { allEvidence, isLoading, isError, refetchAll } = useAllEvidence();

  const lastUpdated = useMemo(() => {
    if (allEvidence.length === 0) return null;
    return allEvidence[0].submittedAt;
  }, [allEvidence]);

  return (
    <AppShell
      lastUpdated={lastUpdated}
      isLive={!isError}
      sidebar={
        <EvidencePanel
          evidence={allEvidence}
          isLoading={isLoading}
          isError={isError}
          onRefetch={refetchAll}
        />
      }
      map={
        <PodoMap evidence={allEvidence} isLoading={isLoading} />
      }
    />
  );
}
