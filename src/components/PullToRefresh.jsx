import React, { useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

/**
 * Wraps a scrollable list and adds a native-style pull-to-refresh gesture.
 *
 * Drop-in replacement for the screens' inner scroll `<div>`: it takes the same
 * `flex-1` slot, forwards the screen's existing `scrollRef` (so scroll-shadow
 * logic keeps working off the same element), and renders a spinner that is
 * revealed as the user pulls.
 */
export default function PullToRefresh({ scrollRef, onRefresh, className = '', children }) {
  const localRef = useRef(null);
  const ref = scrollRef || localRef;
  const { pull, refreshing, threshold } = usePullToRefresh(ref, onRefresh);

  // While dragging we follow the finger 1:1 (no transition); on release we
  // ease back smoothly.
  const settling = !refreshing && pull === 0;
  const contentTransition = settling ? 'transform 0.25s ease' : 'none';

  const progress = Math.min(pull / threshold, 1);
  const indicatorVisible = pull > 4 || refreshing;

  return (
    <div className="relative flex-1 min-h-0">
      {/* Pull indicator */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center"
        style={{
          transform: `translateY(${Math.max(pull - 34, -10)}px)`,
          opacity: indicatorVisible ? 1 : 0,
          transition: settling ? 'transform 0.25s ease, opacity 0.2s ease' : 'opacity 0.15s ease',
        }}
      >
        <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border card-shadow">
          <Loader2
            size={16}
            className={`text-primary ${refreshing ? 'animate-spin' : ''}`}
            style={refreshing ? undefined : { transform: `rotate(${progress * 270}deg)` }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={ref}
        className={`h-full overflow-y-auto scrollbar-hide ${className}`}
        style={{ transform: `translateY(${pull}px)`, transition: contentTransition }}
      >
        {children}
      </div>
    </div>
  );
}
