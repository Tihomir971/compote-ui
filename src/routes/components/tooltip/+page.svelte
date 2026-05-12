<script lang="ts">
	import { Tooltip } from '$lib';
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic Tooltip</h2>
		<Tooltip.Root>
			<Tooltip.Trigger>?</Tooltip.Trigger>
			<Tooltip.Content>Helpful contextual information.</Tooltip.Content>
		</Tooltip.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Positioned Tooltip</h2>
		<Tooltip.Root positioning={{ placement: 'right' }}>
			<Tooltip.Trigger variant="outline" size="default">Hover me</Tooltip.Trigger>
			<Tooltip.Content>Tooltips can be positioned with Ark UI positioning options.</Tooltip.Content>
		</Tooltip.Root>
	</section>
</div>
