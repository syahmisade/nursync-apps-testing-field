import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

const THRESHOLD = 64;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    const el = containerRef.current;
    if (el && el.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (startY.current === null || refreshing) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      e.preventDefault();
      setPullDistance(Math.min(delta * 0.5, THRESHOLD * 1.5));
    }
  }, [refreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      if (onRefresh) await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
    startY.current = null;
  }, [pullDistance, refreshing, onRefresh]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const triggered = pullDistance >= THRESHOLD;

  return (
    <div className="relative h-full flex flex-col">
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center z-10 transition-all duration-200 pointer-events-none"
        style={{
          top: 0,
          height: `${Math.max(pullDistance, refreshing ? THRESHOLD : 0)}px`,
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{
            background: 'hsl(var(--primary))',
            opacity: Math.max(progress, refreshing ? 1 : 0),
            transform: `scale(${0.5 + Math.min(progress, 1) * 0.5})`,
            transition: refreshing ? 'none' : 'transform 0.1s',
          }}
        >
          <RefreshCw
            size={14}
            className={refreshing ? 'animate-spin' : ''}
            style={{
              color: 'white',
              transform: `rotate(${triggered ? 180 : progress * 160}deg)`,
              transition: refreshing ? 'none' : 'transform 0.1s',
            }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{
          overscrollBehavior: 'none',
          transform: `translateY(${refreshing ? THRESHOLD : pullDistance}px)`,
          transition: (pullDistance === 0 && !refreshing) ? 'transform 0.3s ease' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}