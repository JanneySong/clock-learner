import { memo } from 'react';
import { motion } from 'framer-motion';

interface ChoiceButtonProps {
  label: string;
  icon?: string;
  selected?: boolean;
  correct?: boolean | null;
  disabled?: boolean;
  onClick: () => void;
}

const ChoiceButton = memo(function ChoiceButton({
  label,
  icon,
  selected = false,
  correct = null,
  disabled = false,
  onClick,
}: ChoiceButtonProps) {
  let borderColor = 'border-[#D5C9B5]';
  let bgColor = 'bg-white';

  if (correct === true) {
    borderColor = 'border-correct';
    bgColor = 'bg-green-50';
  } else if (correct === false) {
    borderColor = 'border-error';
    bgColor = 'bg-red-50';
  } else if (selected) {
    borderColor = 'border-accent';
    bgColor = 'bg-orange-50';
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-3
        min-h-[64px] px-6 py-3
        ${bgColor} border-3 ${borderColor}
        rounded-2xl text-xl font-bold text-text-primary
        transition-colors duration-150 btn-press
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileTap={{ scale: 0.95 }}
      animate={
        correct === true
          ? { scale: [1, 1.05, 1] }
          : correct === false
            ? { x: [0, -8, 8, -8, 0] }
            : {}
      }
      transition={{ duration: 0.4 }}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="font-[Fredoka,sans-serif]">{label}</span>
      {correct === true && <span className="text-correct text-2xl">✓</span>}
    </motion.button>
  );
});

export default ChoiceButton;
