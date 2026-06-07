import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarRatingProps {
  total: number;
  earned: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

const StarRating = memo(function StarRating({
  total,
  earned,
  size = 'md',
  animated = false,
  className = '',
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <AnimatePresence key={i}>
          <motion.span
            className={`${sizeMap[size]} ${i < earned ? 'grayscale-0' : 'grayscale opacity-30'}`}
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: i < earned ? 1 : 0.3 }}
            transition={animated ? { delay: i * 0.15, type: 'spring', stiffness: 300 } : undefined}
          >
            ⭐
          </motion.span>
        </AnimatePresence>
      ))}
    </div>
  );
});

export default StarRating;
