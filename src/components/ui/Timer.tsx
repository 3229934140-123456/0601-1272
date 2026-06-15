import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../../utils/time';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  warningTime?: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onComplete?: () => void;
  onWarning?: () => void;
}

export function Timer({
  timeRemaining,
  totalTime,
  isRunning,
  warningTime = 30,
  showProgress = true,
  size = 'lg',
  onComplete,
  onWarning,
}: TimerProps) {
  const hasWarned = useRef(false);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (timeRemaining <= warningTime && !hasWarned.current && isRunning) {
      hasWarned.current = true;
      onWarning?.();
    }
    if (timeRemaining <= 0 && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete?.();
    }
  }, [timeRemaining, warningTime, isRunning, onWarning, onComplete]);

  const isWarning = timeRemaining <= warningTime;
  const isCritical = timeRemaining <= 10;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  };

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={timeRemaining}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`font-mono font-bold tracking-wider ${sizes[size]} ${
            isCritical ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-white'
          }`}
        >
          {formatTime(timeRemaining)}
        </motion.div>
      </AnimatePresence>

      {showProgress && (
        <div className="w-full h-1.5 bg-gray-700 rounded-full mt-4 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#1e3a5f] to-[#d4af37]'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {isRunning && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-2 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-400">计时中</span>
        </motion.div>
      )}
    </div>
  );
}
