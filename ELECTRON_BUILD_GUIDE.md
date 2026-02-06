# 🖥️ Electron Build Guide for Scramble

## Overview

This guide explains how to build Scramble as a desktop application for Windows, macOS, and Linux using Electron.

## 📋 Prerequisites

### Required Software
- Node.js 16+ installed
- npm or yarn
- Git

### Platform-Specific Requirements

#### Windows
- Windows 7 or later
- No additional requirements for building

#### macOS
- macOS 10.13 or later
- Xcode Command Line Tools: `xcode-select --install`
- For code signing (optional):
  - Apple Developer account
  - Valid Developer ID certificate

#### Linux
- Ubuntu 18.04+ / Debian 10+ / Fedora 30+
- Required packages:
```bash
sudo apt-get install -y libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

## 🎨 App Icon Setup

### Icon Requirements

The app uses `public/Logo.png` as the source icon. Electron-builder will automatically convert it to the required formats:

**Windows (.ico):**
- 256x256, 128x128, 64x64, 48x48, 32x32, 16x16

**macOS (.icns):**
- 1024x1024, 512x512, 256x256, 128x128, 64x64, 32x32, 16x16

**Linux (.png):**
- 512x512, 256x256, 128x128, 64x64, 48x48, 32x32, 16x16

### Icon Preparation

Your `public/Logo.png` should be:
- **Minimum size:** 512x512 pixels
- **Recommended size:** 1024x1024 pixels
- **Format:** PNG with transparency
- **Color mode:** RGB or RGBA

If you need to create platform-specific icons manually:

```bash
# Install icon generator
npm install -g electron-icon-maker

# Generate icons from Logo.png
electron-icon-maker --input=public/Logo.png --output=build-resources
```

## 🔧 Configuration

The electron-builder configuration is in `electron/electron-builder.config.json`:

### Key Settings

```json
{
  "appId": "com.scramble.app",
  "productName": "Scramble",
  "win": {
    "icon": "public/Logo.png"  // Windows icon
  },
  "mac": {
    "icon": "public/Logo.png",  // macOS icon
    "category": "public.app-category.education"
  },
  "linux": {
    "icon": "public/Logo.png",  // Linux icon
    "category": "Education"
  }
}
```

## 🚀 Building the App

### 1. Install Dependencies

```bash
npm install
```

### 2. Build React App

```bash
npm run build
```

This creates the production build in the `build/` directory.

### 3. Build Desktop App

#### Build for Current Platform

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

#### Build for All Platforms (requires platform-specific tools)

```bash
npm run electron:build
```

### 4. Build Specific Targets

#### Windows

```bash
# NSIS Installer (recommended)
npx electron-builder --win nsis

# Portable executable
npx electron-builder --win portable

# Both
npx electron-builder --win nsis portable
```

#### macOS

```bash
# DMG (recommended)
npx electron-builder --mac dmg

# ZIP
npx electron-builder --mac zip

# Both
npx electron-builder --mac dmg zip
```

#### Linux

```bash
# AppImage (recommended)
npx electron-builder --linux AppImage

# Debian package
npx electron-builder --linux deb

# RPM package
npx electron-builder --linux rpm

# Snap package
npx electron-builder --linux snap

# All formats
npx electron-builder --linux AppImage deb rpm snap
```

## 📦 Output Files

Built applications will be in the `dist/` directory:

```
dist/
├── win-unpacked/              # Windows unpacked files
├── Scramble-0.1.0-x64.exe    # Windows installer
├── Scramble-0.1.0-portable.exe # Windows portable
├── mac/                       # macOS unpacked files
├── Scramble-0.1.0-x64.dmg    # macOS installer
├── Scramble-0.1.0-x64.zip    # macOS zip
├── linux-unpacked/            # Linux unpacked files
├── Scramble-0.1.0-x64.AppImage # Linux AppImage
├── Scramble-0.1.0-amd64.deb  # Debian package
└── Scramble-0.1.0-x86_64.rpm # RPM package
```

## 🔐 Code Signing

### Windows

1. Obtain a code signing certificate
2. Set environment variables:

```bash
set CSC_LINK=path/to/certificate.pfx
set CSC_KEY_PASSWORD=your_password
```

3. Build with signing:

```bash
npx electron-builder --win --publish never
```

### macOS

1. Obtain Apple Developer ID certificate
2. Set environment variables:

```bash
export APPLE_ID=your@email.com
export APPLE_ID_PASSWORD=app-specific-password
export APPLE_TEAM_ID=your_team_id
```

3. Build with signing and notarization:

```bash
npx electron-builder --mac --publish never
```

### Linux

Linux doesn't require code signing, but you can sign packages:

```bash
# Sign Debian package
dpkg-sig --sign builder Scramble-0.1.0-amd64.deb

