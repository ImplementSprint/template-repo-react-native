import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const isWindows = process.platform === 'win32';
const gradleWrapper = isWindows ? 'gradlew.bat' : './gradlew';
const androidDir = join(process.cwd(), 'android');
const gradleWrapperPath = join(androidDir, gradleWrapper);
const debugApkDir = join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug');
const expectedDebugApkPath = join(debugApkDir, 'app-debug.apk');
// Build only the app module artifacts Detox needs.
// Running root-level assembleAndroidTest can trigger additional module
// packaging outside app scope and is unnecessary for Detox binaries.
// x86_64 only — CI emulators are x86_64; building all ABIs quadruples build time.
const gradleTaskArgs = [
  ':app:assembleDebug',
  ':app:assembleAndroidTest',
  '-DtestBuildType=debug',
  '-PreactNativeArchitectures=x86_64',
];

function run(command: string, args: string[], cwd = process.cwd()): void {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows,
  });

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }

  if (typeof result.status !== 'number') {
    process.exit(1);
  }
}

function ensureAndroidProjectExists(): void {
  const hasAndroidDir = existsSync(androidDir);
  const hasGradleWrapper = existsSync(gradleWrapperPath);

  if (!hasAndroidDir || !hasGradleWrapper) {
    console.error('Missing bare React Native android project. Ensure android/ and gradlew are present.');
    process.exit(1);
  }
}

function runGradleBuild(): void {
  if (isWindows) {
    run(gradleWrapper, gradleTaskArgs, androidDir);
    return;
  }

  run('chmod', ['+x', './gradlew'], androidDir);
  run('bash', ['./gradlew', ...gradleTaskArgs], androidDir);
}

function ensureExpectedDebugApk(): void {
  if (existsSync(expectedDebugApkPath)) {
    return;
  }

  if (!existsSync(debugApkDir)) {
    console.error(`Missing APK output directory: ${debugApkDir}`);
    process.exit(1);
  }

  const debugApkCandidates = readdirSync(debugApkDir)
    .filter((fileName) => fileName.endsWith('.apk'))
    .sort((left, right) => left.localeCompare(right));

  const [firstCandidate] = debugApkCandidates;

  if (!firstCandidate) {
    console.error(`No debug APK found under: ${debugApkDir}`);
    process.exit(1);
  }

  const candidatePath = join(debugApkDir, firstCandidate);

  mkdirSync(debugApkDir, { recursive: true });
  copyFileSync(candidatePath, expectedDebugApkPath);
  console.log(`Normalized debug APK for Detox: ${firstCandidate} -> app-debug.apk`);
}

ensureAndroidProjectExists();
runGradleBuild();
ensureExpectedDebugApk();
