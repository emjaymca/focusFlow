# 🚀 Push FocusFlow to Your New Repository

## Quick Commands (Run in your terminal)

```bash
# Clone the standalone branch from MadDev
git clone -b focusflow-standalone https://github.com/emjaymca/MadDev.git focusflow-temp
cd focusflow-temp

# Remove the old remote and add your new repo
git remote remove origin
git remote add origin https://github.com/emjaymca/focusFlow.git

# Push to your new repository as main branch
git push -u origin focusflow-standalone:main

# Clean up
cd ..
rm -rf focusflow-temp
```

**Done!** Your FocusFlow app is now at: https://github.com/emjaymca/focusFlow 🎉

---

## Or Use GitHub CLI (Alternative)

```bash
# Clone the standalone branch
gh repo clone emjaymca/MadDev focusflow-temp -- -b focusflow-standalone
cd focusflow-temp

# Push to your new repo
git remote add new https://github.com/emjaymca/focusFlow.git
git push new focusflow-standalone:main

cd ..
rm -rf focusflow-temp
```

---

## What Gets Pushed

✅ Complete React Native mobile app  
✅ AI motivation system with social media detection  
✅ All components and screens  
✅ Build configuration (eas.json)  
✅ Complete documentation  
✅ No web files - clean mobile-only codebase  

---

## After Pushing

Your repository will be ready at:
**https://github.com/emjaymca/focusFlow**

Anyone can then:
```bash
git clone https://github.com/emjaymca/focusFlow.git
cd focusFlow
npm install
npm start
```

And scan the QR code with Expo Go! 📱✨
