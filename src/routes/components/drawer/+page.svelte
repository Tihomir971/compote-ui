<script lang="ts">
	import { Button, Drawer } from '$lib';

	let bottomOpen = $state(false);
	let rightOpen = $state(false);
	let leftOpen = $state(false);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Bottom Drawer (default)</h2>
		<Drawer.Root bind:open={bottomOpen}>
			<Drawer.Trigger>Open Bottom Drawer</Drawer.Trigger>
			<Drawer.Content maxHeight="30vh">
				<Drawer.CloseTrigger />
				<Drawer.Header>
					<Drawer.Title>Bottom Drawer</Drawer.Title>
					<Drawer.Description>
						Drag down or click outside to close. This drawer slides up from the bottom.
					</Drawer.Description>
				</Drawer.Header>
			</Drawer.Content>
		</Drawer.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Right Drawer</h2>
		<Drawer.Root bind:open={rightOpen} swipeDirection="end">
			<Drawer.Trigger>Open Right Drawer</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.CloseTrigger />
				<Drawer.Header>
					<Drawer.Title>Right Drawer</Drawer.Title>
					<Drawer.Description>Slides in from the right. Swipe right to close.</Drawer.Description>
				</Drawer.Header>
			</Drawer.Content>
		</Drawer.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Left Drawer</h2>
		<Drawer.Root bind:open={leftOpen} swipeDirection="start">
			<Drawer.Trigger>Open Left Drawer</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.CloseTrigger />
				<Drawer.Header>
					<Drawer.Title>Left Drawer</Drawer.Title>
					<Drawer.Description>Slides in from the left. Swipe left to close.</Drawer.Description>
				</Drawer.Header>
				<Button>Hello</Button>
			</Drawer.Content>
		</Drawer.Root>
	</section>
</div>
