# Template Repo Mobile React Native

Plain React Native + TypeScript template aligned with ImplementSprint mobile repository conventions.

## Stack

- React Native CLI (bare workflow)
- TypeScript strict mode
- React Navigation (native stack)
- Jest unit tests
- Maestro E2E scaffolding (Android + iOS)
- GitHub Actions caller for central mobile pipeline

## Windows + Android local prerequisites

For local Android builds and Maestro runs on Windows, install and configure:

- Android Studio + Android SDK + Platform-tools
- Java 17 (Temurin/OpenJDK)
- Node.js 18+

Set environment variables (User scope recommended):

- ANDROID_HOME=C:\Users\<you>\AppData\Local\Android\Sdk
- JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.x.x
- Path includes %ANDROID_HOME%\platform-tools and Java bin

Then verify:

```powershell
adb version
java -version
npm --version
```

## E2E test commands

Primary path (recommended):

```bash
npm run maestro:validate
npm run maestro:test
```

Platform-specific:

```bash
npm run maestro:test:android
npm run maestro:test:ios
```

## Runtime config

Copy `.env.example` to `.env` and adjust:

- `RN_PUBLIC_APP_NAME`
- `RN_PUBLIC_APP_ENV`
- `RN_PUBLIC_API_BASE_URL`

Important: unlike Expo managed workflow, bare React Native does not automatically inject `.env` into native runtime by default. This template includes safe fallbacks in `src/config/appConfig.ts`, and `.env` values are reliable in Node-based contexts (tests/CI). If you need `.env` injected at app runtime, add an env bridge library (for example `react-native-config`) as a project decision.

## Central pipeline caller

This repo includes `.github/workflows/mobile-pipeline-caller.yml`, which forwards to the central reusable workflow with:

- `mobile_stack=react-native`
- default branches `test`,`uat`,`main` for push and pull_request
- Maestro enabled by default
- K6 disabled by default

Set repository variable `MOBILE_SINGLE_SYSTEMS_JSON` with:

```json
{ "name": "MyApp-Mobile", "dir": ".", "mobile_stack": "react-native" }
```

Manual dispatch supports optional JSON overrides via `systems_json_override`.

Example override for a second React Native app in the same repo:

```json
[{"name":"mobile-rn-alt","path":"apps/mobile-rn-alt","branch":"main","platform":"mobile","stack":"react-native"}]
```

Optional per-system flags can also be included when needed:

```json
{
  "name": "MyApp-Mobile",
  "dir": ".",
  "mobile_stack": "react-native",
  "enable_android_build": true,
  "enable_ios_build": true
}
```
