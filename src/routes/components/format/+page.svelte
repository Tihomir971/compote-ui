<script lang="ts">
	import { FormatByte, FormatNumber, FormatRelativeTime, FormatTime } from '$lib';

	const daysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);
	const inTwoHours = new Date(Date.now() + 1000 * 60 * 60 * 2);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">FormatRelativeTime</h2>
		<div class="flex flex-wrap gap-6 text-sm">
			<div class="flex flex-col gap-1">
				<FormatRelativeTime value={daysAgo} />
				<span class="text-xs text-ink-dim">3 days ago</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatRelativeTime value={inTwoHours} />
				<span class="text-xs text-ink-dim">in 2 hours</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatRelativeTime value={daysAgo} style="short" />
				<span class="text-xs text-ink-dim">style: short</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatRelativeTime value={daysAgo} numeric="always" />
				<span class="text-xs text-ink-dim">numeric: always</span>
			</div>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">FormatByte</h2>
		<div class="flex flex-wrap gap-6 text-sm">
			<div class="flex flex-col gap-1">
				<FormatByte value={1536} />
				<span class="text-xs text-ink-dim">decimal (default)</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatByte value={1536} unitSystem="binary" />
				<span class="text-xs text-ink-dim">binary</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatByte value={1536} unitDisplay="long" />
				<span class="text-xs text-ink-dim">unitDisplay: long</span>
			</div>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">FormatNumber</h2>
		<div class="flex flex-wrap gap-6 text-sm">
			<div class="flex flex-col gap-1">
				<FormatNumber value={1234.5} />
				<span class="text-xs text-ink-dim">default</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatNumber value={0.42} style="percent" />
				<span class="text-xs text-ink-dim">style: percent</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatNumber value={1234.5} style="currency" currency="EUR" />
				<span class="text-xs text-ink-dim">style: currency (EUR)</span>
			</div>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">FormatTime</h2>
		<div class="flex flex-wrap gap-6 text-sm">
			<div class="flex flex-col gap-1">
				<FormatTime value={inTwoHours} />
				<span class="text-xs text-ink-dim">default</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatTime value={inTwoHours} format="24h" />
				<span class="text-xs text-ink-dim">format: 24h</span>
			</div>
			<div class="flex flex-col gap-1">
				<FormatTime value={inTwoHours} withSeconds />
				<span class="text-xs text-ink-dim">withSeconds</span>
			</div>
		</div>
	</section>
</div>
