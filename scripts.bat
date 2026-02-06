npm run build

npx cap copy

@REM Run and test Windows
npx cap open @capacitor-community/electron

Navigate into the electron folder: cd electron.

@REM Run the build script:

@REM Windows:
npm run electron:make-windows

@REM Mac: 
npm run electron:make-mac

@REM Linux: 
npm run electron:make-linux