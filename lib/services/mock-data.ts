import type {
  Buyer,
  Crop,
  CropId,
  FarmNotification,
  Mandi,
  SellDecision,
  TrendPoint,
} from '@/types';

export const crops: Crop[] = [
  { id: 'onion', emoji: '🧅', names: { hi: 'प्याज़', mr: 'कांदा', en: 'Onion', te: 'ఉల్లి', kn: 'ಈರುಳ್ಳಿ', ta: 'வெங்காயம்', bn: 'পেঁয়াজ', or: 'ପିଆଜ', gu: 'ડુંગળી', as: 'পিয়াজ' } },
  { id: 'wheat', emoji: '🌾', names: { hi: 'गेहूं', mr: 'गहू', en: 'Wheat', te: 'గోధుమ', kn: 'ಗೋಧಿ', ta: 'கோதுமை', bn: 'গম', or: 'ଗହମ', gu: 'ઘઉં', as: 'গম' } },
  { id: 'soybean', emoji: '🌱', names: { hi: 'सोयाबीन', mr: 'सोयाबीन', en: 'Soybean', te: 'సోయా', kn: 'ಸೋಯಾಬೀನ್', ta: 'சோயா', bn: 'সয়াবিন', or: 'ସୋୟାବିନ୍', gu: 'સોયાબીન', as: 'সয়াবিন' } },
  { id: 'chili', emoji: '🌶️', names: { hi: 'मिर्च', mr: 'मिरची', en: 'Chili', te: 'మిరప', kn: 'ಮೆಣಸಿನಕಾಯಿ', ta: 'மிளகாய்', bn: 'লঙ্কা', or: 'ଲଙ୍କା', gu: 'મરચું', as: 'জালুক' } },
  { id: 'tomato', emoji: '🍅', names: { hi: 'टमाटर', mr: 'टोमॅटो', en: 'Tomato', te: 'టమాట', kn: 'ಟೊಮೇಟೊ', ta: 'தக்காளி', bn: 'টমেটো', or: 'ଟମାଟୋ', gu: 'ટમેટું', as: 'বিলাহী' } },
  { id: 'peanut', emoji: '🥜', names: { hi: 'मूंगफली', mr: 'शेंगदाणा', en: 'Peanut', te: 'వేరుశెనగ', kn: 'ಕಡಲೆಕಾಯಿ', ta: 'நிலக்கடலை', bn: 'চিনাবাদাম', or: 'ଚିନାବାଦାମ', gu: 'મગફળી', as: 'চিনাবাদাম' } },
  { id: 'cotton', emoji: '☁️', names: { hi: 'कपास', mr: 'कापूस', en: 'Cotton', te: 'పత్తి', kn: 'ಹತ್ತಿ', ta: 'பருத்தி', bn: 'তুলা', or: 'ତୁଳା', gu: 'કપાસ', as: 'কপাহ' } },
  { id: 'rice', emoji: '🍚', names: { hi: 'चावल', mr: 'तांदूळ', en: 'Rice', te: 'వరి', kn: 'ಅಕ್ಕಿ', ta: 'நெல்', bn: 'ধান', or: 'ଧାନ', gu: 'ચોખા', as: 'ধান' } },
];

export function getCrop(id: CropId): Crop {
  return crops.find((c) => c.id === id) ?? crops[0];
}

/** Mandi comparison for a crop — already ranked by net in-hand. */
const baseMandis: Omit<Mandi, 'netInHand'>[] = [
  {
    id: 'lasalgaon',
    name: 'लासलगांव APMC / Lasalgaon APMC',
    distanceKm: 12,
    minutes: 28,
    marketPrice: 10000,
    transportCost: 150,
    mandiCharges: 150,
    arrivalToday: 34200,
    isRecommended: true,
    rank: 1,
    priceChange: 180,
  },
  {
    id: 'pimpalgaon',
    name: 'पिंपलगांव APMC / Pimpalgaon',
    distanceKm: 20,
    minutes: 40,
    marketPrice: 9650,
    transportCost: 120,
    mandiCharges: 180,
    arrivalToday: 12800,
    isRecommended: false,
    rank: 2,
    priceChange: 90,
  },
  {
    id: 'nashik',
    name: 'नाशिक मुख्य यार्ड / Nashik Main Yard',
    distanceKm: 10,
    minutes: 24,
    marketPrice: 9100,
    transportCost: 100,
    mandiCharges: 200,
    arrivalToday: 22100,
    isRecommended: false,
    rank: 3,
    priceChange: -50,
  },
  {
    id: 'dindori',
    name: 'डिंडोरी / Dindori',
    distanceKm: 35,
    minutes: 65,
    marketPrice: 9300,
    transportCost: 180,
    mandiCharges: 150,
    arrivalToday: 5600,
    isRecommended: false,
    rank: 4,
    priceChange: 40,
  },
];

export function getMandis(): Mandi[] {
  return baseMandis.map((m) => ({
    ...m,
    netInHand: m.marketPrice - m.transportCost - m.mandiCharges,
  }));
}

