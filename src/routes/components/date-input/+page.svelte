<script lang="ts">
	import { DateInput, getLocalTimeZone, parseAbsolute } from '$lib';
	import { CalendarDate, today } from '@internationalized/date';
	import type { DateInputDateValue } from '$lib';

	const localTimeZone = getLocalTimeZone();

	let value = $state<DateInputDateValue | null>(null);
	let datetimeValue = $state<DateInputDateValue | null>(
		parseAbsolute('2025-07-11T10:12:01.982258+00:00', localTimeZone)
	);
	let invalidValue = $state<DateInputDateValue | null>(null);

	// Supabase-style strings — bind directly, no conversion. String in → string out.
	let dbDate = $state('2025-06-15');
	let dbTimestamptz = $state('2025-07-11T10:12:01.982258+00:00');

	const todayDate = today(localTimeZone);
	const minDate = todayDate;
	const maxDate = todayDate.add({ months: 6 });

	let formDate = $state('2025-06-15');
	let formDateTime = $state('2025-07-11T10:12:01.982258+00:00');
	let submitted = $state('');

	function dumpForm(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
		event.preventDefault();
		submitted = JSON.stringify([...new FormData(event.currentTarget)]);
	}
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic</h2>
		<p class="mb-3 text-sm text-ink-dim">Segmented keyboard-driven input. No calendar popup.</p>
		<div class="flex flex-col gap-4">
			<DateInput label="Date" bind:value />
			<p class="text-sm text-ink-dim">
				Value: <strong>{value?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Date & Time</h2>
		<div class="flex flex-col gap-4">
			<DateInput
				label="Date & time"
				granularity="minute"
				timeZone={localTimeZone}
				hideTimeZone
				bind:value={datetimeValue}
			/>
			<p class="text-sm text-ink-dim">
				Value: <strong>{datetimeValue?.toString() ?? 'none'}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Database strings (Supabase)</h2>
		<p class="mb-3 text-sm text-ink-dim">
			Bind ISO strings straight from the DB — no <code>parseDate</code>/<code>.toString()</code>
			round-trip. The bound value stays a string. A <code>timestamptz</code> (UTC, with
			<code>Z</code>/offset) displays in your local zone and is emitted back as UTC — leave
			<code>timeZone</code> unset.
		</p>
		<div class="flex flex-col gap-4">
			<DateInput label="date column" bind:value={dbDate} />
			<p class="text-sm text-ink-dim">
				Value: <strong>{dbDate}</strong> (<em>{typeof dbDate}</em>)
			</p>
			<DateInput
				label="timestamptz column (UTC in → local display → UTC out)"
				granularity="minute"
				bind:value={dbTimestamptz}
			/>
			<p class="text-sm text-ink-dim">
				Value: <strong>{dbTimestamptz}</strong> (<em>{typeof dbTimestamptz}</em>)
			</p>
			<DateInput
				label="German locale"
				locale="de-DE"
				granularity="minute"
				bind:value={dbTimestamptz}
			/>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Min / Max</h2>
		<p class="mb-3 text-sm text-ink-dim">Today to +6 months.</p>
		<div class="flex flex-col gap-4">
			<DateInput label="Date" min={minDate} max={maxDate} bind:value />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Default Value</h2>
		<div class="flex flex-col gap-4">
			<DateInput label="Date" value={new CalendarDate(2025, 6, 15)} />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Invalid</h2>
		<div class="flex flex-col gap-4">
			<DateInput label="Date" invalid bind:value={invalidValue} />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Read Only</h2>
		<div class="flex flex-col gap-4">
			<DateInput label="Date" readOnly value={new CalendarDate(2025, 6, 15)} />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Disabled</h2>
		<div class="flex flex-col gap-4">
			<DateInput label="Date" disabled />
		</div>
	</section>
	<section>
		<h2 class="mb-4 text-lg font-semibold">In a form</h2>
		<p class="mb-3 text-sm text-ink-dim">
			The hidden input submits a canonical ISO string, never the locale-formatted display value. The
			German field below still <em>displays</em> <code>15.6.2025</code> while submitting ISO.
		</p>
		<form class="flex flex-col gap-4" onsubmit={dumpForm}>
			<DateInput label="Start date" name="startDate" bind:value={formDate} />
			<DateInput
				label="Starts at (minute granularity)"
				name="startsAt"
				granularity="minute"
				bind:value={formDateTime}
			/>
			<DateInput label="German locale" name="germanDate" locale="de-DE" bind:value={formDate} />
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
