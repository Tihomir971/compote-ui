<script lang="ts">
	import { DatePicker, useDatePicker } from '@ark-ui/svelte/date-picker';
	import { DateInput, useDateInput } from '@ark-ui/svelte/date-input';
	import { Field } from '@ark-ui/svelte/field';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { getLocalTimeZone } from '@internationalized/date';
	import { toDateValue, fromDateValue, dateValueShape, dateValueToString } from '$lib/utils/date';
	import type { DateValueShape } from '$lib/utils/date';
	import { PhCalendarBlank } from '$lib/icons';
	import type { DateRangeFieldProps } from './types';
	import DatePickerCalendar from '../date-picker/date-picker-calendar.svelte';

	let {
		start = $bindable(),
		end = $bindable(),
		defaultStart,
		defaultEnd,
		label,
		name,
		startName,
		endName,
		min,
		max,
		disabled,
		readOnly,
		required,
		invalid,
		timeZone,
		granularity,
		hourCycle,
		onValueChange
	}: DateRangeFieldProps = $props();

	const locale = useLocaleContext();
	const id = $props.id();

	// Default the display zone to the user's local zone. Without this Ark/zag
	// formats segments in UTC, so a UTC value would show shifted hours.
	const tz = $derived(timeZone ?? getLocalTimeZone());

	// Remember the shape each end was bound as, so changes are emitted back in the
	// same shape. Tracked per end so a half-filled range still round-trips; when a
	// side starts null, default to string output since that is the common case
	// binding to database columns.
	let startShape: DateValueShape = 'string';
	let endShape: DateValueShape = 'string';

	const arkStart = $derived.by(() => {
		const s = dateValueShape(start) ?? dateValueShape(defaultStart);
		if (s) startShape = s;
		return toDateValue(start ?? defaultStart, tz);
	});

	const arkEnd = $derived.by(() => {
		const s = dateValueShape(end) ?? dateValueShape(defaultEnd);
		if (s) endShape = s;
		return toDateValue(end ?? defaultEnd, tz);
	});

	// zag reads the range positionally, so an end without a start cannot be
	// represented — it would silently become the start. Drop it instead.
	const arkValue = $derived(arkStart ? (arkEnd ? [arkStart, arkEnd] : [arkStart]) : []);

	// Submit from `arkValue`, not from arkStart/arkEnd, so the hidden inputs can
	// never disagree with what the picker actually holds.
	const submittedStart = $derived(arkValue[0] ? dateValueToString(arkValue[0]) : '');
	const submittedEnd = $derived(arkValue[1] ? dateValueToString(arkValue[1]) : '');

	const resolvedStartName = $derived(startName ?? (name ? `${name}Start` : undefined));
	const resolvedEndName = $derived(endName ?? (name ? `${name}End` : undefined));

	const datePicker = useDatePicker(() => ({
		id,
		locale: locale().locale,
		selectionMode: 'range',
		value: arkValue,
		min,
		max,
		disabled,
		readOnly,
		required,
		invalid,
		timeZone: tz,
		onValueChange(details) {
			const [nextStart = null, nextEnd = null] = details.value;
			// Guard: skip if Ark UI echoes back the same range (prevents reactive loop)
			if (
				nextStart?.toString() === arkStart?.toString() &&
				nextEnd?.toString() === arkEnd?.toString()
			) {
				return;
			}
			start = fromDateValue(nextStart, startShape, tz);
			end = fromDateValue(nextEnd, endShape, tz);
			onValueChange?.(details);
		}
	}));

	const dateInput = useDateInput(() => ({
		id,
		locale: locale().locale,
		selectionMode: 'range',
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
	<!-- Ark's HiddenInput would submit locale-formatted strings under names that
	     flip between `name` and `name[0]`/`name[1]` depending on how many dates are
	     selected. Plain inputs give stable names and canonical ISO values. -->
	{#if resolvedStartName}
		<input type="hidden" name={resolvedStartName} {disabled} value={submittedStart} />
	{/if}
	{#if resolvedEndName}
		<input type="hidden" name={resolvedEndName} {disabled} value={submittedEnd} />
	{/if}
</DateInput.RootProvider>
