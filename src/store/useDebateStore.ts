import { create } from 'zustand';
import type { Debate, Team, Round, ArgumentCard, Danmaku, Violation, Score, Speech, Highlight, Debater, CoachAnnotation, TrainingTask } from '../types';
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
  updateTrainingTask: (taskId: string, updates: Partial<TrainingTask>) => void;
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
