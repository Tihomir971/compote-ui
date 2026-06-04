<script lang="ts">
	import { Toggle } from '@ark-ui/svelte/toggle';
	import type { ToggleProps } from './types';
	import { toggle } from './toggle.variants';

	let {
		class: className,
		children,
		pressed = $bindable(),
		size,
		variant,
		icon,
		...rootProps
	}: ToggleProps = $props();
</script>

<Toggle.Root
	{...rootProps}
	bind:pressed
	class={toggle({ size, variant, icon, class: className as never })}
>
	{@render children?.()}
</Toggle.Root>
