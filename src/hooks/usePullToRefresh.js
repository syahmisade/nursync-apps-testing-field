import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 70;   // px the user must pull before a refresh fires
const MAX_PULL = 110;   // hard cap on how far the content can be dragged down
const RESISTANCE = 0.5; // drag resistance so the pull feels rubber-banded

/**
 * Native-style pull-to-refresh gesture for a scrollable element.
 *
 * Touch-only by design: it never listens for mouse events, so desktop/web
 * scrolling is completely unaffected.
 *
 * @param {React.RefObject<HTMLElement>} scrollRef - ref to the scroll container
 * @param {() => (void | Promise<void>)} onRefresh - called when the pull passes THRESHOLD
 * @returns {{ pull: number, refreshing: boolean }}
 */
export function usePullToRefresh(scrollRef, onRefresh) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Live mirrors read inside the listeners so the effect can register once
  // and never re-bind in the middle of a gesture.
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const setPullValue = (value) => {
    pullRef.current = value;
    setPull(value);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;

    const handleTouchStart = (e) => {
      if (refreshingRef.current) return;
      if (el.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!pulling.current || refreshingRef.current) return;
      const delta = e.touches[0].clientY - startY.current;
      // Only engage while pulling downward from the very top of the list.
      if (delta > 0 && el.scrollTop <= 0) {
        e.preventDefault(); // suppress native overscroll/bounce while pulling
        setPullValue(Math.min(delta * RESISTANCE, MAX_PULL));
      } else {
        pulling.current = false;
        setPullValue(0);
      }
    };

    const handleTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;

      if (pullRef.current >= THRESHOLD) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPullValue(THRESHOLD); // hold at the indicator height while refreshing
        try {
          await onRefreshRef.current?.();
        } finally {
          refreshingRef.current = false;
          setRefreshing(false);
          setPullValue(0);
        }
      } else {
        setPullValue(0);
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [scrollRef]);

  return { pull, refreshing, threshold: THRESHOLD };
}

export default usePullToRefresh;
