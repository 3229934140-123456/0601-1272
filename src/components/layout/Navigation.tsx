import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Mic, Gavel, PlayCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/lobby', icon: Home, label: '大厅', description: '创建与管理辩论' },
  { path: '/preparation', icon: Users, label: '准备室', description: '抽签与资料准备' },
  { path: '/competition', icon: Mic, label: '赛场', description: '正式辩论环节' },
  { path: '/judge', icon: Gavel, label: '裁判台', description: '评分与记录' },
  { path: '/review', icon: PlayCircle, label: '复盘室', description: '回顾与分析' },
  { path: '/growth', icon: TrendingUp, label: '成长页', description: '数据与成就' },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#1a1a2e]/80 backdrop-blur-md border-y border-[#1e3a5f]/30"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 py-3 overflow-x-auto">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 min-w-[80px] ${
                  isActive
                    ? 'bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] text-white shadow-lg shadow-[#1e3a5f]/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#1e3a5f]/50 to-[#d4af37]/20"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative z-10" />
                <span className="text-xs font-medium mt-1 relative z-10 whitespace-nowrap">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navDot"
                    className="absolute -bottom-1 w-1 h-1 bg-[#d4af37] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
