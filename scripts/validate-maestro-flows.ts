import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

function collectFlowFiles(rootDir: string): string[] {
  const stack: string[] = [rootDir];
  const flowFiles: string[] = [];

  while (stack.length > 0) {
    const currentPath = stack.pop();
    if (!currentPath) {
      continue;
    }

    for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
      const fullPath = resolve(currentPath, entry.name);

      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile() && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml'))) {
        flowFiles.push(fullPath);
      }
    }
  }

  return flowFiles.sort((left, right) => left.localeCompare(right));
}

function main(): void {
  const maestroDir = resolve(process.cwd(), '.maestro');

  if (!existsSync(maestroDir) || !statSync(maestroDir).isDirectory()) {
    console.error('Required .maestro directory was not found.');
    console.error('Create .maestro and add at least one flow file (*.yaml or *.yml).');
    process.exit(1);
  }

  const flowFiles = collectFlowFiles(maestroDir);
  if (flowFiles.length === 0) {
    console.error('No Maestro flow files were found under .maestro/.');
    console.error('Add at least one flow file (*.yaml or *.yml).');
    process.exit(1);
  }

  const validationErrors: string[] = [];

  console.log(`Found ${flowFiles.length} Maestro flow file(s):`);
  for (const flowFile of flowFiles) {
    const relativePath = relative(process.cwd(), flowFile);
    const flowText = readFileSync(flowFile, 'utf8');
    const headerText = flowText.split(/^---\s*$/m, 1)[0] ?? flowText;
    const appIdMatch = headerText.match(/^\s*appId:\s*(\S+)/m);
    const tagsMatch = headerText.match(/^\s*tags:\s*\r?\n((?:\s*-\s*[^\r\n]+\r?\n?)*)/m);
    const tags =
      tagsMatch?.[1]
        ?.split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith('- '))
        .map((line) => line.slice(2).trim()) ?? [];

    if (!appIdMatch) {
      validationErrors.push(`${relativePath}: missing appId in flow header.`);
    }

    if (!tags.includes('android') && !tags.includes('ios')) {
      validationErrors.push(`${relativePath}: missing platform tag (android or ios).`);
    }

    if (!tags.includes('smoke') && !tags.includes('regression')) {
      validationErrors.push(`${relativePath}: missing execution-tier tag (smoke or regression).`);
    }

    console.log(`- ${relativePath}`);
    if (tags.length > 0) {
      console.log(`  tags: ${tags.join(', ')}`);
    }
  }

  if (validationErrors.length > 0) {
    console.error('Maestro flow validation failed:');
    for (const validationError of validationErrors) {
      console.error(`- ${validationError}`);
    }
    process.exit(1);
  }
}

main();
