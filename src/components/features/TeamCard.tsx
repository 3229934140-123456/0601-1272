import { motion } from 'framer-motion';
import { Crown, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import type { Team } from '../../types';
import { getSideName, getSideColor } from '../../utils/format';

interface TeamCardProps {
  team: Team;
  isActive?: boolean;
  showScore?: boolean;
  onClick?: () => void;
}

export function TeamCard({ team, isActive = false, showScore = true, onClick }: TeamCardProps) {
  const sideColor = getSideColor(team.side);

  return (
    <Card hoverable onClick={onClick} className={`overflow-hidden ${isActive ? 'ring-2 ring-[#d4af37]' : ''}`}>
      <CardContent className="p-0">
        <div className="h-1" style={{ backgroundColor: sideColor }} />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {team.name}
                </h3>
                {team.side === 'affirmative' && <Crown size={16} className="text-[#d4af37]" />}
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${sideColor}20`, color: sideColor }}
              >
                {getSideName(team.side)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                {team.score}
              </p>
              <p className="text-xs text-gray-400">当前得分</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Users size={14} />
            <span>{team.debaters.length} 名辩手</span>
          </div>

          <div className="flex -space-x-3">
            {team.debaters.map((debater, index) => (
              <motion.div
                key={debater.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Avatar
                  src={debater.avatar}
                  alt={debater.name}
                  size="sm"
                  isSpeaking={debater.isSpeaking}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
