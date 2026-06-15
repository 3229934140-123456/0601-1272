import type { Statistics, TrainingTask } from '../types';
import { mockBadges } from './mockBadges';

export { mockBadges } from './mockBadges';

export const mockStatistics: Statistics = {
  debaterId: 'debater-1',
  totalSpeechTime: 8520,
  avgResponseSpeed: 2.3,
  winCount: 12,
  totalMatches: 18,
  winRate: 67,
  commonArguments: ['经济效率', '社会公平', '科技创新', '伦理道德', '法律依据'],
  totalSpeakingTime: 8520,
  averageResponseSpeed: 2.3,
  totalDebates: 18,
  badges: mockBadges,
  charts: {
    speechTime: [
      { name: '第1场', time: 420 },
      { name: '第2场', time: 380 },
      { name: '第3场', time: 450 },
      { name: '第4场', time: 520 },
      { name: '第5场', time: 480 },
      { name: '第6场', time: 550 },
      { name: '第7场', time: 510 },
      { name: '第8场', time: 580 },
    ],
    responseSpeed: [
      { name: '第1场', speed: 3.2 },
      { name: '第2场', speed: 2.8 },
      { name: '第3场', speed: 2.5 },
      { name: '第4场', speed: 2.4 },
      { name: '第5场', speed: 2.2 },
      { name: '第6场', speed: 2.1 },
      { name: '第7场', speed: 2.0 },
      { name: '第8场', speed: 2.3 },
    ],
    winRate: [
      { name: '1月', rate: 50 },
      { name: '2月', rate: 55 },
      { name: '3月', rate: 60 },
      { name: '4月', rate: 58 },
      { name: '5月', rate: 65 },
      { name: '6月', rate: 67 },
    ],
    argumentUsage: [
      { name: '经济效率', count: 28 },
      { name: '社会公平', count: 22 },
      { name: '科技创新', count: 18 },
      { name: '伦理道德', count: 15 },
      { name: '法律依据', count: 12 },
      { name: '环境保护', count: 10 },
      { name: '文化传承', count: 8 },
      { name: '国际视野', count: 6 },
    ],
  },
  voteResults: {
    affirmative: 4,
    negative: 3,
    abstain: 0,
    winner: 'affirmative',
  },
  judges: [
    { id: 'judge-1', name: '张教授', affiliation: '北京大学法学院' },
    { id: 'judge-2', name: '李教授', affiliation: '清华大学社科学院' },
    { id: 'judge-3', name: '王教授', affiliation: '复旦大学新闻学院' },
    { id: 'judge-4', name: '刘教授', affiliation: '武汉大学法学院' },
    { id: 'judge-5', name: '陈教授', affiliation: '浙江大学公管学院' },
    { id: 'judge-6', name: '周教授', affiliation: '南京大学政府管理学院' },
    { id: 'judge-7', name: '吴教授', affiliation: '中国人民大学法学院' },
  ],
};

export const mockTrainingTasks: TrainingTask[] = [
  {
    id: 'task-1',
    title: '立论稿撰写练习',
    description: '就"环境保护应优先于经济发展"为题，撰写一篇4分钟的立论稿',
    status: 'completed',
    deadline: new Date('2025-06-10'),
    dueDate: new Date('2025-06-10'),
    reward: 50,
    progress: 100,
    priority: 'high',
  },
  {
    id: 'task-2',
    title: '质询技巧训练',
    description: '完成10组质询练习，每组包含3个连环问题',
    status: 'in_progress',
    deadline: new Date('2025-06-20'),
    dueDate: new Date('2025-06-20'),
    reward: 80,
    progress: 60,
    priority: 'medium',
  },
  {
    id: 'task-3',
    title: '数据分析能力提升',
    description: '收集并分析5份最新的行业报告，提炼可用数据',
    status: 'in_progress',
    deadline: new Date('2025-06-25'),
    dueDate: new Date('2025-06-25'),
    reward: 100,
    progress: 30,
    priority: 'medium',
  },
  {
    id: 'task-4',
    title: '自由辩论反应训练',
    description: '参加5场模拟自由辩论，提升反应速度和临场应变能力',
    status: 'pending',
    deadline: new Date('2025-06-30'),
    dueDate: new Date('2025-06-30'),
    reward: 120,
    progress: 0,
    priority: 'low',
  },
  {
    id: 'task-5',
    title: '结辩稿撰写',
    description: '就"人工智能是否会取代人类工作"为题，撰写一篇3分钟的结辩稿',
    status: 'pending',
    deadline: new Date('2025-07-05'),
    dueDate: new Date('2025-07-05'),
    reward: 60,
    progress: 0,
    priority: 'high',
  },
];

