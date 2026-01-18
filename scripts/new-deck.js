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
  console.error('Usage: pnpm new <deck-name>');
  console.error('Example: pnpm new my-presentation');
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

console.log(`\n✅ Created new deck: ${deckName}`);
console.log(`\nTo start developing:`);
console.log(`  pnpm dev ${deckName}`);
console.log(`\nTo build:`);
console.log(`  pnpm build:deck ${deckName}`);
console.log(`\nTo export to PDF:`);
console.log(`  pnpm export ${deckName}`);
