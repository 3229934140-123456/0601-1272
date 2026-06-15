import { motion } from 'framer-motion';
import { Calendar, Users, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import type { Debate } from '../../types';
import { formatDateTime, getStatusText, getStatusColor } from '../../utils/format';

interface DebateCardProps {
  debate: Debate;
  onClick?: () => void;
}

export function DebateCard({ debate, onClick }: DebateCardProps) {
  const typeLabels: Record<string, string> = {
    policy: '政策辩',
    value: '价值辩',
    fact: '事实辩',
  };

  const formatLabels: Record<string, string> = {
    bp: 'BP赛制',
    nsda: '新国辩',
    australasian: '奥瑞刚',
    custom: '自定义',
  };

  return (
    <Card hoverable gradient onClick={onClick} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-2">
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#1e3a5f]/50 text-blue-300">
                {typeLabels[debate.type]}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                {formatLabels[debate.format]}
              </span>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full text-white ${getStatusColor(debate.status)}`}>
              {getStatusText(debate.status)}
            </span>
          </div>

          <h3 className="text-base font-semibold text-white mb-3 line-clamp-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {debate.title}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar size={14} />
              <span>{formatDateTime(debate.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users size={14} />
              <span>{debate.teams.length} 支队伍 · {debate.teams.reduce((acc, t) => acc + t.debaters.length, 0)} 名辩手</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock size={14} />
              <span>{debate.rounds.length} 个环节</span>
            </div>
          </div>

          {debate.teams.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {debate.teams.flatMap(team => 
                    team.debaters.slice(0, 2).map(debater => (
                      <div key={debater.id} className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#1a1a2e]">
                        <img src={debater.avatar} alt={debater.name} className="w-full h-full object-cover" />
                      </div>
                    ))
                  )}
                  {debate.teams.reduce((acc, t) => acc + t.debaters.length, 0) > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#1a1a2e] flex items-center justify-center">
                      <span className="text-xs text-gray-400">+{debate.teams.reduce((acc, t) => acc + t.debaters.length, 0) - 4}</span>
                    </div>
                  )}
                </div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="text-[#d4af37] flex items-center gap-1 text-sm"
                >
                  <span>进入</span>
                  <ChevronRight size={16} />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
