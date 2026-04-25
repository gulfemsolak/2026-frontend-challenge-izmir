/**
 * @file InvestigationPage.jsx
 * @description Main investigation page. Composes AppShell with EvidencePanel,
 * PodoMap, and DetailDrawer. Computes topLocation for the confidence display in Header.
 */

import { useMemo } from 'react';
import AppShell from '../components/layout/AppShell.jsx';
import PodoMap from '../components/map/PodoMap.jsx';
import EvidencePanel from '../components/evidence/EvidencePanel.jsx';
import LastKnownPosition from '../components/evidence/LastKnownPosition.jsx';
import DetailDrawer from '../components/detail/DetailDrawer.jsx';
import { useAllEvidence } from '../hooks/useAllEvidence.js';
import { scoreLocation } from '../utils/confidence.js';

export default function InvestigationPage() {
  const { allEvidence, isLoading, isError, refetchAll } = useAllEvidence();

  const lastUpdated = useMemo(() => {
    if (allEvidence.length === 0) return null;
    return allEvidence[0].submittedAt;
  }, [allEvidence]);

  // Group evidence by location and find the highest-confidence one
  const topLocation = useMemo(() => {
    const locationGroups = {};
    allEvidence.forEach((item) => {
      if (!item.location) return;
      const key = item.location.trim().toLowerCase();
      if (!locationGroups[key]) locationGroups[key] = { label: item.location, items: [] };
      locationGroups[key].items.push(item);
    });

    let best = null;
    let bestScore = 0;

    for (const group of Object.values(locationGroups)) {
      const score = scoreLocation(group.items);
      if (score > bestScore) {
        bestScore = score;
        best = { location: group.label, score };
      }
    }

    return best;
  }, [allEvidence]);

  return (
    <>
      <AppShell
        lastUpdated={lastUpdated}
        isLive={!isError}
        topLocation={topLocation}
        sidebar={
          <>
            <LastKnownPosition topLocation={topLocation} allEvidence={allEvidence} />
            <EvidencePanel
              evidence={allEvidence}
              isLoading={isLoading}
              isError={isError}
              onRefetch={refetchAll}
            />
          </>
        }
        map={<PodoMap evidence={allEvidence} isLoading={isLoading} />}
      />
      <DetailDrawer allEvidence={allEvidence} />
    </>
  );
}