# Sign RPM package
rpm --addsign Scramble-0.1.0-x86_64.rpm
```

## 🧪 Testing the Build

### Before Building

```bash
# Test in development mode
npm run electron:dev
```

### After Building

#### Windows
- Double-click the `.exe` installer
- Or run the portable `.exe`

#### macOS
- Open the `.dmg` file
- Drag Scramble to Applications
- Or extract the `.zip` and run

#### Linux
- Make AppImage executable: `chmod +x Scramble-*.AppImage`
- Run: `./Scramble-*.AppImage`
- Or install `.deb`: `sudo dpkg -i Scramble-*.deb`
- Or install `.rpm`: `sudo rpm -i Scramble-*.rpm`

## 🐛 Troubleshooting

### Icon Not Showing

**Problem:** App icon doesn't appear after building

**Solutions:**
1. Ensure `public/Logo.png` exists and is at least 512x512
2. Clear electron-builder cache:
```bash
npx electron-builder clean
```
3. Rebuild:
```bash
npm run build && npm run electron:build
```

### Build Fails on Windows

**Problem:** NSIS build fails

**Solutions:**
1. Install NSIS: Download from https://nsis.sourceforge.io/
2. Add NSIS to PATH
3. Restart terminal and rebuild

### Build Fails on macOS

**Problem:** Code signing fails

**Solutions:**
1. Skip code signing for testing:
```bash
export CSC_IDENTITY_AUTO_DISCOVERY=false
npx electron-builder --mac
```
2. Or remove `afterSign` from config temporarily

### Build Fails on Linux

**Problem:** Missing dependencies

**Solutions:**
```bash
# Ubuntu/Debian
sudo apt-get install -y libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2

# Fedora
sudo dnf install gtk3 libnotify GConf2 nss libXScrnSaver alsa-lib

# Arch
sudo pacman -S gtk3 libnotify gconf nss libxss alsa-lib
```

## 📝 Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "electron:dev": "electron .",
    "electron:build": "electron-builder",
    "electron:build:win": "electron-builder --win",
    "electron:build:mac": "electron-builder --mac",
    "electron:build:linux": "electron-builder --linux",
    "electron:build:all": "electron-builder -mwl"
  }
}
```

## 🚢 Publishing

### Auto-Update Setup

1. Configure GitHub releases in `electron-builder.config.json`:

```json
{
  "publish": {
    "provider": "github",
    "owner": "your-username",
    "repo": "scramble"
  }
}
```

2. Build and publish:

```bash
# Set GitHub token
export GH_TOKEN=your_github_token

# Build and publish
npx electron-builder --publish always
```

### Manual Distribution

1. Build for all platforms
2. Upload to your website or distribution platform
3. Create release notes
4. Notify users

## 📊 Build Optimization

### Reduce Bundle Size

1. **Remove dev dependencies from production:**
```json
{
  "build": {
    "files": [
      "build/**/*",
      "electron/**/*",
      "!**/*.map"
    ]
  }
}
```

2. **Use asar archive:**
```json
{
  "asar": true
}
```

3. **Compress with UPX (Windows/Linux):**
```json
{
  "compression": "maximum"
}
```

### Faster Builds

1. **Build for specific architecture:**
```bash
npx electron-builder --x64
```

2. **Skip unnecessary targets:**
```bash
npx electron-builder --win nsis --x64
```

3. **Use build cache:**
```bash
# Cache is enabled by default
# Clear if needed: npx electron-builder clean
```

## 🔍 Verification

### Check Icon

#### Windows
- Right-click `.exe` → Properties → Check icon

#### macOS
- Open Finder → Check app icon
- Get Info → Check icon

#### Linux
- Check desktop entry icon
- Application menu icon

### Check App Info

#### Windows
- Right-click `.exe` → Properties → Details

#### macOS
- Get Info → Check version, copyright

#### Linux
- Check `.desktop` file
- Application properties

## 📚 Additional Resources

- [Electron Builder Docs](https://www.electron.build/)
- [Electron Docs](https://www.electronjs.org/docs)
- [Icon Guidelines](https://www.electron.build/icons)
- [Code Signing Guide](https://www.electron.build/code-signing)

## ✅ Checklist

Before building for production:

- [ ] Logo.png is at least 512x512 pixels
- [ ] React app builds successfully (`npm run build`)
- [ ] App runs in dev mode (`npm run electron:dev`)
- [ ] Version number updated in package.json
- [ ] Copyright year is current
- [ ] GitHub repo configured (if using auto-update)
- [ ] Code signing certificates ready (if applicable)
- [ ] All dependencies installed
- [ ] Build tested on target platform

---

## 🎉 Ready to Build!

Your Scramble app is now configured to build for Windows, macOS, and Linux with the correct icon on all platforms!

**Quick Build:**
```bash
npm run build && npm run electron:build
```

The built apps will be in the `dist/` directory, ready to distribute! 🚀