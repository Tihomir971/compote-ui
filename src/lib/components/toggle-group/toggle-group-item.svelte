<script lang="ts">
	import { ToggleGroup } from '@ark-ui/svelte/toggle-group';
	import type { ToggleGroupItemBaseProps } from '@ark-ui/svelte/toggle-group';
	import { cn } from 'tailwind-variants';

	interface Props extends ToggleGroupItemBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<ToggleGroup.Item
	{...rest}
	class={cn(
		'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-ink-dim transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm',
		className
	)}
>
	{@render children?.()}
</ToggleGroup.Item>
