<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuRadioItemGroupBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = MenuRadioItemGroupBaseProps & { class?: string; children: Snippet };

	const { class: className, children, ...restProps }: Props = $props();
</script>

<Menu.RadioItemGroup {...restProps} class={cn('', className)}>
	{@render children()}
</Menu.RadioItemGroup>
