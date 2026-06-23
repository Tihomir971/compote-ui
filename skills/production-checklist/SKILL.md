---
name: production-checklist
description: >
  Load before shipping or reviewing a compote-ui integration. Checks peer
  dependencies, theme import, SSR/browser-only image utility boundaries,
  accessible labels, optional data-table peers, excluded companion libraries,
  and local verification with bun run check and bun run lint.
metadata:
  type: lifecycle
  library: compote-ui
  library_version: '0.62.1'
requires:
  - getting-started
  - component-usage
  - theming
sources:
  - package.json
  - CLAUDE.md
  - .claude/skills/verify/SKILL.md
  - src/lib/utils/image-processing.ts
  - src/lib/components/data-table-v9/virtual/data-table-virtual-rows.svelte
---

This checklist builds on getting-started, component-usage, and theming.

# Compote UI — Production Checklist

Run through each section before shipping a compote-ui integration or library change.

## Setup Checks

### Check: Theme import order

Expected:

```css
@import 'tailwindcss';
@import 'compote-ui/theme.css';
```

Fail condition: components render without Compote token utilities or CSS variables.
Fix: import `compote-ui/theme.css` after `tailwindcss`.

### Check: Optional peers match imports

Expected:

```ts
import * as DataTable from 'compote-ui/data-table';
```

Fail condition: app imports `compote-ui/data-table` without `@tanstack/svelte-table`.
Fix: install `@tanstack/svelte-table`.

Expected:

```ts
import * as VirtualDataTable from 'compote-ui/data-table/virtual';
```

Fail condition: app imports the virtual subpath without `@tanstack/svelte-virtual`.
Fix: install `@tanstack/svelte-virtual`.

## SSR And Browser Checks

### Check: Image utilities run in browser handlers

Expected:

```ts
async function handleFile(file: File) {
	const src = await fileToDataUrl(file);
	const blob = await processImage(src);
}
```

Fail condition: `processImage`, `cropImage`, `fileToDataUrl`, or `loadImage` run in SvelteKit server code or a `load` function.
Fix: call Canvas and File APIs from browser event handlers.

## Accessibility Checks

### Check: Icon-only controls have names

Expected:

```svelte
<Button size="icon" aria-label="Settings">
	<SettingsIcon class="size-4" />
</Button>
```

Fail condition: icon-only `Button`, `Toggle`, trigger, or menu control has no accessible name.
Fix: add `aria-label` or visible text.

## Boundary Checks

### Check: Companion libraries stay separate

Expected:

```ts
import { Button } from 'compote-ui';
```

Fail condition: charts or TipTap editor imports are expected from `compote-ui`.
Fix: use `compote-echart` for charts and `compote-editor` for editor work.

## Common Mistakes

### HIGH Skipping local verification

Wrong:

```bash
git commit -m "change component"
```

Correct:

```bash
bun run check
bun run lint
```

The repository expects Svelte type checking and linting after changes.

Source: `.claude/skills/verify/SKILL.md`, `CLAUDE.md`

### MEDIUM Assuming charts and editors are included

Wrong:

```ts
import { Chart, RichTextEditor } from 'compote-ui';
```

Correct:

```ts
import { Button } from 'compote-ui';
```

Charts belong to `compote-echart`; TipTap editor functionality belongs to `compote-editor`.

Source: maintainer interview

### HIGH Forgetting component-specific peers

Wrong:

```ts
import * as VirtualDataTable from 'compote-ui/data-table/virtual';
```

Correct:

```bash
bun add @tanstack/svelte-virtual
```

```ts
import * as VirtualDataTable from 'compote-ui/data-table/virtual';
```

The virtual table subpath imports the optional virtualizer peer.

Source: `package.json`, `src/lib/components/data-table-v9/virtual/data-table-virtual-rows.svelte`

## Pre-Deploy Summary

- [ ] App imports `tailwindcss` before `compote-ui/theme.css`.
- [ ] Data table imports have matching TanStack peers.
- [ ] Browser-only image utilities are not called during SSR.
- [ ] Icon-only controls have accessible names.
- [ ] Charts and editor features use their separate packages.
- [ ] Repository changes pass `bun run check`.
- [ ] Repository changes pass `bun run lint`.

## References

- [Production audit](references/production-audit.md)
