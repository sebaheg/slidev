# Slidev Multi-Deck Repository

This repository hosts multiple [Slidev](https://sli.dev/) presentation decks, each automatically deployed to GitHub Pages.

## Repository Structure

```
├── decks/
│   ├── demo/              # Example deck (your presentations go here)
│   │   ├── slides.md
│   │   ├── components/    # Symlink to shared/components
│   │   └── snippets/      # Symlink to shared/snippets
│   └── _template/         # Template for new decks
├── shared/
│   ├── components/        # Shared Vue components
│   └── snippets/          # Shared code snippets
├── scripts/
│   ├── build-all.js       # Builds all decks for deployment
│   └── new-deck.js        # Creates a new deck from template
└── .github/workflows/
    └── deploy.yml         # GitHub Pages deployment
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start developing a specific deck
pnpm run dev:demo

# Build all decks
pnpm run build
```

## Creating a New Deck

```bash
pnpm run new my-presentation
```

This will:
1. Create `decks/my-presentation/` with a starter `slides.md`
2. Set up symlinks to shared components and snippets
3. Add npm scripts for the new deck

Then start developing:
```bash
pnpm run dev:my-presentation
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm run dev:<deck>` | Start dev server for a deck |
| `pnpm run build:<deck>` | Build a single deck |
| `pnpm run export:<deck>` | Export deck to PDF |
| `pnpm run build` | Build all decks for deployment |
| `pnpm run new <name>` | Create a new deck |

## GitHub Pages Deployment

Decks are automatically deployed to GitHub Pages on push to `main`.

Each deck is available at:
```
https://<username>.github.io/<repo>/<deck-name>/
```

The root URL displays an index page listing all available decks.

## Shared Resources

### Components
Place shared Vue components in `shared/components/`. They will be available in all decks.

### Snippets
Place reusable code snippets in `shared/snippets/`. Reference them in slides using Slidev's snippet syntax.

## Adding Deck-Specific Resources

If a deck needs its own components or assets, create them directly in the deck folder (not as symlinks):

```bash
mkdir decks/my-deck/assets
```

## Learn More

- [Slidev Documentation](https://sli.dev/)
- [Slidev GitHub](https://github.com/slidevjs/slidev)
