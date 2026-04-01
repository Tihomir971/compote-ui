<script lang="ts">
	import { Listbox } from '$lib';

	const listboxItems = [
		{ value: 'apple', label: 'Apple', group: 'Fruits' },
		{ value: 'banana', label: 'Banana', group: 'Fruits' },
		{ value: 'carrot', label: 'Carrot', group: 'Vegetables' },
		{ value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
		{ value: 'chicken', label: 'Chicken', group: 'Proteins' },
		{ value: 'fish', label: 'Fish', group: 'Proteins' }
	];

	let selectedListboxItems = $state([listboxItems[0].value]);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Listbox</h2>
		<div class="flex flex-col gap-4">
			<div class="h-64">
				<Listbox items={listboxItems} label="Select items" bind:value={selectedListboxItems} />
			</div>
			<p class="text-sm text-ink-dim">
				Selected: <strong>{selectedListboxItems.join(', ')}</strong>
			</p>
			<div class="h-64">
				<Listbox
					items={listboxItems}
					label="Select items (filterable)"
					bind:value={selectedListboxItems}
					filterable
				/>
			</div>
		</div>
	</section>
</div>
