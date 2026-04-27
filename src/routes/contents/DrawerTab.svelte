<script lang="ts">
	import { Button, Drawer } from '$lib';

	let bottomOpen = $state(false);
	let rightOpen = $state(false);
	let leftOpen = $state(false);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Bottom Drawer (default)</h2>
		<Button onclick={() => (bottomOpen = true)}>Open Bottom Drawer</Button>
		<Drawer.Root bind:open={bottomOpen}>
			<Drawer.Backdrop />
			<Drawer.Positioner>
				<Drawer.Content>
					<Drawer.Grabber>
						<Drawer.GrabberIndicator />
					</Drawer.Grabber>
					<Drawer.CloseTrigger>✕</Drawer.CloseTrigger>
					<Drawer.Title>Bottom Drawer</Drawer.Title>
					<p class="text-sm text-ink-dim">
						Drag down or click outside to close. This drawer slides up from the bottom.
					</p>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Right Drawer</h2>
		<Button onclick={() => (rightOpen = true)}>Open Right Drawer</Button>
		<Drawer.Root bind:open={rightOpen} swipeDirection="end">
			<Drawer.Backdrop />
			<Drawer.Positioner>
				<Drawer.Content>
					<Drawer.Grabber>
						<Drawer.GrabberIndicator />
					</Drawer.Grabber>
					<Drawer.CloseTrigger>✕</Drawer.CloseTrigger>
					<Drawer.Title>Right Drawer</Drawer.Title>
					<p class="text-sm text-ink-dim">Slides in from the right. Swipe right to close.</p>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Left Drawer</h2>
		<Button onclick={() => (leftOpen = true)}>Open Left Drawer</Button>
		<Drawer.Root bind:open={leftOpen} swipeDirection="start">
			<Drawer.Backdrop />
			<Drawer.Positioner>
				<Drawer.Content>
					<Drawer.Grabber>
						<Drawer.GrabberIndicator />
					</Drawer.Grabber>
					<Drawer.CloseTrigger>✕</Drawer.CloseTrigger>
					<Drawer.Title>Left Drawer</Drawer.Title>
					<p class="text-sm text-ink-dim">Slides in from the left. Swipe left to close.</p>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	</section>
</div>
