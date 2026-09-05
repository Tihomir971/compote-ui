<script lang="ts">
	import { DatePicker, useDatePicker } from '@ark-ui/svelte/date-picker';
	import { DateInput, useDateInput } from '@ark-ui/svelte/date-input';
	import { Field } from '@ark-ui/svelte/field';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { CalendarDateTime, getLocalTimeZone } from '@internationalized/date';
	import { toDateValue, fromDateValue, dateValueShape, dateValueToString } from '$lib/utils/date';
	import type { DateValueShape } from '$lib/utils/date';
	import { PhCalendarBlank } from '$lib/icons';
	import type { DateFieldProps } from './types';
	import DatePickerCalendar from '../date-picker/date-picker-calendar.svelte';

	let {
		value = $bindable(),
		defaultValue,
		label,
		name,
		min,
		max,
		disabled,
		readOnly,
		required,
		invalid,
		timeZone,
		locale: localeProp,
		granularity,
		hourCycle,
		onValueChange
	}: DateFieldProps = $props();

	const localeContext = useLocaleContext();
	const resolvedLocale = $derived(localeProp ?? localeContext().locale);
	const id = $props.id();
	const showTimeInput = $derived(!!granularity && granularity !== 'day');
	const resolvedHourCycle = $derived(
		hourCycle ??
			(new Intl.DateTimeFormat(resolvedLocale, { hour: 'numeric' })
				.formatToParts(new Date(2024, 0, 1, 14))
				.some((p) => p.type === 'dayPeriod')
				? 12
				: 24)
	);

	// Default the display zone to the user's local zone. Without this Ark/zag
	// formats segments in UTC, so a UTC value would show shifted hours.
	const tz = $derived(timeZone ?? getLocalTimeZone());

	// Remember the shape the consumer bound the value as, so changes are emitted
	// back in the same shape (string in → string out, Date in → Date out).
	// When the bound value starts null, default to string output.
	let shape: DateValueShape = 'string';

	const arkValue = $derived.by(() => {
		const s = dateValueShape(value) ?? dateValueShape(defaultValue);
		if (s) shape = s;
		return toDateValue(value, tz);
	});
	const arkDefault = $derived(toDateValue(defaultValue, tz));

	const datePicker = useDatePicker(() => ({
		id,
		locale: resolvedLocale,
		closeOnSelect: !showTimeInput,
		value: arkValue ? [arkValue] : [],
		defaultValue: arkDefault ? [arkDefault] : undefined,
		min,
		max,
		disabled,
		readOnly,
		required,
		invalid,
		timeZone: tz,
		onValueChange(details) {
			const picked = details.value[0] ?? null;
			let next = picked;
			if (picked && showTimeInput && !('hour' in picked)) {
				const h = arkValue && 'hour' in arkValue ? (arkValue as CalendarDateTime).hour : 0;
				const m = arkValue && 'hour' in arkValue ? (arkValue as CalendarDateTime).minute : 0;
				next = new CalendarDateTime(picked.year, picked.month, picked.day, h, m);
				datePicker().setValue(next ? [next] : []);
			}
			value = fromDateValue(next, shape, tz);
			onValueChange?.(details);
		}
	}));

	const dateInput = useDateInput(() => ({
		id,
		locale: resolvedLocale,
		granularity: granularity ?? 'day',
		hourCycle,
		value: datePicker().value,
		min,
		max,
		disabled,
		readOnly,
		required,
		invalid,
		timeZone: tz,
		// Submit a canonical ISO string rather than zag's locale-formatted display
		// string. Only feeds the hidden input's value; segments are formatted separately.
		format: (date) => dateValueToString(date),
		onValueChange(details) {
			datePicker().setValue(details.value);
		}
	}));
</script>

<DateInput.RootProvider value={dateInput}>
	{#if label}
		<DateInput.Label class="text-sm leading-none font-medium">
			{label}
			<Field.RequiredIndicator />
		</DateInput.Label>
	{/if}
	<DateInput.Control>
		<DatePicker.RootProvider value={datePicker}>
			<DatePicker.Control class="flex flex-row gap-1.5">
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
				<DatePicker.Trigger
					class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 shadow-sm hover:bg-surface-2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50"
				>
					<PhCalendarBlank class="size-4" />
				</DatePicker.Trigger>
			</DatePicker.Control>
			<DatePickerCalendar {showTimeInput} hourCycle={resolvedHourCycle} />
		</DatePicker.RootProvider>
	</DateInput.Control>
	<DateInput.HiddenInput {name} />
</DateInput.RootProvider>
