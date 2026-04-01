<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuTriggerItemBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = MenuTriggerItemBaseProps & { class?: string; children: Snippet };

	const { class: className, children, ...restProps }: Props = $props();
</script>

<Menu.TriggerItem
	{...restProps}
	class={cn(
		'relative flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-2 data-highlighted:text-ink',
		className
	)}
>
	{@render children()}
</Menu.TriggerItem>
