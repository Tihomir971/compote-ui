<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuRadioItemBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';
	import MenuItemIndicator from './menu-item-indicator.svelte';

	type Props = MenuRadioItemBaseProps & { class?: string; children: Snippet; indicator?: Snippet };

	const { class: className, children, indicator, ...restProps }: Props = $props();
</script>

<Menu.RadioItem
	{...restProps}
	class={cn(
		'relative flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-2 data-highlighted:text-ink',
		className
	)}
>
	{@render children()}
	<MenuItemIndicator>
		{#if indicator}
			{@render indicator()}
		{:else}
			●
		{/if}
	</MenuItemIndicator>
</Menu.RadioItem>
