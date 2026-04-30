<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerRootProps } from '@ark-ui/svelte/drawer';

	interface Props extends Omit<DrawerRootProps, 'open' | 'onOpenChange'> {
		open?: boolean;
	}

	let { children, open = $bindable(), ...rest }: Props = $props();
</script>

<Drawer.Root bind:open {...rest}>
	{@render children?.()}
</Drawer.Root>
