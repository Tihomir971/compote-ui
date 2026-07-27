<script lang="ts">
	import { DatePicker } from '@ark-ui/svelte/date-picker';
	import { Field } from '@ark-ui/svelte/field';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { CalendarDateTime, getLocalTimeZone } from '@internationalized/date';
	import { toDateValue, fromDateValue, dateValueShape } from '$lib/utils/date';
	import type { DateValueShape } from '$lib/utils/date';
	import { PhCalendarBlank, PhX } from '$lib/icons';
	import type { DatePickerProps } from './types';
	import DatePickerCalendar from './date-picker-calendar.svelte';

	let {
		value = $bindable(),
		defaultValue,
		label,
		placeholder,
		name,
		granularity,
		hourCycle,
		locale: localeProp,
		timeZone,
		onValueChange,
		...restProps
	}: DatePickerProps = $props();

	const localeContext = useLocaleContext();
	const resolvedLocale = $derived(localeProp ?? localeContext().locale);
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
</script>

<DatePicker.Root
	{...restProps}
	locale={resolvedLocale}
	timeZone={tz}
	closeOnSelect={!showTimeInput}
	value={arkValue ? [arkValue] : []}
	defaultValue={arkDefault ? [arkDefault] : undefined}
	onValueChange={(details) => {
		const picked = details.value[0] ?? null;
		let next = picked;
		if (picked && showTimeInput && !('hour' in picked)) {
			const h = arkValue && 'hour' in arkValue ? (arkValue as CalendarDateTime).hour : 0;
			const m = arkValue && 'hour' in arkValue ? (arkValue as CalendarDateTime).minute : 0;
			next = new CalendarDateTime(picked.year, picked.month, picked.day, h, m);
		}
		value = fromDateValue(next, shape, tz);
		onValueChange?.(details);
	}}
>
	{#if label}
		<DatePicker.Label class="text-sm leading-none font-medium">
			{label}
			<Field.RequiredIndicator />
		</DatePicker.Label>
	{/if}
	<DatePicker.Control class="flex flex-row gap-1.5">
		<DatePicker.Input
			{placeholder}
			class="h-9 min-w-0 flex-1 rounded-md border border-border bg-surface-1 px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger"
		/>
		<DatePicker.Trigger
			class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 shadow-sm hover:bg-surface-2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50"
		>
			<PhCalendarBlank class="size-4" />
		</DatePicker.Trigger>
		<DatePicker.ClearTrigger
			class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 text-ink-dim shadow-sm hover:bg-surface-2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
		>
			<PhX class="size-3.5" />
		</DatePicker.ClearTrigger>
	</DatePicker.Control>
	<DatePickerCalendar {showTimeInput} hourCycle={resolvedHourCycle} />
	{#if name}
		<input type="hidden" {name} value={value ?? ''} />
	{/if}
</DatePicker.Root>
