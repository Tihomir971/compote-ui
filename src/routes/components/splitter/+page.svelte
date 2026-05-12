<script lang="ts">
	import { Splitter } from '$lib';
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Horizontal Splitter</h2>
		<div class="h-64 rounded-lg border border-surface-3">
			{#snippet leftPanel()}
				<div class="flex h-full items-center justify-center font-medium">Left Panel</div>
			{/snippet}
			{#snippet rightPanel()}
				<div class="flex h-full items-center justify-center font-medium">Right Panel</div>
			{/snippet}
			<Splitter
				panels={[
					{ id: 'left', minSize: 20, content: leftPanel },
					{ id: 'right', minSize: 20, content: rightPanel }
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
			<Splitter
				orientation="vertical"
				panels={[
					{ id: 'top', minSize: 20, content: topPanel },
					{ id: 'bottom', minSize: 20, content: bottomPanel }
				]}
			/>
		</div>
	</section>
</div>
