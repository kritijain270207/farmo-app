import { delay } from '@/lib/utils';
import {
  buyers,
  demoMobileNumber,
  getMandis,
  getPriceTrend,
  getSellDecision,
  notifications,
} from './mock-data';
import type {
  Buyer,
  CropId,
  FarmNotification,
  Farmer,
  Mandi,
  SellDecision,
  TrendPoint,
} from '@/types';

/**
 * Service layer for Farmo.
 *
 * Current implementation is MOCK — every call runs against in-memory data
 * with a small artificial delay so loading states can be shown.
 *
 * When the FastAPI backend is ready, replace each method body with a
 * fetch() call against `NEXT_PUBLIC_API_URL`. Types are already aligned
 * with the expected backend contracts.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const farmerService = {
  async sendOtp(phone: string): Promise<{ sent: boolean; devOtp: string }> {
    void API_BASE;
    void phone;
    await delay(800);
    // In dev: accept any 10-digit number. OTP is a fixed test code.
    return { sent: true, devOtp: '123456' };
  },

  async verifyOtp(_phone: string, otp: string): Promise<Farmer> {
    void API_BASE;
    await delay(700);
    const valid = otp.length === 6 && /^\d+$/.test(otp);
    if (!valid) throw new Error('bad-otp');
    return {
      id: 'fm-88219',
      name: 'रमेश पाटील',
      phone: demoMobileNumber,
      village: 'नासिक',
      state: 'महाराष्ट्र',
      accountId: 'MH-NSK-88219',
      crops: ['onion', 'wheat', 'soybean'],
      quantity: 40,
    };
  },

  async getProfile(): Promise<Farmer | null> {
    void API_BASE;
    await delay(300);
    return null;
  },
};

export const marketService = {
  async getMandis(cropId: CropId): Promise<Mandi[]> {
    void API_BASE;
    void cropId;
    await delay(600);
    return getMandis();
  },

  async getSellDecision(cropId: CropId, quantity: number): Promise<SellDecision> {
    void API_BASE;
    await delay(900);
    return getSellDecision(cropId, quantity);
  },

  async getPriceTrend(cropId: CropId): Promise<TrendPoint[]> {
    void API_BASE;
    await delay(400);
    return getPriceTrend(cropId);
  },
};

export const buyerService = {
  async getBuyers(cropId: CropId): Promise<Buyer[]> {
    void API_BASE;
    void cropId;
    await delay(600);
    return buyers;
  },
};

export const notificationService = {
  async getNotifications(): Promise<FarmNotification[]> {
    void API_BASE;
    await delay(400);
    return notifications;
  },

  async markRead(_id: string): Promise<void> {
    void API_BASE;
    await delay(100);
  },
};

export const aiService = {
  /**
   * Mock conversational backend for AI Saathi.
   * Keyword-matched replies mimic what a Gemini endpoint would return.
   * Swap body with:
   *   POST {API_BASE}/api/ai/chat  { message, language, farmerContext }
   */
  async chat(message: string, context: { crop: CropId; quantity: number }): Promise<string> {
    void API_BASE;
    await delay(1200);
    const q = message.toLowerCase();
    const d = getSellDecision(context.crop, context.quantity);
    const mandiShort = d.mandi.name.split(' /')[0];

    if (q.includes('भाव') || q.includes('price') || q.includes('क्या') || q.includes('keya')) {
      return `आज ${d.crop.names.hi} का भाव ${mandiShort} में ₹${d.mandi.marketPrice}/Qtl है। बेचने पर हाथ में ₹${d.netAmount}/Qtl मिलेगा।`;
    }
    if (q.includes('कहां') || q.includes('kahan') || q.includes('where')) {
      return `सबसे अच्छी कमाई आपको ${mandiShort} में मिलेगी — ₹${d.netAmount}/Qtl हाथ में, ${d.mandi.distanceKm} किमी दूर। मंडी तुलना में देखें।`;
    }
    if (q.includes('बेचूं') || q.includes('रुकूं') || q.includes('sell') || q.includes('wait')) {
      return d.decision === 'sell_now'
        ? `मेरी सलाह: आज ही बेचें। ₹${d.netAmount}/Qtl मिल रहा है और आने वाले दिनों में भाव गिर सकता है।`
        : `मेरी सलाह: कुछ दिन रुकें। अभी भाव स्थिर है, सरकारी खरीद खुलने का इंतज़ार करें।`;
    }
    if (q.includes('क्विंटल') || q.includes('कितना')) {
      return `आपके ${context.quantity} क्विंटल ${d.crop.names.hi} पर कुल ₹${d.totalNet} मिल सकते हैं। क्या आप मंडी तुलना देखना चाहेंगे?`;
    }
    return `समझ गया। मैं आपकी ${context.quantity} क्विंटल ${d.crop.names.hi} के लिए सबसे अच्छा सौदा ढूंढने में मदद कर सकता हूं। कहें "कहां बेचूं?"`;
  },
};