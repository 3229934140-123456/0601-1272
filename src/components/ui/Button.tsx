import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends ComponentPropsWithoutRef<typeof motion.button> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] text-white hover:from-[#2a4a6f] hover:to-[#3a5a7f] shadow-lg shadow-[#1e3a5f]/30 focus:ring-[#1e3a5f]',
      secondary: 'bg-[#d4af37] text-[#1a1a2e] hover:bg-[#e4bf47] shadow-lg shadow-[#d4af37]/30 focus:ring-[#d4af37]',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 focus:ring-red-600',
      ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-white/5 focus:ring-white/20',
      outline: 'border-2 border-[#1e3a5f] text-white hover:bg-[#1e3a5f]/20 focus:ring-[#1e3a5f]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span>{leftIcon}</span>}
        {children as React.ReactNode}
        {rightIcon && <span>{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
