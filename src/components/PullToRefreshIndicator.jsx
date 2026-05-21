import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefreshIndicator({ label = 'Pull to refresh' }) {
  return (
    <div className="pull-refresh-indicator" aria-hidden="true">
      <RefreshCw size={14} />
      <span>{label}</span>
    </div>
  );
}
