# NutrifyMI — Feature & Implementation Reference

> AI-powered nutrition tracking app built for India. Snap a photo, get instant nutrition data, earn real rewards.

## Tech Stack

- **Framework:** React Native (Expo SDK 55, Expo Router)
- **Language:** TypeScript
- **AI Engine:** Claude API (Anthropic) — Opus for food analysis, Haiku for chat
- **Backend:** Supabase (Auth, Database, Edge Functions, Storage)
- **Payments:** Razorpay (₹199/mo, ₹1,699/yr)
- **Health:** Health Connect (Android steps), Motion sensors (iOS)
- **UI:** NativeWind (Tailwind CSS), Lucide icons, React Native SVG
- **Platforms:** Android, iOS, Web

---

## Core Features

### 1. AI Meal Scanner (Scan Tab)

- Point camera at any meal — Claude AI identifies every dish on the plate
- Returns per-dish breakdown: calories, protein, carbs, fat, fibre, sodium, glycemic index
- Confidence score for each detection (green ≥80%, orange if lower)
- Supports Indian, Asian, Middle Eastern, European, American, African, Latin American cuisines
- Multi-layer nutrition lookup: local food databases (2,000+ Indian dishes, 1,000+ global, 800+ branded) → USDA API → CalorieNinjas → Claude AI fallback
- Barcode scanning for packaged foods via OpenFoodFacts
- Location-aware: detects regional dishes based on user's state/city
- Photo stored in Supabase Storage for history

**Files:** `services/analyzeFood.ts`, `services/dishLookup.ts`, `services/barcodeLookup.ts`, `services/nutritionAPI.ts`, `app/(tabs)/scan.tsx`

---

### 2. Smart Result Screen

- Review AI-detected dishes before logging
- Adjust portion sizes (0.5x to 2x)
- Correct dish names if AI misidentified (earns +3 XP)
- Remove individual dishes from detection
- Glucose Impact card with Low/Medium/High GI advice
- Meal type selector (Breakfast/Lunch/Dinner/Snack)
- Post-meal motivation modal with personalized message + next challenge hint

**Files:** `app/result.tsx`, `services/corrections.ts`, `services/mealMotivation.ts`

---

### 3. Home Dashboard (Home Tab)

- Today's nutrition summary: calories, protein, carbs, fat with circular progress ring
- Calorie ring visualization (SVG-based)
- Quick-log buttons for meals, water, exercise
- Water intake tracker (glass-by-glass)
- Steps counter (Health Connect on Android)
- Daily streak display
- Personalized greeting based on time of day and meal progress
- Contextual insights ("You're low on protein", "Great balanced day!")

**Files:** `app/(tabs)/index.tsx`, `components/CalorieRing.tsx`, `services/insights.ts`, `services/healthData.ts`

---

### 4. Gamification System (Challenge Tab)

#### XP & Levels
- 15 levels from "Beginner" (0 XP) to "Legend" (25,000 XP)
- XP earned: meal log +5, photo bonus +2, 3rd meal/day +7, dish correction +3, streak bonus +2×days (cap 10)
- Level-up celebrations with title progression

#### Daily Challenges
- Log 3 meals, hit calorie target (90-110%), hit protein target, log breakfast before 9 AM
- Hydration goal (personalized by weight)
- Each challenge awards XP on completion

#### Weekly Goals
- 5-Day Logger, 15 Meals, Protein Consistency, 7-Day Streak, Hydration Week
- Horizontal scrollable cards with progress bars

#### Badges (14 total)
- Milestone badges: first_meal, meals_10, meals_50, meals_100
- Streak badges: streak_3, streak_7, streak_30
- Skill badges: corrector, photographer, early_bird, balanced_day, under_target, protein_king, explorer

**Files:** `services/gamification.ts`, `services/rewardEngine.ts`, `app/(tabs)/challenge.tsx`, `components/DailyChallenge.tsx`, `components/XPBar.tsx`

---

### 5. XP Bank & Reward System

#### XP Bank (Progressive Fill)
- Every 100 XP → ₹2 credited to virtual bank
- Tier 1: ₹100 bank (5,000 XP) — withdraw with Monthly plan
- Tier 2: ₹500 bank (25,000 XP) — withdraw with Yearly plan
- Tier 3: ₹1,000 bank (50,000 XP) — repeatable, Yearly plan
- Free users see balance grow — must subscribe to withdraw

#### Reward Milestones
- Roadmap visualization with progress dots
- Gift card claiming with confirmation modal
- Pending/fulfilled reward tracking

