# ⚡ Electron Quick Reference - Scramble

## 🎯 One-Line Summary
**Single icon (`public/Logo.png`) → All platforms (Windows, macOS, Linux)**

---

## 📁 Icon Setup

```
public/Logo.png  ← 1024x1024 PNG with transparency
```

**That's it!** Electron-builder handles the rest.

---

## 🚀 Build Commands

```bash
# Verify icon
npm run prepare-icons

# Build for current platform
npm run electron:build

# Build for specific platform
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux

# Build for all platforms
npm run electron:build:all
```

---

## 📦 Output Files

```
dist/
├── Scramble-0.1.0-x64.exe        # Windows
├── Scramble-0.1.0-x64.dmg        # macOS
└── Scramble-0.1.0-x64.AppImage   # Linux
```

---

## ✅ Quick Checklist

- [ ] `public/Logo.png` exists (1024x1024)
- [ ] Run `npm run prepare-icons`
- [ ] Run `npm run build`
- [ ] Run `npm run electron:build`
- [ ] Test in `dist/` folder

---

## 🎨 Icon Requirements

| Property | Value |
|----------|-------|
| Location | `public/Logo.png` |
| Size | 1024x1024 pixels |
| Format | PNG with transparency |

---

## 🐛 Troubleshooting

**Icon not showing?**
```bash
npx electron-builder clean
npm run build
npm run electron:build
```

**Build fails?**
```bash
npm install
npm run build
npm run electron:build
```

---

## 📚 Full Documentation

- `ELECTRON_BUILD_GUIDE.md` - Complete guide
- `ICON_SETUP.md` - Icon details
- `ELECTRON_SETUP_SUMMARY.md` - Full summary

---

## 🎉 That's It!

```bash
npm run electron:build
```

Your app is in `dist/` with the correct icon on all platforms! 🚀