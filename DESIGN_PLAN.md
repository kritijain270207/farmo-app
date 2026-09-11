# Farmo — Complete Implementation Plan

## 1. Architecture Overview

```
Next.js 14+ (App Router) + TypeScript (strict) + Tailwind CSS
├── Frontend: All 10 screens, 18+ components, i18n, voice UI
├── Service Layer: Mock API services (swap to real FastAPI later)
├── State: React Context (auth, language, farmer profile)
└── Voice: Web Speech API (browser) + Gemini backend (pluggable)
```

### Key Decisions
- **App Router** (not Pages Router) — for nested layouts, server components, streaming
- **no SSR on app shell** — farmer-facing app, auth-gated, all client components
- **Zustand** for global state (auth, language, farmer profile, voice) — lighter than Redux
- **next-intl** for i18n — type-safe, supports 10 languages, works with App Router
- **Mock services first** — clean abstraction layer to swap to real FastAPI later

---

## 2. Project Structure

```
farmo/
├── app/
│   ├── [locale]/                    # next-intl locale routing
│   │   ├── layout.tsx               # Root layout: fonts, providers, shell
│   │   ├── page.tsx                 # Redirect to /welcome
│   │   ├── welcome/
│   │   │   └── page.tsx             # Screen 1: Welcome + Language
│   │   ├── login/
│   │   │   └── page.tsx             # Screen 2: OTP Login
│   │   ├── setup/
│   │   │   └── page.tsx             # Screen 3: Farmer Setup
│   │   ├── (dashboard)/             # Protected layout group
│   │   │   ├── layout.tsx           # Dashboard layout: header + bottom nav
│   │   │   ├── page.tsx             # Screen 4: Home / Kisan Hub
│   │   │   ├── sell/
│   │   │   │   └── page.tsx         # Screen 5: Sell Decision
│   │   │   ├── markets/
│   │   │   │   └── page.tsx         # Screen 6: Market Comparison
│   │   │   ├── saathi/
│   │   │   │   └── page.tsx         # Screen 7: AI Saathi
│   │   │   ├── buyers/
│   │   │   │   └── page.tsx         # Screen 8: Buyers
│   │   │   ├── notifications/
│   │   │   │   └── page.tsx         # Screen 9: Notifications
│   │   │   └── profile/
│   │   │       └── page.tsx         # Screen 10: Profile
│   │   └── not-found.tsx
│   └── api/                          # (Future: proxy to FastAPI)
├── components/
│   ├── ui/                           # Atomic design system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Pill.tsx
│   │   ├── Icon.tsx
│   │   ├── Modal.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   ├── BottomNav.tsx
│   │   ├── DesktopSidebar.tsx
│   │   ├── AppShell.tsx
│   │   └── PageContainer.tsx
│   ├── farmer/
│   │   ├── LanguageCard.tsx
│   │   ├── CropCard.tsx
│   │   ├── WeatherCard.tsx
│   │   └── FarmerProfileCard.tsx
│   ├── market/
│   │   ├── RecommendationCard.tsx   # Hero Brahmastra
│   │   ├── MandiCard.tsx
│   │   ├── PriceCard.tsx
│   │   ├── ProfitBreakdown.tsx
│   │   ├── SimplePriceChart.tsx
│   │   └── StatusBadge.tsx
│   ├── ai/
│   │   ├── VoiceButton.tsx
│   │   ├── VoiceAssistantDrawer.tsx
│   │   ├── ChatBubble.tsx
│   │   └── SuggestionChips.tsx
│   ├── buyer/
│   │   └── BuyerCard.tsx
│   └── notification/
│       └── AlertCard.tsx
├── lib/
│   ├── i18n/
│   │   ├── request.ts               # next-intl server config
│   │   └── navigation.ts            # typed navigation helpers
│   ├── services/
│   │   ├── api.ts                   # API client (axios/fetch wrapper)
│   │   ├── farmer.service.ts
│   │   ├── market.service.ts
│   │   ├── buyer.service.ts
│   │   ├── notification.service.ts
│   │   └── ai.service.ts
│   ├── stores/
│   │   ├── auth.store.ts            # Zustand: auth state
│   │   ├── language.store.ts        # Zustand: language preference
│   │   └── farmer.store.ts          # Zustand: farmer profile
│   ├── hooks/
│   │   ├── useVoice.ts              # Web Speech API hook
│   │   ├── useMediaQuery.ts
│   │   └── useGeolocation.ts
│   └── utils/
│       ├── currency.ts              # ₹ formatting
│       ├── distance.ts              # km formatting
│       └── speech.ts                # Speech synthesis helpers
├── messages/
│   ├── en.json
│   ├── hi.json                      # Hindi (primary)
│   ├── mr.json                      # Marathi
│   ├── te.json                      # Telugu
│   ├── kn.json                      # Kannada
│   ├── ta.json                      # Tamil
│   ├── bn.json                      # Bengali
│   ├── or.json                      # Odia
│   ├── gu.json                      # Gujarati
│   └── as.json                      # Assamese
├── types/
│   ├── farmer.ts
│   ├── market.ts
│   ├── crop.ts
│   ├── mandi.ts
│   ├── buyer.ts
│   └── notification.ts
├── tailwind.config.ts
├── next.config.mjs
├── middleware.ts                      # i18n routing + auth guard
└── tsconfig.json
```

