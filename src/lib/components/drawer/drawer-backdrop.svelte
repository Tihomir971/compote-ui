<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerBackdropBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	interface Props extends DrawerBackdropBaseProps {
		class?: ClassValue;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<Drawer.Backdrop
	{...rest}
	class={cn(
		'fixed inset-0 z-50 bg-black/50',
		'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
		'data-[state=open]:animate-in data-[state=open]:fade-in-0',
		className
	)}
/>
