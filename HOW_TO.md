# HOW_TO: Use This React Native Template Safely

This guide explains:

1. How to start from this template
2. Where your team should put application code
3. What you should not change if you want CI/CD to stay green
4. Which tests are required by the pipeline

## 1) Start From Template

1. Install dependencies:

```sh
npm install
```

2. Create runtime env file:

```sh
# macOS/Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

3. Set app values in `.env`:

- `RN_PUBLIC_APP_NAME`
- `RN_PUBLIC_APP_ENV` (`development`, `staging`, or `production`)
- `RN_PUBLIC_API_BASE_URL`

4. Run the app locally:

```sh
npm start
npm run android
# macOS only:
npm run pods
npm run ios
```

## 2) CI/CD Setup (Required Once Per Repo)

This template uses the workflow caller in `.github/workflows/mobile-pipeline-caller.yml`, which calls the central reusable mobile pipeline.

Set repository variable `MOBILE_SINGLE_SYSTEMS_JSON`:

```json
{ "name": "MyApp-Mobile", "dir": ".", "mobile_stack": "react-native" }
```

Pipeline triggers run on:

- Push to `test`, `uat`, `main`
- Pull requests targeting `test`, `uat`, `main`

## 3) Where To Put Your Code

Use this structure for day-to-day feature work:

- `src/features/<feature-name>/...`: screens, components, hooks, state for each feature
- `src/navigation/`: route definitions and navigator wiring
- `src/config/`: runtime config parsing and environment mapping
- `src/theme/`: colors, spacing, typography tokens
- `src/utils/`: shared utility functions
- `src/app/`: top-level app composition
- `tests/unit/`: Jest unit tests (`*.test.ts` / `*.test.tsx`)
- `.maestro/`: Maestro flow files (`*.yaml` / `*.yml`)

Recommended workflow:

1. Build features under `src/features`
2. Expose screens through `src/navigation/RootNavigator.tsx`
3. Keep app-level wiring in `src/app/App.tsx`
4. Add or update tests with each change

## 4) What You Must Not Break

These are CI/CD contract rules enforced by the mobile workflow.

### Repository and stack contracts

- Do not remove `package.json`
- Do not remove `tsconfig.json`
- Keep `react-native` and `typescript` dependencies present in `package.json`
- Keep `android/` and `ios/` directories in the repository
- Keep `tsconfig.compilerOptions.strict = true`

### TypeScript-only source contract

The React Native standard check fails if JS/JSX app source files exist.

Avoid creating:

- `App.js` or `App.jsx`
- `*.js` / `*.jsx` under common app source dirs such as `app`, `src`, `components`, `screens`, `features`, `hooks`, `utils`

Use `.ts` and `.tsx` for app code.

### Workflow and pipeline contracts

- Do not delete `.github/workflows/mobile-pipeline-caller.yml`
- Keep repository variable name `MOBILE_SINGLE_SYSTEMS_JSON` (or correctly configured `MOBILE_MULTI_SYSTEMS_JSON`)
- Keep `mobile_stack` set to `react-native` for this template system
- Keep `.maestro/` in the repository with at least one flow file

### Maestro and build contracts

By default, the reusable workflow runs Maestro with:

- Android: `maestro test .maestro/smoke-android.yaml`
- iOS: `maestro test .maestro/smoke-ios.yaml`

If you rename or relocate flow files, update package scripts and CI command overrides together.

## 5) Tests Required By CI/CD

The React Native lane uses this order:

1. Stage 1 checks (parallel):
   - React Native TypeScript standard check
   - Unit tests (Jest)
   - Lint
   - Security scan
2. Stage 2 builds (after Stage 1 passes):
   - Android build (`.apk`)
   - iOS simulator build (`.app` zipped artifact)
3. Stage 3 E2E (after each build succeeds):
   - Maestro Android E2E
   - Maestro iOS E2E

### Unit tests

- Command run by reusable workflow: `npx jest --coverage --verbose --ci --forceExit --runInBand`
- Coverage file expected: `coverage/coverage-summary.json`
- Coverage threshold default: `80%` (line coverage is enforced from summary; keep overall global coverage healthy)

### Lint

- Lint command default: `npx eslint . --max-warnings=0`
- Warnings are treated as failures in this template's local script as well

### Security

- Uses `npm audit --audit-level=high`
- `test` branch is relaxed for HIGH findings
- `uat` and `main` enforce HIGH/CRITICAL failure gates

### Maestro E2E

- Keep at least one reliable smoke flow in `.maestro/`
- Prefer stable `testID` selectors in UI components
- Ensure `.maestro/` includes valid YAML flow files

## 6) Local Pre-PR Checklist

Run this before creating a PR:

```sh
npm run verify
npm run maestro:validate
npm run maestro:test:android
# optional but recommended if you develop on macOS:
npm run maestro:test:ios
```

If all commands pass locally, CI failure risk is much lower.

## 7) Common Failure Causes

- `tsconfig` strict mode was disabled
- JS/JSX source files were added to app source folders
- Coverage dropped below threshold
- `.maestro/` was removed or has no flow files
- `MOBILE_SINGLE_SYSTEMS_JSON` was missing or had wrong `mobile_stack`
