# FocusFlow - Anti-Procrastination App

A beautiful cross-platform mobile app (iOS & Android) to help you beat procrastination with task management and the Pomodoro Technique.

## 🚀 Features

### 📝 Task Management
- Create and organize tasks with priorities (Low, Medium, High)
- Track task status: To-do → In Progress → Completed
- Add descriptions and estimated pomodoros
- Color-coded priority badges
- Task selection for focus sessions

### ⏱️ Pomodoro Timer
- 25-minute focus sessions with breaks
- Beautiful circular progress indicator
- Automatic session tracking
- Visual progress with animated timer
- Session counter with dots

### 📊 Statistics & Progress
- Total tasks completed counter
- Total pomodoros and focus time
- Current and longest streak tracking
- Weekly progress visualization
- Achievement system with badges
- Recent activity timeline

### 🎨 Modern Mobile UI
- Native iOS and Android design
- Smooth animations and transitions
- Purple gradient theme
- Clean, distraction-free interface
- Touch-optimized controls

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for universal React apps
- **TypeScript** - Type-safe development
- **AsyncStorage** - Persistent local data storage
- **React Native SVG** - Vector graphics for timer

## 📱 Running the App

### Prerequisites
- Node.js 16+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- For iOS: Mac with Xcode installed
- For Android: Android Studio with emulator set up

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on your preferred platform:

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web (for testing):**
```bash
npm run web
```

### Testing on Physical Device

1. Install the **Expo Go** app on your iOS or Android device
2. Run `npm start` in your terminal
3. Scan the QR code with your device:
   - **iOS**: Use Camera app
   - **Android**: Use Expo Go app

## 📂 Project Structure

```
mobile/
├── App.tsx                 # Main app component
├── types.ts               # TypeScript interfaces
├── components/
│   └── Header.tsx         # Navigation header
├── screens/
│   ├── TasksScreen.tsx    # Task management view
│   ├── TimerScreen.tsx    # Pomodoro timer view
│   └── StatsScreen.tsx    # Statistics dashboard
└── utils/
    ├── storage.ts         # AsyncStorage helpers
    └── stats.ts           # Statistics calculations
```

## 🎯 How to Use

1. **Add Tasks**: Tap the "+ Add Task" button to create new tasks
2. **Set Priorities**: Choose Low, Medium, or High priority
3. **Start Focus Session**: Select a task and tap "Work on this"
4. **Use Timer**: Switch to Timer view and start your pomodoro
5. **Track Progress**: View your statistics in the Stats view

## 📦 Building for Production

### iOS

1. Configure your app in `app.json`
2. Build the standalone app:
```bash
expo build:ios
```

### Android

1. Configure your app in `app.json`
2. Build the APK or App Bundle:
```bash
expo build:android
```

## 🔧 Configuration

Edit `app.json` to customize:
- App name and icon
- Splash screen
- Bundle identifiers
- Build settings

## 📝 License

MIT License - Feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

Built with React Native and Expo for cross-platform mobile development.

---

**Happy Focusing! 🎯**
