<script lang="ts">
	import { Select } from '$lib';

	const selectItems = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'orange', label: 'Orange' }
	];
	const selectItemsNmb = [
		{ value: 1, label: 'One' },
		{ value: 2, label: 'Two' },
		{ value: 3, label: 'Three' }
	];

	let selectedSelectValue = $state('apple');
	let selectedSelectValueNmb = $state<number | null>(null);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Select</h2>
		<div class="flex flex-col gap-4">
			<Select
				items={selectItems}
				label="Choose a fruit"
				bind:value={selectedSelectValue}
				placeholder="Select a fruit"
			/>
			<Select
				items={selectItems}
				label="Choose a fruit"
				bind:value={selectedSelectValue}
				placeholder="Select a fruit"
				size="sm"
			/>
			<p class="text-sm text-ink-dim">
				Selected: <strong>{selectedSelectValue}</strong>
			</p>
			<Select
				items={selectItemsNmb}
				label="Choose a number"
				bind:value={selectedSelectValueNmb}
				placeholder="Select a number"
			/>
			<p class="text-sm text-ink-dim">
				Selected number: <strong>{selectedSelectValueNmb}</strong> ({typeof selectedSelectValueNmb})
			</p>
			<Select
				items={selectItems}
				label="Disabled"
				bind:value={selectedSelectValue}
				placeholder="Select a fruit"
				disabled
			/>
		</div>
	</section>
</div>
