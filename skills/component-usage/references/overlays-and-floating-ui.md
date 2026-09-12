# Overlays And Floating UI

`Dialog`, `Drawer`, `Menu`, `Popover`, `HoverCard`, `Tooltip`, and `Toast` are namespace exports.
`AlertDialog` is a single component, not a namespace.

## Dialog

```svelte
<script lang="ts">
	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Title>Confirm Action</Dialog.Title>
	<Dialog.Description>This cannot be undone.</Dialog.Description>
	<Dialog.Footer>
		<Dialog.CloseTrigger>Cancel</Dialog.CloseTrigger>
		<Button onclick={() => (open = false)}>Confirm</Button>
	</Dialog.Footer>
	<Dialog.CloseTrigger />
</Dialog.Root>
```

Use `onOpenChange`, not `onClose` — `Dialog` has no `onClose` prop:

```svelte
<Dialog.Root
	bind:open
	onOpenChange={(details) => {
		if (!details.open) handleClose();
	}}
>
	<Dialog.Title>Title</Dialog.Title>
</Dialog.Root>
```

`Dialog.CloseTrigger` with no children renders an absolute-positioned X icon in the corner
automatically — no separate placement needed. With children, it renders as an inline button (for
`Dialog.Footer`). `contentClass` sets dialog width (e.g. `contentClass="max-w-4xl"`).

**Stacking:** z-index defaults to `50`. Set the `--layer-index` CSS variable on the dialog's
container to offset it (e.g. `style="--layer-index: 10"` → z-index 60) — use this when a dialog
must appear above another fixed element like a drawer.

## Drawer

Slide-in panel anchored to a viewport edge, with swipe-to-dismiss and snap points.
`Drawer.Content` renders the backdrop and positioner internally — compose only
`Header`/`Body`/`Footer`.

```svelte
<Drawer.Root bind:open>
	<Drawer.Content>
		<Drawer.CloseTrigger />
		<Drawer.Header>
			<Drawer.Title>Edit Record</Drawer.Title>
		</Drawer.Header>
		<Drawer.Body>Scrollable content</Drawer.Body>
		<Drawer.Footer>
			<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
			<Button>Save</Button>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
```

`swipeDirection?: 'up' | 'down' | 'start' | 'end'` (default `'down'`) controls which edge it slides
from: `'down'` = bottom sheet (default), `'up'` = top, `'start'` = left (LTR), `'end'` = right
(LTR). `Drawer.Body` scrolls internally via `ScrollArea` — no fixed height needed. Safe to open a
`Dialog` from inside a `Drawer` (it portals above it, same z-index, stacked by DOM order).

Sizing and styling overrides:

```svelte
<!-- Custom height (bottom/top drawers, default 96svh) -->
<Drawer.Content maxHeight="50vh">...</Drawer.Content>

<!-- Custom width (side drawers, default 25rem) -->
<Drawer.Content maxWidth="32rem">...</Drawer.Content>

<!-- Custom backdrop/positioner classes (power users) -->
<Drawer.Content backdropClass="bg-black/80" positionerClass="items-center">...</Drawer.Content>
```

`Drawer.Grabber`/`Drawer.GrabberIndicator` render a drag handle (top edge for bottom/top drawers,
open edge for side drawers) — repositions automatically per `swipeDirection`.

## AlertDialog

For confirmations — built-in confirm/cancel buttons, no custom body.

```svelte
<AlertDialog
	bind:open={deleteOpen}
	title="Delete item?"
	description="This action cannot be undone."
	variant="destructive"
	confirmLabel="Delete"
	onConfirm={handleDelete}
/>
```

Props: `open` (bindable), `title`, `description?: string | string[]`,
`variant?: 'default' | 'destructive'`, `confirmLabel?`, `cancelLabel?`, `onConfirm?`, `onCancel?`.

## Menu

Composable dropdown with items, groups, checkboxes, radio items, context trigger, and submenus.

```svelte
<Menu.Root>
	<Menu.Trigger variant="outline">
		Options
		<Menu.Indicator />
	</Menu.Trigger>
	<Menu.Content>
		<Menu.Item value="new">New File</Menu.Item>
		<Menu.Item value="save">Save</Menu.Item>
		<Menu.Separator />
		<Menu.Item value="quit" disabled>Quit</Menu.Item>
	</Menu.Content>
</Menu.Root>
```

Groups, checkboxes, and radio items:

