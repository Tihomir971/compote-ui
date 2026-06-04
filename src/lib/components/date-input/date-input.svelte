<script lang="ts">
	import { DateInput } from '@ark-ui/svelte/date-input';
	import { Field } from '@ark-ui/svelte/field';
	import {
		fromDateToLocal,
		getLocalTimeZone,
		parseAbsolute,
		parseDate,
		parseDateTime,
		parseZonedDateTime
	} from '@internationalized/date';
	import type { DateValue, DateInputProps, NativeDateInput } from './types';

	let {
		value = $bindable(),
		defaultValue,
		label,
		name,
		timeZone = getLocalTimeZone(),
		hideTimeZone,
		onValueChange,
		...restProps
	}: DateInputProps = $props();

	const absoluteDateTimeRe = /(?:Z|[+-]\d{2}:\d{2})$/;

	function isAbsoluteDateTime(v: NativeDateInput): boolean {
		return typeof v === 'string' && v.includes('T') && absoluteDateTimeRe.test(v);
	}

	function toDateValue(v: NativeDateInput): DateValue | null {
		if (v == null) return null;
		if (typeof v === 'string') {
			if (!v) return null;
			if (v.includes('T')) {
				// ZonedDateTime.toString() format: "2024-01-15T10:30:00+02:00[Europe/Belgrade]"
				if (v.includes('[')) return parseZonedDateTime(v);
				if (absoluteDateTimeRe.test(v)) return parseAbsolute(v, timeZone);
				return parseDateTime(v);
			}
			return parseDate(v);
		}
		if (v instanceof Date) return fromDateToLocal(v);
		return v;
	}

	function fromDateValue(dv: DateValue | null, source: NativeDateInput): NativeDateInput {
		if (dv == null) return null;
		if (typeof source === 'string') {
			if (absoluteDateTimeRe.test(source)) return dv.toDate(timeZone).toISOString();
			return dv.toString();
		}
		if (source instanceof Date) return dv.toDate(getLocalTimeZone());
		return dv;
	}

	const arkValue = $derived(toDateValue(value));
	const arkDefault = $derived(toDateValue(defaultValue));
	const shouldHideTimeZone = $derived(hideTimeZone ?? isAbsoluteDateTime(value));
</script>

<DateInput.Root
	{...restProps}
	{timeZone}
	hideTimeZone={shouldHideTimeZone}
	value={arkValue ? [arkValue] : []}
	defaultValue={arkDefault ? [arkDefault] : undefined}
	onValueChange={(details) => {
		const dv = details.value[0] ?? null;
		// Guard: skip if Ark UI echoes back the same date (prevents reactive loop)
		if (dv?.toString() === arkValue?.toString()) return;
		value = fromDateValue(dv, value);
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
