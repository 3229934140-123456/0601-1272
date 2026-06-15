import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  MinusCircle,
  Star,
  AlertTriangle,
  Gauge,
  Plus,
  Trash2,
  CheckCircle2,
  Users,
  Clock,
  FileText,
  Award,
  TrendingUp,
  TrendingDown,
  MessageSquare,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ScoreSlider } from '../components/features/ScoreSlider';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useDebateStore } from '../store/useDebateStore';
import type { Violation, Highlight, Score } from '../types';
import {
  getSideName,
  getSideColor,
  getViolationTypeName,
  formatDateTime,
  formatDuration,
} from '../utils/format';

export default function JudgePanel() {
  const { currentDebate, violations, highlights, scores, addViolation, addHighlight, updateScore, updateTeamScore } = useDebateStore();
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [newViolation, setNewViolation] = useState<Partial<Violation>>({
    type: 'timeout',
    description: '',
    penalty: 1,
  });
  const [newHighlight, setNewHighlight] = useState<Partial<Highlight>>({
    description: '',
    impact: 'high',
  });
  const [selectedDebater, setSelectedDebater] = useState<string | null>(null);
  const [localScores, setLocalScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    scores.forEach((s) => {
      initial[s.debaterId] = s.total;
    });
    return initial;
  });

  const allDebaters = currentDebate?.teams.flatMap((t) => t.debaters) || [];

  const handleAddViolation = () => {
    if (!selectedDebater || !newViolation.description) return;
    
    const violation: Violation = {
      id: `violation-${Date.now()}`,
      debaterId: selectedDebater,
      type: newViolation.type as 'timeout' | 'interrupt' | 'personal_attack' | 'off_topic' | 'other',
      description: newViolation.description,
      penalty: newViolation.penalty || 1,
      timestamp: new Date(),
      time: Math.floor(Date.now() / 1000) % 3600,
    };
    
    addViolation(violation);
    updateTeamScore(violation.debaterId, -(violation.penalty * 5));
    setNewViolation({ type: 'timeout', description: '', penalty: 1 });
    setSelectedDebater(null);
    setShowViolationModal(false);
  };

  const handleAddHighlight = () => {
    if (!selectedDebater || !newHighlight.description) return;
    
    const highlight: Highlight = {
      id: `highlight-${Date.now()}`,
      debaterId: selectedDebater,
      description: newHighlight.description,
      impact: newHighlight.impact as 'low' | 'medium' | 'high' | 'critical',
      timestamp: new Date(),
      startTime: 0,
      endTime: 0,
      isExcellent: true,
    };
    
    addHighlight(highlight);
    updateTeamScore(highlight.debaterId, highlight.impact === 'critical' ? 10 : highlight.impact === 'high' ? 5 : 2);
    setNewHighlight({ description: '', impact: 'high' });
    setSelectedDebater(null);
    setShowHighlightModal(false);
  };

  const handleScoreChange = (debaterId: string, value: number) => {
    setLocalScores((prev) => ({ ...prev, [debaterId]: value }));
    updateScore(debaterId, value);
  };

  const getViolationColor = (type: string) => {
    switch (type) {
      case 'timeout': return 'text-yellow-500';
      case 'interrupt': return 'text-orange-500';
      case 'personal_attack': return 'text-red-500';
      case 'off_topic': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-purple-400';
      case 'high': return 'text-green-400';
      case 'medium': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'critical': return '关键亮点';
      case 'high': return '重要亮点';
      case 'medium': return '一般亮点';
      default: return '普通亮点';
    }
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                裁判台
              </h1>
              <p className="text-gray-400">记录扣分、亮点、违规，实时评分</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d4af37]/20">
                <Scale size={18} className="text-[#d4af37]" />
                <span className="text-[#d4af37] font-medium">裁判模式</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {currentDebate?.teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${getSideColor(team.side, true)}`} />
                          {team.name}
                        </CardTitle>
                        <div className={`text-2xl font-bold ${
                          team.side === 'affirmative' ? 'text-[#c41e3a]' : 'text-[#0d7377]'
                        }`}>
                          {team.score}
                        </div>
                      </div>
                      <CardDescription>{getSideName(team.side)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-green-400">
                            <TrendingUp size={14} />
                            +{highlights.filter((h) =>
                              team.debaters.some((d) => d.id === h.debaterId)
                            ).length}
                          </span>
                          <span className="flex items-center gap-1 text-red-400">
                            <TrendingDown size={14} />
                            -{violations.filter((v) =>
                              team.debaters.some((d) => d.id === v.debaterId)
                            ).reduce((sum, v) => sum + v.penalty * 5, 0)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Gauge size={20} />
                      实时评分
                    </CardTitle>
                    <span className="text-sm text-gray-400">0 - 100 分</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {currentDebate?.teams.map((team, teamIndex) => (
                      <div key={team.id}>
                        <h4 className={`text-sm font-medium mb-4 ${
                          team.side === 'affirmative' ? 'text-[#c41e3a]' : 'text-[#0d7377]'
                        }`}>
                          {team.name} ({getSideName(team.side)})
                        </h4>
                        <div className="space-y-4">
                          {team.debaters.map((debater, debaterIndex) => (
                            <motion.div
                              key={debater.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + teamIndex * 0.1 + debaterIndex * 0.05 }}
                              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <Avatar name={debater.name} avatar={debater.avatar} size="md" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white font-medium">{debater.name}</span>
                                    <span className="text-2xl font-bold text-[#d4af37]">
                                      {localScores[debater.id] || 0}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {debater.role === 'first' ? '一辩' :
                                     debater.role === 'second' ? '二辩' :
                                     debater.role === 'third' ? '三辩' : '四辩'}
                                  </p>
                                </div>
                              </div>
                              <ScoreSlider
                                value={localScores[debater.id] || 0}
                                onChange={(value) => handleScoreChange(debater.id, value)}
                                min={0}
                                max={100}
                                showValue={false}
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0</span>
                                <span>25</span>
                                <span>50</span>
                                <span>75</span>
                                <span>100</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={20} />
                    扣分记录
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="secondary"
                    className="w-full mb-4"
                    leftIcon={<MinusCircle size={18} />}
                    onClick={() => {
                      setSelectedDebater(null);
                      setShowViolationModal(true);
                    }}
                  >
                    记录违规
                  </Button>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {violations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MinusCircle size={32} className="mx-auto mb-2 opacity-50" />
                        <p>暂无违规记录</p>
                      </div>
                    ) : (
                      violations.map((violation, index) => {
                        const debater = allDebaters.find((d) => d.id === violation.debaterId);
                        return (
                          <motion.div
                            key={violation.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle size={14} className={getViolationColor(violation.type)} />
                              <span className="text-sm text-red-400 font-medium">
                                {getViolationTypeName(violation.type)}
                              </span>
                              <span className="ml-auto text-red-500 font-bold">-{violation.penalty * 5}</span>
                            </div>
                            <p className="text-sm text-white">{debater?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{violation.description}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDateTime(violation.timestamp)}
                            </p>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star size={20} />
                    亮点记录
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="primary"
                    className="w-full mb-4"
                    leftIcon={<Star size={18} />}
                    onClick={() => {
                      setSelectedDebater(null);
                      setShowHighlightModal(true);
                    }}
                  >
                    记录亮点
                  </Button>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {highlights.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Star size={32} className="mx-auto mb-2 opacity-50" />
                        <p>暂无亮点记录</p>
                      </div>
                    ) : (
                      highlights.map((highlight, index) => {
                        const debater = allDebaters.find((d) => d.id === highlight.debaterId);
                        const bonus = highlight.impact === 'critical' ? 10 : highlight.impact === 'high' ? 5 : 2;
                        return (
                          <motion.div
                            key={highlight.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Star size={14} className={getImpactColor(highlight.impact)} />
                              <span className={`text-sm font-medium ${getImpactColor(highlight.impact)}`}>
                                {getImpactLabel(highlight.impact)}
                              </span>
                              <span className="ml-auto text-green-500 font-bold">+{bonus}</span>
                            </div>
                            <p className="text-sm text-white">{debater?.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{highlight.description}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDateTime(highlight.timestamp)}
                            </p>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#1e3a5f]/30 to-transparent border border-[#1e3a5f]/50"
            >
              <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                评分汇总
              </h3>
              <div className="space-y-4">
                {currentDebate?.teams.map((team) => {
                  const teamScores = team.debaters.map((d) => localScores[d.id] || 0);
                  const avgScore = teamScores.length > 0 
                    ? Math.round(teamScores.reduce((a, b) => a + b, 0) / teamScores.length) 
                    : 0;
                  return (
                    <div key={team.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">{team.name}</span>
                        <span className="text-[#d4af37] font-bold">{avgScore} 分</span>
                      </div>
                      <ProgressBar
                        progress={avgScore}
                        color={team.side === 'affirmative' ? 'danger' : 'success'}
                      />
                    </div>
                  );
                })}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">当前领先</span>
                    <span className="text-[#d4af37] font-bold">
                      {currentDebate?.teams.sort((a, b) => b.score - a.score)[0].name}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showViolationModal}
        onClose={() => setShowViolationModal(false)}
        title="记录违规"
        description="选择辩手并记录违规行为"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">选择辩手</label>
            <div className="grid grid-cols-4 gap-2">
              {allDebaters.map((debater) => (
                <button
                  key={debater.id}
                  onClick={() => setSelectedDebater(debater.id)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    selectedDebater === debater.id
                      ? 'ring-2 ring-[#d4af37] bg-[#d4af37]/20'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Avatar name={debater.name} avatar={debater.avatar} size="sm" className="mx-auto mb-1" />
                  <p className="text-xs text-white truncate">{debater.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">违规类型</label>
            <div className="grid grid-cols-2 gap-2">
              {['timeout', 'interrupt', 'personal_attack', 'off_topic', 'other'].map((type) => (
                <button
                  key={type}
                  onClick={() => setNewViolation({ ...newViolation, type: type as any })}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    newViolation.type === type
                      ? 'ring-2 ring-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {getViolationTypeName(type as any)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">扣分数值</label>
            <div className="flex gap-2">
              {[1, 2, 3, 5].map((penalty) => (
                <button
                  key={penalty}
                  onClick={() => setNewViolation({ ...newViolation, penalty })}
                  className={`flex-1 p-2 rounded-lg text-sm transition-all ${
                    newViolation.penalty === penalty
                      ? 'ring-2 ring-red-500 bg-red-500/20 text-red-400'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  -{penalty * 5}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">违规描述</label>
            <TextArea
              placeholder="请描述违规行为..."
              rows={3}
              value={newViolation.description}
              onChange={(e) => setNewViolation({ ...newViolation, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowViolationModal(false)}>
              取消
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleAddViolation}
              disabled={!selectedDebater || !newViolation.description}
            >
              确认扣分
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showHighlightModal}
        onClose={() => setShowHighlightModal(false)}
        title="记录亮点"
        description="选择辩手并记录精彩表现"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">选择辩手</label>
            <div className="grid grid-cols-4 gap-2">
              {allDebaters.map((debater) => (
                <button
                  key={debater.id}
                  onClick={() => setSelectedDebater(debater.id)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    selectedDebater === debater.id
                      ? 'ring-2 ring-[#d4af37] bg-[#d4af37]/20'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Avatar name={debater.name} avatar={debater.avatar} size="sm" className="mx-auto mb-1" />
                  <p className="text-xs text-white truncate">{debater.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">影响程度</label>
            <div className="grid grid-cols-4 gap-2">
              {['low', 'medium', 'high', 'critical'].map((impact) => (
                <button
                  key={impact}
                  onClick={() => setNewHighlight({ ...newHighlight, impact: impact as any })}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    newHighlight.impact === impact
                      ? 'ring-2 ring-green-500 bg-green-500/20 text-green-400'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {getImpactLabel(impact)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">亮点描述</label>
            <TextArea
              placeholder="请描述精彩表现..."
              rows={3}
              value={newHighlight.description}
              onChange={(e) => setNewHighlight({ ...newHighlight, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowHighlightModal(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddHighlight}
              disabled={!selectedDebater || !newHighlight.description}
            >
              确认记录
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
