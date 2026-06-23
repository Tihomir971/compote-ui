<script lang="ts">
	import { PasswordInput } from '$lib';

	let value = $state('');
	let invalidValue = $state('bad-password');
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Password Input</h2>
		<div class="flex flex-col gap-4">
			<p class="text-sm text-ink-dim">Value: {value || '(empty)'}</p>
			<PasswordInput label="Password" placeholder="Enter password" bind:value />

			<PasswordInput label="Horizontal" placeholder="Enter password" layout="horizontal" />

			<PasswordInput label="Required" placeholder="Enter password" required />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">States</h2>
		<div class="flex flex-col gap-4">
			<PasswordInput label="Invalid" bind:value={invalidValue} invalid />
			<PasswordInput label="Disabled" disabled />
			<PasswordInput label="Readonly" readOnly />
		</div>
	</section>
</div>
