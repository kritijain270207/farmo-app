import { delay, API_BASE } from '@/lib/utils';
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
 * Calls the FastAPI backend at NEXT_PUBLIC_API_URL.
 * Falls back to mock data if the backend is unavailable.
 */

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// ── Farmer / Auth ──

export const farmerService = {
  async sendOtp(phone: string): Promise<{ sent: boolean; devOtp: string }> {
    try {
      return await apiFetch('/api/farmer/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
    } catch {
      await delay(800);
      return { sent: true, devOtp: '123456' };
    }
  },

  async verifyOtp(_phone: string, otp: string): Promise<Farmer> {
    try {
      return await apiFetch('/api/farmer/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone: _phone, otp }),
      });
    } catch {
      await delay(700);
      const valid = otp.length === 6 && /^\d+$/.test(otp);
      if (!valid) throw new Error('bad-otp');
      return {
        id: 'fm-88219',
        name: 'रमेश पाटील',
        phone: '9876543210',
        village: 'नासिक',
        state: 'महाराष्ट्र',
        accountId: 'MH-NSK-88219',
        crops: ['onion', 'wheat', 'soybean'],
        quantity: 40,
      };
    }
  },

  async getProfile(): Promise<Farmer | null> {
    try {
      return await apiFetch('/api/farmer/profile');
    } catch {
      return null;
    }
  },
};

// ── Market ──

export const marketService = {
  async getMandis(cropId: CropId): Promise<Mandi[]> {
    try {
      return await apiFetch(`/api/market/mandis?crop=${cropId}`);
    } catch {
      await delay(600);
      const { getMandis } = await import('./mock-data');
      return getMandis();
    }
  },

  async getSellDecision(cropId: CropId, quantity: number): Promise<SellDecision> {
    try {
      return await apiFetch(`/api/market/sell-decision?crop=${cropId}&quantity=${quantity}`);
    } catch {
      await delay(900);
      const { getSellDecision } = await import('./mock-data');
      return getSellDecision(cropId, quantity);
    }
  },

  async getPriceTrend(cropId: CropId): Promise<TrendPoint[]> {
    try {
      return await apiFetch(`/api/market/price-trend?crop=${cropId}`);
    } catch {
      await delay(400);
      const { getPriceTrend } = await import('./mock-data');
      return getPriceTrend(cropId);
    }
  },
};

// ── Buyers ──

export const buyerService = {
  async getBuyers(cropId: CropId): Promise<Buyer[]> {
    try {
      return await apiFetch(`/api/buyers?crop=${cropId}`);
    } catch {
      await delay(600);
      const { buyers } = await import('./mock-data');
      return buyers;
    }
  },
};

// ── Notifications ──

export const notificationService = {
  async getNotifications(): Promise<FarmNotification[]> {
    try {
      return await apiFetch('/api/notifications');
    } catch {
      await delay(400);
      const { notifications } = await import('./mock-data');
      return notifications;
    }
  },

  async markRead(_id: string): Promise<void> {
    await delay(100);
  },
};

// ── AI Saathi ──

export const aiService = {
  async chat(message: string, context: { crop: CropId; quantity: number }): Promise<string> {
    try {
      const result = await apiFetch<{ reply: string }>('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          language: 'hi',
          farmerContext: context,
        }),
      });
      return result.reply;
    } catch {
      await delay(1200);
      const q = message.toLowerCase();
      const { getSellDecision } = await import('./mock-data');
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
    }
  },
};
