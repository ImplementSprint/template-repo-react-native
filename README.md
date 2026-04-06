# Template Repo Mobile React Native

Plain React Native + TypeScript template aligned with ImplementSprint mobile repository conventions.

## Stack

- React Native CLI (bare workflow)
- TypeScript strict mode
- React Navigation (native stack)
- Jest unit tests
- Maestro E2E scaffolding (Android + iOS)

## Windows Android Prerequisites

Install and configure these once before running Android locally:

1. Install Node.js 20+ and JDK 17.
2. Install Android Studio.
3. In Android Studio SDK Manager, install:
	- Android SDK Platform 36
	- Android SDK Build-Tools 36
	- Android SDK Platform-Tools
	- Android Emulator
4. Set environment variables (PowerShell example):

```powershell
$env:ANDROID_HOME = "C:\Users\<you>\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\<you>\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\\platform-tools;$env:ANDROID_HOME\\emulator"
```

5. Create and start an Android emulator from Android Studio.
6. Validate setup:

```sh
npx react-native doctor
adb --version
```

If `doctor` reports missing `ANDROID_HOME`, missing SDK 36, or `adb` not recognized, fix those first.

## Quick Start

1. Install dependencies.

```sh
npm install
```

1. Start Metro.

```sh
npm start
```

1. Run Android app.

```sh
npm run android
```

1. Run iOS app (macOS only).

```sh
npm run pods
npm run ios
```

## Quality Gates

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run verify
```

## E2E

```sh
npm run maestro:validate
npm run maestro:test:android
```

For iOS:

```sh
npm run maestro:test:ios
```

## Runtime Config

Copy `.env.example` to `.env` and adjust:

- `RN_PUBLIC_APP_NAME`
- `RN_PUBLIC_APP_ENV`
- `RN_PUBLIC_API_BASE_URL`

Important: unlike Expo managed workflow, bare React Native does not automatically inject `.env` into native runtime by default. This template includes safe fallbacks in `src/config/appConfig.ts`, and `.env` values are reliable in Node-based contexts (tests/CI). If you need `.env` injected at app runtime, add an env bridge library (for example `react-native-config`) as a project decision.

## Pipeline Caller

This repo includes [`.github/workflows/mobile-pipeline-caller.yml`](.github/workflows/mobile-pipeline-caller.yml).

Set repository variable `MOBILE_SINGLE_SYSTEMS_JSON` with:

```json
{ "name": "MyApp-Mobile", "dir": ".", "mobile_stack": "react-native" }
```

Optional overrides:

```json
{
	"name": "MyApp-Mobile",
	"dir": ".",
	"mobile_stack": "react-native",
	"enable_android_build": true,
	"enable_ios_build": true
}
```

`enable_android_build` and `enable_ios_build` are already `true` by default in central workflows. You only need to set them when you want to disable one (set to `false`) or make intent explicit.
