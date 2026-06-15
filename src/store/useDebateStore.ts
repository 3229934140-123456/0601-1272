import { create } from 'zustand';
import type { Debate, Team, Round, ArgumentCard, Danmaku, Violation, Score, Speech, Highlight, Debater, CoachAnnotation, TrainingTask, ReplaySession } from '../types';
import { currentDebate, mockArgumentCards, mockDanmakus, mockViolations, mockScores, mockSpeech, mockDebates } from '../data/mockDebates';

interface DebateState {
  debates: Debate[];
  currentDebate: Debate;
  selectedFormat: string;
  argumentCards: ArgumentCard[];
  danmakus: Danmaku[];
  violations: Violation[];
  highlights: Highlight[];
  scores: Score[];
  speeches: Speech[];
  isPaused: boolean;
  currentRoundIndex: number;
  timeRemaining: number;
  currentSpeaker: Debater | null;
  addDebate: (debate: Debate) => void;
  setCurrentDebate: (debate: Debate) => void;
  setSelectedFormat: (format: string) => void;
  addArgumentCard: (card: ArgumentCard) => void;
  updateArgumentCard: (id: string, updates: Partial<ArgumentCard>) => void;
  deleteArgumentCard: (id: string) => void;
  addDanmaku: (danmaku: Danmaku) => void;
  addViolation: (violation: Violation) => void;
  addHighlight: (highlight: Highlight) => void;
  addScore: (score: Score) => void;
  updateScore: (debaterId: string, value: number) => void;
  setCurrentRoundIndex: (index: number) => void;
  setTimeRemaining: (time: number) => void;
  setCurrentSpeaker: (speaker: Debater | null) => void;
  togglePause: () => void;
  setIsPaused: (paused: boolean) => void;
  addSpeech: (speech: Speech) => void;
  updateSpeechAnnotation: (speechId: string, annotation: CoachAnnotation) => void;
  updateTeamScore: (debaterId: string, scoreChange: number) => void;
  resetRoundState: () => void;
  trainingTasks: TrainingTask[];
  addTrainingTask: (task: TrainingTask) => void;
  addOrUpdateReplayTask: (speechId: string, taskData: Partial<TrainingTask>) => TrainingTask;
  updateTrainingTask: (taskId: string, updates: Partial<TrainingTask>) => void;
  addReplaySession: (taskId: string, session: ReplaySession) => void;
  startTask: (taskId: string) => void;
}

