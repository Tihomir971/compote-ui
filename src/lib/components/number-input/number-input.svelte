<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import { NumberInput } from '@ark-ui/svelte/number-input';
	import type { NumberInputProps } from './types';
	import PhCaretDown from '$lib/icons/PhCaretDown.svelte';
	import PhCaretUp from '$lib/icons/PhCaretUp.svelte';
	import { useLocaleContext } from '@ark-ui/svelte/locale';

	let {
		value = $bindable(),
		readonly,
		label,
		layout = 'vertical',
		name,
		...restProps
	}: NumberInputProps = $props();
	const locale = useLocaleContext();
	const rootClass = $derived(
		layout === 'horizontal'
			? 'flex items-center gap-1.5 w-full max-w-48 data-disabled:opacity-50 data-disabled:grayscale'
			: 'flex flex-col gap-1.5 w-full max-w-48 data-disabled:opacity-50 data-disabled:grayscale'
	);
</script>

<input type="hidden" {name} value={Number.isNaN(value) ? undefined : value?.toString()} />

<NumberInput.Root
	{...restProps}
	allowMouseWheel
	locale={locale().locale}
	value={value?.toString()}
	readOnly={readonly}
	onValueChange={(valueChangeDetails) => {
		console.log(valueChangeDetails);
		if (isNaN(valueChangeDetails.valueAsNumber)) {
			return;
		}
		value = valueChangeDetails.valueAsNumber;
	}}
	class={rootClass}
>
	{#if label}
		<NumberInput.Label>
			{label}
			<Field.RequiredIndicator />
		</NumberInput.Label>
	{/if}
	<NumberInput.Control class="relative isolate">
		<NumberInput.Input
			class="h-9 w-full rounded-md border bg-surface-1 px-3 pr-8 text-right text-sm font-medium tabular-nums shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none data-invalid:border-danger data-invalid:focus-visible:ring-danger"
		/>
		<div
			class="absolute top-px right-px bottom-px z-10 flex w-6 flex-col overflow-hidden rounded-r border-l"
		>
			<NumberInput.IncrementTrigger
				class="inline-flex flex-1 cursor-pointer items-center justify-center border-none text-ink-dim hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary active:bg-surface-2 disabled:cursor-not-allowed disabled:text-ink-dim"
			>
				<PhCaretUp class="h-4 w-4 shrink-0" />
			</NumberInput.IncrementTrigger>
			<NumberInput.DecrementTrigger
				class="inline-flex flex-1 cursor-pointer items-center justify-center border-t text-ink-dim hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary active:bg-surface-2 disabled:cursor-not-allowed disabled:text-ink-dim"
			>
				<PhCaretDown class="h-4 w-4 shrink-0" />
			</NumberInput.DecrementTrigger>
		</div>
	</NumberInput.Control>
</NumberInput.Root>
