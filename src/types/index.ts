export interface Debate {
  id: string;
  title: string;
  type: 'policy' | 'value' | 'fact';
  format: 'bp' | 'nsda' | 'australasian' | 'custom';
  startTime: Date;
  status: 'preparing' | 'ongoing' | 'finished';
  teams: Team[];
  rounds: Round[];
  timerRules: TimerRule[];
}

export interface Team {
  id: string;
  name: string;
  side: 'affirmative' | 'negative';
  debaters: Debater[];
  score: number;
}

export interface Debater {
  id: string;
  name: string;
  role: 'first' | 'second' | 'third' | 'fourth';
  avatar: string;
  isSpeaking: boolean;
  title?: string;
}

export interface Round {
  id: string;
  name: string;
  duration: number;
  currentSpeaker: string | null;
  timeRemaining: number;
  speeches: Speech[];
  scores: Score[];
  violations: Violation[];
  side: 'affirmative' | 'negative' | 'both';
}

export interface Speech {
  id: string;
  debaterId: string;
  startTime: number;
  duration: number;
  transcript: string;
  highlights: Highlight[];
  content?: string;
  timestamp: Date;
}

export interface Score {
  id: string;
  judgeId: string;
  teamId: string;
  debaterId: string;
  content: number;
  delivery: number;
  strategy: number;
  total: number;
}

export interface Violation {
  id: string;
  debaterId: string;
  type: 'timeout' | 'interruption' | 'personal_attack' | 'other' | 'interrupt' | 'off_topic';
  time: number;
  description: string;
  penalty: number;
  timestamp: Date;
}

export interface Highlight {
  id: string;
  startTime: number;
  endTime: number;
  description: string;
  isExcellent: boolean;
  debaterId: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface ArgumentCard {
  id: string;
  teamId: string;
  title: string;
  content: string;
  type: 'argument' | 'evidence' | 'rebuttal';
  createdAt: Date;
}

export interface TimerRule {
  id: string;
  roundName: string;
  duration: number;
  warningTime: number;
  overtimeAllowed: boolean;
}

export interface Danmaku {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  color: string;
}

export interface Statistics {
  debaterId: string;
  totalSpeechTime: number;
  totalSpeakingTime: number;
  avgResponseSpeed: number;
  averageResponseSpeed: number;
  winCount: number;
  totalMatches: number;
  totalDebates: number;
  winRate: number;
  commonArguments: string[];
  badges: Badge[];
  charts: {
    speechTime: { name: string; time: number }[];
    responseSpeed: { name: string; speed: number }[];
    winRate: { name: string; rate: number }[];
    argumentUsage: { name: string; count: number }[];
    teamRanking?: { team: string; wins: number; losses: number; points: number }[];
    personalRanking?: { debaterId: string; team: string; score: number }[];
    skillRadar?: { skill: string; value: number }[];
  };
  voteResults: {
    affirmative: number;
    negative: number;
    abstain: number;
    winner: 'affirmative' | 'negative';
  };
  judges: {
    id: string;
    name: string;
    affiliation: string;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
  progress: number;
  requirementCount: number;
}

export interface TrainingTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  deadline: Date;
  dueDate: Date;
  reward: number;
  progress: number;
  priority: 'low' | 'medium' | 'high';
}

export interface DebateFormat {
  id: string;
  name: string;
  description: string;
  rounds: { name: string; duration: number }[];
}

export type PageType = 'lobby' | 'preparation' | 'arena' | 'judge' | 'review' | 'growth';
