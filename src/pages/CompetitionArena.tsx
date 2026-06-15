import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  MessageSquare,
  Hand,
  Pause,
  Play,
  Volume2,
  Users,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Maximize2,
  Settings,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Timer } from '../components/ui/Timer';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TeamCard } from '../components/features/TeamCard';
import { DanmakuItem } from '../components/features/DanmakuItem';
import { useDebateStore } from '../store/useDebateStore';
import { useUserStore } from '../store/useUserStore';
import { useTimer } from '../hooks/useTimer';
import { useDanmaku } from '../hooks/useDanmaku';
import { getRoleName, getSideName, getSideColor } from '../utils/format';
import { formatTime } from '../utils/time';

const cardTypes = [
  { type: 'question', label: '提问', color: 'bg-blue-500', icon: MessageSquare },
  { type: 'objection', label: '反对', color: 'bg-red-500', icon: XCircle },
  { type: 'support', label: '支持', color: 'bg-green-500', icon: CheckCircle2 },
  { type: 'warning', label: '提醒', color: 'bg-yellow-500', icon: AlertTriangle },
];

export default function CompetitionArena() {
  const {
    currentDebate,
    currentRoundIndex,
    timeRemaining,
    isPaused,
    currentSpeaker,
    speeches,
    togglePause,
    addDanmaku,
    setCurrentRoundIndex,
    setTimeRemaining,
    setCurrentSpeaker,
    addSpeech,
  } = useDebateStore();
  const { currentUser } = useUserStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [danmakuInput, setDanmakuInput] = useState('');
  const [raisedCard, setRaisedCard] = useState<string | null>(null);
  const [showDanmaku, setShowDanmaku] = useState(true);
  const danmakuContainerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentRound = currentDebate?.rounds[currentRoundIndex];
  const currentTeam = currentDebate?.teams.find(
    (t) => t.debaters.some((d) => d.id === currentSpeaker?.id)
  );

  const { timeRemaining: timerTime, isRunning, start, pause, reset } = useTimer({
    initialTime: currentRound?.duration || 180,
    onComplete: () => {
      playEndSound();
      handleNextRound();
    },
    onWarning: () => playWarningSound(),
  });

  const { visibleDanmakus, sendDanmaku } = useDanmaku();

  useEffect(() => {
    if (currentRound) {
      reset(currentRound.duration);
    }
  }, [currentRoundIndex, currentRound]);

  const playWarningSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  };

  const playEndSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      setIsSpeaking(false);
      pause();
      if (currentSpeaker) {
        addSpeech({
          id: `speech-${Date.now()}`,
          debaterId: currentSpeaker.id,
          startTime: 0,
          duration: (currentRound?.duration || 180) - timerTime,
          transcript: '发言记录...',
          content: '发言记录...',
          timestamp: new Date(),
          highlights: [],
        });
      }
    } else {
      setIsSpeaking(true);
      start();
      setCurrentSpeaker(currentUser as any);
    }
  };

  const handleNextRound = () => {
    setIsSpeaking(false);
    pause();
    if (currentRoundIndex < (currentDebate?.rounds.length || 0) - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    }
  };

  const handleRaiseCard = (type: string) => {
    setRaisedCard(raisedCard === type ? null : type);
  };

  const handleSendDanmaku = () => {
    if (!danmakuInput.trim()) return;
    sendDanmaku(currentUser.name, currentUser.id);
    setDanmakuInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendDanmaku();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0d1117]">
      <Header />
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                辩论赛场
              </h1>
              <p className="text-gray-400">
                {currentDebate?.title}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Volume2 size={18} />}
              >
                音频
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Maximize2 size={18} />}
              >
                全屏
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      第 {currentRoundIndex + 1} 环节 · {currentRound?.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSideColor(currentTeam?.side || 'affirmative')}`}>
                        {getSideName(currentTeam?.side || 'affirmative')}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-white">
                        {currentSpeaker ? currentSpeaker.name : '等待发言'}
                      </span>
                      {currentSpeaker && (
                        <span className="text-gray-500">
                          ({getRoleName(currentSpeaker.role)})
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative mb-8">
                      <Avatar
                        name={currentSpeaker?.name || '?'}
                        avatar={currentSpeaker?.avatar}
                        size="lg"
                        isSpeaking={isSpeaking}
                      />
                      {isSpeaking && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-[#d4af37]/50"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    <div className="mb-8">
                      <Timer
                        timeRemaining={timerTime}
                        totalTime={currentRound?.duration || 180}
                        isRunning={isRunning}
                        size="lg"
                      />
                    </div>

                    <div className="w-full max-w-md mb-8">
                      <ProgressBar
                        progress={((currentRound?.duration || 180) - timerTime) / (currentRound?.duration || 180) * 100}
                        color={timerTime <= 10 ? 'danger' : timerTime <= 30 ? 'warning' : 'success'}
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        variant={isSpeaking ? 'danger' : 'primary'}
                        size="lg"
                        leftIcon={isSpeaking ? <MicOff size={20} /> : <Mic size={20} />}
                        onClick={handleToggleSpeak}
                        className="min-w-[140px]"
                      >
                        {isSpeaking ? '结束发言' : '开始发言'}
                      </Button>
                      <Button
                        variant={isPaused ? 'secondary' : 'ghost'}
                        size="lg"
                        leftIcon={isPaused ? <Play size={20} /> : <Pause size={20} />}
                        onClick={togglePause}
                      >
                        {isPaused ? '继续' : '暂停'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        rightIcon={<ChevronRight size={20} />}
                        onClick={handleNextRound}
                      >
                        下一环节
                      </Button>
                    </div>
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hand size={20} />
                    举牌示意
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {cardTypes.map((card) => (
                      <motion.button
                        key={card.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRaiseCard(card.type)}
                        className={`relative p-6 rounded-xl border-2 transition-all ${
                          raisedCard === card.type
                            ? `${card.color} border-white/50 shadow-lg`
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <card.icon
                          size={32}
                          className={`mx-auto mb-2 ${raisedCard === card.type ? 'text-white' : 'text-gray-400'}`}
                        />
                        <p className={`text-sm font-medium ${raisedCard === card.type ? 'text-white' : 'text-gray-400'}`}>
                          {card.label}
                        </p>
                        {raisedCard === card.type && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                          >
                            <CheckCircle2 size={16} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentDebate?.teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <TeamCard team={team} showScore />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock size={20} />
                      环节进度
                    </CardTitle>
                    <span className="text-sm text-gray-400">
                      {currentRoundIndex + 1} / {currentDebate?.rounds.length || 0}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1e3a5f] via-[#d4af37]/30 to-[#1e3a5f]" />
                    <div className="space-y-4">
                      {currentDebate?.rounds.map((round, index) => (
                        <motion.div
                          key={round.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`relative pl-12 py-3 rounded-lg transition-all ${
                            index === currentRoundIndex
                              ? 'bg-[#d4af37]/10 border border-[#d4af37]/30'
                              : index < currentRoundIndex
                              ? 'opacity-60'
                              : 'opacity-40'
                          }`}
                        >
                          <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                            index === currentRoundIndex
                              ? 'bg-[#d4af37] ring-4 ring-[#d4af37]/30'
                              : index < currentRoundIndex
                              ? 'bg-green-500'
                              : 'bg-gray-600'
                          }`}>
                            {index < currentRoundIndex && <CheckCircle2 size={12} className="text-white" />}
                            {index === currentRoundIndex && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`font-medium ${
                                index === currentRoundIndex ? 'text-[#d4af37]' : 'text-white'
                              }`}>
                                {round.name}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {getSideName(round.side)} · {formatTime(round.duration)}
                              </p>
                            </div>
                            {index === currentRoundIndex && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#d4af37]/20 text-[#d4af37]">
                                进行中
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
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
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users size={20} />
                      观众弹幕
                    </CardTitle>
                    <button
                      onClick={() => setShowDanmaku(!showDanmaku)}
                      className={`p-2 rounded-lg transition-colors ${
                        showDanmaku ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-white/5 text-gray-500'
                      }`}
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  <div
                    ref={danmakuContainerRef}
                    className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2"
                  >
                    {showDanmaku && (
                      <AnimatePresence>
                        {visibleDanmakus.map((danmaku, index) => (
                          <DanmakuItem
                            key={danmaku.id}
                            danmaku={danmaku}
                            delay={index * 0.1}
                          />
                        ))}
                      </AnimatePresence>
                    )}
                    {visibleDanmakus.length === 0 && (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        暂无弹幕
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="发送弹幕..."
                      value={danmakuInput}
                      onChange={(e) => setDanmakuInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      variant="secondary"
                      onClick={handleSendDanmaku}
                      leftIcon={<Send size={18} />}
                    >
                      发送
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings size={20} />
                    赛场控制
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      申请暂停
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      申请补充
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      查看资料
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      论点卡
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
