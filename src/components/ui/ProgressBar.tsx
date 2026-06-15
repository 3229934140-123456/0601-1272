import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value?: number;
  progress?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  progress,
  max = 100,
  label,
  showValue = false,
  color = 'primary',
  size = 'md',
  animated = true,
  className,
}: ProgressBarProps) {
  const actualValue = progress !== undefined ? progress : value;
  const percentage = Math.min(100, Math.max(0, (actualValue! / max) * 100));

  const colors = {
    primary: 'bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f]',
    secondary: 'bg-[#d4af37]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && <span className="text-sm text-white font-medium">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-gray-700/50 rounded-full overflow-hidden', heights[size])}>
        <motion.div
          className={cn('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
