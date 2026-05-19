<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerDescriptionBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	interface Props extends DrawerDescriptionBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Description {...rest} class={cn('text-sm text-ink-dim', className)}>
	{@render children?.()}
</Drawer.Description>
