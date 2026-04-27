<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerRootProps, DrawerOpenChangeDetails } from '@ark-ui/svelte/drawer';

	interface Props extends Omit<DrawerRootProps, 'open' | 'onOpenChange'> {
		open?: boolean;
	}

	let { children, open = $bindable(), ...rest }: Props = $props();

	const handleOpenChange = (details: DrawerOpenChangeDetails) => {
		open = details.open;
	};
</script>

<Drawer.Root {open} onOpenChange={handleOpenChange} {...rest}>
	{@render children?.()}
</Drawer.Root>
