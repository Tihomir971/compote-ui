<script lang="ts">
	import { DatePicker } from '@ark-ui/svelte/date-picker';
	import { Field } from '@ark-ui/svelte/field';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { CalendarDateTime } from '@internationalized/date';
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
		onValueChange,
		...restProps
	}: DatePickerProps = $props();

	const locale = useLocaleContext();
	const showTimeInput = $derived(!!granularity && granularity !== 'day');
	const resolvedHourCycle = $derived(
		hourCycle ??
			(new Intl.DateTimeFormat(locale().locale, { hour: 'numeric' })
				.formatToParts(new Date(2024, 0, 1, 14))
				.some((p) => p.type === 'dayPeriod')
				? 12
				: 24)
	);
</script>

<DatePicker.Root
	{...restProps}
	locale={locale().locale}
	closeOnSelect={!showTimeInput}
	value={value ? [value] : []}
	defaultValue={defaultValue ? [defaultValue] : undefined}
	onValueChange={(details) => {
		const picked = details.value[0] ?? null;
		if (picked && showTimeInput && !('hour' in picked)) {
			const h = value && 'hour' in value ? (value as CalendarDateTime).hour : 0;
			const m = value && 'hour' in value ? (value as CalendarDateTime).minute : 0;
			value = new CalendarDateTime(picked.year, picked.month, picked.day, h, m);
		} else {
			value = picked;
		}
		onValueChange?.(details);
	}}
>
	{#if label}
		<DatePicker.Label class="text-sm font-medium leading-none">
			{label}
			<Field.RequiredIndicator />
		</DatePicker.Label>
	{/if}
	<DatePicker.Control class="flex flex-row gap-1.5">
		<DatePicker.Input
			{placeholder}
			class="h-9 min-w-0 flex-1 rounded-md border border-border bg-surface-1 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger"
		/>
		<DatePicker.Trigger
			class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 shadow-sm hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-50"
		>
			<PhCalendarBlank class="size-4" />
		</DatePicker.Trigger>
		<DatePicker.ClearTrigger
			class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 text-ink-dim shadow-sm hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
		>
			<PhX class="size-3.5" />
		</DatePicker.ClearTrigger>
	</DatePicker.Control>
	<DatePickerCalendar {showTimeInput} hourCycle={resolvedHourCycle} />
	{#if name}
		<input type="hidden" {name} value={value ?? ''} />
	{/if}
</DatePicker.Root>
