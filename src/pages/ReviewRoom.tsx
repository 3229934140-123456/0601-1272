import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Play,
  Pause,
  Volume2,
  MessageSquare,
  BarChart3,
  Users,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  SkipBack,
  SkipForward,
  Zap,
  Target,
  Award,
  ThumbsUp,
  ThumbsDown,
  GitBranch,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useDebateStore } from '../store/useDebateStore';
import { mockStatistics } from '../data/mockStatistics';
import {
  getSideName,
  getSideColor,
  formatDateTime,
  formatDuration,
} from '../utils/format';
import type { Speech } from '../types';

export default function ReviewRoom() {
  const { currentDebate, speeches, violations, highlights, scores } = useDebateStore();
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'timeline' | 'clashes' | 'vote'>('timeline');

  const allDebaters = currentDebate?.teams.flatMap((t) => t.debaters) || [];

  const getDebaterById = (id: string) => allDebaters.find((d) => d.id === id);

  const timelineItems = [
    ...speeches.map((s) => ({ ...s, type: 'speech' as const })),
    ...violations.map((v) => ({ ...v, type: 'violation' as const })),
    ...highlights.map((h) => ({ ...h, type: 'highlight' as const })),
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const selectedItem = timelineItems[selectedTimelineIndex];

  const argumentClashes = [
    {
      id: 'clash-1',
      title: 'AI就业影响',
      affirmativePoint: 'AI创造更多新型就业岗位',
      negativePoint: 'AI导致大规模失业和社会动荡',
      winner: 'affirmative',
      impact: 'high',
    },
    {
      id: 'clash-2',
      title: '技术自主性',
      affirmativePoint: '人类始终掌握AI的控制权',
      negativePoint: 'AI可能发展出自主意识和目标',
      winner: 'negative',
      impact: 'critical',
    },
    {
      id: 'clash-3',
      title: '伦理决策能力',
      affirmativePoint: 'AI可以学习人类伦理价值观',
      negativePoint: '机器无法理解人类情感和道德',
      winner: 'tie',
      impact: 'medium',
    },
  ];

  const voteResults = mockStatistics.voteResults;

  const playIntervalRef = useRef<number | null>(null);

  const getItemDuration = (item: any) => {
    if (item.type === 'speech') return item.duration || 240;
    if (item.type === 'violation') return 30;
    return 20;
  };

  const totalDuration = timelineItems.reduce((sum, item) => sum + getItemDuration(item), 0);

  const handleTimelineClick = (index: number) => {
    setSelectedTimelineIndex(index);
    setCurrentPlayTime(0);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    if (isPlaying) {
      startPlayback();
    }
  };

  const handleSkipBack = () => {
    const newIndex = Math.max(0, selectedTimelineIndex - 1);
    setSelectedTimelineIndex(newIndex);
    setCurrentPlayTime(0);
  };

  const handleSkipForward = () => {
    const newIndex = Math.min(timelineItems.length - 1, selectedTimelineIndex + 1);
    setSelectedTimelineIndex(newIndex);
    setCurrentPlayTime(0);
  };

  const startPlayback = () => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    playIntervalRef.current = window.setInterval(() => {
      setCurrentPlayTime((prev) => {
        const currentItem = timelineItems[selectedTimelineIndex];
        if (!currentItem) {
          setIsPlaying(false);
          if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;
          }
          return 0;
        }
        const itemDur = getItemDuration(currentItem);
        const newTime = prev + 1;
        if (newTime >= itemDur) {
          if (selectedTimelineIndex < timelineItems.length - 1) {
            setSelectedTimelineIndex((i) => i + 1);
            return 0;
          } else {
            setIsPlaying(false);
            if (playIntervalRef.current) {
              clearInterval(playIntervalRef.current);
              playIntervalRef.current = null;
            }
            return itemDur;
          }
        }
        return newTime;
      });
    }, 1000);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startPlayback();
    }
  };

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  const renderTimelineItem = (item: any, index: number) => {
    const debater = getDebaterById(item.debaterId);
    const isSelected = index === selectedTimelineIndex;

    let icon, bgColor, borderColor;

    if (item.type === 'speech') {
      icon = <MessageSquare size={14} />;
      bgColor = 'bg-blue-500/10';
      borderColor = 'border-blue-500/30';
    } else if (item.type === 'violation') {
      icon = <AlertTriangle size={14} />;
      bgColor = 'bg-red-500/10';
      borderColor = 'border-red-500/30';
    } else {
      icon = <Star size={14} />;
      bgColor = 'bg-green-500/10';
      borderColor = 'border-green-500/30';
    }

    return (
      <motion.div
        key={`${item.type}-${item.id}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        onClick={() => handleTimelineClick(index)}
        className={`relative pl-10 py-3 rounded-lg cursor-pointer transition-all ${
          isSelected ? `${bgColor} border ${borderColor}` : 'hover:bg-white/5'
        }`}
      >
        <div className={`absolute left-2 top-3 w-6 h-6 rounded-full flex items-center justify-center ${
          item.type === 'speech' ? 'bg-blue-500' :
          item.type === 'violation' ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {icon}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name={debater?.name || '?'} avatar={debater?.avatar} size="xs" />
            <span className="text-sm text-white">{debater?.name}</span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDuration(item.duration || 0)}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
          {item.content || item.description}
        </p>
        {isSelected && (
          <motion.div
            layoutId="timeline-indicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37] rounded-r"
          />
        )}
      </motion.div>
    );
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
                复盘室
              </h1>
              <p className="text-gray-400">{currentDebate?.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/5 rounded-lg p-1">
                {['timeline', 'clashes', 'vote'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      activeTab === tab
                        ? 'bg-[#d4af37]/20 text-[#d4af37]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'timeline' ? '时间线' : tab === 'clashes' ? '论点碰撞' : '投票结果'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Play size={20} />
                        语音回放
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={14} />
                        {formatDuration(currentPlayTime)} / {formatDuration(getItemDuration(selectedItem || {}))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-[#1e3a5f]/30 to-[#0d1117] rounded-xl p-8 mb-6">
                      {selectedItem && (
                        <div className="text-center">
                          <div className="relative inline-block mb-4">
                            <Avatar
                              name={getDebaterById(selectedItem.debaterId)?.name || '?'}
                              avatar={getDebaterById(selectedItem.debaterId)?.avatar}
                              size="lg"
                              isSpeaking={isPlaying}
                            />
                            {isPlaying && (
                              <motion.div
                                className="absolute inset-0 rounded-full border-4 border-[#d4af37]/50"
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {getDebaterById(selectedItem.debaterId)?.name}
                          </h3>
                          <p className="text-gray-400 mb-4">
                            {selectedItem.type === 'speech' ? '发言' :
                             selectedItem.type === 'violation' ? '违规记录' : '精彩亮点'}
                          </p>
                          <p className="text-gray-300 max-w-lg mx-auto">
                            {selectedItem.type === 'speech' ? selectedItem.content || selectedItem.transcript :
                             selectedItem.type === 'violation' ? selectedItem.description :
                             (selectedItem as any).description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <ProgressBar
                        progress={
                          selectedItem
                            ? (currentPlayTime / getItemDuration(selectedItem)) * 100
                            : 0
                        }
                        color="success"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{formatDuration(0)}</span>
                        <span>{formatDuration(getItemDuration(selectedItem || {}))}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleSkipBack}
                        disabled={selectedTimelineIndex === 0}
                      >
                        <SkipBack size={20} />
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={togglePlay}
                        leftIcon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        className="min-w-[120px]"
                      >
                        {isPlaying ? '暂停' : '播放'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleSkipForward}
                        disabled={selectedTimelineIndex >= timelineItems.length - 1}
                      >
                        <SkipForward size={20} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target size={20} />
                      关键数据
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-1">
                          {speeches.length}
                        </div>
                        <p className="text-sm text-gray-400">发言次数</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 text-center">
                        <div className="text-3xl font-bold text-green-400 mb-1">
                          {highlights.length}
                        </div>
                        <p className="text-sm text-gray-400">精彩亮点</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 text-center">
                        <div className="text-3xl font-bold text-red-400 mb-1">
                          {violations.length}
                        </div>
                        <p className="text-sm text-gray-400">违规记录</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 text-center">
                        <div className="text-3xl font-bold text-[#d4af37] mb-1">
                          {formatDuration(speeches.reduce((sum, s) => sum + s.duration, 0))}
                        </div>
                        <p className="text-sm text-gray-400">总时长</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users size={20} />
                      评分详情
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentDebate?.teams.map((team) => (
                        <div key={team.id}>
                          <h4 className={`text-sm font-medium mb-3 ${
                            team.side === 'affirmative' ? 'text-[#c41e3a]' : 'text-[#0d7377]'
                          }`}>
                            {team.name} ({getSideName(team.side)})
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {team.debaters.map((debater) => {
                              const score = scores.find((s) => s.debaterId === debater.id);
                              return (
                                <div key={debater.id} className="p-3 rounded-lg bg-white/5">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar name={debater.name} avatar={debater.avatar} size="sm" />
                                    <div>
                                      <p className="text-sm text-white">{debater.name}</p>
                                      <p className="text-xs text-gray-500">
                                        {debater.role === 'first' ? '一辩' :
                                         debater.role === 'second' ? '二辩' :
                                         debater.role === 'third' ? '三辩' : '四辩'}
                                      </p>
                                    </div>
                                    <span className="ml-auto text-lg font-bold text-[#d4af37]">
                                      {score?.total || 0}
                                    </span>
                                  </div>
                                  <ProgressBar
                                    progress={score?.total || 0}
                                    color={team.side === 'affirmative' ? 'danger' : 'success'}
                                    size="sm"
                                  />
                                </div>
                              );
                            })}
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
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History size={20} />
                      时间线
                    </CardTitle>
                    <CardDescription>点击查看详细内容</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto pr-2">
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1e3a5f] via-[#d4af37]/30 to-[#1e3a5f]" />
                      <div className="space-y-1">
                        {timelineItems.map((item, index) => renderTimelineItem(item, index))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'clashes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch size={20} />
                  论点碰撞
                </CardTitle>
                <CardDescription>双方核心论点的交锋记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {argumentClashes.map((clash, index) => (
                    <motion.div
                      key={clash.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Zap size={20} className="text-[#d4af37]" />
                          <h3 className="text-lg font-semibold text-white">{clash.title}</h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          clash.winner === 'affirmative' ? 'bg-[#c41e3a]/20 text-[#c41e3a]' :
                          clash.winner === 'negative' ? 'bg-[#0d7377]/20 text-[#0d7377]' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {clash.winner === 'affirmative' ? '正方占优' :
                           clash.winner === 'negative' ? '反方占优' : '平局'}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className={`p-4 rounded-xl border-2 ${
                          clash.winner === 'affirmative' ? 'border-[#c41e3a]/50 bg-[#c41e3a]/10' : 'border-white/10'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full ${getSideColor('affirmative', true)}`} />
                            <span className="text-sm font-medium text-[#c41e3a]">正方</span>
                            {clash.winner === 'affirmative' && <CheckCircle2 size={16} className="text-green-500" />}
                          </div>
                          <p className="text-gray-300">{clash.affirmativePoint}</p>
                        </div>

                        <div className={`p-4 rounded-xl border-2 ${
                          clash.winner === 'negative' ? 'border-[#0d7377]/50 bg-[#0d7377]/10' : 'border-white/10'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full ${getSideColor('negative', true)}`} />
                            <span className="text-sm font-medium text-[#0d7377]">反方</span>
                            {clash.winner === 'negative' && <CheckCircle2 size={16} className="text-green-500" />}
                          </div>
                          <p className="text-gray-300">{clash.negativePoint}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">影响程度</span>
                          <span className={`font-medium ${
                            clash.impact === 'critical' ? 'text-purple-400' :
                            clash.impact === 'high' ? 'text-green-400' : 'text-blue-400'
                          }`}>
                            {clash.impact === 'critical' ? '关键' : clash.impact === 'high' ? '重要' : '一般'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'vote' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  投票结果
                </CardTitle>
                <CardDescription>评委和观众投票统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <Award size={20} className="text-[#d4af37]" />
                      最终结果
                    </h3>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-transparent border border-[#d4af37]/30 text-center">
                      <div className="text-6xl mb-4">🏆</div>
                      <h4 className={`text-2xl font-bold mb-2 ${
                        voteResults.winner === 'affirmative' ? 'text-[#c41e3a]' : 'text-[#0d7377]'
                      }`}>
                        {currentDebate?.teams.find((t) => t.side === voteResults.winner)?.name}
                      </h4>
                      <p className="text-gray-400 mb-4">
                        {voteResults.winner === 'affirmative' ? '正方' : '反方'}获胜
                      </p>
                      <div className="flex items-center justify-center gap-8 text-sm">
                        <div>
                          <span className="text-[#c41e3a] font-bold text-xl">{voteResults.affirmative}</span>
                          <p className="text-gray-500">评委票（正方）</p>
                        </div>
                        <div className="text-2xl text-gray-600">:</div>
                        <div>
                          <span className="text-[#0d7377] font-bold text-xl">{voteResults.negative}</span>
                          <p className="text-gray-500">评委票（反方）</p>
                        </div>
                        {voteResults.abstain > 0 && (
                          <div>
                            <span className="text-gray-400 font-bold text-xl">{voteResults.abstain}</span>
                            <p className="text-gray-500">弃权</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#c41e3a]">正方支持率</span>
                          <span className="text-[#c41e3a] font-bold">{Math.round((voteResults.affirmative / (voteResults.affirmative + voteResults.negative + voteResults.abstain)) * 100)}%</span>
                        </div>
                        <ProgressBar
                          progress={(voteResults.affirmative / (voteResults.affirmative + voteResults.negative + voteResults.abstain)) * 100}
                          color="danger"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#0d7377]">反方支持率</span>
                          <span className="text-[#0d7377] font-bold">{Math.round((voteResults.negative / (voteResults.affirmative + voteResults.negative + voteResults.abstain)) * 100)}%</span>
                        </div>
                        <ProgressBar
                          progress={(voteResults.negative / (voteResults.affirmative + voteResults.negative + voteResults.abstain)) * 100}
                          color="success"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <Users size={20} className="text-blue-400" />
                      投票详情
                    </h3>
                    <div className="space-y-4">
                      {mockStatistics.judges.map((judge, index) => (
                        <motion.div
                          key={judge.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar name={judge.name} size="md" />
                            <div className="flex-1">
                              <p className="text-white font-medium">{judge.name}</p>
                              <p className="text-sm text-gray-500">{judge.affiliation}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              index < voteResults.affirmative
                                ? 'bg-[#c41e3a]/20 text-[#c41e3a]'
                                : 'bg-[#0d7377]/20 text-[#0d7377]'
                            }`}>
                              {index < voteResults.affirmative ? '投正方' : '投反方'}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