---

## 3. Design Token System (from DESIGN.md → Tailwind)

### Colors (tailwind.config.ts)

```typescript
colors: {
  // Core brand
  primary:        '#1E3B2B',   // Deep Forest Green
  'on-primary':   '#FFFFFF',
  'primary-container': '#1E3B2B',
  'on-primary-container': '#85A590',

  // Secondary / Harvest gold
  secondary:      '#F59E0B',   // Golden Ochre
  'on-secondary': '#1E3B2B',
  'secondary-container': '#FEA619',
  'on-secondary-container': '#684000',

  // Tertiary / Growth
  tertiary:       '#22C55E',   // Success Green
  'on-tertiary':  '#FFFFFF',
  'tertiary-container': '#003F18',
  'on-tertiary-container': '#00B753',

  // Danger / Alert
  error:          '#EF4444',
  'on-error':     '#FFFFFF',
  'error-container': '#FFDAD6',
  'on-error-container': '#93000A',

  // Surfaces
  background:     '#F9FAF6',   // Natural Off-White
  'on-background':'#141E17',
  surface:        '#F1FCF2',
  'on-surface':   '#141E17',
  'on-surface-variant': '#424843',

  // Card surfaces
  'surface-container-lowest': '#FFFFFF',
  'surface-container-low': '#EBF7EC',
  'surface-container': '#E6F1E6',
  'surface-container-high': '#E0EBE1',
  'surface-container-highest': '#DAE5DB',

  // Structural
  outline:        '#727973',
  'outline-variant': '#C2C8C1',

  // Price status
  'price-up':     '#15803D',   // Green uptick text
  'price-up-bg':  '#DCFCE7',   // Green uptick bg
  'price-down':   '#B91C1C',   // Red downtick text
  'price-down-bg':'#FEE2E2',   // Red downtick bg
  'price-stable': '#B45309',   // MSP/Stable text
  'price-stable-bg': '#FEF3C7' // MSP/Stable bg
}
```

### Typography Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| display-lg | 40px | 700 | 48px | Desktop hero |
| display-lg-mobile | 32px | 700 | 40px | Mobile hero |
| headline-lg | 30px | 600 | 38px | Section headers |
| headline-lg-mobile | 24px | 600 | 32px | Mobile section headers |
| headline-md | 22px | 600 | 28px | Card titles |
| headline-sm | 18px | 600 | 24px | Sub-card titles |
| price-hero | 36px | 700 | 44px | ₹9,700 hero prices |
| body-lg | 18px | 400 | 26px | Long descriptions |
| body-md | 16px | 400 | 24px | Default body |
| body-sm | 14px | 500 | 20px | Supporting text |
| label-lg | 16px | 600 | 20px | Button labels |
| label-md | 14px | 600 | 18px | Card labels |
| label-sm | 12px | 700 | 16px | Badges, pills |

