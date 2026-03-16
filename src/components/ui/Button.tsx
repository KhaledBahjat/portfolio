'use client';

import { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: ReactNode;
}

const variants = {
  primary: `
    bg-[#020075] text-white 
    hover:bg-[#020095] hover:shadow-glow
    active:bg-[#020055] active:scale-[0.98]
    focus:ring-2 focus:ring-[#020075]/50 
    shadow-lg shadow-[#020075]/20
  `,
  secondary: `
    bg-accent-600 text-white 
    hover:bg-accent-500 hover:shadow-glow-purple 
    active:bg-accent-700 active:scale-[0.98]
    focus:ring-2 focus:ring-accent-500/50
    shadow-lg shadow-accent-600/20
  `,
  danger: `
    bg-red-600 text-white 
    hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30
    active:bg-red-700 active:scale-[0.98]
    focus:ring-2 focus:ring-red-500/50
    shadow-lg shadow-red-600/20
  `,
  ghost: `
    bg-transparent text-text-secondary 
    hover:text-text-primary hover:bg-surface-border/20
    active:bg-surface-border/40 active:scale-[0.98]
  `,
  glass: `
    glass text-text-primary 
    hover:bg-surface-border/30 hover:shadow-glow-white/10
    active:bg-surface-border/50 active:scale-[0.98]
    border border-surface-border
  `,
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className = '', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ 
          scale: 1.03,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        whileTap={{ scale: 0.97 }}
        disabled={isLoading}
        className={`
          inline-flex items-center justify-center gap-2.5 
          rounded-xl font-bold tracking-tight
          transition-all duration-300 
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
          outline-none
          ${variants[variant]} 
          ${sizes[size]} 
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <motion.span 
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/30 border-t-[#020075] rounded-full" 
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