export function getRecommendedMandi(): Mandi {
  return getMandis().find((m) => m.isRecommended) ?? getMandis()[0];
}

/** Build a full sell decision for a crop + quantity. */
export function getSellDecision(cropId: CropId, quantity: number): SellDecision {
  const crop = getCrop(cropId);
  const mandi = getRecommendedMandi();

  const reasons =
    cropId === 'onion'
      ? [
          'आज का भाव सप्ताह के उच्चतम स्तर पर है।',
          'अगले 3 दिनों में आवक बढ़ने से भाव गिरने की संभावना है।',
          'निर्यातकों की मांग आज बहुत अच्छी है।',
          'पास की मंडी में परिवहन खर्च कम है।',
        ]
      : cropId === 'wheat'
        ? [
            'भाव स्थिर है और MSP समर्थन मजबूत है।',
            'सरकारी खरीद खुलते ही स्थिर भाव की उम्मीद है।',
            'गोदाम भंडारण से सड़न का जोखिम कम है।',
          ]
        : [
            'आज का भाव पिछले सप्ताह से बेहतर है।',
            'बाज़ार में मांग स्थिर बनी हुई है।',
            'पास की मंडी में बेहतर कमाई मिल रही है।',
          ];

  return {
    crop,
    quantity,
    decision: cropId === 'wheat' ? 'wait' : 'sell_now',
    mandi,
    cropValue: mandi.marketPrice,
    transportCost: mandi.transportCost,
    mandiCharges: mandi.mandiCharges,
    netAmount: mandi.netInHand,
    totalNet: mandi.netInHand * quantity,
    reasons,
  };
}

export function getPriceTrend(cropId: CropId): TrendPoint[] {
  const base = cropId === 'onion' ? 1900 : cropId === 'wheat' ? 2450 : 4800;
  const mk = (day: string, i: number, change: number) => ({
    day,
    value: base + Math.round(change * ((i * (1 + (cropId === 'onion' ? 10 : 3))) / 6)),
  });
  return [
    mk('S', 0, 0),
    mk('M', 1, 50),
    mk('T', 2, 80),
    mk('W', 3, 120),
    mk('Th', 4, 100),
    mk('F', 5, 140),
    mk('Today', 6, 200),
  ];
}

export const buyers: Buyer[] = [
  {
    id: 'abc-foods',
    name: 'ABC Foods',
    type: 'food_processor',
    typeKey: 'food_processor',
    distanceKm: 18,
    requiredQty: 20,
    offeredPrice: 2150,
    verified: true,
    phone: '1800-202-4455',
  },
  {
    id: 'gulf-export',
    name: 'Gulf Exports Ltd.',
    type: 'exporter',
    typeKey: 'exporter',
    distanceKm: 34,
    requiredQty: 60,
    offeredPrice: 2080,
    verified: true,
    phone: '1800-202-7788',
  },
  {
    id: 'malegaon-fpo',
    name: 'Malegaon FPO',
    type: 'fpo',
    typeKey: 'fpo',
    distanceKm: 9,
    requiredQty: 15,
    offeredPrice: 2025,
    verified: true,
    phone: '1800-202-1122',
  },
  {
    id: 'nashik-reta',
    name: 'Nashik Fresh Retail',
    type: 'retailer',
    typeKey: 'retailer',
    distanceKm: 6,
    requiredQty: 8,
    offeredPrice: 1950,
    verified: false,
    phone: '1800-202-9900',
  },
];

export const notifications: FarmNotification[] = [
  {
    id: 'n1',
    type: 'price_up',
    tone: 'up',
    title: 'प्याज़ का भाव ₹120 बढ़ा',
    body: 'लासलगांव में आज प्याज़ ₹2,100/Qtl पर है। बेचने का यह सही समय है।',
    timeKey: '2 min ago',
    actionKey: 'देखें',
  },
  {
    id: 'n2',
    type: 'forecast',
    tone: 'warn',
    title: '3 दिन में भाव गिर सकता है',
    body: 'मध्य प्रदेश से आवक बढ़ने से भाव में 12% तक गिरावट की संभावना है।',
    timeKey: '1 hr ago',
    actionKey: 'क्यों?',
  },
  {
    id: 'n3',
    type: 'weather',
    tone: 'info',
    title: 'बारिश से परिवहन प्रभावित हो सकता है',
    body: 'कल सुबह हल्की बारिश की संभावना है। मंडी जाने का कार्यक्रम पहले करें।',
    timeKey: '3 hrs ago',
  },
  {
    id: 'n4',
    type: 'price_down',
    tone: 'down',
    title: 'नाशिक मंडी में आवक बहुत ज्यादा',
    body: 'नाशिक यार्ड में आज आवक 22,100 कट्टे है। भाव दबाव में रह सकता है।',
    timeKey: '5 hrs ago',
    actionKey: 'तुलना देखें',
  },
];

export const demoMobileNumber = '9876543210';