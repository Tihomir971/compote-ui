---
name: theming
description: >
  Load when configuring compote-ui/theme.css, Tailwind CSS 4 integration, CSS
  variables, dark and light mode, class overrides, focus rings, consumer brand
  tokens, --compote-* variables, @theme inline, or color-scheme behavior.
metadata:
  type: core
  library: compote-ui
  library_version: '0.62.1'
sources:
  - src/lib/theme.css
  - src/routes/layout.css
  - .prettierrc
  - CLAUDE.md
---

# Compote UI — Theming

Import `tailwindcss` first, then `compote-ui/theme.css`. Override `--compote-*` variables in the consuming app.

## Setup

```css
@import 'tailwindcss';
@import 'compote-ui/theme.css';

:root {
	--compote-primary: oklch(55% 0.2 270);
	--compote-ring: var(--compote-primary);
	--radius: 4px;
	--font-sans: Inter, sans-serif;
}
```

## Core Patterns

### Override semantic tokens

```css
:root {
	--compote-ink: light-dark(var(--gray-15), var(--gray-1));
	--compote-ink-dim: light-dark(var(--gray-11), var(--gray-5));
	--compote-surface-1: light-dark(var(--gray-3), var(--gray-13));
	--compote-surface-document: light-dark(var(--gray-2), var(--gray-14));
	--compote-border: var(--compote-surface-3);
}
```

`theme.css` maps these to Tailwind utilities such as `text-ink`, `bg-surface-1`, `border-border`, and `ring-ring`.

### Force light or dark mode

```svelte
<svelte:head>
	<script>
		document.documentElement.classList.toggle('dark', true);
	</script>
</svelte:head>
```

The theme follows system preference by default through `color-scheme: light dark`.

### Extend component classes through class props

```svelte
<Button class="rounded-full px-5">Save</Button>
<Dialog.Root contentClass="max-w-4xl">
	<Dialog.Title>Wide dialog</Dialog.Title>
</Dialog.Root>
```

Components merge class props with defaults; use token utilities instead of hard-coded colors.

## Common Mistakes

### HIGH Adding duplicate dark media block

Wrong:

```css
@media (prefers-color-scheme: dark) {
	:root {
		--compote-surface-1: #111;
	}
}
```

Correct:

```css
:root {
	--compote-surface-1: light-dark(var(--gray-3), var(--gray-13));
}

.dark {
	color-scheme: dark;
}

.light {
	color-scheme: light;
}
```

The theme uses `light-dark()` plus `color-scheme`, so duplicating dark variables fights the model.

Source: `src/lib/theme.css`, `CLAUDE.md`

### MEDIUM Styling colored text as white

Wrong:

```svelte
<Button class="text-white">Save</Button>
```

Correct:

```svelte
<Button class="text-ink-inverse">Save</Button>
```

Text on colored backgrounds should use `text-ink-inverse` so consumers can retheme it.

Source: `CLAUDE.md`, `src/lib/theme.css`

### MEDIUM Using primary for focus rings

Wrong:

```svelte
<input class="focus-visible:ring-primary" />
```

Correct:

```svelte
<input class="focus-visible:ring-ring" />
```

Focus rings should use `ring-ring` so `--compote-ring` can be customized independently.

Source: `CLAUDE.md`, `src/lib/theme.css`

## References

- [Theme tokens](references/theme-tokens.md)
