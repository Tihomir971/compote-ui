---
name: component-usage
description: >
  Load when choosing or using compote-ui components and utilities from the root
  package. Covers public exports, single components vs namespaced compound
  components, forms, overlays, layout/display components, files/images, buttons,
  collections, and common component usage mistakes.
metadata:
  type: core
  library: compote-ui
  library_version: '0.62.1'
sources:
  - src/lib/index.ts
  - src/lib/utils/collections.ts
  - src/lib/components/button/button.svelte
  - src/lib/components/field/field.svelte
  - src/lib/components/select/select.svelte
  - src/lib/components/dialog/dialog-root.svelte
  - src/lib/components/file-upload/file-upload.svelte
  - src/lib/components/image-cropper/image-cropper.svelte
  - src/lib/utils/image-processing.ts
---

# Compote UI — Component Usage

Use root exports from `compote-ui` for ordinary components and namespaces for compound component families.

## Setup

```svelte
<script lang="ts">
	import { Button, Field, Select, Dialog, createListCollection } from 'compote-ui';

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana', disabled: true }
	];

	let name = $state('');
	let fruit = $state<string | null>(null);
	let open = $state(false);
	const collection = createListCollection(fruits);
</script>

<Field.Root required>
	<Field.Label>Name</Field.Label>
	<Field.Input bind:value={name} />
</Field.Root>

<Select items={fruits} label="Fruit" bind:value={fruit} />

<Button onclick={() => (open = true)}>Open</Button>
<Dialog.Root bind:open>
	<Dialog.Title>Selected fruit</Dialog.Title>
	<p>{fruit}</p>
</Dialog.Root>
```

## Core Patterns

### Import compound components as namespaces

```svelte
<script lang="ts">
	import { Card, Tabs, Menu } from 'compote-ui';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Summary</Card.Title>
	</Card.Header>
	<Card.Content>
		<Tabs.Root defaultValue="one">
			<Tabs.List>
				<Tabs.Trigger value="one">One</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="one">Content</Tabs.Content>
		</Tabs.Root>
	</Card.Content>
</Card.Root>
```

### Use item shapes expected by collections

```ts
import { createListCollection, createTreeCollection } from 'compote-ui';

const list = createListCollection([
	{ value: 1, label: 'One' },
	{ value: 2, label: 'Two', disabled: true }
]);

const tree = createTreeCollection([
	{ value: 'src', label: 'src', children: [{ value: 'app', label: 'App.svelte' }] }
]);
```

### Prefer wrappers before raw Ark UI primitives

```svelte
<script lang="ts">
	import { Drawer } from 'compote-ui';
</script>

<Drawer.Root>
	<Drawer.Trigger>Open</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Edit record</Drawer.Title>
		</Drawer.Header>
		<Drawer.Body>Content</Drawer.Body>
	</Drawer.Content>
</Drawer.Root>
```

Use Ark UI directly only for advanced cases the wrapper does not model, such as nested splitters.

## Common Mistakes

### HIGH Importing compound parts as root exports

Wrong:

```svelte
<script lang="ts">
	import { DialogRoot, DialogTitle } from 'compote-ui';
</script>
```

Correct:

```svelte
<script lang="ts">
	import { Dialog } from 'compote-ui';
</script>

<Dialog.Root>
	<Dialog.Title>Title</Dialog.Title>
</Dialog.Root>
```

Compound components are exported as namespaces.

Source: `src/lib/index.ts`

### HIGH Using arbitrary item shapes

Wrong:

```svelte
<script lang="ts">
	const items = [{ id: 1, name: 'One' }];
</script>

<Select {items} bind:value />
```

Correct:

```svelte
<script lang="ts">
	const items = [{ value: 1, label: 'One' }];
</script>

<Select {items} bind:value />
```

List-based components and collection helpers derive value and display text from `value` and `label`.

Source: `src/lib/utils/collections.ts`, `src/lib/components/select/select.svelte`

### MEDIUM Icon-only button without label

Wrong:

```svelte
<Button size="icon">
	<SettingsIcon />
</Button>
```

Correct:

```svelte
<Button size="icon" aria-label="Settings">
	<SettingsIcon class="size-4" />
</Button>
```

Icon-only controls need an accessible name.

Source: `C:/Users/tihom/.claude/skills/compote-ui/references/button.md`

## References

- [Buttons](references/buttons.md)
- [Forms and inputs](references/forms-and-inputs.md)
- [Overlays and floating UI](references/overlays-and-floating-ui.md)
- [Layout and display](references/layout-and-display.md)
- [Files and images](references/files-and-images.md)
- [Interactive components](references/interactive-components.md)
- [Component export map](references/component-export-map.md)