**Font Stack:**
```css
font-family: 'Outfit', 'Tiro Devanagari Hindi', 'Noto Sans Telugu', /* ...Indic scripts... */
```
- Latin + Numerals: **Outfit**
- Hindi/Marathi Devanagari: **Tiro Devanagari Hindi**
- Other Indic: appropriate Noto/Tiro fonts
- Line-height multiplier 1.15x for Devanagari text

---

## 4. Routing & Screen Architecture

### Route Map

| Screen | Route | Auth | Layout |
|--------|-------|------|--------|
| Welcome + Language | `/[locale]/welcome` | No | Full-screen (no header/nav) |
| OTP Login | `/[locale]/login` | No | Full-screen |
| Farmer Setup | `/[locale]/setup` | Partial | Minimal header |
| Home / Kisan Hub | `/[locale]/` | Yes | Dashboard (header + bottom nav) |
| Sell Decision | `/[locale]/sell` | Yes | Dashboard |
| Market Comparison | `/[locale]/markets` | Yes | Dashboard |
| AI Saathi | `/[locale]/saathi` | Yes | Dashboard |
| Buyers | `/[locale]/buyers` | Yes | Dashboard |
| Notifications | `/[locale]/notifications` | Yes | Dashboard |
| Profile | `/[locale]/profile` | Yes | Dashboard |

### Auth Flow
```
Welcome → Login (OTP) → Setup → Dashboard
                                 ↑
                          Bottom Nav (5 tabs)
```

### Dashboard Bottom Navigation
```
🏠 Home  |  📍 Markets  |  🎙️ Saathi  |  👥 Buyers  |  👤 Profile
```
- Bell icon in AppHeader for notifications
- AI Saathi FAB (floating action button) as alternative entry on all screens

---

## 5. i18n System (next-intl)

### Supported Languages

| Code | Language | Font | RTL |
|------|----------|------|-----|
| en | English | Outfit | No |
| hi | Hindi | Tiro Devanagari Hindi | No |
| mr | Marathi | Tiro Devanagari Marathi | No |
| te | Telugu | Noto Sans Telugu | No |
| kn | Kannada | Noto Sans Kannada | No |
| ta | Tamil | Noto Sans Tamil | No |
| bn | Bengali | Noto Sans Bengali | No |
| or | Odia | Noto Sans Odia | No |
| gu | Gujarati | Noto Sans Gujarati | No |
| as | Assamese | Noto Sans Bengali (shared) | No |

