<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import { NumberInput } from '@ark-ui/svelte/number-input';
	import type { NumberInputProps } from './types';
	import PhCaretDown from '$lib/icons/PhCaretDown.svelte';
	import PhCaretUp from '$lib/icons/PhCaretUp.svelte';

	let {
		value = $bindable(),
		readonly,
		label,
		layout = 'vertical',
		name,
		...restProps
	}: NumberInputProps = $props();
	const rootClass = $derived(
		layout === 'horizontal'
			? 'flex items-center gap-(--ark-field-gap) w-full max-w-48 data-disabled:opacity-50 data-disabled:grayscale'
			: 'flex flex-col gap-(--ark-field-gap) w-full max-w-48 data-disabled:opacity-50 data-disabled:grayscale'
	);
</script>

<input type="hidden" {name} value={Number.isNaN(value) ? undefined : value?.toString()} />
<NumberInput.Root
	{...restProps}
	allowMouseWheel
	value={value?.toLocaleString(restProps.locale)}
	locale={restProps.locale}
	readOnly={readonly}
	onValueChange={(valueChangeDetails) => {
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
		<NumberInput.Input class="px-(--ark-input-px) pr-8 text-right font-medium tabular-nums" />
		<div
			class="absolute top-px right-px bottom-px z-10 flex w-6 flex-col overflow-hidden rounded-r border-r border-l"
		>
			<NumberInput.IncrementTrigger
				class="inline-flex flex-1 cursor-pointer items-center justify-center border-none text-(--ark-muted) hover:bg-(--ark-hover-bg) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ark-ring) active:bg-(--ark-accent-bg) disabled:cursor-not-allowed disabled:text-(--ark-disabled-fg)"
			>
				<PhCaretUp class="h-4 w-4 shrink-0" />
			</NumberInput.IncrementTrigger>
			<NumberInput.DecrementTrigger
				class="inline-flex flex-1 cursor-pointer items-center justify-center border-t border-l border-none text-(--ark-muted) hover:bg-(--ark-hover-bg) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ark-ring) active:bg-(--ark-accent-bg) disabled:cursor-not-allowed disabled:text-(--ark-disabled-fg)"
			>
				<PhCaretDown class="h-4 w-4 shrink-0" />
			</NumberInput.DecrementTrigger>
		</div>
	</NumberInput.Control>
</NumberInput.Root>