export const useDebateStore = create<DebateState>((set, get) => ({
  debates: mockDebates,
  currentDebate: currentDebate,
  selectedFormat: 'nsda',
  argumentCards: mockArgumentCards,
  danmakus: mockDanmakus,
  violations: mockViolations,
  highlights: [],
  scores: mockScores,
  speeches: [mockSpeech],
  isPaused: false,
  currentRoundIndex: 0,
  timeRemaining: 180,
  currentSpeaker: null,
  trainingTasks: [],

  addDebate: (debate) =>
    set((state) => ({
      debates: [debate, ...state.debates],
      currentDebate: debate,
    })),

  setCurrentDebate: (debate) => set({ currentDebate: debate }),
  setSelectedFormat: (format) => set({ selectedFormat: format }),

  addArgumentCard: (card) =>
    set((state) => ({ argumentCards: [...state.argumentCards, card] })),

  updateArgumentCard: (id, updates) =>
    set((state) => ({
      argumentCards: state.argumentCards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      ),
    })),

  deleteArgumentCard: (id) =>
    set((state) => ({
      argumentCards: state.argumentCards.filter((card) => card.id !== id),
    })),

  addDanmaku: (danmaku) =>
    set((state) => ({ danmakus: [...state.danmakus, danmaku] })),

  addViolation: (violation) =>
    set((state) => ({ violations: [...state.violations, violation] })),

  addHighlight: (highlight) =>
    set((state) => ({ highlights: [...state.highlights, highlight] })),

  addScore: (score) =>
    set((state) => ({ scores: [...state.scores, score] })),

  updateScore: (debaterId, value) =>
    set((state) => {
      const existingScore = state.scores.find((s) => s.debaterId === debaterId);
      if (existingScore) {
        return {
          scores: state.scores.map((score) =>
            score.debaterId === debaterId ? { ...score, total: value } : score
          ),
        };
      } else {
        const newScore: Score = {
          id: `score-${Date.now()}`,
          judgeId: 'judge-1',
          teamId: '',
          debaterId,
          content: value * 0.4,
          delivery: value * 0.3,
          strategy: value * 0.3,
          total: value,
        };
        return { scores: [...state.scores, newScore] };
      }
    }),

  setCurrentRoundIndex: (index) => set({ currentRoundIndex: index }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  setCurrentSpeaker: (speaker) =>
    set((state) => {
      const currentTeams = state.currentDebate.teams.map((team) => ({
        ...team,
        debaters: team.debaters.map((debater) => ({
          ...debater,
          isSpeaking: debater.id === speaker?.id,
        })),
      }));
      return {
        currentSpeaker: speaker,
        currentDebate: { ...state.currentDebate, teams: currentTeams },
      };
    }),

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setIsPaused: (paused) => set({ isPaused: paused }),

  resetRoundState: () =>
    set((state) => {
      const nextRoundIndex = state.currentRoundIndex;
      const nextRound = state.currentDebate.rounds[nextRoundIndex];
      const teamsWithNoSpeaking = state.currentDebate.teams.map((team) => ({
        ...team,
        debaters: team.debaters.map((d) => ({ ...d, isSpeaking: false })),
      }));
      return {
        isPaused: false,
        currentSpeaker: null,
        timeRemaining: nextRound?.duration || 180,
        currentDebate: { ...state.currentDebate, teams: teamsWithNoSpeaking },
      };
    }),

  addSpeech: (speech) =>
    set((state) => ({ speeches: [...state.speeches, speech] })),

  updateSpeechAnnotation: (speechId, annotation) =>
    set((state) => ({
      speeches: state.speeches.map((s) =>
        s.id === speechId ? { ...s, annotation, needsReplay: annotation.needsReplay } : s
      ),
    })),

  addTrainingTask: (task) =>
    set((state) => ({ trainingTasks: [...state.trainingTasks, task] })),

  addOrUpdateReplayTask: (speechId, taskData) => {
    const existing = get().trainingTasks.find((t) => t.relatedSpeechId === speechId);
    if (existing) {
      get().updateTrainingTask(existing.id, {
        ...taskData,
        status: taskData.status || existing.status,
        progress: taskData.status === 'pending' && existing.status === 'pending' ? existing.progress : (taskData.progress ?? existing.progress),
      });
      return { ...existing, ...taskData };
    } else {
      const newTask: TrainingTask = {
        id: `replay-${Date.now()}`,
        title: taskData.title || '回练任务',
        description: taskData.description || '',
        status: 'pending',
        deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        reward: 50,
        progress: 0,
        priority: 'medium',
        replaySessions: [],
        totalReplayCount: 0,
        targetReplayCount: 3,
        ...taskData,
        relatedSpeechId: speechId,
        replayCompleted: false,
      } as any;
      set((state) => ({ trainingTasks: [...state.trainingTasks, newTask] }));
      return newTask;
    }
  },

  addReplaySession: (taskId, session) =>
    set((state) => {
      const task = state.trainingTasks.find((t) => t.id === taskId);
      if (!task) return {};
      const sessions = [...(task.replaySessions || []), session];
      const newCount = sessions.length;
      const target = task.targetReplayCount || 3;
      const progress = Math.min(100, Math.round((newCount / target) * 100));
      return {
        trainingTasks: state.trainingTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                replaySessions: sessions,
                totalReplayCount: newCount,
                replayCompleted: newCount >= target,
                lastReplayAt: session.completedAt,
                nextSuggestedAt: new Date(Date.now() + 2 * 24 * 3600 * 1000),
                progress,
                status: newCount >= target ? 'completed' : (t.status === 'pending' ? 'in_progress' : t.status),
              }
            : t
        ),
      };
    }),

  startTask: (taskId) =>
    set((state) => ({
      trainingTasks: state.trainingTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'in_progress',
              progress: Math.max(t.progress, 10),
              startedAt: t.startedAt || new Date(),
            }
          : t
      ),
    })),

  updateTrainingTask: (taskId, updates) =>
    set((state) => ({
      trainingTasks: state.trainingTasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    })),

  updateTeamScore: (debaterId, scoreChange) =>
    set((state) => {
      const team = state.currentDebate.teams.find((t) =>
        t.debaters.some((d) => d.id === debaterId)
      );
      if (!team) return {};

      return {
        currentDebate: {
          ...state.currentDebate,
          teams: state.currentDebate.teams.map((t) =>
            t.id === team.id ? { ...t, score: t.score + scoreChange } : t
          ),
        },
      };
    }),
}));
