<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuCheckboxItemBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';
	import MenuItemIndicator from './menu-item-indicator.svelte';
	import PhCheck from '$lib/icons/PhCheck.svelte';

	type IndicatorSnippet = { indicator?: Snippet };

	type Props = MenuCheckboxItemBaseProps & { class?: string; children: Snippet } & IndicatorSnippet;

	const { class: className, children, indicator, ...restProps }: Props = $props();
</script>

<Menu.CheckboxItem
	{...restProps}
	class={cn(
		'relative flex cursor-default items-center justify-between gap-4 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-2 data-highlighted:text-ink',
		className
	)}
>
	{@render children()}
	<MenuItemIndicator>
		{#if indicator}
			{@render indicator()}
		{:else}
			<PhCheck />
		{/if}
	</MenuItemIndicator>
</Menu.CheckboxItem>
