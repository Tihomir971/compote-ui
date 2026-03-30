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

## Svelte Component Authoring

- Always use the Svelte MCP server when creating or editing `.svelte` files.
- Components must be compatible with Svelte 5 runes; the `runes: true` compiler option is set globally.
- The rune-mode workaround in `svelte.config.js` (excluding `node_modules`) will be removable in Svelte 6 — do not remove it now.
- The Prettier config's `tailwindStylesheet` points to `./src/routes/layout.css` — do not move that file without updating `.prettierrc`.
