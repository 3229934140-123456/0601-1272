import { create } from 'zustand';
import type { PageType } from '../types';

interface UiState {
  currentPage: PageType;
  showDanmaku: boolean;
  showTimer: boolean;
  isFullscreen: boolean;
  theme: 'dark' | 'light';
  modalType: string | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  setCurrentPage: (page: PageType) => void;
  toggleDanmaku: () => void;
  toggleTimer: () => void;
  toggleFullscreen: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  openModal: (type: string) => void;
  closeModal: () => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentPage: 'lobby',
  showDanmaku: true,
  showTimer: true,
  isFullscreen: false,
  theme: 'dark',
  modalType: null,
  notification: null,

  setCurrentPage: (page) => set({ currentPage: page }),
  toggleDanmaku: () => set((state) => ({ showDanmaku: !state.showDanmaku })),
  toggleTimer: () => set((state) => ({ showTimer: !state.showTimer })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setTheme: (theme) => set({ theme }),
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
  showNotification: (message, type) => set({ notification: { message, type } }),
  hideNotification: () => set({ notification: null }),
}));
