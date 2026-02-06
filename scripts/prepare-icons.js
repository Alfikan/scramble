const fs = require('fs');
const path = require('path');

/**
 * Icon Preparation Script for Scramble
 * Checks and prepares icons for electron-builder
 */

const ICON_PATH = path.join(__dirname, '..', 'public', 'Logo.png');
const BUILD_RESOURCES = path.join(__dirname, '..', 'build-resources');

console.log('🎨 Scramble Icon Preparation\n');

// Check if Logo.png exists
if (!fs.existsSync(ICON_PATH)) {
  console.error('❌ Error: public/Logo.png not found!');
  console.log('\nPlease ensure you have a Logo.png file in the public/ directory.');
  console.log('Recommended size: 1024x1024 pixels');
  process.exit(1);
}

// Get file stats
const stats = fs.statSync(ICON_PATH);
const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('✅ Logo.png found!');
console.log(`   Size: ${fileSizeInMB} MB`);
console.log(`   Path: ${ICON_PATH}\n`);

// Create build-resources directory if it doesn't exist
if (!fs.existsSync(BUILD_RESOURCES)) {
  fs.mkdirSync(BUILD_RESOURCES, { recursive: true });
  console.log('✅ Created build-resources directory\n');
}

// Copy icon to build-resources for backup
const backupPath = path.join(BUILD_RESOURCES, 'icon.png');
fs.copyFileSync(ICON_PATH, backupPath);
console.log('✅ Icon backed up to build-resources/icon.png\n');

console.log('📋 Icon Requirements:');
console.log('   • Minimum size: 512x512 pixels');
console.log('   • Recommended: 1024x1024 pixels');
console.log('   • Format: PNG with transparency');
console.log('   • Color mode: RGB or RGBA\n');

console.log('🔧 Electron-builder will automatically convert Logo.png to:');
console.log('   • Windows: .ico (multiple sizes)');
console.log('   • macOS: .icns (multiple sizes)');
console.log('   • Linux: .png (multiple sizes)\n');

console.log('✨ Icon preparation complete!');
console.log('\nNext steps:');
console.log('   1. npm run build');
console.log('   2. npm run electron:build\n');

// Check if sharp is installed for better icon conversion
try {
  require.resolve('sharp');
  console.log('✅ Sharp is installed (better icon quality)');
} catch (e) {
  console.log('💡 Tip: Install sharp for better icon quality:');
  console.log('   npm install --save-dev sharp\n');
}

console.log('🎉 Ready to build Scramble for all platforms!');