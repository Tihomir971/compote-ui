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

	let formValue = $state<DateValue[]>([]);
	let submitted = $state('');

	function dumpForm(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
		event.preventDefault();
		submitted = JSON.stringify([...new FormData(event.currentTarget)]);
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
	<section>
		<h2 class="mb-4 text-lg font-semibold">In a form</h2>
		<p class="mb-3 text-sm text-ink-dim">
			A <code>name</code> of <code>stay</code> submits two ISO fields, <code>stayStart</code> and
			<code>stayEnd</code>. The names stay the same however many dates are picked; an unpicked end
			date submits as an empty string.
		</p>
		<form class="flex flex-col gap-4" onsubmit={dumpForm}>
			<DateRangeField label="Stay" name="stay" bind:value={formValue} />
			<button
				type="submit"
				class="h-9 w-fit rounded-md bg-primary px-4 text-sm text-ink-inverse focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
			>
				Submit
			</button>
			<p class="text-sm break-all text-ink-dim">
				Submitted: <strong>{submitted || 'none'}</strong>
			</p>
		</form>
	</section>
</div>
