<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuItemIndicatorBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = MenuItemIndicatorBaseProps & { class?: string; children: Snippet };

	const { class: className, children, ...restProps }: Props = $props();
</script>

<Menu.ItemIndicator {...restProps} class={cn('flex items-center justify-center', className)}>
	{@render children()}
</Menu.ItemIndicator>
