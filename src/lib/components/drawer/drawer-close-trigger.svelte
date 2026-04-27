<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerCloseTriggerBaseProps } from '@ark-ui/svelte/drawer';

	interface Props extends DrawerCloseTriggerBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.CloseTrigger
	{...rest}
	onclick={()=>console.log("Click:")}
	class={className ??
		'absolute top-12 right-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded border-none bg-transparent text-ink-dim hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[-1px]'}
>
	{@render children?.()}
</Drawer.CloseTrigger>
