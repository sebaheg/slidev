#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const decksDir = join(rootDir, 'decks');

const deckName = process.argv[2];

if (!deckName) {
  const decks = readdirSync(decksDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => d.name);

  console.log('Usage: pnpm export <deck-name>\n');
  console.log('Available decks:');
  decks.forEach(d => console.log(`  - ${d}`));
  process.exit(1);
}

const slidesPath = join(decksDir, deckName, 'slides.md');

if (!existsSync(slidesPath)) {
  console.error(`Error: Deck "${deckName}" not found at ${slidesPath}`);
  process.exit(1);
}

execSync(`npx slidev export "${slidesPath}"`, {
  cwd: rootDir,
  stdio: 'inherit'
});
