<script lang="ts">
	import { Popover } from '@ark-ui/svelte/popover';
	import type { PopoverRootBaseProps } from '@ark-ui/svelte/popover';
	import type { Snippet } from 'svelte';
	import { setPopoverLabels } from './popover-labels.svelte';

	interface Props extends PopoverRootBaseProps {
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

	setPopoverLabels();
</script>

<Popover.Root bind:open {lazyMount} {unmountOnExit} {...restProps}>
	{@render children()}
</Popover.Root>
