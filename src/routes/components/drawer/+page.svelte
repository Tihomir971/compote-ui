<script lang="ts">
	import { Button, Dialog, Drawer, Select } from '$lib';

	let bottomOpen = $state(false);
	let rightOpen = $state(false);
	let leftOpen = $state(false);
	let dialogOpen = $state(false);

	const fruits = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'orange', label: 'Orange' }
	];
	let selectedFruit = $state('apple');
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
				<div class="p-4">
					<Button onclick={() => (dialogOpen = true)}>Open Dialog</Button>
					<Dialog.Root bind:open={dialogOpen}>
						<Dialog.Title>Select a Fruit</Dialog.Title>
						<Dialog.Description>Choose your favourite fruit from the list below.</Dialog.Description
						>
						<Select
							items={fruits}
							label="Fruit"
							bind:value={selectedFruit}
							placeholder="Select a fruit"
						/>
						<Dialog.Footer>
							<Button variant="outline" onclick={() => (dialogOpen = false)}>Cancel</Button>
							<Button onclick={() => (dialogOpen = false)}>Confirm</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger />
					</Dialog.Root>
				</div>
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
