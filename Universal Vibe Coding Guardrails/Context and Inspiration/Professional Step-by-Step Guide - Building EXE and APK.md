# Professional Step-by-Step Guide: Building EXE and APK

## Building Windows EXE (Desktop Application)

### Prerequisites Verification:

1. Rust and Cargo installed (already confirmed with `cargo --version`)
2. Visual Studio Build Tools or Visual Studio with C++ build tools

### Detailed Steps:

1. __Navigate to your project directory__:

   ```bash
   cd glass-media-flow-main
   ```

2. __Build the web application__:

   ```bash
   npm run build
   ```

   Expected output:

   ```javascript
   vite v5.4.19 building for production...
   ✓ 1715 modules transformed.
   dist/index.html                  1.00 kB │ gzip:   0.43 kB
   dist/assets/index-MIba6XnO.css  66.28 kB │ gzip:  11.77 kB
   dist/assets/index-SA56mhoP.js  340.67 kB │ gzip: 109.55 kB
   ✓ built in 8.20s
   ```

3. __Build the Windows EXE with Tauri__:

   ```bash
   npm run tauri build
   ```

   Expected output:

   ```javascript
   ✔ Building Cargo project for x86_64-pc-windows-msvc
   Finished release [optimized] target(s) in 2m 30s
   ✔ Built application at: src-tauri\target\release\app.exe
   ```

4. __Locate your EXE files__:

   - Main executable: `glass-media-flow-main\src-tauri\target\release\app.exe`
   - Installer (NSIS): `glass-media-flow-main\src-tauri\target\release\bundle\nsis\Glass Media Flow_0.1.0_x64_en-US.msi`

## Building Android APK

### Prerequisites Verification:

1. Android SDK tools installed
2. Java 21 configured (already confirmed with `java -version`)

### Detailed Steps:

1. __Navigate to your project directory__:

   ```bash
   cd glass-media-flow-main
   ```

2. __Build web assets and copy to native projects__:

   ```bash
   npm run mobile
   ```

   Expected output:

   ```javascript
   > vite_react_shadcn_ts@0.0.0 build
   > vite build

   vite v5.4.19 building for production...
   ✓ 1715 modules transformed.
   dist/index.html                  1.00 kB │ gzip:   0.43 kB
   dist/assets/index-MIba6XnO.css  66.28 kB │ gzip:  11.77 kB
   dist/assets/index-SA56mhoP.js  340.67 kB │ gzip: 109.55 kB
   ✓ built in 8.20s
   √ Copying web assets from dist to android\app\src\main\assets\public in 120.96ms
   √ Copying web assets from dist to ios\App\App\public in 40.57ms
   ```

3. __Build the Android APK__:

   ```bash
   npx cap build android
   ```

   Expected output:

   ```javascript
   √ Running Gradle build in 1377.51s
   √ Built android-release.apk in 15.23s
   ```

4. __Locate your APK file__:

   - Path: `glass-media-flow-main\android\app\build\outputs\apk\debug\app-debug.apk`
   - Size: Approximately 7-8 MB

## Alternative Quick Build Commands

### For Windows EXE (One-liner):

```bash
cd glass-media-flow-main && npm run build && npm run tauri build
```

### For Android APK (One-liner):

```bash
cd glass-media-flow-main && npm run mobile && npx cap build android
```

## Testing Your Applications

### Windows EXE Testing:

1. Double-click the EXE file: `glass-media-flow-main\src-tauri\target\release\app.exe`

2. Or run from command line:

   ```bash
   .\glass-media-flow-main\src-tauri\target\release\app.exe
   ```

### Android APK Testing:

1. Transfer APK to Android device

2. Enable "Install from Unknown Sources" in device settings

3. Open file manager and tap on `app-debug.apk`

4. Or install via ADB:

   ```bash
   adb install glass-media-flow-main\android\app\build\outputs\apk\debug\app-debug.apk
   ```

Both your Windows desktop application and Android mobile application are now ready for distribution and testing!

---


Step-by-Step Guide: Building EXE and APK
Building Windows EXE (Desktop App)
Prerequisites:
Rust and Cargo installed (already verified)
Visual Studio Build Tools or Visual Studio with C++ build tools
Steps:
Navigate to project root:

cd glass-media-flow-main

Build the Vite app:

npm run build

Build the Windows EXE with Tauri:

npm run tauri build

Locate your EXE:

Path: src-tauri\target\release\app.exe
Installer: src-tauri\target\release\bundle\nsis\*.exe
Building Android APK
Prerequisites:
Android SDK tools installed
Java 21 (already installed and configured)
Steps:
Navigate to project root:

cd glass-media-flow-main

Build web assets and copy to native projects:

npm run mobile

Build the Android APK:

npx cap build android

Locate your APK:

Path: android\app\build\outputs\apk\debug\app-debug.apk
Alternative Quick Commands
For Windows EXE:
# Single command to build everything
npm run build && npm run tauri build

For Android APK:
# Single command to build everything
npm run mobile && npx cap build android

Both executables are now ready for distribution and testing!



Start New Task