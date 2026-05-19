<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerTriggerBaseProps } from '@ark-ui/svelte/drawer';
	import { button, type ButtonSize, type ButtonVariant } from '../button/button.variants';

	type Props = DrawerTriggerBaseProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
	};

	let { variant, size, class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Trigger {...rest} class={button({ variant, size, class: className })}>
	{@render children?.()}
</Drawer.Trigger>
