# 🎨 App Icon Setup for Scramble

## Overview

Scramble uses `public/Logo.png` as the source icon for all platforms (Windows, macOS, Linux). Electron-builder automatically converts this single PNG file to all required formats.

## 📁 Icon Location

```
scramble/
└── public/
    └── Logo.png  ← Your app icon (used for all platforms)
```

## ✅ Icon Requirements

### Specifications

| Property | Requirement |
|----------|-------------|
| **File Name** | `Logo.png` |
| **Location** | `public/` directory |
| **Minimum Size** | 512x512 pixels |
| **Recommended Size** | 1024x1024 pixels |
| **Format** | PNG |
| **Transparency** | Supported (RGBA) |
| **Color Mode** | RGB or RGBA |
| **File Size** | < 5 MB recommended |

### Why These Sizes?

- **512x512**: Minimum for good quality on all platforms
- **1024x1024**: Ensures crisp display on high-DPI screens (Retina, 4K)
- Electron-builder will automatically downscale to all required sizes

## 🔄 Automatic Conversion

When you build the app, electron-builder automatically converts `Logo.png` to:

### Windows (.ico)
- 256x256
- 128x128
- 64x64
- 48x48
- 32x32
- 16x16

### macOS (.icns)
- 1024x1024 (icon_512x512@2x)
- 512x512 (icon_512x512, icon_256x256@2x)
- 256x256 (icon_256x256, icon_128x128@2x)
- 128x128 (icon_128x128)
- 64x64 (icon_32x32@2x)
- 32x32 (icon_32x32, icon_16x16@2x)
- 16x16 (icon_16x16)

### Linux (.png)
- 512x512
- 256x256
- 128x128
- 64x64
- 48x48
- 32x32
- 16x16

## 🎨 Design Guidelines

### Best Practices

1. **Simple Design**
   - Clear and recognizable at small sizes
   - Avoid fine details that disappear when scaled down
   - Use bold, simple shapes

2. **Contrast**
   - Ensure good contrast against both light and dark backgrounds
   - Test on different desktop themes

3. **Padding**
   - Leave ~10% padding around the edges
   - Prevents icon from touching edges

4. **Transparency**
   - Use transparent background
   - Avoid white backgrounds (looks bad on light themes)

5. **Colors**
   - Use your brand colors
   - Ensure colors work at small sizes
   - Test in grayscale

### Example Icon Structure

```
┌─────────────────────┐
│  10% padding        │
│  ┌───────────────┐  │
│  │               │  │
│  │   Your Logo   │  │
│  │   (80% size)  │  │
│  │               │  │
│  └───────────────┘  │
│  10% padding        │
└─────────────────────┘
```

## 🛠️ Creating Your Icon

### Option 1: Use Existing Logo

If you already have `public/Logo.png`:

```bash
# Check if it meets requirements
npm run prepare-icons
```

### Option 2: Create New Icon

#### Using Design Software

**Figma / Sketch / Adobe XD:**
1. Create 1024x1024 artboard
2. Design your icon with 10% padding
3. Export as PNG
4. Save as `public/Logo.png`

**Photoshop / GIMP:**
1. New file: 1024x1024 pixels
2. Design with transparent background
3. Save as PNG-24 with transparency
4. Save as `public/Logo.png`

**Inkscape / Illustrator:**
1. Create 1024x1024 document
2. Design vector icon
3. Export as PNG (1024x1024)
4. Save as `public/Logo.png`

#### Using Online Tools

**Canva:**
1. Create custom size: 1024x1024
2. Design your icon
3. Download as PNG
4. Save as `public/Logo.png`

**Figma (Free):**
1. Create frame: 1024x1024
2. Design icon
3. Export as PNG
4. Save as `public/Logo.png`

### Option 3: Convert Existing Image

If you have an image in another format:

```bash
# Using ImageMagick (install first)
convert your-logo.jpg -resize 1024x1024 -background none -gravity center -extent 1024x1024 public/Logo.png

# Using online converter
# Upload to: https://convertio.co/
# Convert to PNG, resize to 1024x1024
```

## 🧪 Testing Your Icon

### 1. Visual Check

```bash
# Run preparation script
npm run prepare-icons
```

This will:
- ✅ Verify Logo.png exists
- ✅ Check file size
- ✅ Create backup
- ✅ Show requirements

### 2. Build Test

```bash
# Build for your platform
npm run electron:build:win   # Windows
npm run electron:build:mac   # macOS
npm run electron:build:linux # Linux
```

### 3. Check Built App

