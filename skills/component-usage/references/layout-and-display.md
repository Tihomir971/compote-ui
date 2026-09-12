# Layout And Display

## AppShell

Page-scaffolding layout with five **optional** regions on a CSS grid. Render only the regions
you need — an omitted one collapses to zero width/height, no config flag needed.

```svelte
<AppShell.Root>
	<AppShell.Header>Header</AppShell.Header>
	<AppShell.Navbar>Navbar</AppShell.Navbar>
	<AppShell.Main>Main content (scrolls independently)</AppShell.Main>
	<AppShell.Aside>Aside</AppShell.Aside>
	<AppShell.Footer>Footer</AppShell.Footer>
</AppShell.Root>
```

- Sizing is done via the `class` prop (no size props): `<AppShell.Navbar class="w-80">`.
- Full height by default (`h-dvh`); override with `<AppShell.Root class="h-full">` when nesting.
- `AppShell.Main` scrolls independently — header/navbar/aside/footer stay put.
- Use `AppShell.Section grow` inside `Navbar`/`Aside` for a scrolling area between pinned
  top/bottom sections (e.g. logo + scrolling nav links + user menu).
- Desktop-first, no built-in mobile logic — add your own responsive classes.

## NavRail

A collapsed icon rail that **expands on hover** (overlay mode), meant to sit inside
`AppShell.Navbar`. It floats over content and widens on hover/focus/pin — nothing else reflows.

```svelte
<AppShell.Navbar class="w-16">
	<NavRail.Root bind:expanded>
		<AppShell.Section grow class="space-y-1 p-2">
			<NavRail.Item label="Dashboard" active onclick={() => goto('/dashboard')}>
				{#snippet icon()}<PhStar />{/snippet}
			</NavRail.Item>
		</AppShell.Section>
	</NavRail.Root>
</AppShell.Navbar>
```

- `NavRail.Root`: `expanded?: boolean` (bindable) pins it open.
- `NavRail.Item`: renders `<a>` when `href` is set, else `<button>`. Pass `icon` as a snippet;
  `label` fades in on expand.
- The `AppShell.Navbar` placeholder must reserve the collapsed width (`class="w-16"`).

## Badge

Plain presentational `<span>` for status labels, counts, or tags — no Ark UI primitive.

```svelte
<Badge>Draft</Badge>
<Badge color="success" variant="solid">Verified</Badge>
<Badge color="danger" variant="outline">Failed</Badge>

<Badge color="success" variant="solid">
	{#snippet icon()}<PhCheck />{/snippet}
	Verified
</Badge>
```

`Badge` props: `variant?: 'solid' | 'subtle' | 'outline'` (default `'subtle'`),
`color?: 'neutral' | 'primary' | 'danger' | 'warning' | 'success' | 'info'` (default `'neutral'`),
`icon?: Snippet`, `class?: ClassValue`.

## Card

Namespaced presentational component for grouping content.

```svelte
<Card.Root>
	<Card.Header>
		<Card.Title>Card Title</Card.Title>
		<Card.Description>Card Description</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>Card content goes here.</p>
	</Card.Content>
	<Card.Footer>
		<Button variant="outline">Cancel</Button>
		<Button>Confirm</Button>
	</Card.Footer>
</Card.Root>
```

All sub-components (`Root`, `Header`, `Title`, `Description`, `Content`, `Footer`) accept `class`.

## Table

Plain presentational table primitive — no data model, no column defs, no sorting/filtering.

**Table vs DataTable.** Use `DataTable` (see the `data-table` skill) when you need sorting,
filtering, column visibility/resizing/pinning, row selection, or virtualization. Use `Table` for
static rows, cells built from arbitrary markup, or tables inside dialogs where selection state
lives in the consumer. Both share cell metrics and surface tokens, so they stay visually
consistent.

