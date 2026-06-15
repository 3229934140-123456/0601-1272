import { create } from 'zustand';
import type { Debater, Statistics, Badge, TrainingTask } from '../types';
import { currentUser } from '../data/mockDebaters';
import { mockStatistics, mockTrainingTasks } from '../data/mockStatistics';
import { mockBadges } from '../data/mockBadges';

interface UserState {
  currentUser: Debater;
  statistics: Statistics;
  badges: Badge[];
  trainingTasks: TrainingTask[];
  userRole: 'debater' | 'judge' | 'coach' | 'audience';
  setCurrentUser: (user: Debater) => void;
  setUserRole: (role: 'debater' | 'judge' | 'coach' | 'audience') => void;
  updateStatistics: (updates: Partial<Statistics>) => void;
  unlockBadge: (badgeId: string) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  completeTask: (taskId: string) => void;
  addTask: (task: TrainingTask) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: currentUser,
  statistics: mockStatistics,
  badges: mockBadges,
  trainingTasks: mockTrainingTasks,
  userRole: 'debater',

  setCurrentUser: (user) => set({ currentUser: user }),
  setUserRole: (role) => set({ userRole: role }),

  updateStatistics: (updates) =>
    set((state) => ({
      statistics: { ...state.statistics, ...updates },
    })),

  unlockBadge: (badgeId) =>
    set((state) => ({
      badges: state.badges.map((badge) =>
        badge.id === badgeId
          ? { ...badge, unlocked: true, unlockedAt: new Date() }
          : badge
      ),
    })),

  updateTaskProgress: (taskId, progress) =>
    set((state) => ({
      trainingTasks: state.trainingTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              progress: Math.min(100, Math.max(0, progress)),
              status: progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending',
            }
          : task
      ),
    })),

  completeTask: (taskId) =>
    set((state) => ({
      trainingTasks: state.trainingTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: 'completed', progress: 100 }
          : task
      ),
    })),

  addTask: (task) =>
    set((state) => ({ trainingTasks: [...state.trainingTasks, task] })),
}));
