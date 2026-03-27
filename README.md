# Template Repo Mobile React Native

Plain React Native + TypeScript template aligned with ImplementSprint mobile repository conventions.

## Stack

- React Native CLI (bare workflow)
- TypeScript strict mode
- React Navigation (native stack)
- Jest unit tests
- Detox E2E scaffolding (Android + iOS)

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
bundle install
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
npm run detox:build
npm run detox:test
```

For iOS:

```sh
npm run detox:build:ios
npm run detox:test:ios
```

## Runtime Config

Copy `.env.example` to `.env` and adjust:

- `RN_PUBLIC_APP_NAME`
- `RN_PUBLIC_APP_ENV`
- `RN_PUBLIC_API_BASE_URL`

## Pipeline Caller

This repo includes [`.github/workflows/mobile-pipeline-caller.yml`](.github/workflows/mobile-pipeline-caller.yml).

Set repository variable `MOBILE_SINGLE_SYSTEMS_JSON` with:

```json
{ "name": "MyApp-Mobile", "dir": ".", "mobile_stack": "react-native" }
```

Use this value once central workflow routing includes `react-native` as a first-class stack.