```svelte
<Menu.Content>
	<Menu.ItemGroup>
		<Menu.ItemGroupLabel>View</Menu.ItemGroupLabel>
		<Menu.CheckboxItem value="sidebar" checked={sidebar} onCheckedChange={(v) => (sidebar = v)}>
			Show Sidebar
		</Menu.CheckboxItem>
	</Menu.ItemGroup>
	<Menu.RadioItemGroup value={theme} onValueChange={(d) => (theme = d.value)}>
		<Menu.RadioItem value="light">Light</Menu.RadioItem>
		<Menu.RadioItem value="dark">Dark</Menu.RadioItem>
	</Menu.RadioItemGroup>
</Menu.Content>
```

Right-click context menu — use `Menu.ContextTrigger` instead of `Menu.Trigger`:

```svelte
<Menu.Root>
	<Menu.ContextTrigger>
		<div class="rounded border p-8 text-center">Right-click here</div>
	</Menu.ContextTrigger>
	<Menu.Content>
		<Menu.Item value="copy">Copy</Menu.Item>
	</Menu.Content>
</Menu.Root>
```

Submenu — nest a `Menu.Root` after a `Menu.TriggerItem`:

```svelte
<Menu.Content>
	<Menu.TriggerItem>Export as...</Menu.TriggerItem>
	<Menu.Root>
		<Menu.Content>
			<Menu.Item value="pdf">PDF</Menu.Item>
			<Menu.Item value="csv">CSV</Menu.Item>
		</Menu.Content>
	</Menu.Root>
</Menu.Content>
```

## Popover

Composable floating panel anchored to a trigger.

```svelte
<Popover.Root>
	<Popover.Trigger>
		<Button>Open Popover</Button>
	</Popover.Trigger>
	<Popover.Content>
		<Popover.Title>Popover Title</Popover.Title>
		<Popover.Description>Content here.</Popover.Description>
		<Popover.CloseTrigger />
	</Popover.Content>
</Popover.Root>
```

`Popover.Content` accepts `showArrow?: boolean` (default `true`). Control placement via
`<Popover.Root positioning={{ placement: 'right' }}>`.

## HoverCard

Floating card that opens on **hover**, not click — key difference from `Popover`. Use `asChild` on
the trigger to render any element (e.g. a link) instead of the default button.

```svelte
<HoverCard.Root>
	<p>
		Liked by
		<HoverCard.Trigger>
			{#snippet asChild(props)}
				<a href="/profile" {...props()} class="font-medium text-primary underline"> @sarah_chen </a>
			{/snippet}
		</HoverCard.Trigger>
	</p>
	<HoverCard.Content>
		<p class="text-sm text-ink">Bio text here.</p>
	</HoverCard.Content>
</HoverCard.Root>
```

`openDelay?: number` (default `600`), `closeDelay?: number` (default `300`) on `HoverCard.Root`.

## Tooltip

Namespace export wrapping Ark UI Tooltip — short text hint shown on hover/focus.

```svelte
<Tooltip.Root>
	<Tooltip.Trigger>
		<Button variant="ghost" size="icon" aria-label="Info"><PhInfo /></Button>
	</Tooltip.Trigger>
	<Tooltip.Content>More information</Tooltip.Content>
</Tooltip.Root>
```

Prefer `Tooltip` over `HoverCard` for a single line of supplementary text; use `HoverCard` for
richer content (profile previews, formatted descriptions).

## Toast

Toaster setup belongs once in the root layout:

```svelte
<!-- +layout.svelte -->
<Toast.Toaster />
{@render children()}
```

Then fire toasts anywhere:

```ts
import { toast } from 'compote-ui';

toast.success('Saved');
toast.error('Save failed', { description: 'Please try again.' });
toast.promise(saveData(), {
	loading: { title: 'Saving…' },
	success: { title: 'Saved' },
	error: { title: 'Save failed' }
});
```

Shorthand helpers: `toast.info()`, `toast.success()`, `toast.warning()`, `toast.error()`,
`toast.loading()` — first arg is the title, second an optional options object; each returns the
toast `id` usable with `toast.update(id, options)` / `toast.dismiss(id)`. `loading` shows a
spinner and does not auto-dismiss. `toast.create(options)` remains available for full control.

Action button (e.g. Undo):

```ts
toast.create({
	title: 'File deleted',
	type: 'info',
	action: { label: 'Undo', onClick: () => restore() }
});
```

`toast.create()` options: `title: string`, `description?: string`,
`type?: 'info' | 'success' | 'error' | 'warning' | 'loading'`, `duration?: number` (ms, overrides
the toaster default for this toast), `action?: { label: string; onClick: () => void }`.

`Toast.Toaster` props: `class?: ClassValue`, `toaster?: CreateToasterReturn` (a custom instance
from `createToaster()` for a different `placement`/`max`/`duration` — defaults to the shared
`toast` singleton). Default placement is `bottom-end`; timers pause while the tab is hidden.