```svelte
<div class="max-h-64 overflow-auto rounded-lg border border-surface-3">
	<Table.Root class="table-fixed">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-24">SKU</Table.Head>
				<Table.Head>Item</Table.Head>
				<Table.Head class="text-right">Qty</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each items as item (item.id)}
				<Table.Row selected={selectedIds[item.id]}>
					<Table.Cell>{item.sku || '-'}</Table.Cell>
					<Table.Cell class="truncate">{item.name}</Table.Cell>
					<Table.Cell class="text-right">{item.quantity}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
```

`Table.Root` has no border, rounding, background, or scroll container by default — wrap it
yourself. Add `table-fixed` when setting explicit column widths or using `truncate` on cells.
Alignment is via utility classes (`text-right`) on `Table.Head`/`Table.Cell`, not props.

## QrCode

Single-file wrapper rendering an SVG QR code from any string value.

```svelte
<QrCode value="https://example.com" />
<QrCode value="https://example.com" size="lg" class="text-primary" />
```

Props: `value: string`, `size?: 'sm' | 'md' | 'lg' | 'xl'` (default `'md'`),
`encoding?: QrCodeGenerateOptions`, `class?: string`. Color follows the CSS `color` property — use
a `text-*` class.

## Progress

Two wrappers around Ark UI Progress: `ProgressLinear` (bar) and `ProgressCircular` (ring). Both
are determinate by default; pass `value={null}` for an indeterminate animated state.

```svelte
<ProgressLinear value={60} label="Uploading" showValueText />
<ProgressCircular value={60} showValueText size="lg" />
<ProgressLinear value={null} label="Loading…" />
```

Shared props: `value?: number | null` (bindable, `null` = indeterminate), `min`/`max` (default
`0`/`100`), `label?: string`, `showValueText?: boolean`,
`variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info'`, `formatOptions?: NumberFormatOptions`.
`ProgressLinear` adds `size?: 'sm' | 'md' | 'lg'`. `ProgressCircular` adds `size?: 'sm' | 'md' | 'lg' | number`
and `thickness?: number`.

## Format

Unstyled formatting components re-exported directly from Ark UI (no compote wrapper) — they
render plain text via `Intl`, so there's nothing to theme. Locale comes from the nearest
`LocaleProvider` (defaults to browser locale). None of them accept `class` since they render bare
text nodes — wrap in a `<span>` to style the surrounding text.

```svelte
<FormatRelativeTime value={someDate} />
<FormatByte value={1536} />
<FormatNumber value={1234.5} style="currency" currency="EUR" />
<FormatTime value={someDate} format="24h" />
```

- `FormatRelativeTime` — `value: Date` + `Intl.RelativeTimeFormatOptions` (`style`, `numeric`).
- `FormatByte` — `value: number` (bytes) + `unit?`, `unitDisplay?`, `unitSystem?: 'decimal' | 'binary'`.
- `FormatNumber` — `value: number` + `Intl.NumberFormatOptions` (`style`, `currency`, etc.).
- `FormatTime` — `value: string | Date` + `format?: '12h' | '24h'`, `withSeconds?: boolean`.

## Tabs

```svelte
<Tabs.Root bind:value={tab} defaultValue="account">
	<Tabs.List>
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="account">Account content</Tabs.Content>
	<Tabs.Content value="settings">Settings content</Tabs.Content>
</Tabs.Root>
```

`Tabs.Indicator` must be inside `Tabs.List`, after the triggers.

## Splitter

Splitter fills its container:

```svelte
<div class="h-64">
	{#snippet left()}
		<div class="p-3">Left</div>
	{/snippet}
	{#snippet right()}
		<div class="p-3">Right</div>
	{/snippet}

	<Splitter
		panels={[
			{ id: 'left', minSize: 20, content: left },
			{ id: 'right', minSize: 20, content: right }
		]}
	/>
</div>
```

**Limitation — no nesting.** The `<Splitter>` wrapper doesn't support nesting: Ark UI requires both
outer and inner `Splitter.Root` to share one `registry` instance, but the wrapper has no way to
pass it into a `content` snippet. Use Ark UI primitives directly, calling
`Splitter.createRegistry()` **once** and passing the same `{registry}` to every `Splitter.Root` in
the tree:

