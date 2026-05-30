<script lang="ts">
	import { DatePicker, useDatePicker } from '@ark-ui/svelte/date-picker';
	import { DateInput, useDateInput } from '@ark-ui/svelte/date-input';
	import { Field } from '@ark-ui/svelte/field';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { CalendarDateTime } from '@internationalized/date';
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
		granularity,
		onValueChange
	}: DateFieldProps = $props();

	const locale = useLocaleContext();
	const id = $props.id();
	const showTimeInput = $derived(!!granularity && granularity !== 'day');

	const datePicker = useDatePicker(() => ({
		id,
		locale: locale().locale,
		closeOnSelect: !showTimeInput,
		value: value ? [value] : [],
		defaultValue: defaultValue ? [defaultValue] : undefined,
		min,
		max,
		disabled,
		readOnly,
		required,
		invalid,
		timeZone,
		onValueChange(details) {
			const picked = details.value[0] ?? null;
			if (picked && showTimeInput && !('hour' in picked)) {
				const h = value && 'hour' in value ? (value as CalendarDateTime).hour : 0;
				const m = value && 'hour' in value ? (value as CalendarDateTime).minute : 0;
				const merged = new CalendarDateTime(picked.year, picked.month, picked.day, h, m);
				value = merged;
				datePicker().setValue([merged]);
			} else {
				value = picked;
			}
			onValueChange?.(details);
		}
	}));

	const dateInput = useDateInput(() => ({
		id,
		locale: locale().locale,
		granularity: granularity ?? 'day',
		value: datePicker().value,
		min,
		max,
		disabled,
		readOnly,
		required,
		invalid,
		timeZone,
		onValueChange(details) {
			datePicker().setValue(details.value);
		}
	}));
</script>

<DateInput.RootProvider value={dateInput}>
	{#if label}
		<DateInput.Label class="text-sm font-medium leading-none">
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
					class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 shadow-sm hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-50"
				>
					<PhCalendarBlank class="size-4" />
				</DatePicker.Trigger>
			</DatePicker.Control>
			<DatePickerCalendar {showTimeInput} />
		</DatePicker.RootProvider>
	</DateInput.Control>
	<DateInput.HiddenInput {name} />
</DateInput.RootProvider>
