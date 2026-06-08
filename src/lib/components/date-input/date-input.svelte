<script lang="ts">
	import { DateInput } from '@ark-ui/svelte/date-input';
	import { Field, useFieldContext } from '@ark-ui/svelte/field';
	import type { DateInputProps } from './types';

	let {
		value = $bindable(),
		defaultValue,
		label,
		name,
		onValueChange,
		invalid,
		readOnly,
		disabled,
		hideTimeZone = true,
		...restProps
	}: DateInputProps = $props();

	const field = useFieldContext();
	const isInvalid = $derived(invalid ?? field?.()?.invalid ?? false);
	const isReadOnly = $derived(readOnly ?? field?.()?.readOnly ?? false);
	const isDisabled = $derived(disabled ?? field?.()?.disabled ?? false);

	const arkValue = $derived(value ?? null);
	const arkDefault = $derived(defaultValue ?? null);
</script>

<DateInput.Root
	{...restProps}
	{hideTimeZone}
	invalid={isInvalid}
	readOnly={isReadOnly}
	disabled={isDisabled}
	value={arkValue ? [arkValue] : []}
	defaultValue={arkDefault ? [arkDefault] : undefined}
	onValueChange={(details) => {
		const dv = details.value[0] ?? null;
		// Guard: skip if Ark UI echoes back the same date (prevents reactive loop)
		if (dv?.toString() === arkValue?.toString()) return;
		value = dv;
		onValueChange?.(details);
	}}
>
	{#if label}
		<DateInput.Label class="text-sm font-medium leading-none">
			{label}
			<Field.RequiredIndicator />
		</DateInput.Label>
	{/if}
	<DateInput.Control>
		<DateInput.SegmentGroup
			class="inline-flex h-9 items-center rounded-md border border-border bg-surface-1 px-3 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger"
		>
			<DateInput.SegmentContext>
				{#snippet render(segment)}
					<DateInput.Segment
						{segment}
						class="rounded px-0.5 text-ink outline-none focus:bg-primary focus:text-ink-inverse data-placeholder-shown:text-ink-dim"
					/>
				{/snippet}
			</DateInput.SegmentContext>
		</DateInput.SegmentGroup>
	</DateInput.Control>
	<DateInput.HiddenInput {name} />
</DateInput.Root>
