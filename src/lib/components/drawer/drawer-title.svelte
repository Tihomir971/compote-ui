<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerTitleBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	interface Props extends DrawerTitleBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Title {...rest} class={cn('mb-2 text-lg leading-7 font-medium text-ink', className)}>
	{@render children?.()}
</Drawer.Title>
