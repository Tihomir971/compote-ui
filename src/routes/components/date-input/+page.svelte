<script lang="ts">
	import { DateInput } from '$lib';
	import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
	import type { DateValue } from '@ark-ui/svelte/date-picker';

	let value = $state<DateValue | null>(null);
	let datetimeValue = $state<DateValue | null>(null);
	let invalidValue = $state<DateValue | null>(null);

	const todayDate = today(getLocalTimeZone());
	const minDate = todayDate;
	const maxDate = todayDate.add({ months: 6 });
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
			<DateInput label="Date & time" granularity="minute" bind:value={datetimeValue} />
			<p class="text-sm text-ink-dim">
				Value: <strong>{datetimeValue?.toString() ?? 'none'}</strong>
			</p>
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
</div>
