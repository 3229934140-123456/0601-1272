import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Clock, Users, Calendar, Settings, X, Check, Shuffle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { DebateCard } from '../components/features/DebateCard';
import { TeamCard } from '../components/features/TeamCard';
import { useDebateStore } from '../store/useDebateStore';
import { mockDebates, debateFormats } from '../data/mockDebates';
import { formatDateTime } from '../utils/format';

export default function Lobby() {
  const { currentDebate, selectedFormat, setSelectedFormat, setCurrentDebate } = useDebateStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDebateTitle, setNewDebateTitle] = useState('');
  const [debateType, setDebateType] = useState<'policy' | 'value' | 'fact'>('value');
  const [showTimerConfig, setShowTimerConfig] = useState(false);

  const filteredDebates = mockDebates.filter(debate =>
    debate.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const typeLabels: Record<string, { label: string; color: string }> = {
    policy: { label: '政策辩', color: 'bg-blue-500/20 text-blue-300' },
    value: { label: '价值辩', color: 'bg-purple-500/20 text-purple-300' },
    fact: { label: '事实辩', color: 'bg-green-500/20 text-green-300' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                辩论大厅
              </h1>
              <p className="text-gray-400">创建辩题、配置赛制、组建队伍</p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Plus size={20} />}
              onClick={() => setShowCreateModal(true)}
            >
              创建新辩论
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜索辩题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            </div>
            <Button variant="ghost" leftIcon={<Filter size={18} />}>
              筛选
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                进行中的辩论
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDebates
                  .filter(d => d.status === 'ongoing')
                  .map(debate => (
                    <motion.div key={debate.id} variants={itemVariants}>
                      <DebateCard
                        debate={debate}
                        onClick={() => {
                          setCurrentDebate(debate);
                        }}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                即将开始
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDebates
                  .filter(d => d.status === 'preparing')
                  .map(debate => (
                    <motion.div key={debate.id} variants={itemVariants}>
                      <DebateCard
                        debate={debate}
                        onClick={() => {
                          setCurrentDebate(debate);
                        }}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                已结束
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDebates
                  .filter(d => d.status === 'finished')
                  .map(debate => (
                    <motion.div key={debate.id} variants={itemVariants}>
                      <DebateCard
                        debate={debate}
                        onClick={() => {
                          setCurrentDebate(debate);
                        }}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {currentDebate && (
              <Card gradient>
                <CardHeader>
                  <CardTitle>当前辩论</CardTitle>
                  <CardDescription>{formatDateTime(currentDebate.startTime)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {currentDebate.title}
                  </h3>
                  <div className="space-y-4">
                    {currentDebate.teams.map(team => (
                      <TeamCard key={team.id} team={team} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={18} />
                  赛制配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {debateFormats.map(format => (
                    <button
                      key={format.id}
                      onClick={() => {
                        setSelectedFormat(format.id);
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedFormat === format.id
                          ? 'bg-[#1e3a5f] border border-[#d4af37]/50'
                          : 'bg-white/5 border border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{format.name}</span>
                        {selectedFormat === format.id && (
                          <Check size={16} className="text-[#d4af37]" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{format.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format.rounds.length} 个环节 · {format.rounds.reduce((acc, r) => acc + r.duration, 0) / 60} 分钟
                      </p>
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  leftIcon={<Clock size={16} />}
                  onClick={() => setShowTimerConfig(true)}
                >
                  计时规则设置
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={18} />
                  今日赛程
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDebates.slice(0, 3).map((debate, index) => (
                    <motion.div
                      key={debate.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] flex items-center justify-center">
                        <Shuffle size={20} className="text-[#d4af37]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{debate.title}</p>
                        <p className="text-xs text-gray-400">{formatDateTime(debate.startTime)}</p>
                      </div>
                      <Users size={16} className="text-gray-500" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="创建新辩论"
        description="配置辩题、赛制和队伍信息"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">辩题</label>
            <Input
              placeholder="例如：人工智能的发展对人类社会利大于弊/弊大于利"
              value={newDebateTitle}
              onChange={(e) => setNewDebateTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">辩题类型</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(typeLabels).map(([key, { label, color }]) => (
                <button
                  key={key}
                  onClick={() => setDebateType(key as 'policy' | 'value' | 'fact')}
                  className={`p-3 rounded-lg text-center transition-all ${
                    debateType === key
                      ? 'ring-2 ring-[#d4af37]'
                      : ''
                  } ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">选择赛制</label>
            <div className="space-y-2">
              {debateFormats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedFormat === format.id
                      ? 'bg-[#1e3a5f] border border-[#d4af37]/50'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{format.name}</span>
                    {selectedFormat === format.id && (
                      <Check size={16} className="text-[#d4af37]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{format.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setShowCreateModal(false)}>
              取消
            </Button>
            <Button variant="secondary" className="flex-1">
              创建辩论
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTimerConfig}
        onClose={() => setShowTimerConfig(false)}
        title="计时规则设置"
        description="配置各环节的计时规则和提醒方式"
      >
        <div className="space-y-4">
          {debateFormats.find(f => f.id === selectedFormat)?.rounds.map((round, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{round.name}</span>
                <span className="text-[#d4af37]">{Math.floor(round.duration / 60)}分{round.duration % 60}秒</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  超时提醒
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  最后30秒警告
                </label>
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <Button variant="ghost" className="flex-1" onClick={() => setShowTimerConfig(false)}>
              取消
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setShowTimerConfig(false)}>
              保存设置
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
