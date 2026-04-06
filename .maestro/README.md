# Maestro Starter Flows

This template ships with platform-specific smoke flows:

- smoke-android.yaml
- smoke-ios.yaml

Before first release, update appId values when you change package identifiers.

Recommended tags:

- `smoke` for short promotion-lane validation
- `android` or `ios` for platform targeting
- `regression` for longer nightly or manual suites

Run flows:

```sh
npm run maestro:test:android:smoke
npm run maestro:test:ios:smoke
npm run maestro:test:android:full
npm run maestro:test:ios:full
```
