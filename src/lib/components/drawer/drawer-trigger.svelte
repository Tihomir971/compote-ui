<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerTriggerBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';

	interface Props extends DrawerTriggerBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Trigger {...rest} class={className}>
	{@render children?.()}
</Drawer.Trigger>
