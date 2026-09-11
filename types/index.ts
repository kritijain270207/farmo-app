export type CropId =
  | 'onion'
  | 'wheat'
  | 'soybean'
  | 'chili'
  | 'tomato'
  | 'peanut'
  | 'cotton'
  | 'rice';

export type DecisionType = 'sell_now' | 'wait' | 'divert';

export type VehicleType = 'tata_ace' | 'pickup' | 'truck_10';

export interface Crop {
  id: CropId;
  emoji: string;
  names: Partial<Record<string, string>>;
}

export interface Mandi {
  id: string;
  name: string;
  distanceKm: number;
  minutes: number;
  /** Market price ₹ / quintal */
  marketPrice: number;
  /** Transport + labour ₹ / quintal */
  transportCost: number;
  /** Total mandi charges ₹ / quintal */
  mandiCharges: number;
  /** Net in-hand ₹ / quintal */
  netInHand: number;
  arrivalToday: number;
  isRecommended: boolean;
  rank: number;
  priceChange: number;
}

export interface Vehicle {
  id: VehicleType;
  emoji: string;
  labelKey: string;
  capacityQtl: number;
  costPerKm: number;
}

export interface SellDecision {
  crop: Crop;
  quantity: number;
  decision: DecisionType;
  mandi: Mandi;
  cropValue: number;
  transportCost: number;
  mandiCharges: number;
  netAmount: number;
  totalNet: number;
  reasons: string[];
}

export type BuyerType =
  | 'food_processor'
  | 'exporter'
  | 'retailer'
  | 'fpo'
  | 'cooperative';

export interface Buyer {
  id: string;
  name: string;
  type: BuyerType;
  typeKey: string;
  distanceKm: number;
  requiredQty: number;
  offeredPrice: number;
  verified: boolean;
  phone: string;
}

export type NotificationType =
  | 'price_up'
  | 'price_down'
  | 'forecast'
  | 'weather'
  | 'buyer'
  | 'system';

export interface FarmNotification {
  id: string;
  type: NotificationType;
  tone: 'up' | 'down' | 'warn' | 'info';
  title: string;
  body: string;
  timeKey: string;
  actionKey?: string;
}

export interface TrendPoint {
  day: string;
  value: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  state: string;
  accountId: string;
  crops: CropId[];
  quantity: number;
}

export type VoiceStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';