<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = {
		value: string;
		disabled?: boolean;
		class?: string;
		children: Snippet;
	};

	const { value, disabled = false, class: className, children }: Props = $props();
</script>

<Menu.Item
	{value}
	{disabled}
	class={cn(
		'data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
		className
	)}
>
	{@render children()}
</Menu.Item>
