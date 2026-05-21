<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerRootProps } from '@ark-ui/svelte/drawer';

	interface Props extends Omit<DrawerRootProps, 'open'> {
		open?: boolean;
	}

	let { children, open = $bindable(), onOpenChange, ...rest }: Props = $props();
</script>

<Drawer.Root
	{open}
	onOpenChange={(details) => {
		open = details.open;
		onOpenChange?.(details);
	}}
	{...rest}
>
	{@render children?.()}
</Drawer.Root>
