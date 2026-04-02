<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuIndicatorBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';
	import PhCaretDown from '$lib/icons/PhCaretDown.svelte';

	type Props = MenuIndicatorBaseProps & { class?: string; children?: Snippet };

	const { class: className, children, ...restProps }: Props = $props();
</script>

<Menu.Indicator {...restProps} class={cn('transition-transform data-open:rotate-180', className)}>
	{#if children}
		{@render children()}
	{:else}
		<PhCaretDown />
	{/if}
</Menu.Indicator>