#### Windows
1. Navigate to `dist/`
2. Right-click `Scramble-*.exe`
3. Properties → Check icon
4. Install and check desktop shortcut

#### macOS
1. Open `dist/mac/`
2. Check app icon in Finder
3. Right-click → Get Info
4. Verify icon appears

#### Linux
1. Run AppImage: `./dist/Scramble-*.AppImage`
2. Check application menu
3. Verify desktop entry icon

## 🔧 Troubleshooting

### Icon Not Showing

**Problem:** Icon doesn't appear after building

**Solutions:**

1. **Check file exists:**
```bash
ls -la public/Logo.png
```

2. **Verify file size:**
```bash
file public/Logo.png
# Should show: PNG image data, 1024 x 1024 (or larger)
```

3. **Clear cache and rebuild:**
```bash
npx electron-builder clean
npm run build
npm run electron:build
```

4. **Check file permissions:**
```bash
chmod 644 public/Logo.png
```

### Icon Looks Blurry

**Problem:** Icon appears pixelated or blurry

**Solutions:**

1. **Increase source size:**
   - Use 1024x1024 or larger
   - Ensure PNG is not compressed

2. **Use vector source:**
   - Design in vector (SVG)
   - Export at high resolution

3. **Check DPI:**
   - Ensure 72 DPI or higher
   - Use 144 DPI for best results

### Icon Has White Background

**Problem:** Icon shows white box instead of transparency

**Solutions:**

1. **Re-export with transparency:**
   - Use PNG-24 format
   - Enable alpha channel
   - Save with transparency

2. **Remove background:**
```bash
# Using ImageMagick
convert Logo.png -fuzz 10% -transparent white Logo-transparent.png
```

### Different Icon on Different Platforms

**Problem:** Icon looks different on Windows vs macOS

**Solutions:**

1. **Test on all platforms:**
   - Build for each platform
   - Check icon appearance
   - Adjust design if needed

2. **Use platform-specific icons (advanced):**
```json
{
  "win": {
    "icon": "build-resources/icon.ico"
  },
  "mac": {
    "icon": "build-resources/icon.icns"
  },
  "linux": {
    "icon": "build-resources/icon.png"
  }
}
```

## 📊 Icon Checklist

Before building:

- [ ] Logo.png exists in public/ directory
- [ ] Size is at least 512x512 (1024x1024 recommended)
- [ ] Format is PNG with transparency
- [ ] Design is clear at small sizes
- [ ] Colors work on light and dark backgrounds
- [ ] Has appropriate padding (~10%)
- [ ] File size is reasonable (< 5 MB)
- [ ] Tested with `npm run prepare-icons`
- [ ] Built and verified on target platform

## 🎯 Quick Commands

```bash
# Check icon setup
npm run prepare-icons

# Build with icon for Windows
npm run electron:build:win

# Build with icon for macOS
npm run electron:build:mac

# Build with icon for Linux
npm run electron:build:linux

# Build for all platforms
npm run electron:build:all
```

## 📚 Additional Resources

- [Electron Icon Guidelines](https://www.electron.build/icons)
- [macOS Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/macos/icons-and-images/app-icon/)
- [Windows Icon Guidelines](https://docs.microsoft.com/en-us/windows/apps/design/style/iconography/app-icon-design)
- [Linux Icon Theme Spec](https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html)

## 🎨 Icon Design Tools

### Free Tools
- [Figma](https://www.figma.com/) - Web-based design
- [GIMP](https://www.gimp.org/) - Photo editor
- [Inkscape](https://inkscape.org/) - Vector graphics
- [Canva](https://www.canva.com/) - Online design

### Paid Tools
- Adobe Photoshop
- Adobe Illustrator
- Sketch (macOS)
- Affinity Designer

### Icon Generators
- [Icon Kitchen](https://icon.kitchen/)
- [App Icon Generator](https://appicon.co/)
- [MakeAppIcon](https://makeappicon.com/)

## ✨ Tips for Best Results

1. **Start with vector** - Design in vector format (SVG) for scalability
2. **Test at small sizes** - View at 16x16 to ensure clarity
3. **Use consistent style** - Match your brand identity
4. **Consider context** - Icon should work in taskbar, dock, and desktop
5. **Get feedback** - Test with users on different platforms

---

## 🎉 Your Icon is Ready!

With `public/Logo.png` properly set up, Scramble will have a professional icon on all platforms! 🚀

**Build command:**
```bash
npm run electron:build
```

The icon will automatically be applied to all platform builds! ✨