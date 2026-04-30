<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerGrabberBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	interface Props extends DrawerGrabberBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Grabber
	{...rest}
	class={cn(
		'flex w-full shrink-0 cursor-grab touch-none items-center justify-center py-5 select-none active:cursor-grabbing',
		className
	)}
>
	{@render children?.()}
</Drawer.Grabber>
