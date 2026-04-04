# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Compote** is a Svelte UI component library built on top of Ark UI, with additional custom components. It is published to npm via `npm publish`.

## Package Manager

Use **bun** exclusively for development. Do not use npm, pnpm, or yarn to install or run scripts.

```
bun install
bun run <script>
```

## Key Commands

| Purpose         | Command                                    |
| --------------- | ------------------------------------------ |
| Dev server      | `bun run dev`                              |
| Type-check      | `bun run check`                            |
| Lint            | `bun run lint`                             |
| Format          | `bun run format`                           |
| Build library   | `bun run prepack`                          |
| Build + publish | `npm publish` (runs prepack automatically) |

## Framework & Versions

- **Svelte 5** — runes mode is enabled project-wide (`$state`, `$derived`, `$effect`, `$props`). Do not use the legacy Options API (no `export let`, no `onMount` from svelte, no reactive statements `$:`).
- **SvelteKit 2** — used as the dev harness; the actual output is a library package.
- **Ark UI** (`@ark-ui/svelte`) — headless component primitives, listed as a peer dependency. Build on top of these where possible; add custom components when Ark UI doesn't cover the use case.
- **Tailwind CSS 4** — imported via `src/routes/layout.css`; use utility classes directly in components.

## Library Structure

- Components go in `src/lib/` and must be exported from `src/lib/index.ts`.
- The built package outputs to `dist/` (gitignored). Run `bun run build` to generate it.
- `src/routes/` is the dev playground only — not part of the published package.

## Code Style

- **Tabs** for indentation (enforced by Prettier).
- **Single quotes**, no trailing commas, 100-char print width.
- Tailwind classes are auto-sorted by `prettier-plugin-tailwindcss` on format.
- Run `bun run format` to fix formatting; `bun run lint` checks both Prettier and ESLint.

## Theming System

The theme lives in `src/lib/theme.css` (published as `dist/theme.css`).

### CSS variables

Semantic variables (all prefixed `--compote-`) are defined in `:root` and exposed to Tailwind via `@theme inline` (without the prefix, e.g. `--color-ink`, `bg-primary`).

| Variable                     | Tailwind utility             | Purpose                     |
| ---------------------------- | ---------------------------- | --------------------------- |
| `--compote-ink`              | `text-ink`                   | Primary text                |
| `--compote-ink-dim`          | `text-ink-dim`               | Secondary/muted text        |
| `--compote-ink-inverse`      | `text-ink-inverse`           | Text on colored backgrounds |
| `--compote-surface-{1,2,3}`  | `bg-surface-{1,2,3}`         | Surface layers (1=lightest) |
| `--compote-surface-document` | `bg-surface-document`        | Page background             |
| `--compote-well`             | `bg-well`                    | Inset/recessed backgrounds  |
| `--compote-primary`          | `bg-primary`, `text-primary` | Accent color (orange hue)   |
| `--compote-border`           | `border-border`              | Default border color        |
| `--compote-ring`             | `ring-ring`                  | Focus ring color            |

### Dark mode

Uses `light-dark()` CSS function — no `@media` block or duplicate variable declarations needed. `color-scheme: light dark` on `:root` auto-follows system preference. `.dark` / `.light` classes on `<html>` override it.

- Do **not** add a `@media (prefers-color-scheme: dark)` block — use `light-dark(lightVal, darkVal)` inline.
- Status colors (`--compote-primary`, `--compote-danger`, etc.) are the same in both modes — no `light-dark()` needed for them.

### Focus rings and colored-background text

- All focus rings use `ring-ring` (not `ring-primary`) so consumers can restyle via `--compote-ring`.
- Text on primary/colored backgrounds uses `text-ink-inverse` (not `text-white`) so consumers can restyle via `--compote-ink-inverse`.

## After Adding or Modifying a Component

When you add a new component or make significant changes to an existing one:

1. **Add a playground tab** — create `src/routes/contents/<ComponentName>Tab.svelte` with examples covering the component's key features, then register it in `src/routes/+page.svelte` (import + `Tabs.Trigger` + `Tabs.Content`), keeping entries in alphabetical order.

2. **Update the compote-ui skill** — the skill lives at `~/.claude/skills/compote-ui/references/`. Add or update the relevant reference file (e.g. `display.md`, `form.md`, `layout.md`). Document the component anatomy, props, and a minimal usage example.

## Svelte Component Authoring

- Always use the Svelte MCP server when creating or editing `.svelte` files.
- Components must be compatible with Svelte 5 runes; the `runes: true` compiler option is set globally.
- The rune-mode workaround in `svelte.config.js` (excluding `node_modules`) will be removable in Svelte 6 — do not remove it now.
- The Prettier config's `tailwindStylesheet` points to `./src/routes/layout.css` — do not move that file without updating `.prettierrc`.
