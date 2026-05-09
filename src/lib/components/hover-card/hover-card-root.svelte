<script lang="ts">
	import { HoverCard } from '@ark-ui/svelte/hover-card';
	import type { HoverCardRootBaseProps } from '@ark-ui/svelte/hover-card';
	import type { Snippet } from 'svelte';

	interface Props extends HoverCardRootBaseProps {
		open?: boolean;
		children: Snippet;
		lazyMount?: boolean;
		unmountOnExit?: boolean;
	}

	let {
		open = $bindable(),
		children,
		lazyMount = true,
		unmountOnExit = true,
		...restProps
	}: Props = $props();
</script>

<HoverCard.Root bind:open {lazyMount} {unmountOnExit} {...restProps}>
	{@render children()}
</HoverCard.Root>
