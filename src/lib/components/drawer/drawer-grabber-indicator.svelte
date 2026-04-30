<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerGrabberIndicatorBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	interface Props extends DrawerGrabberIndicatorBaseProps {
		class?: ClassValue;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<Drawer.GrabberIndicator {...rest} class={cn('h-1 w-10 rounded-full bg-border', className)} />
