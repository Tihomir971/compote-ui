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

	let submitted = $state<string | null>(null);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const data = new FormData(event.currentTarget as HTMLFormElement);
		submitted = JSON.stringify(Object.fromEntries(data), null, 2);
	}
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

	<section>
		<h2 class="mb-4 text-lg font-semibold">Form submission</h2>
		<p class="mb-4 text-sm text-ink-dim">
			The <code>name</code> prop is forwarded to Ark's <code>Select.HiddenSelect</code>, so the
			value is serialized by <code>FormData</code>. The <code>n:</code> prefix makes SvelteKit remote
			forms coerce the value to a number.
		</p>
		<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
			<Select items={selectItems} label="Fruit" name="fruit" placeholder="Select a fruit" />
			<Select items={selectItemsNmb} label="Number" name="n:amount" placeholder="Select a number" />
			<button
				type="submit"
				class="w-fit cursor-pointer rounded-md bg-primary px-3 py-1.5 text-sm text-ink-inverse"
			>
				Submit
			</button>
		</form>
		{#if submitted}
			<pre class="mt-4 rounded-md bg-well p-3 text-sm">{submitted}</pre>
		{/if}
	</section>
</div>
