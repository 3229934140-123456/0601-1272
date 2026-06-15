import { motion } from 'framer-motion';
import type { Danmaku } from '../../types';

interface DanmakuItemProps {
  danmaku: Danmaku;
  top?: number;
  duration?: number;
  delay?: number;
}

export function DanmakuItem({ danmaku, top = 10, duration = 8, delay = 0 }: DanmakuItemProps) {
  return (
    <motion.div
      initial={{ x: '100vw', opacity: 0 }}
      animate={{ x: '-100%', opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration,
        ease: 'linear',
        delay,
      }}
      className="relative whitespace-nowrap px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-sm font-medium shadow-lg"
      style={{
        color: danmaku.color,
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
      }}
    >
      <span className="text-gray-400 mr-2">{danmaku.userName}:</span>
      {danmaku.content}
    </motion.div>
  );
}
