import { AnimatePresence, motion } from 'framer-motion';

// iOS-like easing for push/pop navigation.
export const slideTransition = { type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.28 };

// The detail page slides in from the right and out to the right.
export const detailVariants = {
  initial: { x: '100%', boxShadow: '-12px 0 28px rgba(0,0,0,0.08)' },
  animate: { x: 0, boxShadow: '-12px 0 28px rgba(0,0,0,0.08)' },
  exit: { x: '100%', boxShadow: '-12px 0 28px rgba(0,0,0,0)' },
};

// The underlying list parallaxes a short distance to the left while the
// detail page is on top.
export const listVariants = {
  initial: { x: '-14%', opacity: 0.96, scale: 0.985 },
  animate: { x: 0, opacity: 1, scale: 1 },
  exit: { x: '-14%', opacity: 0.96, scale: 0.985 },
};

export { AnimatePresence, motion };