#### Reward Fulfillment
- Choose: Amazon Gift Card or NGO Donation
- Gift cards delivered via email (Supabase Edge Function)
- NGO partners: Akshaya Patra, Feeding India (Zomato), Robin Hood Army, Annamrita
- Donation impact: meals sponsored counter
- 80G tax receipt for eligible donations

**Files:** `services/xpBank.ts`, `services/rewards.ts`, `services/rewardFulfillment.ts`, `components/XPBankCard.tsx`

---

### 6. AI Nutrition Coach — "Cali" (Coach Tab)

- Chat with AI nutrition coach powered by Claude Haiku
- Full context injection each message: profile, today's meals, macro gaps, streak, water, steps
- Multilingual support (auto-detects user language)
- 8 quick-start prompts: "What should I eat next?", "Am I on track?", "Quick healthy snack?", etc.
- Medical disclaimer handling (won't diagnose, directs to doctors)
- Chat history stored locally (last 50 messages)
- Free: 1 message/day | Pro: unlimited

**Files:** `services/aiCoach.ts`, `app/(tabs)/coach.tsx`

---

### 7. Nutrition Guide (Guide Tab) — Pro Only

- **Day Score:** Overall daily nutrition rating (Poor/Fair/Good/Excellent)
- **Gap Analysis:** Shows low/good/high status for calories, protein, fibre
- **Meal Recommendations:** Smart suggestions based on time, remaining macros, diet type, medical conditions
- **Recipe Database:** 8 curated Indian recipes with ingredients, steps, prep time
- **Condition-Specific Advice:** Tailored guidance for diabetes, PCOS, hypertension, heart health
- **Regional Foods:** Suggestions based on user's state (Maharashtra, South India, etc.)

**Files:** `services/nutritionGuide.ts`, `services/mealRecommender.ts`, `app/(tabs)/guide.tsx`

---

### 8. Weekly Insights (Insights Tab)

- Swipe through past weeks (1 week free, 4 weeks Pro)
- Weekly calorie bar chart with daily target line
- Macro breakdown donut chart (protein/carbs/fat split)
- Day streak counter per week
- Meal history grouped by date
- Trend analysis across weeks

**Files:** `app/(tabs)/insights.tsx`, `components/WeeklyBarChart.tsx`, `components/MacroDonut.tsx`

---

### 9. Reports — Pro Only

- Generate Daily, Weekly, or Monthly reports
- Summary stats: average calories, target adherence %, meals logged, calorie trend
- Daily macro averages with visual circles
- Glycemic index analysis (Low/Medium/High GI counts)
- Meal pattern breakdown (breakfast/lunch/dinner/snack frequency)
- Top 5 most-eaten dishes
- Clinical overview: BMI, macro ratio, protein per kg body weight, concerns, recommendations
- Shareable with dietitians/practitioners via unique link
- Report history saved to database

**Files:** `services/reportEngine.ts`, `app/reports.tsx`

---

### 10. Water Tracking

- Glass-by-glass water intake logging
- Personalized daily goal based on weight (30ml per kg)
- Quick-add from home screen
- Integrated into daily challenges
- History tracked in Supabase

**Files:** `services/waterTracker.ts`

---

### 11. Exercise & Step Tracking

- Manual exercise logging with calorie burn calculation
- Health Connect integration for Android step counting
- Motion sensor fallback for iOS
- Daily burned calories display on home screen

**Files:** `services/exerciseTracker.ts`, `services/healthData.ts`, `components/ExerciseLogModal.tsx`

---

### 12. Intermittent Fasting Support

- Protocol selection (16:8, 18:6, 20:4, OMAD, custom)
- Eating window configuration
- Fasting timer and status tracking

**Files:** `services/fasting.ts`

---

### 13. Favorites & Quick Log

- Frequently logged meals auto-saved as favorites
- Quick-log from home screen (tap favorite → instant re-log)
- Sorted by usage frequency

**Files:** `services/favorites.ts`

---

### 14. Social Features

- Community impact dashboard (total meals donated by all users)
- Shareable achievement cards

**Files:** `services/social.ts`

---

### 15. Smart Notifications

- Max 3-4 per day, never spam
- Time-aware: breakfast (7:30), lunch (12:30), dinner (19:30)
- Weekend delay (+1 hour mornings)
- Streak rescue alerts (10 PM if no meals logged)
- Skip if meal already logged for that slot
- Android notification channels (Meal Reminders, Streak, Achievements, Weekly)
- 40+ notification templates with personalization

**Files:** `services/notifications.ts`

---

### 16. Onboarding

- 7-step guided setup: name → age → body metrics → goal → diet → conditions → activity
- Auto-detects location
- Calculates personalized daily targets (Mifflin-St Jeor + activity multiplier)
- Celebration screen showing computed targets

**Files:** `app/onboarding.tsx`

---

### 17. Profile & Settings

- Avatar upload (camera or gallery)
- Full health profile editing
- Goal selection: Lose Weight, Gain Muscle, Stay Healthy, Manage Diabetes, PCOS Management, Heart Health
- Diet types: Vegetarian, Non-Vegetarian, Vegan, Eggetarian
- Activity levels: Sedentary, Lightly Active, Moderately Active, Very Active
- Medical conditions multi-select
- Auto-recalculated daily targets on any change
- App theme selector

**Files:** `app/(tabs)/profile.tsx`, `services/avatar.ts`

---

### 18. Pro Subscription

- Monthly: ₹199/month
- Yearly: ₹1,699/year (30% savings)
- 15-day free trial
- Pro unlocks: unlimited scans, AI coach, rewards withdrawal, 4-week insights, reports, guide tab
- Razorpay integration for Indian payments
- Supabase Edge Functions for payment verification

**Files:** `app/pro.tsx`, `services/payments.ts`, `services/proGate.ts`

---

## Food Databases

| Database | Entries | Coverage |
|----------|---------|----------|
| Indian Food DB | 2,000+ | Regional Indian dishes with accurate macros |
| Global Food DB | 1,000+ | International cuisines |
| Branded Food DB | 800+ | Packaged foods (Indian brands) |
| Dish Aliases | 500+ | Regional name mappings (e.g., "poha" = "flattened rice") |

**Files:** `data/indianFoodDB.ts`, `data/globalFoodDB.ts`, `data/brandedFoodDB.ts`, `data/dishAliases.ts`

---

## Backend (Supabase)

### Database Tables
- `profiles` — user data, XP, level, badges, targets, subscription status
- `meal_logs` — every logged meal with full nutrition data
- `meal_photos` — photo storage references
- `water_logs` — daily water intake
- `exercise_logs` — exercise sessions
- `reward_redemptions` — gift card claims and donations
- `reports` — generated nutrition reports
- `shared_reports` — shareable report links

### Edge Functions
- `verify-razorpay-payment` — payment signature verification
- `create-razorpay-subscription` — subscription creation
- `cancel-razorpay-subscription` — subscription cancellation
- `send-gift-card-email` — reward delivery emails
- `send-donation-email` — NGO donation confirmations

### Schema Files
- `supabase-features-schema.sql`
- `supabase-reports-schema.sql`
- `supabase-rewards-schema.sql`

---

## Authentication

- Supabase Auth (email/password)
- Login and Signup screens
- Protected routes via AuthContext
- Session persistence

**Files:** `context/AuthContext.tsx`, `app/(auth)/login.tsx`, `app/(auth)/signup.tsx`

---

## App Architecture

```
app/
├── (auth)/          # Login, Signup
├── (tabs)/          # 7 main tabs (Home, Scan, Insights, Challenge, Guide, Coach, Profile)
├── _layout.tsx      # Root layout with auth routing
├── index.tsx        # Entry redirect
├── onboarding.tsx   # New user setup
├── result.tsx       # Post-scan result screen
├── reports.tsx      # Nutrition reports
├── pro.tsx          # Subscription screen
└── legal.tsx        # Privacy, Terms, Disclaimer

services/            # 32 business logic modules
components/          # 15 reusable UI components
context/             # Auth + Theme providers
data/                # Food databases (4 files)
constants/           # Design tokens
types/               # TypeScript interfaces
```

---

## Key Differentiators

1. **India-First:** 2,000+ Indian dishes, regional food knowledge, ₹ pricing, Razorpay payments
2. **AI-Powered:** Claude AI for photo scanning + nutrition coaching
3. **Pays You Back:** Users earn ₹1,600+ in Amazon gift cards for consistent tracking
4. **Health Condition Support:** Diabetes, PCOS, hypertension-aware recommendations
5. **Gamification:** XP, levels, badges, streaks, challenges — habit formation through game mechanics
6. **Social Impact:** Donate rewards to feed underprivileged children through NGO partners
7. **Dietitian Reports:** Generate and share clinical-grade reports with practitioners

---

## Monetization Model

| | Free | Pro (₹199/mo or ₹1,699/yr) |
|---|---|---|
| Meal scans | 1/day | Unlimited |
| AI Coach messages | 1/day | Unlimited |
| Weekly insights | 1 week | 4 weeks |
| Reports | — | Daily/Weekly/Monthly |
| Guide tab | — | Full access |
| Reward withdrawal | — | Unlock tiers |
| Dish corrections | 1/scan | Unlimited |

**Net cost after rewards:** ₹1,699/yr - ₹1,600 rewards = ~₹99/yr (~₹8/month)
