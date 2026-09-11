'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CropId } from '@/types';

interface FarmerState {
  name: string;
  village: string;
  state: string;
  mainCrop: CropId;
  quantity: number;
  isComplete: boolean;
  setName: (name: string) => void;
  setVillage: (village: string) => void;
  setMainCrop: (crop: CropId) => void;
  setQuantity: (qty: number) => void;
  completeSetup: () => void;
}

export const useFarmerStore = create<FarmerState>()(
  persist(
    (set) => ({
      name: 'रमेश पाटील',
      village: 'नासिक',
      state: 'महाराष्ट्र',
      mainCrop: 'onion',
      quantity: 40,
      isComplete: false,

      setName: (name) => set({ name }),
      setVillage: (village) => set({ village }),
      setMainCrop: (mainCrop) => set({ mainCrop }),
      setQuantity: (quantity) => set({ quantity: Math.max(1, Math.min(1000, quantity)) }),
      completeSetup: () => set({ isComplete: true }),
    }),
    { name: 'farmo-farmer' },
  ),
);