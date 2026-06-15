import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import type { Debater } from '../../types';
import { getRoleName } from '../../utils/format';

interface DebaterCardProps {
  debater: Debater;
  teamSide?: 'affirmative' | 'negative';
  showRole?: boolean;
  isCurrentUser?: boolean;
  onClick?: () => void;
}

export function DebaterCard({ debater, teamSide, showRole = true, isCurrentUser = false, onClick }: DebaterCardProps) {
  const sideColor = teamSide === 'affirmative' ? '#c41e3a' : '#0d7377';
  const sideBg = teamSide === 'affirmative' ? 'from-[#c41e3a]/20' : 'from-[#0d7377]/20';

  return (
    <Card hoverable onClick={onClick} className={`overflow-hidden ${isCurrentUser ? 'ring-2 ring-[#d4af37]' : ''}`}>
      <CardContent className="p-0">
        <div className={`h-1 ${teamSide ? '' : 'bg-[#1e3a5f]'}`} style={{ backgroundColor: teamSide ? sideColor : undefined }} />
        <div className={`p-4 bg-gradient-to-b ${sideBg} to-transparent`}>
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <Avatar
                src={debater.avatar}
                alt={debater.name}
                size="lg"
                isSpeaking={debater.isSpeaking}
              />
              {debater.isSpeaking && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-green-500"
                >
                  <Mic size={12} className="text-white" />
                </motion.div>
              )}
              {!debater.isSpeaking && (
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-gray-600">
                  <MicOff size={12} className="text-gray-400" />
                </div>
              )}
            </div>

            <h4 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              {debater.name}
            </h4>

            {showRole && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${sideColor}20`, color: sideColor }}
              >
                {getRoleName(debater.role)}
              </span>
            )}

            {isCurrentUser && (
              <span className="mt-2 text-xs text-[#d4af37]">当前用户</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
