<script lang="ts">
	import { ProgressLinear, ProgressCircular } from '$lib';

	let value = $state(60);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Interactive</h2>
		<div class="space-y-4">
			<input type="range" min="0" max="100" bind:value class="w-full accent-primary" />
			<ProgressLinear {value} label="Uploading" showValueText />
			<div class="flex justify-center pt-2">
				<ProgressCircular {value} showValueText size="lg" />
			</div>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Linear — sizes</h2>
		<div class="space-y-4">
			<ProgressLinear value={45} size="sm" />
			<ProgressLinear value={45} size="md" />
			<ProgressLinear value={45} size="lg" />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Linear — variants</h2>
		<div class="space-y-4">
			<ProgressLinear value={70} variant="primary" label="Primary" showValueText />
			<ProgressLinear value={70} variant="success" label="Success" showValueText />
			<ProgressLinear value={70} variant="danger" label="Danger" showValueText />
			<ProgressLinear value={70} variant="warning" label="Warning" showValueText />
			<ProgressLinear value={70} variant="info" label="Info" showValueText />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Linear — indeterminate</h2>
		<ProgressLinear value={null} label="Loading…" />
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Circular — sizes</h2>
		<div class="flex flex-wrap items-end gap-8">
			<ProgressCircular value={65} size="sm" showValueText />
			<ProgressCircular value={65} size="md" showValueText />
			<ProgressCircular value={65} size="lg" showValueText />
			<ProgressCircular value={65} size={128} thickness={8} showValueText />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Circular — variants</h2>
		<div class="flex flex-wrap items-end gap-8">
			<ProgressCircular value={80} variant="primary" label="Primary" showValueText />
			<ProgressCircular value={80} variant="success" label="Success" showValueText />
			<ProgressCircular value={80} variant="danger" label="Danger" showValueText />
			<ProgressCircular value={80} variant="warning" label="Warning" showValueText />
			<ProgressCircular value={80} variant="info" label="Info" showValueText />
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Circular — indeterminate</h2>
		<div class="flex flex-wrap items-end gap-8">
			<ProgressCircular value={null} size="sm" />
			<ProgressCircular value={null} size="md" label="Loading…" />
		</div>
	</section>
</div>
