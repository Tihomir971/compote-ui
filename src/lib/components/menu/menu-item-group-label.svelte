<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuItemGroupLabelBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = MenuItemGroupLabelBaseProps & { class?: string; children: Snippet };

	const { class: className, children, ...restProps }: Props = $props();
</script>

<Menu.ItemGroupLabel
	{...restProps}
	class={cn('px-2 py-1.5 text-xs font-medium text-ink-dim', className)}
>
	{@render children()}
</Menu.ItemGroupLabel>
