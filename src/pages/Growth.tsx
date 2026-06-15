import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Clock,
  Zap,
  TrendingUp,
  BarChart3,
  Award,
  Target,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Medal,
  Crown,
  Star,
  Flame,
  Brain,
  MessageSquare,
  Users,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Header } from '../components/layout/Header';
import { Navigation } from '../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { BadgeIcon } from '../components/features/BadgeIcon';
import { useUserStore } from '../store/useUserStore';
import { mockStatistics, mockBadges, mockTrainingTasks } from '../data/mockStatistics';
import { mockDebaters } from '../data/mockDebaters';
import { formatDuration, formatNumber, formatPercentage } from '../utils/format';

const CHART_COLORS = ['#d4af37', '#1e3a5f', '#0d7377', '#c41e3a', '#6366f1', '#ec4899'];

export default function Growth() {
  const { currentUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'ranking' | 'tasks'>('overview');
  const stats = mockStatistics;
  const tasks = mockTrainingTasks;

  const speakingTimeData = stats.charts.speechTime;
  const responseSpeedData = stats.charts.responseSpeed;
  const winRateData = stats.charts.winRate;
  const argumentTypeData = stats.charts.argumentUsage;
  const teamRankingData = stats.charts.teamRanking;
  const personalRankingData = stats.charts.personalRanking;
  const radarData = stats.charts.skillRadar;

  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const unlockedBadges = mockBadges.filter((b) => b.unlocked);
  const lockedBadges = mockBadges.filter((b) => !b.unlocked);

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
                成长中心
              </h1>
              <p className="text-gray-400">统计数据、成就徽章、训练任务</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white/5 rounded-lg p-1">
                {['overview', 'badges', 'ranking', 'tasks'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      activeTab === tab
                        ? 'bg-[#d4af37]/20 text-[#d4af37]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab === 'overview' ? '概览' :
                     tab === 'badges' ? '徽章' :
                     tab === 'ranking' ? '排名' : '任务'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card gradient>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                      <Avatar
                        name={currentUser.name}
                        avatar={currentUser.avatar}
                        size="xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#1e3a5f] flex items-center justify-center border-4 border-[#0d1117]">
                        <Crown size={18} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h2>
                      <p className="text-gray-400 mb-4">{currentUser.title}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-[#d4af37]">
                            {formatDuration(stats.totalSpeakingTime)}
                          </div>
                          <p className="text-sm text-gray-500">总发言时长</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-400">
                            {stats.averageResponseSpeed}s
                          </div>
                          <p className="text-sm text-gray-500">平均回应速度</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400">
                            {formatPercentage(stats.winRate)}
                          </div>
                          <p className="text-sm text-gray-500">总胜率</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-400">
                            {stats.totalDebates}
                          </div>
                          <p className="text-sm text-gray-500">参与场次</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-400">
                            {unlockedBadges.length}/{mockBadges.length}
                          </div>
                          <p className="text-sm text-gray-500">徽章解锁</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock size={20} />
                      发言时长趋势
                    </CardTitle>
                    <CardDescription>近6个月发言时长统计</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={speakingTimeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a2e',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: 'white',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="minutes"
                            stroke="#d4af37"
                            strokeWidth={3}
                            dot={{ fill: '#d4af37', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#d4af37' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
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
                      <Zap size={20} />
                      回应速度分析
                    </CardTitle>
                    <CardDescription>质询环节的回应速度</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={responseSpeedData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="debate" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a2e',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: 'white',
                            }}
                          />
                          <Bar dataKey="seconds" fill="#0d7377" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp size={20} />
                      胜率走势
                    </CardTitle>
                    <CardDescription>近6个月胜负记录</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={winRateData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="month" stroke="#6b7280" />
                          <YAxis stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a2e',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: 'white',
                            }}
                          />
                          <Legend />
                          <Bar dataKey="wins" name="胜" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="losses" name="负" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain size={20} />
                      常用论证类型
                    </CardTitle>
                    <CardDescription>论证方式分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={argumentTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="count"
                          >
                            {argumentTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a2e',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: 'white',
                            }}
                          />
                          <Legend
                            formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} />
                    能力雷达图
                  </CardTitle>
                  <CardDescription>综合能力评估</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="skill" stroke="#6b7280" />
                        <PolarRadiusAxis stroke="#6b7280" />
                        <Radar
                          name="能力值"
                          dataKey="value"
                          stroke="#d4af37"
                          fill="#d4af37"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1a1a2e',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award size={20} />
                    已解锁徽章
                    <span className="ml-2 text-sm font-normal text-[#d4af37]">
                      {unlockedBadges.length}/{mockBadges.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {unlockedBadges.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#1e3a5f]/20 border border-[#d4af37]/30 text-center"
                      >
                        <BadgeIcon badge={badge} size="lg" className="mx-auto mb-3" />
                        <h4 className="text-white font-medium mb-1">{badge.name}</h4>
                        <p className="text-xs text-gray-400 mb-2">{badge.description}</p>
                        <p className="text-xs text-[#d4af37]">
                          {badge.unlockedAt ? `获得于 ${badge.unlockedAt.toLocaleDateString()}` : ''}
                        </p>
                      </motion.div>
                    ))}
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
                    <Star size={20} />
                    待解锁徽章
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {lockedBadges.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 rounded-xl bg-white/5 border border-white/10 text-center opacity-60"
                      >
                        <BadgeIcon badge={badge} size="lg" className="mx-auto mb-3 grayscale" />
                        <h4 className="text-white font-medium mb-1">{badge.name}</h4>
                        <p className="text-xs text-gray-400 mb-3">{badge.description}</p>
                        <div className="text-xs">
                          <div className="flex justify-between text-gray-500 mb-1">
                            <span>进度</span>
                            <span>{badge.progress}/{badge.requirementCount}</span>
                          </div>
                          <ProgressBar
                            progress={(badge.progress / badge.requirementCount) * 100}
                            color="warning"
                            size="sm"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy size={20} />
                    队伍排名
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamRankingData.map((team, index) => (
                      <motion.div
                        key={team.team}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                          team.team === '星辰辩队'
                            ? 'bg-[#d4af37]/20 border border-[#d4af37]/30'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                          index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' :
                          'bg-white/10 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{team.team}</p>
                          <p className="text-sm text-gray-400">{team.wins}胜 {team.losses}负</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#d4af37]">{team.points}</p>
                          <p className="text-xs text-gray-500">积分</p>
                        </div>
                      </motion.div>
                    ))}
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
                    <Medal size={20} />
                    个人排名
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {personalRankingData.map((person, index) => {
                      const debater = mockDebaters.find((d) => d.id === person.debaterId) || mockDebaters[0];
                      return (
                        <motion.div
                          key={person.debaterId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                            person.debaterId === currentUser.id
                              ? 'bg-[#d4af37]/20 border border-[#d4af37]/30'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                            index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white' :
                            'bg-white/10 text-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <Avatar name={debater.name} avatar={debater.avatar} size="md" />
                          <div className="flex-1">
                            <p className="text-white font-medium">{debater.name}</p>
                            <p className="text-sm text-gray-400">{person.team}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-[#d4af37]">{person.score}</p>
                            <p className="text-xs text-gray-500">评分</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">{completedTasks}</div>
                    <p className="text-sm text-gray-400">已完成</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">{inProgressTasks}</div>
                    <p className="text-sm text-gray-400">进行中</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-500/10 border-gray-500/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-gray-400 mb-1">{pendingTasks}</div>
                    <p className="text-sm text-gray-400">待开始</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar size={20} />
                      训练任务
                    </CardTitle>
                    <Button variant="primary" size="sm" leftIcon={<Target size={16} />}>
                      新建任务
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl transition-colors ${
                          task.status === 'completed'
                            ? 'bg-green-500/10 border border-green-500/20'
                            : task.status === 'in_progress'
                            ? 'bg-blue-500/10 border border-blue-500/20'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            task.status === 'completed'
                              ? 'bg-green-500/30'
                              : task.status === 'in_progress'
                              ? 'bg-blue-500/30'
                              : 'bg-white/10'
                          }`}>
                            {task.status === 'completed' ? (
                              <CheckCircle2 size={20} className="text-green-400" />
                            ) : task.status === 'in_progress' ? (
                              <Flame size={20} className="text-blue-400" />
                            ) : (
                              <AlertCircle size={20} className="text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">{task.title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                task.priority === 'high'
                                  ? 'bg-red-500/20 text-red-400'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>进度</span>
                                  <span>{task.progress}%</span>
                                </div>
                                <ProgressBar
                                  progress={task.progress}
                                  color={
                                    task.status === 'completed' ? 'success' :
                                    task.status === 'in_progress' ? 'primary' : 'warning'
                                  }
                                  size="sm"
                                />
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock size={14} />
                                <span>截止: {task.dueDate.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
                            详情
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
