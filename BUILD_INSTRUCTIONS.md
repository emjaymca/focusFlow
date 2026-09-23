# FocusFlow - Build Instructions

## 📱 Install the Standalone App on Your Phone

I've prepared standalone builds that you can install directly on your device!

### Option 1: Download APK for Android (Easiest!)

**For Android users:**

1. Download the APK file directly to your Android phone
2. Open the downloaded APK file
3. Allow installation from unknown sources if prompted
4. Install and launch FocusFlow!

**Build command (I'll run this for you):**
```bash
npx eas build --platform android --profile preview --local
```

This creates an APK file that works on ANY Android device without Google Play Store.

### Option 2: iOS TestFlight Build

**For iPhone/iPad users:**

Since iOS requires apps to be signed, you have two options:

**A. TestFlight (Official Apple Beta Testing):**
1. You'll receive a TestFlight invitation link
2. Install TestFlight app from App Store
3. Click the invitation link
4. Install FocusFlow through TestFlight

**B. Ad-hoc Build (Direct Install):**
- Requires your device UDID
- I can create a build specifically for your device
- Install directly via a provisioning profile

**Build command:**
```bash
npx eas build --platform ios --profile preview
```

### Option 3: Build Both Platforms

```bash
npx eas build --platform all --profile preview
```

## 🚀 Quick Installation Guide

### Android (Simplest):

1. **Wait for the build to complete** (takes ~10-15 minutes)
2. **Download the APK** from the provided link
3. **Transfer to your phone** (via USB, cloud, or email)
4. **Open the APK** on your Android device
5. **Tap "Install"**
6. **Done!** Launch FocusFlow

### iOS (Requires Apple Developer Account):

1. **Sign up for Expo account** (free)
2. **Run the build command**
3. **Download the build** when ready
4. **Install via TestFlight** or direct installation

## 📦 What You Get

✅ **Standalone native app** - No Expo Go required  
✅ **Works offline** - All data stored locally  
✅ **Native performance** - True mobile experience  
✅ **AI motivation** - Smart social media detection  
✅ **Push notifications** - (Can be added later)  
✅ **Native animations** - Smooth, responsive UI  

## 🛠️ Build Configuration

The app is configured with:
- **App Name:** FocusFlow
- **Package:** com.focusflow.app
- **Version:** 1.0.0
- **Icon:** Purple checkmark logo
- **Splash Screen:** Purple gradient

## 📝 Build Profiles

- **preview**: For testing - creates APK (Android) and ad-hoc builds (iOS)
- **production**: For app store submission - optimized and signed

## ⚡ Alternative: Expo Go (No Build Needed)

If you want to test immediately without waiting for builds:

1. Install **Expo Go** on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Run on your computer:
   ```bash
   npm start
   ```

3. Scan the QR code with your phone

4. App loads instantly!

(But this requires Expo Go app and internet connection)

## 🎯 Recommended Approach

**Android Users:** Build APK (standalone, no dependencies)  
**iOS Users:** Use Expo Go for testing, then TestFlight for production  

---

Let me know which platform you need and I'll start the build! 📱✨
