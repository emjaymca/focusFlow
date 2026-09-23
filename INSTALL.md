# 📱 How to Install FocusFlow on Your Phone

## Quick Start: Choose Your Option

### 🤖 Android (Easiest - No Account Needed!)

**Method 1: Build APK Locally (Recommended)**
```bash
# Clone the repo and navigate to it
git checkout cursor/focus-app-d022
npm install

# Build APK locally (takes 10-15 min)
npm run build:android
```

This creates an **APK file** you can install directly!

**Method 2: Use EAS Cloud Build**
```bash
# First time: Login to Expo
npx eas login

# Build APK in the cloud
npm run build:android
```

### 🍎 iOS (Requires Apple Developer Account)

```bash
# Login to Expo
npx eas login

# Build for iOS
npm run build:ios
```

**Note:** iOS builds require:
- Apple Developer Account ($99/year)
- OR use Expo Go app for free testing

---

## Detailed Instructions

### For Android Users

#### Option A: Local Build (Free, No Account!)

1. **Install Android Studio** (if not already installed)
   - Download: https://developer.android.com/studio

2. **Clone and Setup**
   ```bash
   git clone https://github.com/emjaymca/MadDev.git
   cd MadDev
   git checkout cursor/focus-app-d022
   npm install
   ```

3. **Build the APK**
   ```bash
   npm run build:android
   ```

4. **Find the APK**
   - Look in the build output for the APK path
   - Usually: `android/app/build/outputs/apk/release/app-release.apk`

5. **Install on Phone**
   - Transfer APK to your phone (USB, email, cloud)
   - Open the APK file on your phone
   - Enable "Install from Unknown Sources" if prompted
   - Tap Install
   - Launch FocusFlow!

#### Option B: EAS Cloud Build (Easier)

1. **Create Expo Account** (free)
   - Sign up at: https://expo.dev/signup

2. **Login via CLI**
   ```bash
   npx eas login
   ```

3. **Configure the Build**
   ```bash
   npx eas build:configure
   ```

4. **Build APK**
   ```bash
   npm run build:android
   ```

5. **Download and Install**
   - EAS will provide a download link when done
   - Download the APK to your phone
   - Install it!

### For iOS Users

#### Option A: TestFlight (Recommended)

1. **Expo Account + Apple Developer Account**
   - Expo: https://expo.dev/signup (free)
   - Apple Developer: https://developer.apple.com ($99/year)

2. **Login and Configure**
   ```bash
   npx eas login
   npx eas build:configure
   ```

3. **Build for TestFlight**
   ```bash
   npm run build:ios
   ```

4. **Submit to TestFlight**
   ```bash
   npx eas submit --platform ios
   ```

5. **Install via TestFlight**
   - Apple will send you a TestFlight invitation
   - Install TestFlight app from App Store
   - Accept invitation
   - Install FocusFlow!

#### Option B: Expo Go (Quick Testing - Free!)

1. **Install Expo Go**
   - Download from App Store: https://apps.apple.com/app/expo-go/id982107779

2. **Start Dev Server**
   ```bash
   npm start
   ```

3. **Scan QR Code**
   - Open Expo Go on your phone
   - Scan the QR code
   - App loads instantly!

**Limitation:** Requires Expo Go app and internet connection

---

## What Each Build Type Gives You

| Build Type | Android | iOS | Requirements |
|------------|---------|-----|--------------|
| **Local APK** | ✅ Standalone app | ❌ | None! |
| **EAS Cloud** | ✅ Standalone app | ✅ Standalone app | Expo account |
| **TestFlight** | ❌ | ✅ Full app | Apple Developer |
| **Expo Go** | ✅ Testing only | ✅ Testing only | Free Expo Go app |

## Recommended Path

### Android Users:
1. **First Time:** Try Expo Go (instant, free)
2. **For Real Use:** Build local APK (standalone, no dependencies)

### iOS Users:
1. **First Time:** Use Expo Go (instant, free)
2. **Serious Testing:** TestFlight ($99/year Apple Developer)
3. **Production:** App Store submission

---

## Build Configuration Details

All configuration is already set up in:
- `eas.json` - Build profiles
- `app.json` - App configuration
- `package.json` - Build scripts

### App Details:
- **Name:** FocusFlow
- **Package ID:** com.focusflow.app
- **Version:** 1.0.0
- **Icon:** Purple checkmark logo
- **Splash:** Purple gradient

---

## Troubleshooting

### Android Build Fails
```bash
# Make sure you have Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### iOS Build Fails
- Make sure you have an Apple Developer account
- Make sure Xcode is installed (Mac only)
- Check Apple Developer Portal for certificates

### EAS Login Issues
```bash
# Logout and login again
npx eas logout
npx eas login
```

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start dev server (for Expo Go)
npm start

# Build Android APK locally
npm run build:android

# Build iOS (requires Apple Developer)
npm run build:ios

# Build both platforms
npm run build:all

# Login to EAS
npx eas login

# Check build status
npx eas build:list
```

---

## Need Help?

The easiest way to get started:

**Android:** Download and install Expo Go, then run `npm start` and scan QR code  
**iOS:** Download and install Expo Go, then run `npm start` and scan QR code  

This lets you test the app immediately without building anything! 🚀

When you're ready for a standalone app, follow the build instructions above.
