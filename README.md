# FocusFlow 📱✨

**AI-Powered Anti-Procrastination App for iOS & Android**

<div align="center">
  
  <p>
    <strong>Beat procrastination with intelligent motivation and the Pomodoro Technique</strong>
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-installation">Installation</a>
  </p>
</div>

---

## 🌟 Features

### ✨ AI-Powered Motivation System
- **Smart Social Media Detection** - Detects when you've been away for 5+ minutes (likely scrolling)
- **Contextual Quotes** - Personalized motivational messages based on your progress, time of day, and current task
- **Anti-Procrastination Tips** - Practical advice to overcome resistance
- **Focus Reminders** - Direct messaging when you need that extra push
- **Time-Away Warnings** - Shows exactly how much time you lost to distractions

### 📝 Task Management
- Create and organize tasks with priorities (Low, Medium, High)
- Track status: To-do → In Progress → Completed
- Add descriptions and estimated pomodoros
- Color-coded priority badges
- Task selection for focus sessions

### ⏱️ Pomodoro Timer
- 25-minute focus sessions with 5-minute breaks
- Beautiful circular SVG progress indicator
- Automatic session tracking
- Long breaks after configurable sessions
- Tracks completed pomodoros per task

### 📊 Statistics & Gamification
- Total tasks completed and focus time
- Current and longest streak tracking 🔥
- Weekly progress visualization
- Achievement system with unlockable badges

### 🎯 Daily Goals
- Set and track daily objectives
- Visual progress bars
- Quick increment buttons

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/emjaymca/focusflow-mobile.git
cd focusflow-mobile

# Install dependencies
npm install

# Start the development server
npm start
```

### Run on Your Device

**Option 1: Expo Go (Fastest!)**

1. Install **Expo Go** on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in your terminal

3. App loads instantly! ✨

**Option 2: Emulator/Simulator**

```bash
# iOS Simulator (Mac only)
npm run ios

# Android Emulator
npm run android
```

---

## 📱 Installation on Your Phone

### Android

**Build APK:**
```bash
npm run build:android
```

This creates an APK you can install directly on any Android device!

### iOS

**Build for TestFlight:**
```bash
npm run build:ios
```

See [INSTALL.md](./INSTALL.md) for detailed instructions.

---

## 🧠 AI Motivation System

### How It Works

**Social Media Detection:**
- Monitors when you leave the app
- Detects absences of 5+ minutes
- Shows time-away warnings when you return

**Example After 15 Minutes Away:**
> ⚠️ "15 minutes vanished. Time to reclaim your focus."
> 
> *"Stop scrolling, start doing."*
>
> 🚀 [Start Pomodoro NOW!]

### Manual Motivation

Tap the ✨ sparkle button anytime for:
- Fresh motivational quote
- Anti-procrastination tip
- Current stats display
- Focus reminders

---

## 🛠️ Tech Stack

- **React Native 0.76.5** - Cross-platform mobile framework
- **Expo ~52.0.0** - Development and build platform
- **TypeScript** - Type-safe development
- **AsyncStorage** - Persistent local storage
- **React Native SVG** - Vector graphics for timer

---

## 📂 Project Structure

```
focusflow-mobile/
├── mobile/                    # App source code
│   ├── App.tsx               # Main app component
│   ├── components/           # UI components
│   ├── screens/              # Main screens
│   └── utils/                # Utilities
├── assets/                   # App assets
├── app.json                  # Expo configuration
├── eas.json                  # Build configuration
└── package.json              # Dependencies
```

---

## 🎯 Usage

1. **Add Tasks** - Tap "+ Add Task"
2. **Set Priorities** - Choose Low, Medium, or High
3. **Get Motivated** - Tap ✨ sparkle button
4. **Start Focus** - Select task, switch to Timer
5. **Track Progress** - View stats and achievements

---

## 🚀 Building for Production

### Android APK

```bash
npm run build:android
```

### iOS App

```bash
npm run build:ios
npx eas submit --platform ios
```

---

## 📄 License

MIT License - Free to use for your own purposes!

---

<div align="center">
  <strong>Made with ❤️ for productivity enthusiasts</strong>
</div>
