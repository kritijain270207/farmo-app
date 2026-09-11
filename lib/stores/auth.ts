'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { farmerService } from '@/lib/services';
import type { Farmer } from '@/types';

type AuthStatus = 'unauthenticated' | 'otp-sent' | 'authenticated';

interface AuthState {
  status: AuthStatus;
  phone: string | null;
  farmer: Farmer | null;
  devOtp: string | null;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  skipSetup: (farmer: Farmer) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: 'unauthenticated',
      phone: null,
      farmer: null,
      devOtp: null,

      sendOtp: async (phone) => {
        const res = await farmerService.sendOtp(phone);
        set({ status: 'otp-sent', phone, devOtp: res.devOtp });
        return res.sent;
      },

      verifyOtp: async (otp) => {
        const phone = useAuthStore.getState().phone;
        if (!phone) return false;
        try {
          const farmer = await farmerService.verifyOtp(phone, otp);
          set({ status: 'authenticated', farmer, devOtp: null });
          return true;
        } catch {
          return false;
        }
      },

      skipSetup: (farmer) => {
        set({ status: 'authenticated', farmer });
      },

      logout: () => {
        set({ status: 'unauthenticated', phone: null, farmer: null, devOtp: null });
      },
    }),
    { name: 'farmo-auth' },
  ),
);