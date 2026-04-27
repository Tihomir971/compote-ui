<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerGrabberIndicatorBaseProps } from '@ark-ui/svelte/drawer';

	interface Props extends DrawerGrabberIndicatorBaseProps {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<Drawer.GrabberIndicator {...rest} class={className ?? 'h-1 w-10 rounded-full bg-border'} />
