import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Upload, FileText, Plus, Users, Edit2, Trash2, BookOpen, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { DebaterCard } from '../components/features/DebaterCard';
import { ArgumentCardComponent } from '../components/features/ArgumentCardComponent';
import { useDebateStore } from '../store/useDebateStore';
import { useUserStore } from '../store/useUserStore';
import type { ArgumentCard } from '../types';
import { getRoleName, getSideName } from '../utils/format';

export default function Preparation() {
  const { currentDebate, argumentCards, addArgumentCard, updateArgumentCard, deleteArgumentCard } = useDebateStore();
  const { currentUser } = useUserStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResult, setDrawResult] = useState<{ side: 'affirmative' | 'negative'; role: string } | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState<Partial<ArgumentCard>>({
    title: '',
    content: '',
    type: 'argument',
  });
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([
    { name: '麦肯锡_AI报告2024.pdf', size: '2.4MB', type: 'pdf' },
    { name: 'NatureMedicine_AI诊断.pdf', size: '1.8MB', type: 'pdf' },
  ]);
  const [dragOver, setDragOver] = useState(false);

  const handleDraw = () => {
    setIsDrawing(true);
    setTimeout(() => {
      const sides: ('affirmative' | 'negative')[] = ['affirmative', 'negative'];
      const roles = ['first', 'second', 'third', 'fourth'];
      setDrawResult({
        side: sides[Math.floor(Math.random() * sides.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
      });
      setIsDrawing(false);
    }, 2000);
  };

  const handleAddCard = () => {
    if (!newCard.title || !newCard.content) return;
    
    const card: ArgumentCard = {
      id: `card-${Date.now()}`,
      teamId: currentDebate?.teams[0]?.id || 'team-1',
      title: newCard.title,
      content: newCard.content,
      type: newCard.type as 'argument' | 'evidence' | 'rebuttal',
      createdAt: new Date(),
    };
    
    addArgumentCard(card);
    setNewCard({ title: '', content: '', type: 'argument' });
    setShowAddCardModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(f => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(1) + 'MB',
        type: f.name.split('.').pop() || 'unknown',
      }));
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const typeLabels = {
    argument: { label: '论点', color: 'bg-blue-500/20 text-blue-400' },
    evidence: { label: '论据', color: 'bg-green-500/20 text-green-400' },
    rebuttal: { label: '反驳', color: 'bg-orange-500/20 text-orange-400' },
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
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            准备室
          </h1>
          <p className="text-gray-400">抽签分组、角色分工、资料上传、论点卡撰写</p>
        </motion.div>

        {currentDebate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#1e3a5f]/30 to-[#1a1a2e] border border-[#1e3a5f]/50"
          >
            <h2 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              {currentDebate.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Users size={16} />
                {currentDebate.teams.length} 支队伍
              </span>
              <span className="flex items-center gap-2">
                <FileText size={16} />
                {currentDebate.rounds.length} 个环节
              </span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card gradient>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shuffle size={20} />
                    抽签分组
                  </CardTitle>
                  <CardDescription>随机决定正反方和发言顺序</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <AnimatePresence mode="wait">
                      {isDrawing ? (
                        <motion.div
                          key="drawing"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="mb-6"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37] to-[#1e3a5f] flex items-center justify-center"
                          >
                            <Shuffle size={40} className="text-white" />
                          </motion.div>
                          <p className="text-[#d4af37] font-medium">抽签中...</p>
                        </motion.div>
                      ) : drawResult ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="mb-6"
                        >
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#1e3a5f]/30 border-2 border-[#d4af37] flex items-center justify-center">
                            <CheckCircle2 size={48} className="text-[#d4af37]" />
                          </div>
                          <p className="text-white font-medium mb-2">抽签结果</p>
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5">
                            <span style={{ color: drawResult.side === 'affirmative' ? '#c41e3a' : '#0d7377' }}>
                              {getSideName(drawResult.side)}
                            </span>
                            <span className="text-gray-500">·</span>
                            <span className="text-white">{getRoleName(drawResult.role)}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mb-6"
                        >
                          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/5 border-2 border-dashed border-gray-600 flex items-center justify-center">
                            <span className="text-4xl">🎲</span>
                          </div>
                          <p className="text-gray-400">点击下方按钮开始抽签</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <Button
                      variant="secondary"
                      className="w-full"
                      leftIcon={<Shuffle size={18} />}
                      onClick={handleDraw}
                      disabled={isDrawing}
                    >
                      {isDrawing ? '抽签中...' : '开始抽签'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    角色分工
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {currentDebate?.teams.flatMap(team =>
                      team.debaters.map(debater => (
                        <DebaterCard
                          key={debater.id}
                          debater={debater}
                          teamSide={team.side}
                          isCurrentUser={debater.id === currentUser.id}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload size={20} />
                    资料上传
                  </CardTitle>
                  <CardDescription>上传参考文献、数据资料、案例材料</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragOver
                        ? 'border-[#d4af37] bg-[#d4af37]/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const files = e.dataTransfer.files;
                      if (files) {
                        const newFiles = Array.from(files).map(f => ({
                          name: f.name,
                          size: (f.size / 1024 / 1024).toFixed(1) + 'MB',
                          type: f.name.split('.').pop() || 'unknown',
                        }));
                        setUploadedFiles([...uploadedFiles, ...newFiles]);
                      }
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
                    />
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#1e3a5f]/30 flex items-center justify-center">
                      <Upload size={24} className="text-[#d4af37]" />
                    </div>
                    <p className="text-white font-medium mb-1">点击或拖拽文件到此处</p>
                    <p className="text-sm text-gray-400">支持 PDF、Word、Excel、PPT 等格式</p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/30 flex items-center justify-center">
                            <FileText size={18} className="text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size} · {file.type.toUpperCase()}</p>
                          </div>
                          <button className="p-1 text-gray-500 hover:text-red-400 transition-colors">
                            <X size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen size={20} />
                      论点卡
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Plus size={16} />}
                      onClick={() => setShowAddCardModal(true)}
                    >
                      新建
                    </Button>
                  </div>
                  <CardDescription>撰写论点、论据、攻防预案卡片</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {argumentCards.map((card, index) => (
                      <ArgumentCardComponent
                        key={card.id}
                        card={card}
                        onEdit={() => {}}
                        onDelete={() => deleteArgumentCard(card.id)}
                      />
                    ))}
                    {argumentCards.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <FileText size={32} className="text-gray-600" />
                        </div>
                        <p className="text-gray-500">暂无论点卡</p>
                        <p className="text-sm text-gray-600">点击上方按钮创建第一张</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#1e3a5f]/20 border border-[#d4af37]/30"
            >
              <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                准备进度
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">抽签分组</span>
                  <CheckCircle2 size={20} className={drawResult ? 'text-green-500' : 'text-gray-600'} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">角色分工</span>
                  <CheckCircle2 size={20} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">资料上传</span>
                  <span className="text-sm text-[#d4af37]">{uploadedFiles.length} 份</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">论点卡</span>
                  <span className="text-sm text-[#d4af37]">{argumentCards.length} 张</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <Button variant="secondary" className="w-full" rightIcon={<ChevronRight size={18} />}>
                    进入赛场
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        title="新建论点卡"
        description="创建论点、论据或反驳卡片"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">卡片类型</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(typeLabels).map(([key, { label, color }]) => (
                <button
                  key={key}
                  onClick={() => setNewCard({ ...newCard, type: key as 'argument' | 'evidence' | 'rebuttal' })}
                  className={`p-2 rounded-lg text-center text-sm transition-all ${
                    newCard.type === key
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
            <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
            <Input
              placeholder="例如：经济效率提升"
              value={newCard.title}
              onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">内容</label>
            <TextArea
              placeholder="输入论点内容、数据来源、案例描述等..."
              rows={4}
              value={newCard.content}
              onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowAddCardModal(false)}>
              取消
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleAddCard}>
              创建卡片
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
