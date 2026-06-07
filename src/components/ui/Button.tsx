import { memo } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'correct' | 'wrong' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: string;
}

const variantStyles = {
  primary: 'bg-accent text-white hover:bg-orange-600 active:bg-orange-700',
  secondary: 'bg-bg-card text-text-primary hover:bg-[#e5d9c4] active:bg-[#d4c7ab]',
  correct: 'bg-correct text-white',
  wrong: 'bg-error text-white',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-card',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-base min-h-[40px] rounded-2xl',
  md: 'px-6 py-3 text-xl min-h-[56px] rounded-3xl',
  lg: 'px-8 py-4 text-2xl min-h-[64px] rounded-3xl',
};

const Button = memo(function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-bold transition-all duration-150 btn-press
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      {children}
    </button>
  );
});

export default Button;
