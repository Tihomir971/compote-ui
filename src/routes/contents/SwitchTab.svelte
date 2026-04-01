<script lang="ts">
	import { Switch } from '$lib';

	let switchChecked = $state(false);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Switch</h2>
		<div class="flex flex-col gap-4">
			<Switch label="Enable notifications" bind:checked={switchChecked} />
			<p class="text-sm text-ink-dim">Checked: {switchChecked}</p>
			<Switch label="Dark mode" bind:checked={switchChecked} layout="vertical" labelSpacer />
			<Switch label="Disabled switch" bind:checked={switchChecked} disabled />
		</div>
	</section>
</div>