```svelte
<script lang="ts">
	import { Splitter } from '@ark-ui/svelte/splitter';

	const registry = Splitter.createRegistry();
</script>

<Splitter.Root {registry} orientation="horizontal" panels={[{ id: 'left' }, { id: 'right' }]}>
	<Splitter.Panel id="left" class="overflow-auto p-2">Left</Splitter.Panel>
	<Splitter.ResizeTrigger id="left:right" aria-label="Resize left and right" />
	<Splitter.Panel id="right" class="overflow-auto">
		<!-- Nested vertical splitter reuses the same registry -->
		<Splitter.Root {registry} orientation="vertical" panels={[{ id: 'top' }, { id: 'bottom' }]}>
			<Splitter.Panel id="top" class="overflow-auto p-2">Top</Splitter.Panel>
			<Splitter.ResizeTrigger id="top:bottom" aria-label="Resize top and bottom" />
			<Splitter.Panel id="bottom" class="overflow-auto p-2">Bottom</Splitter.Panel>
		</Splitter.Root>
	</Splitter.Panel>
</Splitter.Root>
```

The `ResizeTrigger` `id` must follow the `"panelA:panelB"` format matching adjacent panel ids.

## Collapsible

```svelte
<Collapsible.Root>
	<Collapsible.Trigger>
		Section title
		<Collapsible.Indicator />
	</Collapsible.Trigger>
	<Collapsible.Content>
		<p class="px-3 py-2.5">Hidden content here.</p>
	</Collapsible.Content>
</Collapsible.Root>
```

`Collapsible.Indicator` rotates 90deg on `data-[state=open]` (defaults to a caret-right icon).
Pass `defaultOpen`, `disabled`, `collapsedHeight` (partial-collapse mode), or `bind:open` to
`Collapsible.Root`.

## ScrollArea

ScrollArea needs explicit size:

```svelte
<ScrollArea.Root class="h-80 w-56">
	<ScrollArea.Viewport>
		<ScrollArea.Content class="p-3">Content</ScrollArea.Content>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar orientation="vertical">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
</ScrollArea.Root>
```

## Carousel

Vertical Carousel needs explicit height:

```svelte
<Carousel.Root orientation="vertical" class="h-[512px]" slideCount={images.length}>
	<Carousel.Control>
		<Carousel.ItemGroup>
			{#each images as image, index (image.src)}
				<Carousel.Item {index}>
					<img src={image.src} alt={image.alt} class="h-full w-full object-cover" />
				</Carousel.Item>
			{/each}
		</Carousel.ItemGroup>
	</Carousel.Control>
	<Carousel.IndicatorGroup>
		{#each images as _, index (index)}
			<Carousel.Indicator {index} />
		{/each}
	</Carousel.IndicatorGroup>
</Carousel.Root>
```

`Carousel.Indicator` renders a dot by default; pass `thumbnail` plus children for a thumbnail
indicator.

## TreeView

TreeView fills its container:

```svelte
<div class="h-80 rounded border">
	<TreeView {items} label="Files" bind:selectedValue={selected} />
</div>
```

`selectionMode="multiple"` adds `bind:checkedValue` for checkbox selection. `TreeItem.icon` takes
an Iconify icon name (e.g. `"ph:folder""`) — requires `@iconify/svelte` in the consumer app.

## JsonTreeView

JSON/object inspector — renders nested objects, arrays, primitives, Dates, regexes, errors, maps,
and sets with keyboard navigation.

```svelte
<div class="max-h-96 rounded border p-2">
	<JsonTreeView data={payload} defaultExpandedDepth={2} />
</div>
```

Wrap in a constrained container (`max-h-*`) for large payloads. Pass a `renderValue` snippet for
custom value rendering (e.g. turning emails into `mailto:` links).
