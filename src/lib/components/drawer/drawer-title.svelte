<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerTitleBaseProps } from '@ark-ui/svelte/drawer';

	interface Props extends DrawerTitleBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Title {...rest} class={className ?? 'mb-2 text-lg leading-7 font-medium text-ink'}>
	{@render children?.()}
</Drawer.Title>
