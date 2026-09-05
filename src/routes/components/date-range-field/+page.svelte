<script lang="ts">
	import { DateRangeField } from '$lib';
	import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
	import type { DateValue } from '@ark-ui/svelte/date-picker';

	let start = $state<DateValue | null>(null);
	let end = $state<DateValue | null>(null);

	// Supabase-style strings — bind straight to the two `date` columns.
	let stayStart = $state('2025-06-01');
	let stayEnd = $state('2025-06-15');

	let presetStart = $state<DateValue | null>(new CalendarDate(2025, 6, 1));
	let presetEnd = $state<DateValue | null>(new CalendarDate(2025, 6, 15));

	const todayDate = today(getLocalTimeZone());
	const minDate = todayDate;
	const maxDate = todayDate.add({ months: 6 });

	function isWeekend(date: DateValue): boolean {
		const d = new Date(date.year, date.month - 1, date.day);
		return d.getDay() === 0 || d.getDay() === 6;
	}

	let formStart = $state('2025-06-01');
	let formEnd = $state('2025-06-15');
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
			Two segment groups bound separately via <code>bind:start</code> and <code>bind:end</code>. The
			calendar highlights the selected range.
		</p>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" bind:start bind:end />
			<p class="text-sm text-ink-dim">
				Start: <strong>{start?.toString() ?? 'none'}</strong>
				&nbsp;–&nbsp; End: <strong>{end?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Database strings (Supabase)</h2>
		<p class="mb-3 text-sm text-ink-dim">
			A range is almost always two <code>date</code> columns, so each end binds to its own string —
			no array, no conversion. String in → string out. Bind strings (not <code>DateValue</code>)
			when the value feeds a remote <code>query</code>/<code>command</code>: their arguments are
			serialized with devalue, which handles strings and <code>Date</code> but not
			<code>@internationalized/date</code> class instances.
		</p>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Stay" bind:start={stayStart} bind:end={stayEnd} />
			<p class="text-sm text-ink-dim">
				stay_start: <strong>{stayStart}</strong> (<em>{typeof stayStart}</em>) &nbsp;–&nbsp;
				stay_end: <strong>{stayEnd}</strong> (<em>{typeof stayEnd}</em>)
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Default Value</h2>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" bind:start={presetStart} bind:end={presetEnd} />
			<p class="text-sm text-ink-dim">
				Start: <strong>{presetStart?.toString() ?? 'none'}</strong>
				&nbsp;–&nbsp; End: <strong>{presetEnd?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Min / Max</h2>
		<p class="mb-3 text-sm text-ink-dim">Today to +6 months.</p>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" min={minDate} max={maxDate} bind:start bind:end />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Unavailable Dates</h2>
		<p class="mb-3 text-sm text-ink-dim">Weekends are marked unavailable.</p>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" isDateUnavailable={isWeekend} bind:start bind:end />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Invalid</h2>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" invalid bind:start bind:end />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Disabled</h2>
		<div class="flex flex-col gap-4">
			<DateRangeField label="Date range" disabled bind:start={presetStart} bind:end={presetEnd} />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">In a form</h2>
		<p class="mb-3 text-sm text-ink-dim">
			<code>name="stay"</code> is shorthand for the pair <code>stayStart</code> /
			<code>stayEnd</code>. Use <code>startName</code> / <code>endName</code> to match your own column
			names, or a remote form schema of any shape. Both submit canonical ISO.
		</p>
		<form class="flex flex-col gap-4" onsubmit={dumpForm}>
			<DateRangeField
				label="Stay (name shorthand)"
				name="stay"
				bind:start={formStart}
				bind:end={formEnd}
			/>
			<DateRangeField
				label="Stay (explicit names)"
				startName="stay_start"
				endName="stay_end"
				bind:start={formStart}
				bind:end={formEnd}
			/>
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
