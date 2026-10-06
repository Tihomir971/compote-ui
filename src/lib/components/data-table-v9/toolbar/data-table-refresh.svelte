<script lang="ts">
	import * as Tooltip from '../../tooltip';
	import { PhArrowClockwise } from '#lib/icons';

	type Props = {
		/** Called on click. If it returns a promise, the button shows a busy state until it settles. */
		onRefresh: () => void | Promise<unknown>;
		/** Force the busy state, e.g. when a refresh is triggered elsewhere. */
		loading?: boolean;
		/** Text label for the trigger. When omitted, a refresh icon is shown instead. */
		triggerLabel?: string;
	};

	let { onRefresh, loading = false, triggerLabel }: Props = $props();

	let pending = $state(false);
	const busy = $derived(loading || pending);

	async function handleClick() {
		if (busy) return;
		pending = true;
		try {
			await onRefresh();
		} finally {
			pending = false;
		}
	}
</script>

<Tooltip.Root disabled={!!triggerLabel}>
	<!-- aria-disabled instead of disabled so keyboard focus isn't lost mid-refresh -->
	<Tooltip.Trigger
		type="button"
		variant="outline"
		size={triggerLabel ? 'default' : 'icon'}
		class="aria-disabled:cursor-default"
		aria-label={triggerLabel ? undefined : 'Refresh'}
		aria-busy={busy}
		aria-disabled={busy}
		onclick={handleClick}
	>
		<PhArrowClockwise class={busy ? 'animate-spin motion-reduce:animate-none' : undefined} />
		{triggerLabel}
	</Tooltip.Trigger>
	<Tooltip.Content>Refresh</Tooltip.Content>
</Tooltip.Root>
