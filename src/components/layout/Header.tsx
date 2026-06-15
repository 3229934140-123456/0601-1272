import { User, Settings, Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';

export function Header() {
  const { currentUser } = useUserStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-[#1a1a2e]/95 backdrop-blur-md border-b border-[#1e3a5f]/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#d4af37] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">辩</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                辩论竞技场
              </h1>
              <p className="text-xs text-gray-400">Debate Arena Platform</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{currentUser.name}</p>
                <p className="text-xs text-gray-400">一辩 · 星辰队</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4af37]">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <button
            className="md:hidden p-2 text-gray-400"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden mt-4 pt-4 border-t border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4af37]">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{currentUser.name}</p>
                <p className="text-xs text-gray-400">一辩 · 星辰队</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <User size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
