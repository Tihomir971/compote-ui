---
name: getting-started
description: >
  Load when setting up compote-ui in a Svelte or SvelteKit app. Covers npm install,
  bun add, importing tailwindcss before compote-ui/theme.css, first imports from
  compote-ui, Toast.Toaster placement, Svelte 5 runes usage, and peer dependency basics.
metadata:
  type: lifecycle
  library: compote-ui
  library_version: '0.62.1'
sources:
  - package.json
  - README.md
  - CLAUDE.md
  - AGENTS.md
  - src/lib/index.ts
  - src/routes/layout.css
  - src/lib/theme.css
---

# Compote UI — Getting Started

Use Svelte 5 runes, import Tailwind first, then import `compote-ui/theme.css`.

## Setup

```bash
npm install compote-ui
```

```bash
bun add compote-ui
```

```css
@import 'tailwindcss';
@import 'compote-ui/theme.css';
```

```svelte
<script lang="ts">
	import { Button, Card } from 'compote-ui';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Account</Card.Title>
		<Card.Description>Manage account settings.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button>Save</Button>
	</Card.Content>
</Card.Root>
```

## Core Patterns

### Use Svelte 5 bindings

```svelte
<script lang="ts">
	import { Dialog, Button } from 'compote-ui';

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open</Button>

<Dialog.Root bind:open>
	<Dialog.Title>Confirm</Dialog.Title>
	<Dialog.Description>Confirm the action.</Dialog.Description>
</Dialog.Root>
```

### Render toast output once

```svelte
<script lang="ts">
	import { Toast } from 'compote-ui';

	let { children } = $props();
</script>

<Toast.Toaster />
{@render children()}
```

```ts
import { toast } from 'compote-ui';

toast.success('Saved');
```

### Add optional peers only when used

```bash
bun add @tanstack/svelte-table
```

```bash
bun add @tanstack/svelte-virtual
```

Use `@tanstack/svelte-table` with `compote-ui/data-table`; add `@tanstack/svelte-virtual` only with `compote-ui/data-table/virtual`.

## Common Mistakes

### CRITICAL Missing theme CSS import

Wrong:

```css
@import 'tailwindcss';
```

Correct:

```css
@import 'tailwindcss';
@import 'compote-ui/theme.css';
```

Components rely on `theme.css` for Compote CSS variables and Tailwind token definitions.

Source: `src/lib/theme.css`, `src/routes/layout.css`

### HIGH Using Svelte legacy props

Wrong:

```svelte
<script lang="ts">
	export let open = false;
	$: visible = open;
</script>
```

Correct:

```svelte
<script lang="ts">
	let { open = $bindable(false) } = $props();
	const visible = $derived(open);
</script>
```

The project uses Svelte 5 runes mode globally.

Source: `CLAUDE.md`, `svelte.config.js`

### MEDIUM Installing table peers for every app

Wrong:

```bash
bun add compote-ui @tanstack/svelte-table @tanstack/svelte-virtual
```

Correct:

```bash
bun add compote-ui
bun add @tanstack/svelte-table
bun add @tanstack/svelte-virtual
```

Install TanStack peers only when the consuming app imports the matching data-table subpath.

Source: `package.json`, `src/lib/index.ts`

## References

- [Install and peers](references/install-and-peers.md)