export const speechTimeData = [
  { name: '第1场', time: 420 },
  { name: '第2场', time: 380 },
  { name: '第3场', time: 450 },
  { name: '第4场', time: 520 },
  { name: '第5场', time: 480 },
  { name: '第6场', time: 550 },
  { name: '第7场', time: 510 },
  { name: '第8场', time: 580 },
];

export const responseSpeedData = [
  { name: '第1场', speed: 3.2 },
  { name: '第2场', speed: 2.8 },
  { name: '第3场', speed: 2.5 },
  { name: '第4场', speed: 2.4 },
  { name: '第5场', speed: 2.2 },
  { name: '第6场', speed: 2.1 },
  { name: '第7场', speed: 2.0 },
  { name: '第8场', speed: 2.3 },
];

export const winRateData = [
  { name: '1月', rate: 50 },
  { name: '2月', rate: 55 },
  { name: '3月', rate: 60 },
  { name: '4月', rate: 58 },
  { name: '5月', rate: 65 },
  { name: '6月', rate: 67 },
];

export const teamRanking = [
  { rank: 1, name: '星辰辩论队', wins: 15, points: 1450, members: 4 },
  { rank: 2, name: '弘毅辩论队', wins: 14, points: 1420, members: 4 },
  { rank: 3, name: '明德辩论队', wins: 12, points: 1380, members: 4 },
  { rank: 4, name: '新民辩论队', wins: 11, points: 1350, members: 4 },
  { rank: 5, name: '至善辩论队', wins: 10, points: 1320, members: 4 },
  { rank: 6, name: '博学辩论队', wins: 9, points: 1280, members: 4 },
  { rank: 7, name: '笃行辩论队', wins: 8, points: 1250, members: 4 },
  { rank: 8, name: '慎思辩论队', wins: 7, points: 1200, members: 4 },
];

export const individualRanking = [
  { rank: 1, name: '张明远', team: '星辰辩论队', wins: 12, mvp: 5, rating: 92 },
  { rank: 2, name: '刘子轩', team: '弘毅辩论队', wins: 11, mvp: 4, rating: 90 },
  { rank: 3, name: '李思琪', team: '星辰辩论队', wins: 12, mvp: 3, rating: 88 },
  { rank: 4, name: '赵雅琳', team: '弘毅辩论队', wins: 10, mvp: 4, rating: 87 },
  { rank: 5, name: '王浩然', team: '星辰辩论队', wins: 11, mvp: 2, rating: 86 },
  { rank: 6, name: '孙博文', team: '弘毅辩论队', wins: 9, mvp: 3, rating: 85 },
  { rank: 7, name: '陈雨萱', team: '星辰辩论队', wins: 10, mvp: 2, rating: 84 },
  { rank: 8, name: '周晓彤', team: '弘毅辩论队', wins: 8, mvp: 2, rating: 83 },
];

export const argumentUsageData = [
  { name: '经济效率', count: 28 },
  { name: '社会公平', count: 22 },
  { name: '科技创新', count: 18 },
  { name: '伦理道德', count: 15 },
  { name: '法律依据', count: 12 },
  { name: '环境保护', count: 10 },
  { name: '文化传承', count: 8 },
  { name: '国际视野', count: 6 },
];
