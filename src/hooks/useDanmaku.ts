import { useState, useCallback, useEffect } from 'react';
import type { Danmaku } from '../types';
import { useDebateStore } from '../store/useDebateStore';

export function useDanmaku() {
  const { danmakus, addDanmaku } = useDebateStore();
  const [visibleDanmakus, setVisibleDanmakus] = useState<Danmaku[]>([]);
  const [danmakuInput, setDanmakuInput] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const colors = [
    '#ffffff',
    '#ffd700',
    '#ff6b6b',
    '#4ecdc4',
    '#a8e6cf',
    '#dcedc1',
    '#ffd3b6',
    '#ffaaa5',
  ];

  const sendDanmaku = useCallback((userName: string, userId: string) => {
    if (!danmakuInput.trim()) return;

    const newDanmaku: Danmaku = {
      id: `dm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      content: danmakuInput.trim(),
      timestamp: Date.now(),
      color: selectedColor,
    };

    addDanmaku(newDanmaku);
    setDanmakuInput('');
  }, [danmakuInput, selectedColor, addDanmaku]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const recentDanmakus = danmakus.filter(
        (d) => now - d.timestamp < 10000
      );
      setVisibleDanmakus(recentDanmakus.slice(-20));
    }, 1000);

    return () => clearInterval(interval);
  }, [danmakus]);

  const getDanmakuStyle = useCallback((index: number) => {
    const top = (index * 30) % 70 + 5;
    const animationDuration = 8 + Math.random() * 4;
    return {
      top: `${top}%`,
      color: danmakus[index]?.color || '#ffffff',
      animationDuration: `${animationDuration}s`,
    };
  }, [danmakus]);

  return {
    visibleDanmakus,
    danmakuInput,
    setDanmakuInput,
    selectedColor,
    setSelectedColor,
    sendDanmaku,
    colors,
    getDanmakuStyle,
  };
}
