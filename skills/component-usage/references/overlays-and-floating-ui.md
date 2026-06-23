# Overlays And Floating UI

`Dialog`, `Drawer`, `Menu`, `Popover`, `HoverCard`, `Tooltip`, and `Toast` are namespace exports.

Dialog:

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

Use `onOpenChange`, not `onClose`:

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

Drawer content renders backdrop and positioner internally:

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

AlertDialog is for confirmations:

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

Toast setup belongs in layout:

```svelte
<Toast.Toaster />
```

Then fire toasts anywhere:

```ts
import { toast } from 'compote-ui';

toast.success('Saved');
toast.error('Save failed', { description: 'Please try again.' });
```