### Translation Keys Structure
```json
{
  "common": {
    "appName": "Farmo",
    "tagline": "A Brahmastra for Farmers",
    "sellNow": "SELL NOW",
    "wait": "WAIT",
    "divert": "TRY ANOTHER MARKET",
    "currency": "₹",
    "perQuintal": "/Qtl",
    "perQuintalHi": "/क्विंटल",
    "kilometer": "km",
    "minutes": "min"
  },
  "welcome": {
    "greeting": "Welcome to Farmo",
    "selectLanguage": "Choose your language",
    "proceed": "Proceed",
    "proceedHi": "आगे बढ़ें"
  },
  "login": {
    "enterPhone": "Enter your mobile number",
    "enterPhoneHi": "अपना मोबाइल नंबर डालें",
    "sendOtp": "Send OTP",
    "sendOtpHi": "OTP भेजें",
    "enterOtp": "Enter OTP",
    "enterOtpHi": "OTP दर्ज करें",
    "resendOtp": "Resend OTP"
  },
  "setup": {
    "name": "Your name",
    "village": "Village / Location",
    "mainCrop": "Main crop",
    "quantity": "Approximate quantity",
    "proceed": "Start using Farmo"
  },
  "home": {
    "greeting": "Hello {name} ji",
    "greetingHi": "नमस्ते {name} जी",
    "weatherOk": "Weather is good to go to mandi",
    "weatherOkHi": "आज मंडी जाने के लिए मौसम ठीक है",
    "brahmastraDecision": "Today's Brahmastra Decision",
    "sellNowReason": "Today's price is good and expected to fall in coming days",
    "netAmount": "Expected net amount",
    "sellHow": "See how to sell",
    "why": "Why?",
    "myCrops": "My Crops",
    "quickActions": "Quick Farmer Services",
    "askFarmo": "Ask Farmo",
    "checkMarkets": "Check Markets",
    "findBuyers": "Find Buyers",
    "alerts": "Alerts"
  },
  "sell": {
    "title": "Sell Decision",
    "reasons": "3 simple reasons",
    "expectedReturn": "Expected return",
    "cropValue": "Crop value",
    "transport": "Transport",
    "mandiCharges": "Mandi charges",
    "netInHand": "Net in-hand",
    "chooseMandi": "Choose mandi",
    "seeOtherMandi": "See other mandis"
  },
  "markets": {
    "title": "Where to sell?",
    "bestProfit": "Best Profit",
    "nearest": "Nearest",
    "lowestTransport": "Lowest Transport",
    "expectedNet": "Expected net",
    "transportCost": "Transport cost",
    "mandiPrice": "Mandi price",
    "mandiCharges": "Mandi charges",
    "vehicleSelection": "Select vehicle",
    "sharedTransport": "Save ₹{amount} with shared transport"
  },
  "saathi": {
    "title": "AI Saathi",
    "askMe": "Ask me, I'll help",
    "suggestions": {
      "price": "What's the price today?",
      "where": "Where should I sell?",
      "sellNow": "Should I sell now or wait?",
      "quantity": "I have {qty} quintals"
    }
  },
  "buyers": {
    "title": "Who wants to buy your crop?",
    "call": "Call",
    "details": "View details",
    "verified": "Verified",
    "needsQty": "Needs {qty} Qtl"
  },
  "notifications": {
    "priceUp": "{crop} price increased by ₹{amount}",
    "priceAlert": "Price may increase in {days} days",
    "highArrival": "Very high arrivals at {mandi} today",
    "weatherImpact": "Weather may affect transport"
  },
  "profile": {
    "myCrops": "My crops",
    "changeLanguage": "Change language",
    "notificationSettings": "Notification settings",
    "help": "Help",
    "contactSupport": "Contact support"
  }
}
```

---

## 6. Component Specifications

### Component → HTML Mapping

| Component | From HTML Section | Reusable In |
|-----------|-------------------|-------------|
| `LanguageCard` | Welcome grid items | Screen 1 |
| `PrimaryButton` | All CTAs (h-14, bg-primary) | Everywhere |
| `VoiceButton` | `mainVoiceTrigger` (huge mic) | Home, AI Saathi |
| `CropCard` | Tracked Crops cards | Home, Markets |
| `RecommendationCard` | Hero Brahmastra section | Home |
| `PriceCard` | Price display in crop cards | Home, Markets |
| `MarketCard` | Mandi selection cards | Markets |
| `ProfitBreakdown` | Right panel ₹9,700 breakdown | Sell, Markets |
| `WeatherCard` | Weather bar in welcome | Home |
| `BuyerCard` | Buyer listing cards | Buyers |
| `AlertCard` | Notification items | Notifications |
| `BottomNavigation` | (New: mobile bottom nav) | Dashboard |
| `AppHeader` | `<header>` in HTML | Dashboard |
| `VoiceAssistantDrawer` | voiceFeedbackToast | Everywhere |
| `StatusBadge` | SELL NOW / WAIT pills | Sell, Markets |
| `SimplePriceChart` | SVG sparklines in crop cards | Home, Markets |
| `SuggestionChips` | "अक्सर पूछे जाने वाले सवाल" | Home, Saathi |
| `ChatBubble` | (New: for Saathi conversation) | Saathi |

### Component Props Pattern
```typescript
// Example: RecommendationCard
interface RecommendationCardProps {
  crop: Crop;
  decision: 'sell_now' | 'wait' | 'divert';
  mandi: MandiRecommendation;
  netAmount: number;
  totalQuantity: number;
  reason: string;
  decisionTime: string;
  onSellHow: () => void;
  onWhy: () => void;
  locale: string;
}
```

---

## 7. Data Types / Models

