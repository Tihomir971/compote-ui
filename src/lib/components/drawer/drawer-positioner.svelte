<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerPositionerBaseProps } from '@ark-ui/svelte/drawer';

	interface Props extends DrawerPositionerBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Positioner
	{...rest}
	class={className ??
		'fixed inset-0 z-50 flex items-end justify-center data-[swipe-direction=left]:items-stretch data-[swipe-direction=left]:justify-start data-[swipe-direction=right]:items-stretch data-[swipe-direction=right]:justify-end data-[swipe-direction=up]:items-start'}
>
	{@render children?.()}
</Drawer.Positioner>
