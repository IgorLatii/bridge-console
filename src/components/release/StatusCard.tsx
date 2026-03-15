/**
 * Backend service: release-orchestrator-idp
 * TODO: GET /api/releases
 * EVENT: RELEASE_REQUESTED (Triggered on manual deploy)
 */

import { useState, useEffect } from 'react';
import { releaseService } from '../../services/releaseService';
import type { ReleaseEvent } from '../../types';

export default function ReleaseStatusCard() {
  const [latestRelease, setLatestRelease] = useState<ReleaseEvent | null>(null);

  useEffect(() => {
    releaseService.getReleases().then((releases) => {
      const latest = releases.find((r) => r.status === 'SUCCESS');
      if (latest) setLatestRelease(latest);
    });
  }, []);

  const statusLabel = latestRelease
    ? `System Stable · v2.4.1`
    : 'Checking status...';

  return (
    <div className="flex items-center gap-3 rounded-full border border-status-success/20 bg-status-success/5 px-3 py-1.5">
      <div className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
      <span className="text-xs font-medium tabular-nums text-status-success">
        {statusLabel}
      </span>
    </div>
  );
}