### Core Types
```typescript
// types/farmer.ts
interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  mainCrops: CropType[];
  defaultQuantity: number; // in quintals
  preferredLanguage: Language;
}

// types/crop.ts
type CropType = 'onion' | 'wheat' | 'chili' | 'tomato' | 'soybean' | 'peanut' | 'cotton' | 'rice' | 'maize' | 'sugarcane';

interface Crop {
  id: CropType;
  name: { [key in Language]: string };
  icon: string; // emoji
  category: string;
}

// types/market.ts
interface Mandi {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  distanceKm: number;
  estimatedMinutes: number;
  currentPrice: number;       // ₹/quintal
  priceChange: number;        // positive/negative
  arrivalQuantity: number;    // quintals today
  charges: MandiCharges;
}

interface MandiCharges {
  commission: number;
  labourCharge: number;
  marketFee: number;
  total: number;
}

interface MandiRecommendation extends Mandi {
  netExpected: number;
  transportCost: number;
  transportOptions: TransportOption[];
  isRecommended: boolean;
  recommendationRank: number;
}

interface TransportOption {
  vehicle: 'tata_ace' | 'pickup' | 'truck_10wheeler';
  name: string;
  nameHi: string;
  capacity: number; // quintals
  estimatedCost: number;
}

// types/market.ts (continued)
interface SellDecision {
  crop: CropType;
  quantity: number;
  decision: 'sell_now' | 'wait' | 'divert';
  confidence: number;
  reasons: string[];
  mandi: MandiRecommendation;
  cropValue: number;
  transportCost: number;
  mandiCharges: number;
  netAmount: number;
  decisionTime: string;
  validUntil: string;
}

// types/buyer.ts
interface Buyer {
  id: string;
  name: string;
  type: 'processor' | 'exporter' | 'retailer' | 'fpo' | 'cooperative';
  distanceKm: number;
  requiredQuantity: number;   // quintals
  offeredPrice: number;       // ₹/quintal
  isVerified: boolean;
  phone: string;
}

// types/notification.ts
interface FarmNotification {
  id: string;
  type: 'price_up' | 'price_down' | 'weather' | 'buyer' | 'system';
  crop?: CropType;
  message: string;
  detail?: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

// types/ai-saathi.ts
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoice: boolean;
}

interface VoiceState {
  status: 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
  transcript: string;
  error?: string;
}
```

---

## 8. Screen-by-Screen Design (Component Composition)

### Screen 1: Welcome + Language (`/welcome`)

**Layout:** Full-screen, centered, no header/nav
**Background:** gradient surface-container-low → background
**Structure:**
```
[Logo + Tagline "A Brahmastra for Farmers"]
[Language Cards Grid: 2-col mobile, 3-col tablet, 5-col desktop]
  Each card: Native script text + speaker icon + tap to select
[Primary CTA: "आगे बढ़ें" / "Proceed"]
```

### Screen 2: Phone Login (`/login`)

**Layout:** Centered card
**Structure:**
```
[Farmo logo]
["अपना मोबाइल नंबर डालें"]
[Large phone number input with +91 prefix]
[Primary Button: "OTP भेजें"]
── After OTP ──
["OTP दर्ज करें"]
[6 large OTP boxes, auto-focus]
[Primary Button: "Verify"]
[Resend timer: "30s में फिर से भेजें"]
```

### Screen 3: Farmer Setup (`/setup`)

**Layout:** Stepper-like single page
**Structure:**
```
[Progress dots: 1/4 2/4 3/4 4/4]
["आपकी जानकारी"]
[Name input with voice mic icon]
[Village input with voice mic icon]
[Crop Cards Grid: 2x3 grid of crop emoji cards]
  Tap to select (green check on selected)
[Quantity: Large +/- stepper: 40 क्विंटल]
[Primary Button: "शुरू करें"]
```

### Screen 4: Home / Kisan Hub (`/`)

