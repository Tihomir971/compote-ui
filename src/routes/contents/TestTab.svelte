<script lang="ts">
	import { Drawer, type DrawerOpenChangeDetails } from '@ark-ui/svelte/drawer'
	import { PhX } from '$lib/icons'

	let open = $state(false)

	const handleOpenChange = (details: DrawerOpenChangeDetails) => {
		open = details.open
	}
</script>

<div class="p-4">
	<button
		class="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface-1 px-4 text-sm font-medium hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		onclick={() => (open = true)}
	>
		Open Drawer
	</button>

	<Drawer.Root {open} onOpenChange={handleOpenChange}>
		<Drawer.Backdrop
			class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
		/>
		<Drawer.Positioner class="fixed inset-0 z-50 flex items-end justify-center">
			<Drawer.Content
				class="relative flex w-full max-h-[96svh] flex-col rounded-t-2xl bg-surface-1 px-5 shadow-xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom"
			>
				<Drawer.Grabber
					class="flex w-full shrink-0 cursor-grab touch-none select-none items-center justify-center py-5"
				>
					<Drawer.GrabberIndicator class="h-1 w-10 rounded-full bg-surface-3" />
				</Drawer.Grabber>

				<Drawer.CloseTrigger
					class="absolute right-4 top-12 flex h-7 w-7 items-center justify-center rounded bg-transparent opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<PhX class="size-4" />
					<span class="sr-only">Close</span>
				</Drawer.CloseTrigger>

				<Drawer.Title class="mb-2 text-lg font-medium">Test Drawer</Drawer.Title>

				<p class="text-sm text-ink-dim">
					This drawer is built directly with Ark UI primitives, no compote wrappers.
				</p>

				<p class="mt-4 text-sm">
					Drag the grabber at the top to dismiss, or press Escape. The drawer slides up from the
					bottom and snaps to a single full snap point by default.
				</p>
			</Drawer.Content>
		</Drawer.Positioner>
	</Drawer.Root>
</div>
