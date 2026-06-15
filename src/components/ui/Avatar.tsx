import { cn } from '../../lib/utils';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

interface AvatarProps {
  src?: string;
  avatar?: string;
  name?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xs';
  isSpeaking?: boolean;
  isOnline?: boolean;
  badge?: React.ReactNode;
  className?: string;
}

export function Avatar({
  src, avatar, name, alt = '', size = 'md', isSpeaking = false, isOnline, badge, className }: AvatarProps) {
  const imageSrc = avatar || src;
  const displayName = name || alt;
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  return (
    <div className="relative inline-block">
      <motion.div
        className={cn(
          'relative rounded-full overflow-hidden bg-gray-700 flex items-center justify-center',
          sizes[size],
          isSpeaking && 'ring-4 ring-[#d4af37] ring-opacity-50',
          className
        )}
        animate={isSpeaking ? { scale: [1, 1.05, 1] } : undefined}
        transition={isSpeaking ? { repeat: Infinity, duration: 1.5 } : undefined}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="font-medium text-white">
            {displayName ? displayName.charAt(0).toUpperCase() : <User className="text-gray-400" size={size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 28 : 40} />}
          </div>
        )}
        {isSpeaking && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/20 to-transparent animate-pulse" />
        )}
      </motion.div>
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-[#1a1a2e',
            isOnline ? 'bg-green-500' : 'bg-gray-500'
          )}
        />
      )}
      {badge && (
        <div className="absolute -top-1 -right-1">{badge}</div>
      )}
    </div>
  );
}
