<script lang="ts">
	import { Badge } from '$lib';
	import { PhCheck, PhX } from '$lib/icons';
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Colors</h2>
		<div class="flex flex-wrap items-center gap-3">
			<Badge color="neutral">Neutral</Badge>
			<Badge color="primary">Primary</Badge>
			<Badge color="danger">Danger</Badge>
			<Badge color="warning">Warning</Badge>
			<Badge color="success">Success</Badge>
			<Badge color="info">Info</Badge>
		</div>
		<p class="mt-2 text-sm text-ink-dim">neutral / primary / danger / warning / success / info</p>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Variants</h2>

		<h3 class="mb-2 text-sm font-medium text-ink-dim">Solid</h3>
		<div class="mb-4 flex flex-wrap items-center gap-3">
			<Badge variant="solid" color="neutral">Neutral</Badge>
			<Badge variant="solid" color="primary">Primary</Badge>
			<Badge variant="solid" color="danger">Danger</Badge>
			<Badge variant="solid" color="warning">Warning</Badge>
			<Badge variant="solid" color="success">Success</Badge>
			<Badge variant="solid" color="info">Info</Badge>
		</div>

		<h3 class="mb-2 text-sm font-medium text-ink-dim">Subtle</h3>
		<div class="mb-4 flex flex-wrap items-center gap-3">
			<Badge variant="subtle" color="neutral">Neutral</Badge>
			<Badge variant="subtle" color="primary">Primary</Badge>
			<Badge variant="subtle" color="danger">Danger</Badge>
			<Badge variant="subtle" color="warning">Warning</Badge>
			<Badge variant="subtle" color="success">Success</Badge>
			<Badge variant="subtle" color="info">Info</Badge>
		</div>

		<h3 class="mb-2 text-sm font-medium text-ink-dim">Outline</h3>
		<div class="flex flex-wrap items-center gap-3">
			<Badge variant="outline" color="neutral">Neutral</Badge>
			<Badge variant="outline" color="primary">Primary</Badge>
			<Badge variant="outline" color="danger">Danger</Badge>
			<Badge variant="outline" color="warning">Warning</Badge>
			<Badge variant="outline" color="success">Success</Badge>
			<Badge variant="outline" color="info">Info</Badge>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">With icon</h2>
		<div class="flex flex-wrap items-center gap-3">
			<Badge color="success" variant="solid">
				{#snippet icon()}
					<PhCheck />
				{/snippet}
				Verified
			</Badge>
			<Badge color="danger" variant="subtle">
				{#snippet icon()}
					<PhX />
				{/snippet}
				Rejected
			</Badge>
			<Badge color="info" variant="outline">
				{#snippet icon()}
					<PhCheck />
				{/snippet}
				Approved
			</Badge>
		</div>
		<p class="mt-2 text-sm text-ink-dim">Badges with a leading icon snippet</p>
	</section>
</div>
