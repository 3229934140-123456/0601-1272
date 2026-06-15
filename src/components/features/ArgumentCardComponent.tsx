import { motion } from 'framer-motion';
import { FileText, BookOpen, Zap, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import type { ArgumentCard } from '../../types';
import { getArgumentTypeName, getArgumentTypeColor } from '../../utils/format';

interface ArgumentCardComponentProps {
  card: ArgumentCard;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ArgumentCardComponent({ card, onEdit, onDelete }: ArgumentCardComponentProps) {
  const iconMap = {
    argument: FileText,
    evidence: BookOpen,
    rebuttal: Zap,
  };

  const Icon = iconMap[card.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className={`overflow-hidden border-l-4 ${getArgumentTypeColor(card.type)}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/5">
                <Icon size={16} className="text-white" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                {getArgumentTypeName(card.type)}
              </span>
            </div>
            <div className="flex gap-1">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1 text-gray-400 hover:text-white transition-colors rounded hover:bg-white/10"
                >
                  <Edit2 size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <h4 className="text-sm font-semibold text-white mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {card.title}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
            {card.content}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
