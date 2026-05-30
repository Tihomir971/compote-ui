<script lang="ts">
	import { DateField } from '$lib';
	import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
	import type { DateValue } from '@ark-ui/svelte/date-picker';

	let value = $state<DateValue | null>(null);
	let datetimeValue = $state<DateValue | null>(null);
	let presetValue = $state<DateValue | null>(new CalendarDate(2025, 6, 15));
	let minMaxValue = $state<DateValue | null>(null);
	let invalidValue = $state<DateValue | null>(null);

	const todayDate = today(getLocalTimeZone());
	const minDate = todayDate;
	const maxDate = todayDate.add({ months: 3 });
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic</h2>
		<div class="flex flex-col gap-4">
			<DateField label="Date" bind:value />
			<p class="text-sm text-ink-dim">
				Value: <strong>{value?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Date & Time</h2>
		<p class="mb-3 text-sm text-ink-dim">
			Segments include hour and minute. The calendar popup stays open and shows a time input.
		</p>
		<div class="flex flex-col gap-4">
			<DateField label="Appointment" granularity="minute" bind:value={datetimeValue} />
			<p class="text-sm text-ink-dim">
				Value: <strong>{datetimeValue?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Default Value</h2>
		<div class="flex flex-col gap-4">
			<DateField label="Date" bind:value={presetValue} />
			<p class="text-sm text-ink-dim">
				Value: <strong>{presetValue?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Min / Max</h2>
		<p class="mb-3 text-sm text-ink-dim">
			Restricted to today + 3 months. Dates outside the range are unavailable in the calendar.
		</p>
		<div class="flex flex-col gap-4">
			<DateField label="Date" min={minDate} max={maxDate} bind:value={minMaxValue} />
			<p class="text-sm text-ink-dim">
				Value: <strong>{minMaxValue?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Invalid</h2>
		<div class="flex flex-col gap-4">
			<DateField label="Date" invalid bind:value={invalidValue} />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Read Only</h2>
		<div class="flex flex-col gap-4">
			<DateField label="Date" readOnly value={new CalendarDate(2025, 6, 15)} />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Disabled</h2>
		<div class="flex flex-col gap-4">
			<DateField label="Date" disabled />
		</div>
	</section>
</div>
