<script lang="ts">
	import { ToggleGroup } from '@ark-ui/svelte/toggle-group';
	import type { ToggleGroupRootBaseProps } from '@ark-ui/svelte/toggle-group';
	import { cn } from 'tailwind-variants';

	interface Props extends ToggleGroupRootBaseProps {
		class?: string;
	}

	let { class: className, children, value = $bindable(), ...rootProps }: Props = $props();
</script>

<ToggleGroup.Root
	{...rootProps}
	bind:value
	class={cn(
		'inline-flex gap-1 rounded-lg border border-border bg-surface-1 p-1 data-[orientation=vertical]:flex-col',
		className
	)}
>
	{@render children?.()}
</ToggleGroup.Root>
