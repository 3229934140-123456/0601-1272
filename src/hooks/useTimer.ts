import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTime: number;
  autoStart?: boolean;
  onTick?: (time: number) => void;
  onComplete?: () => void;
  onWarning?: () => void;
  warningTime?: number;
}

export function useTimer({
  initialTime,
  autoStart = false,
  onTick,
  onComplete,
  onWarning,
  warningTime = 30,
}: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [hasWarned, setHasWarned] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    setTimeRemaining((prev) => {
      const newTime = prev - 1;
      onTick?.(newTime);
      
      if (newTime <= warningTime && !hasWarned) {
        setHasWarned(true);
        onWarning?.();
      }
      
      if (newTime <= 0) {
        setIsRunning(false);
        onComplete?.();
        return 0;
      }
      
      return newTime;
    });
  }, [onTick, onComplete, onWarning, warningTime, hasWarned]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, tick]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setTimeRemaining(newTime ?? initialTime);
    setIsRunning(false);
    setIsPaused(false);
    setHasWarned(false);
  }, [initialTime]);

  return {
    timeRemaining,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    formatTime: () => {
      const mins = Math.floor(Math.abs(timeRemaining) / 60);
      const secs = Math.abs(timeRemaining) % 60;
      const sign = timeRemaining < 0 ? '-' : '';
      return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    progress: (initialTime - timeRemaining) / initialTime,
    isWarning: timeRemaining <= warningTime,
  };
}