**Layout:** Scrollable single column (mobile), sidebar + content (desktop)
**Component Composition:**
```
AppHeader
├── Logo + Brand
├── Language Switcher (desktop)
├── Voice Mic Button (pulse animation)
├── Bell icon (notifications badge)
└── Avatar

PageContainer
├── WeatherCard (compact inline)
├── VoiceAssistantDrawer (hidden, toggled)
├── RecommendationCard (Hero Brahmastra)
│   ├── Crop emoji + name + lot size
│   ├── SELL NOW / WAIT badge
│   ├── Mandi name + distance + time
│   ├── Net ₹ amount (price-hero)
│   ├── "बेचने का तरीका देखें" CTA
│   └── "क्यों?" expandable → ProfitBreakdown
├── SuggestionChips ("अक्सर पूछे जाने वाले सवाल")
├── QuickActions (4-card grid)
│   ├── Ask Farmo (→ saathi)
│   ├── Check Markets (→ markets)
│   ├── Find Buyers (→ buyers)
│   └── Alerts (→ notifications)
├── "मेरी फसलें" section
│   └── CropCard[] (horizontal scroll or grid)
│       ├── Crop name + stock info
│       ├── Price + change pill
│       ├── SimplePriceChart (SVG sparkline)
│       ├── StatusBadge (recommendation)
│       └── Action CTA
└── MandiLiveYardSection (card with image)
    ├── Live arrival count
    ├── StatusBadge
    └── Action links

BottomNav (mobile only)
├── 🏠 Home
├── 📍 Markets
├── 🎙️ Saathi (emphasized center)
├── 👥 Buyers
└── 👤 Profile
```

### Screen 5: Sell Decision (`/sell`)

**Layout:** Single column, scrollable
**Component Composition:**
```
AppHeader
  [Back arrow] [Title: "प्याज़ बेचने का फैसला"]
PageContainer
├── StatusBadge (SELL NOW — large, prominent)
├── Decision reasons checklist (✓ items)
├── ProfitBreakdown
│   ├── Crop value
│   ├── Transport cost
│   ├── Mandi charges
│   └── Net amount (price-hero)
├── Vehicle selection cards (if transport chosen)
├── [Primary CTA: "मंडी चुनें"] → markets
├── [Secondary: "दूसरी मंडी देखें"] → markets
└── AI Saathi FAB (floating mic)
```

### Screen 6: Market Comparison (`/markets`)

**Layout:** Single column list (mobile), split panel (desktop: list left, detail right)
**Component Composition:**
```
AppHeader
  [Title: "कहां बेचें?"]
PageContainer
├── Sort chips: [Best Profit] [Nearest] [Lowest Transport]
├── MandiCard[] (ranked list)
│   ├── Rank # + Recommended badge
│   ├── Mandi name + distance
│   ├── Mandi price (₹/Qtl)
│   ├── Transport cost
│   ├── Mandi charges
│   └── Net expected (price-hero, highlighted for #1)
├── Selected mandi expanded view
│   ├── Full ProfitBreakdown
│   ├── Vehicle selection (large cards)
│   ├── Transport pool availability
│   └── "यहां बेचें" primary CTA
└── AI Saathi FAB
```

### Screen 7: AI Saathi (`/saathi`)

**Layout:** Chat interface (full height between header and bottom nav)
**Component Composition:**
```
AppHeader
  [Title: "AI साथी"]
PageContainer (flex column, h-full)
├── ChatBubble[] (scrollable area, grows)
│   ├── User message (right-aligned, primary bg)
│   └── Assistant message (left-aligned, surface bg)
├── SuggestionChips (initial/empty state)
│   ["आज प्याज़ का भाव?", "कहां बेचूं?", ...]
├── Input area
│   ├── Text input (optional typing)
│   ├── VoiceButton (large, center)
│   └── Send button (when text entered)
└── Voice status states
    ├── idle: mic icon
    ├── listening: pulsing rings + "सुन रहा है..."
    ├── processing: spinner + "सोच रहा है..."
    ├── speaking: volume icon + transcript
    └── error: "फिर से बोलिए"

BottomNav
```

### Screen 8: Buyers (`/buyers`)

**Layout:** Scrollable list
**Component Composition:**
```
AppHeader
  [Title: "आपकी फसल कौन खरीदना चाहता है?"]
PageContainer
├── Filter chips (crop type, distance)
├── BuyerCard[] (card list)
│   ├── Buyer name + type badge
│   ├── Offered price (₹/Qtl)
│   ├── Required quantity
│   ├── Distance
│   ├── Verified badge
│   ├── [Primary: "बात करें"] (call action)
│   └── [Secondary: "विवरण देखें"]
└── AI Saathi FAB
```

### Screen 9: Notifications (`/notifications`)

