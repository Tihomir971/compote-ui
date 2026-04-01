<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuItemGroupBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = MenuItemGroupBaseProps & { class?: string; children: Snippet };

	const { class: className, children, ...restProps }: Props = $props();
</script>

<Menu.ItemGroup {...restProps} class={cn('', className)}>
	{@render children()}
</Menu.ItemGroup>
