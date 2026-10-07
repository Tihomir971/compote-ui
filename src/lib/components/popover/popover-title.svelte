<script lang="ts">
	import { Popover } from '@ark-ui/svelte/popover';
	import type { PopoverTitleBaseProps } from '@ark-ui/svelte/popover';
	import type { ClassValue } from 'svelte/elements';
	import { getPopoverLabels } from './popover-labels.svelte';

	interface Props extends PopoverTitleBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();

	const labels = getPopoverLabels();
	$effect(() => labels?.registerTitle());
</script>

<Popover.Title {...rest} class={className ?? 'text-sm font-semibold'}>
	{@render children?.()}
</Popover.Title>
