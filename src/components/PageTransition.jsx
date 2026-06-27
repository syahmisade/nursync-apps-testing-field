import { AnimatePresence, motion } from 'framer-motion';

// iOS-like easing for push/pop navigation.
export const slideTransition = { type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.32 };

// The detail page slides in from the right and out to the right.
export const detailVariants = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
};

// The underlying list parallaxes a short distance to the left while the
// detail page is on top.
export const listVariants = {
  initial: { x: '-30%' },
  animate: { x: 0 },
  exit: { x: '-30%' },
};

export { AnimatePresence, motion };
