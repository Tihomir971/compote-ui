<script lang="ts">
	import { DateRangeField } from '$lib';
	import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
	import type { DateValue } from '@ark-ui/svelte/date-picker';

	let value = $state<DateValue[]>([]);
	let presetValue = $state<DateValue[]>([
		new CalendarDate(2025, 6, 1),
		new CalendarDate(2025, 6, 15)
	]);
	let invalidValue = $state<DateValue[]>([]);

	const todayDate = today(getLocalTimeZone());
	const minDate = todayDate;
	const maxDate = todayDate.add({ months: 6 });

	function isWeekend(date: DateValue): boolean {
		const d = new Date(date.year, date.month - 1, date.day);
		return d.getDay() === 0 || d.getDay() === 6;
	}
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic</h2>
		<p class="mb-3 text-sm text-ink-dim">
			Two segment groups for start and end. Calendar highlights the selected range.
		</p>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" bind:value />
			<p class="text-sm text-ink-dim">
				Start: <strong>{value[0]?.toString() ?? 'none'}</strong>
				&nbsp;–&nbsp; End: <strong>{value[1]?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Default Value</h2>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" bind:value={presetValue} />
			<p class="text-sm text-ink-dim">
				Start: <strong>{presetValue[0]?.toString() ?? 'none'}</strong>
				&nbsp;–&nbsp; End: <strong>{presetValue[1]?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Min / Max</h2>
		<p class="mb-3 text-sm text-ink-dim">Today to +6 months.</p>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" min={minDate} max={maxDate} bind:value />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Unavailable Dates</h2>
		<p class="mb-3 text-sm text-ink-dim">Weekends are marked unavailable.</p>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" isDateUnavailable={isWeekend} bind:value />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Invalid</h2>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" invalid bind:value={invalidValue} />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Disabled</h2>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" disabled />
		</div>
	</section>
</div>
