#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readdirSync, symlinkSync, unlinkSync, lstatSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const decksDir = join(rootDir, 'decks');

const deckName = process.argv[2];

if (!deckName) {
  // List available decks
  const decks = readdirSync(decksDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_'))
    .map(d => d.name);

  console.log('Usage: pnpm dev <deck-name>\n');
  console.log('Available decks:');
  decks.forEach(d => console.log(`  - ${d}`));
  process.exit(1);
}

const slidesPath = join(decksDir, deckName, 'slides.md');
const deckDir = join(decksDir, deckName);

if (!existsSync(slidesPath)) {
  console.error(`Error: Deck "${deckName}" not found at ${slidesPath}`);
  process.exit(1);
}

// Create symlinks for shared assets (plotly, images) in deck directory for dev
const assetsToLink = ['plotly', 'images'];
for (const asset of assetsToLink) {
  const srcPath = join(rootDir, asset);
  const linkPath = join(deckDir, asset);
  
  if (existsSync(srcPath)) {
    // Remove existing symlink if present
    if (existsSync(linkPath)) {
      try {
        const stats = lstatSync(linkPath);
        if (stats.isSymbolicLink()) {
          unlinkSync(linkPath);
        }
      } catch (e) {
        // ignore
      }
    }
    
    // Create symlink if it doesn't exist
    if (!existsSync(linkPath)) {
      try {
        symlinkSync(srcPath, linkPath, 'dir');
        console.log(`✅ Linked ${asset}/ for development`);
      } catch (e) {
        console.warn(`⚠️ Could not create symlink for ${asset}/: ${e.message}`);
      }
    }
  }
}

execSync(`npx slidev "${slidesPath}" --open`, {
  cwd: rootDir,
  stdio: 'inherit'
});
