#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync, existsSync, symlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const decksDir = join(rootDir, 'decks');
const templateDir = join(decksDir, '_template');

const deckName = process.argv[2];

if (!deckName) {
  console.error('Usage: npm run new <deck-name>');
  console.error('Example: npm run new my-presentation');
  process.exit(1);
}

// Validate deck name (lowercase, alphanumeric, hyphens only)
if (!/^[a-z0-9-]+$/.test(deckName)) {
  console.error('Error: Deck name must be lowercase alphanumeric with hyphens only');
  process.exit(1);
}

const newDeckDir = join(decksDir, deckName);

if (existsSync(newDeckDir)) {
  console.error(`Error: Deck "${deckName}" already exists`);
  process.exit(1);
}

console.log(`Creating new deck: ${deckName}`);

// Create deck directory
mkdirSync(newDeckDir, { recursive: true });

// Copy template slides.md
const templateSlides = readFileSync(join(templateDir, 'slides.md'), 'utf-8');
const newSlides = templateSlides.replace(/{{DECK_NAME}}/g, deckName);
writeFileSync(join(newDeckDir, 'slides.md'), newSlides);

// Create symlinks to shared resources
try {
  symlinkSync('../../shared/components', join(newDeckDir, 'components'));
  symlinkSync('../../shared/snippets', join(newDeckDir, 'snippets'));
} catch (error) {
  console.warn('Warning: Could not create symlinks (may need admin rights on Windows)');
}

// Read and update package.json to add scripts for new deck
const packageJsonPath = join(rootDir, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

packageJson.scripts[`dev:${deckName}`] = `slidev decks/${deckName}/slides.md --open`;
packageJson.scripts[`build:${deckName}`] = `slidev build decks/${deckName}/slides.md`;
packageJson.scripts[`export:${deckName}`] = `slidev export decks/${deckName}/slides.md`;

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`\n✅ Created new deck: ${deckName}`);
console.log(`\nTo start developing:`);
console.log(`  npm run dev:${deckName}`);
console.log(`\nTo build:`);
console.log(`  npm run build:${deckName}`);
