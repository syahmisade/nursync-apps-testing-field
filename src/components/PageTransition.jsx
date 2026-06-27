import { AnimatePresence, motion } from 'framer-motion';

// iOS-like easing for push/pop navigation.
export const slideTransition = { type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.32 };

// Top-level app pages use a lighter transition than drill-down detail views.
export const pageTransition = { type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.18 };

export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

// The detail page slides in from the right and out to the right.
// Opacity is included so that with `prefers-reduced-motion` (where MotionConfig
// strips the x transform) the transition degrades to a gentle crossfade.
export const detailVariants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
};

// The underlying list parallaxes a short distance to the left while the
// detail page is on top.
export const listVariants = {
  initial: { x: '-30%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
};

export { AnimatePresence, motion };
