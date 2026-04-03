<script lang="ts">
	import { NumberInput } from '$lib';

	let numberInputValue = $state(1);
	let numberCurrency = $state(1);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Number Input</h2>
		<div class="flex flex-col gap-4">
			<p class="text-sm text-ink-dim">Value: {numberInputValue}</p>
			<NumberInput
				label="Price"
				bind:value={numberInputValue}
				min={0}
				step={0.01}
				formatOptions={{ minimumFractionDigits: 2 }}
			/>

			<NumberInput
				label="Custom step"
				bind:value={numberCurrency}
				min={0}
				step={0.5}
				locale="sr-Latn-RS"
				formatOptions={{ minimumFractionDigits: 2, style: 'currency', currency: 'RSD' }}
			/>
		</div>
	</section>
</div>
