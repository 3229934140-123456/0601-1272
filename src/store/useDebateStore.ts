import { create } from 'zustand';
import type { Debate, Team, Round, ArgumentCard, Danmaku, Violation, Score, Speech, Highlight, Debater } from '../types';
import { currentDebate, mockArgumentCards, mockDanmakus, mockViolations, mockScores, mockSpeech } from '../data/mockDebates';

interface DebateState {
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
  addSpeech: (speech: Speech) => void;
  updateTeamScore: (debaterId: string, scoreChange: number) => void;
}

export const useDebateStore = create<DebateState>((set, get) => ({
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

  addSpeech: (speech) =>
    set((state) => ({ speeches: [...state.speeches, speech] })),

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