**Layout:** Scrollable list
**Component Composition:**
```
AppHeader
  [Title: "सूचनाएं"]
PageContainer
├── AlertCard[] (notification list)
│   ├── Type indicator (green/amber/red icon)
│   ├── Message text
│   ├── Time
│   └── Action CTA (if applicable)
├── Mark all read button
└── Empty state (if no notifications)
```

### Screen 10: Profile (`/profile`)

**Layout:** Simple single column
**Component Composition:**
```
AppHeader
  [Title: "प्रोफ़ाइल"]
PageContainer
├── FarmerProfileCard
│   ├── Avatar + name
│   ├── Village, district
│   └── Member since
├── Settings list
│   ├── My Crops (→ crop management)
│   ├── Language change
│   ├── Notification settings
│   ├── Help
│   └── Contact support
└── Logout button
```

---

## 9. Responsive Strategy

### Breakpoints
```
Mobile:  < 640px  (default)   — 4-col grid, 16px margins
Tablet:  640px - 1024px       — 8-col grid, 24px margins
Desktop: > 1024px             — 12-col grid, 32px margins, max 1280px
```

### Layout Behavior

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Bottom nav (5 tabs) | Bottom nav | Top nav bar |
| Header | Compact (h-14) | Full (h-20) | Full with nav tabs |
| Voice mic | Center bottom nav | FAB | FAB in header |
| Market list | Full-width cards | 2-col grid | Split: list (6col) + detail (6col) |
| Recommendation | Full-width | Full-width | Split: crop (7col) + profit (5col) |
| Crop cards | Single column stack | 2-col grid | 3-col grid |
| Buyers | Single column stack | 2-col grid | 2-col with sidebar |
| AI Saathi | Full-screen chat | Split: chat + suggestions | Split: chat + panel |

---

## 10. Voice Assistant Architecture

### Frontend (Browser)
```typescript
// hooks/useVoice.ts
// Wraps Web Speech API (SpeechRecognition + SpeechSynthesis)
// States: idle → listening → processing → speaking → idle
// Falls back gracefully when API not available

interface UseVoiceReturn {
  state: VoiceState;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  isSupported: boolean;
}
```

### Backend Integration (Future Gemini)
```typescript
// POST /api/ai/chat
// Request: { message: string, language: string, farmerContext: { crop, quantity, location } }
// Response: { reply: string, intent: string, data?: any }
```

### Voice States UI
1. **Idle**: Large mic button, subtle pulse, "बोलकर पूछें"
2. **Listening**: Expanding rings, waveform, "सुन रहा है..."
3. **Processing**: Dots animation, "सोच रहा है..."
4. **Speaking**: Volume icon, text transcript, auto-scroll
5. **Error**: Alert icon, "फिर से बोलिए", retry button

---

## 11. API Service Layer (Mock → Real)

### Service Abstraction
```typescript
// lib/services/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// When backend is ready, swap mock → real calls
class MarketService {
  async getCropPrices(cropId: string): Promise<Price[]> { /* mock */ }
  async getMandiComparison(cropId: string, location: Location): Promise<MandiRecommendation[]> { /* mock */ }
  async getSellDecision(cropId: string, quantity: number): Promise<SellDecision> { /* mock */ }
}

class FarmerService {
  async login(phone: string): Promise<{ otpSent: boolean }> { /* mock */ }
  async verifyOtp(phone: string, otp: string): Promise<{ token: string; farmer: FarmerProfile }> { /* mock */ }
  async getProfile(): Promise<FarmerProfile> { /* mock */ }
  async updateProfile(data: Partial<FarmerProfile>): Promise<FarmerProfile> { /* mock */ }
}

class BuyerService {
  async getBuyers(cropId: string, location: Location): Promise<Buyer[]> { /* mock */ }
}

class NotificationService {
  async getNotifications(): Promise<FarmNotification[]> { /* mock */ }
  async markRead(id: string): Promise<void> { /* mock */ }
}

class AiService {
  async chat(message: string, context: FarmerContext): Promise<ChatMessage> { /* mock, will hit Gemini */ }
}
```

