<script lang="ts">
	import { DatePicker, useDatePicker } from '@ark-ui/svelte/date-picker';
	import { DateInput, useDateInput } from '@ark-ui/svelte/date-input';
	import { Field } from '@ark-ui/svelte/field';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { PhCalendarBlank } from '$lib/icons';
	import type { DateRangeFieldProps } from './types';
	import DatePickerCalendar from '../date-picker/date-picker-calendar.svelte';

	let {
		value = $bindable([]),
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
		hourCycle,
		onValueChange
	}: DateRangeFieldProps = $props();

	const locale = useLocaleContext();
	const id = $props.id();

	const datePicker = useDatePicker(() => ({
		id,
		locale: locale().locale,
		selectionMode: 'range',
		value,
		defaultValue,
		min,
		max,
		disabled,
		readOnly,
		required,
		invalid,
		timeZone,
		onValueChange(details) {
			value = details.value;
			onValueChange?.(details);
		}
	}));

	const dateInput = useDateInput(() => ({
		id,
		locale: locale().locale,
		selectionMode: 'range',
		hourCycle,
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

	const segmentGroupClass =
		'inline-flex h-9 items-center rounded-md border border-border bg-surface-1 px-3 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger';

	const segmentClass =
		'rounded px-0.5 text-ink outline-none focus:bg-primary focus:text-ink-inverse data-placeholder-shown:text-ink-dim';
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
			<DatePicker.Control class="flex flex-row items-center gap-1.5">
				<DateInput.SegmentGroup index={0} class={segmentGroupClass}>
					<DateInput.SegmentContext>
						{#snippet render(segment)}
							<DateInput.Segment {segment} class={segmentClass} />
						{/snippet}
					</DateInput.SegmentContext>
				</DateInput.SegmentGroup>
				<span class="text-ink-dim">–</span>
				<DateInput.SegmentGroup index={1} class={segmentGroupClass}>
					<DateInput.SegmentContext>
						{#snippet render(segment)}
							<DateInput.Segment {segment} class={segmentClass} />
						{/snippet}
					</DateInput.SegmentContext>
				</DateInput.SegmentGroup>
				<DatePicker.Trigger
					class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-1 shadow-sm hover:bg-surface-2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50"
				>
					<PhCalendarBlank class="size-4" />
				</DatePicker.Trigger>
			</DatePicker.Control>
			<DatePickerCalendar />
		</DatePicker.RootProvider>
	</DateInput.Control>
	<DateInput.HiddenInput {name} />
</DateInput.RootProvider>
