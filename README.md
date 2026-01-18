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
pnpm dev demo

# Build all decks
pnpm build
```

## Creating a New Deck

```bash
pnpm new my-presentation
```

This will:
1. Create `decks/my-presentation/` with a starter `slides.md`
2. Set up symlinks to shared components and snippets

Then start developing:
```bash
pnpm dev my-presentation
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev <deck>` | Start dev server for a deck |
| `pnpm build:deck <deck>` | Build a single deck |
| `pnpm export <deck>` | Export deck to PDF |
| `pnpm build` | Build all decks for deployment |
| `pnpm new <name>` | Create a new deck |

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