### Mock Data
Create `lib/services/mock-data.ts` with:
- 8-10 crop profiles with Hindi/English names + emojis
- 5 mandis with realistic prices
- 6-8 buyers with varied types
- 5-6 sample notifications
- Sell decision templates
- Price trend data (7-day arrays)

---

## 12. State Management (Zustand)

### Stores
```typescript
// auth.store.ts
interface AuthState {
  isAuthenticated: boolean;
  farmer: FarmerProfile | null;
  token: string | null;
  login: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
}

// language.store.ts
interface LanguageState {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  languages: { code: Language; name: string; nativeName: string }[];
}

// farmer.store.ts (extends farmer profile + current context)
interface FarmerContextState {
  selectedCrop: CropType | null;
  quantity: number;
  location: { village: string; district: string; lat: number; lng: number } | null;
  setSelectedCrop: (crop: CropType) => void;
  setQuantity: (qty: number) => void;
}
```

---

## 13. Implementation Phases

### Phase 1: Scaffold + Design System
1. Create Next.js project with TypeScript + Tailwind
2. Set up fonts (Outfit, Tiro Devanagari Hindi)
3. Configure Tailwind tokens from DESIGN.md
4. Set up next-intl with Hindi + English
5. Create component library skeleton
6. Set up middleware (i18n routing + auth redirect)

### Phase 2: Onboarding Screens
7. Build Welcome + Language screen
8. Build OTP Login screen
9. Build Farmer Setup screen
10. Set up Zustand stores (auth, language, farmer)

### Phase 3: Dashboard Core
11. Build AppHeader (responsive)
12. Build BottomNav (mobile) / TopNav (desktop)
13. Build AppShell layout component
14. Build Home / Kisan Hub screen
15. Build VoiceAssistantDrawer
16. Build RecommendationCard (Hero Brahmastra)
17. Build tracked crops section

### Phase 4: Decision + Markets
18. Build Sell Decision screen
19. Build Market Comparison screen
20. Build MandiCard + ProfitBreakdown
21. Build vehicle selection + transport pooling UI

### Phase 5: AI + Buyers + Notifications
22. Build AI Saathi chat interface
23. Build VoiceButton with speech states
24. Build Buyers screen + BuyerCard
25. Build Notifications screen + AlertCard

### Phase 6: Polish + Responsive
26. Build Profile screen
27. Desktop sidebar / responsive navigation
28. All translations (10 languages)
29. Responsive testing across breakpoints
30. Accessibility audit (touch targets, contrast, screen reader)

---

## 14. External Dependencies

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.5.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "next-intl": "^3.25.0",
  "zustand": "^4.5.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.4.0",
  "@radix-ui/react-dialog": "^1.1.0",
  "@radix-ui/react-select": "^2.1.0",
  "lucide-react": "^0.400.0",
  "framer-motion": "^11.0.0"
}
```

---

## 15. Node.js Requirement

Node.js is not currently installed on this machine. The following commands are needed:
```
winget install OpenJS.NodeJS.LTS
```
After installation, restart terminal and verify:
```
node --version   # Should show v20.x or v22.x LTS
npm --version    # Should show 10.x
```
Then scaffold:
```
npx create-next-app@latest farmo --typescript --tailwind --app --src-dir=false --import-alias="@/*"
```

---

## 16. Verification Checklist

- [ ] All 10 screens render correctly on mobile (360-430px)
- [ ] Tablet layout (640-1024px) shows appropriate 2-column layouts
- [ ] Desktop layout (>1024px) shows top nav + sidebar-style content
- [ ] All 10 languages selectable and render without layout breaking
- [ ] Hindi/Marathi use Tiro Devanagari font (not generic Latin)
- [ ] All primary CTAs are minimum 56px height
- [ ] Voice states render correctly (idle, listening, processing, speaking, error)
- [ ] Touch targets are minimum 56px on mobile
- [ ] Price numbers use Outfit with tabular-nums
- [ ] Colors match DESIGN.md tokens
- [ ] Auth flow works: Welcome → OTP → Setup → Dashboard
- [ ] Bottom nav highlights current page
- [ ] Responsive images and cards don't overflow
- [ ] Dark text on light backgrounds meets 7:1 contrast ratio
