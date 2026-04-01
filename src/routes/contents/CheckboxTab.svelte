<script lang="ts">
	import { Checkbox, CheckboxGroup } from '$lib';

	let checked = $state(false);

	const frameworkItems = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' }
	];

	let selectedFrameworks = $state(['svelte']);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Checkbox</h2>
		<div class="flex flex-col gap-4">
			<Checkbox label="I agree to the terms and conditions" bind:checked />
			<Checkbox label="Subscribe to newsletter" bind:checked />
			<p>Checked: {checked}</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Checkbox Group</h2>
		<CheckboxGroup items={frameworkItems} bind:value={selectedFrameworks} />
		<CheckboxGroup items={frameworkItems} bind:value={selectedFrameworks} orientation="vertical" />
		<p class="mt-4 text-sm text-ink-dim">
			Selected frameworks: {selectedFrameworks.join(', ')}
		</p>
	</section>
</div>
