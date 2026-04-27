<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerTriggerBaseProps } from '@ark-ui/svelte/drawer';

	interface Props extends DrawerTriggerBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Trigger {...rest} class={className}>
	{@render children?.()}
</Drawer.Trigger>
