<script lang="ts">
	import { Select } from '$lib';

	const selectItems = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'orange', label: 'Orange' }
	];

	let selectedSelectValue = $state('apple');
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Select</h2>
		<div class="flex flex-col gap-4">
			<Select
				items={selectItems}
				label="Choose a fruit"
				bind:value={selectedSelectValue}
				placeholder="Select a fruit"
			/>
			<p class="text-sm text-ink-dim">
				Selected: <strong>{selectedSelectValue}</strong>
			</p>
			<Select
				items={selectItems}
				label="Choose a fruit"
				bind:value={selectedSelectValue}
				placeholder="Select a fruit"
				disabled
			/>
		</div>
	</section>
</div>
