<script lang="ts">
	import { DateInput } from '@ark-ui/svelte/date-input';
	import { Field } from '@ark-ui/svelte/field';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import {
		fromDateToLocal,
		getLocalTimeZone,
		parseAbsoluteToLocal,
		parseDate,
		parseDateTime
	} from '@internationalized/date';
	import type { DateValue, DateInputProps, NativeDateInput } from './types';

	let {
		value = $bindable(),
		defaultValue,
		label,
		name,
		onValueChange,
		...restProps
	}: DateInputProps = $props();

	const locale = useLocaleContext();

	function toDateValue(v: NativeDateInput): DateValue | null {
		if (v == null) return null;
		if (typeof v === 'string') {
			if (!v) return null;
			if (v.includes('T')) {
				if (v.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(v)) return parseAbsoluteToLocal(v);
				return parseDateTime(v);
			}
			return parseDate(v);
		}
		if (v instanceof Date) return fromDateToLocal(v);
		return v;
	}

	function fromDateValue(dv: DateValue | null, source: NativeDateInput): NativeDateInput {
		if (dv == null) return null;
		if (typeof source === 'string') return dv.toString();
		if (source instanceof Date) return dv.toDate(getLocalTimeZone());
		return dv;
	}

	const arkValue = $derived(toDateValue(value));
	const arkDefault = $derived(toDateValue(defaultValue));
</script>

<DateInput.Root
	{...restProps}
	locale={locale().locale}
	value={arkValue ? [arkValue] : []}
	defaultValue={arkDefault ? [arkDefault] : undefined}
	onValueChange={(details) => {
		const dv = details.value[0] ?? null;
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
