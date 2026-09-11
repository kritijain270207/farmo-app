'use client';

import { create } from 'zustand';

interface UiState {
  voiceOpen: boolean;
  setVoiceOpen: (open: boolean) => void;
}

/** Global UI shell state — lets any page open the voice drawer. */
export const useUiStore = create<UiState>((set) => ({
  voiceOpen: false,
  setVoiceOpen: (voiceOpen) => set({ voiceOpen }),
}));