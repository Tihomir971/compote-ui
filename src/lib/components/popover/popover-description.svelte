<script lang="ts">
	import { Popover } from '@ark-ui/svelte/popover';
	import type { PopoverDescriptionBaseProps } from '@ark-ui/svelte/popover';
	import type { ClassValue } from 'svelte/elements';
	import { getPopoverLabels } from './popover-labels.svelte';

	interface Props extends PopoverDescriptionBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();

	const labels = getPopoverLabels();
	$effect(() => labels?.registerDescription());
</script>

<Popover.Description {...rest} class={className ?? 'mt-1 text-sm text-ink-dim'}>
	{@render children?.()}
</Popover.Description>
