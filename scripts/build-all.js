#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, mkdirSync, existsSync, cpSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const decksDir = join(rootDir, 'decks');
const distDir = join(rootDir, 'dist');

// Get all deck directories (excluding _template)
const decks = readdirSync(decksDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
  .map(dirent => dirent.name);

console.log(`Found ${decks.length} deck(s): ${decks.join(', ')}\n`);

// Clean and create dist directory
if (existsSync(distDir)) {
  execSync(`rm -rf "${distDir}"`);
}
mkdirSync(distDir, { recursive: true });

// Build each deck
for (const deck of decks) {
  const slidesPath = `decks/${deck}/slides.md`;
  const outPath = join(distDir, deck);
  console.log(`\n📦 Building deck: ${deck}`);

  try {
    // Build with base path set for GitHub Pages subdirectory
    // Use absolute path for --out to ensure correct output location
    execSync(`npx slidev build ${slidesPath} --base /${deck}/ --out "${outPath}"`, {
      cwd: rootDir,
      stdio: 'inherit'
    });
    console.log(`✅ Successfully built: ${deck}`);
  } catch (error) {
    console.error(`❌ Failed to build: ${deck}`);
    process.exit(1);
  }
}

// Create index.html that lists all decks
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slide Decks</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      padding: 2rem;
      color: #fff;
    }
    .container { max-width: 800px; margin: 0 auto; }
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2.5rem;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .decks {
      display: grid;
      gap: 1rem;
    }
    .deck {
      display: block;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      text-decoration: none;
      color: #fff;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .deck:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      border-color: rgba(102, 126, 234, 0.5);
    }
    .deck-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .deck-path {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Slide Decks</h1>
    <div class="decks">
      ${decks.map(deck => `
      <a href="./${deck}/" class="deck">
        <div class="deck-title">${deck.charAt(0).toUpperCase() + deck.slice(1).replace(/-/g, ' ')}</div>
        <div class="deck-path">/${deck}/</div>
      </a>`).join('')}
    </div>
  </div>
</body>
</html>`;

writeFileSync(join(distDir, 'index.html'), indexHtml);
console.log('\n✅ Created index.html');
console.log(`\n🎉 All ${decks.length} deck(s) built successfully!`);
