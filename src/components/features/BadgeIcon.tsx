import { motion } from 'framer-motion';
import { Award, Mic, Trophy, BarChart2, Brain, Star, Crown, Target, PlayCircle, GraduationCap, Zap, Flame } from 'lucide-react';
import type { Badge } from '../../types';

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  onClick?: () => void;
  className?: string;
}

const iconMap: Record<string, React.FC<any>> = {
  award: Award,
  mic: Mic,
  trophy: Trophy,
  'bar-chart': BarChart2,
  brain: Brain,
  star: Star,
  crown: Crown,
  target: Target,
  'play-circle': PlayCircle,
  'graduation-cap': GraduationCap,
  zap: Zap,
  flame: Flame,
};

export function BadgeIcon({ badge, size = 'md', showName = false, onClick, className }: BadgeIconProps) {
  const Icon = iconMap[badge.icon] || Award;

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 36,
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className || ''}`} onClick={onClick}>
      <motion.div
        whileHover={{ scale: badge.unlocked ? 1.1 : 1 }}
        className={`relative ${sizes[size]} rounded-xl flex items-center justify-center ${
          badge.unlocked
            ? 'bg-gradient-to-br from-[#d4af37]/30 to-[#d4af37]/10 border border-[#d4af37]/50'
            : 'bg-gray-800/50 border border-gray-700/50'
        }`}
      >
        <Icon
          size={iconSizes[size]}
          className={badge.unlocked ? 'text-[#d4af37]' : 'text-gray-600'}
        />
        {badge.unlocked && (
          <motion.div
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="absolute inset-0 rounded-xl bg-[#d4af37]/20"
          />
        )}
        {!badge.unlocked && (
          <div className="absolute inset-0 rounded-xl bg-[#1a1a2e]/60 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
        )}
      </motion.div>
      {showName && (
        <div className="text-center">
          <p className={`text-xs font-medium ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>
            {badge.name}
          </p>
          {!badge.unlocked && (
            <p className="text-xs text-gray-600 mt-0.5">{badge.requirement}</p>
          )}
        </div>
      )}
    </div>
  );
}
