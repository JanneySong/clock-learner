import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeedbackType } from '../../types';

interface FeedbackOverlayProps {
  type: FeedbackType | null;
  message?: string;
  companionEmoji?: string;
  onDismiss?: () => void;
}

const feedbackConfig: Record<FeedbackType, {
  bg: string;
  emoji: string;
  defaultMessage: string;
}> = {
  correct: {
    bg: 'bg-correct/90',
    emoji: '🎉',
    defaultMessage: '太棒了！',
  },
  wrong: {
    bg: 'bg-[#FFF3E0]/95',
    emoji: '🤔',
    defaultMessage: '再试试看',
  },
  hint: {
    bg: 'bg-blue-100/95',
    emoji: '💡',
    defaultMessage: '看看指针指向哪里',
  },
  encourage: {
    bg: 'bg-accent/90',
    emoji: '💪',
    defaultMessage: '加油！你可以的！',
  },
};

const FeedbackOverlay = memo(function FeedbackOverlay({
  type,
  message,
  companionEmoji = '🐰',
  onDismiss,
}: FeedbackOverlayProps) {
  return (
    <AnimatePresence>
      {type && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onDismiss}
        >
          <motion.div
            className={`${feedbackConfig[type].bg} rounded-3xl p-8 shadow-xl flex flex-col items-center gap-4 max-w-[300px] w-full`}
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="text-5xl">{companionEmoji}</span>
            <span className="text-4xl">{feedbackConfig[type].emoji}</span>
            <p className="text-xl font-bold text-text-primary text-center">
              {message || feedbackConfig[type].defaultMessage}
            </p>
            {type === 'correct' && (
              <div className="flex gap-1">
                {['⭐', '⭐', '⭐'].map((star, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.15, type: 'spring' }}
                  >
                    {star}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default FeedbackOverlay;
