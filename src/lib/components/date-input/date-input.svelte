<script lang="ts">
	import { DateInput } from '@ark-ui/svelte/date-input';
	import { Field, useFieldContext } from '@ark-ui/svelte/field';
	import { toDateValue, fromDateValue, dateValueShape } from '$lib/utils/date';
	import { getLocalTimeZone } from '@internationalized/date';
	import type { DateValueShape } from '$lib/utils/date';
	import type { DateInputProps } from './types';

	let {
		value = $bindable(),
		defaultValue,
		label,
		name,
		granularity = 'day',
		hourCycle,
		timeZone,
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

	// Default the display zone to the user's local zone. Without this Ark/zag
	// formats segments in UTC, so a UTC value (e.g. 21:00Z) would show as 21:00
	// instead of the local 23:00. A UTC string still round-trips back to UTC.
	const tz = $derived(timeZone ?? getLocalTimeZone());

	// Remember the shape the consumer bound the value as, so changes are emitted
	// back in the same shape (string in → string out, Date in → Date out).
	// When the bound value starts null (e.g. a nullable DB column), default to
	// string output since that's the common case binding to database values.
	let shape: DateValueShape = 'string';

	const arkValue = $derived.by(() => {
		const s = dateValueShape(value) ?? dateValueShape(defaultValue);
		if (s) shape = s;
		return toDateValue(value, tz);
	});
	const arkDefault = $derived(toDateValue(defaultValue, tz));
</script>

<DateInput.Root
	{...restProps}
	{granularity}
	{hourCycle}
	timeZone={tz}
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
		value = fromDateValue(dv, shape, tz);
		onValueChange?.(details);
	}}
>
	{#if label}
		<DateInput.Label class="text-sm leading-none font-medium">
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
