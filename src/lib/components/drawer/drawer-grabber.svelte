<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerGrabberBaseProps } from '@ark-ui/svelte/drawer';

	interface Props extends DrawerGrabberBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Grabber
	{...rest}
	class={className ??
		'flex w-full shrink-0 cursor-grab touch-none items-center justify-center py-5 select-none active:cursor-grabbing'}
>
	{@render children?.()}
</Drawer.Grabber>
