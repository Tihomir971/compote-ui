<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';
	import type { DialogCloseTriggerBaseProps } from '@ark-ui/svelte/dialog';
	import { PhX } from '$lib/icons';

	interface Props extends DialogCloseTriggerBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Dialog.CloseTrigger
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
</Dialog.CloseTrigger>
