<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerCloseTriggerBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';
	import PhX from '$lib/icons/PhX.svelte';

	interface Props extends DrawerCloseTriggerBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.CloseTrigger
	{...rest}
	class={className ??
		'absolute top-3 right-3 flex size-7 cursor-pointer items-center justify-center rounded border-none bg-transparent text-ink-dim hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[-1px]'}
>
	{#if children}
		{@render children()}
	{:else}
		<PhX />
	{/if}
</Drawer.CloseTrigger>
