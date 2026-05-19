<script lang="ts">
	import { Toggle as ArkToggle } from '@ark-ui/svelte/toggle';
	import type { ToggleProps } from './types';
	import { toggle } from './toggle.variants';

	let {
		class: className,
		children,
		pressed = $bindable(),
		size,
		icon,
		...rootProps
	}: ToggleProps = $props();
</script>

<ArkToggle.Root {...rootProps} bind:pressed class={toggle({ size, icon, class: className as never })}>
	{@render children?.()}
</ArkToggle.Root>
