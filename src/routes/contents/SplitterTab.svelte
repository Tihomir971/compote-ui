<script lang="ts">
	import { Spliter } from '$lib';
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Horizontal Splitter</h2>
		<div class="h-64 rounded-lg border border-surface-3">
			{#snippet leftPanel()}
				<div class="flex h-full items-center justify-center font-medium">Left Panel</div>
			{/snippet}
			{#snippet rightPanel()}
				<div class="flex h-full items-center justify-center font-medium">Right Panel</div>
			{/snippet}
			<Spliter
				panels={[
					{ id: 'left', minSize: 150, content: leftPanel },
					{ id: 'right', minSize: 150, content: rightPanel }
				]}
			/>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Vertical Splitter</h2>
		<div class="h-64 rounded-lg border border-surface-3">
			{#snippet topPanel()}
				<div class="flex h-full items-center justify-center font-medium">Top Panel</div>
			{/snippet}
			{#snippet bottomPanel()}
				<div class="flex h-full items-center justify-center font-medium">Bottom Panel</div>
			{/snippet}
			<Spliter
				orientation="vertical"
				panels={[
					{ id: 'top', minSize: 100, content: topPanel },
					{ id: 'bottom', minSize: 100, content: bottomPanel }
				]}
			/>
		</div>
	</section>
</div>
