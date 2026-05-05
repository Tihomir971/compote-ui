<script lang="ts">
	import { Popover } from '@ark-ui/svelte/popover';
	import type { PopoverCloseTriggerBaseProps } from '@ark-ui/svelte/popover';
	import { PhX } from '$lib/icons';
	import type { ClassValue } from 'svelte/elements';

	interface Props extends PopoverCloseTriggerBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Popover.CloseTrigger
	{...rest}
	class={className ??
		'absolute top-3 right-3 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:opacity-50'}
>
	{#if children}
		{@render children()}
	{:else}
		<PhX class="size-4" />
		<span class="sr-only">Close</span>
	{/if}
</Popover.CloseTrigger>
