<script lang="ts">
	import { PhoneInput } from '$lib';
	import type { CountryCode } from 'svelte-tel-input/types';

	let value = $state('');
	let country = $state<CountryCode | null>('RS');
	let valid = $state(false);

	let invalidValue = $state('+1');
	let invalidCountry = $state<CountryCode | null>('US');
	let invalidValid = $state(false);

	let disabledValue = $state('+12015550123');
	let disabledCountry = $state<CountryCode | null>('US');
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Phone Input</h2>
		<div class="flex flex-col gap-4">
			<p class="text-sm text-ink-dim">
				Value: {value || '(empty)'} · Country: {country ?? '(none)'} · Valid: {valid}
			</p>
			<PhoneInput label="Phone number" bind:value bind:country bind:valid />

			<PhoneInput label="Horizontal" bind:value bind:country bind:valid layout="horizontal" />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">States</h2>
		<div class="flex flex-col gap-4">
			<PhoneInput
				label="Invalid"
				bind:value={invalidValue}
				bind:country={invalidCountry}
				bind:valid={invalidValid}
				invalid={!invalidValid}
			/>
			<PhoneInput
				label="Disabled"
				bind:value={disabledValue}
				bind:country={disabledCountry}
				disabled
			/>
			<PhoneInput
				label="Readonly"
				bind:value={disabledValue}
				bind:country={disabledCountry}
				readonly
			/>
		</div>
	</section>
</div>
