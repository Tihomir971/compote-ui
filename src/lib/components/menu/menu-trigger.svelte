<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuTriggerBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { button, type ButtonVariant, type ButtonSize } from '../button/button.variants';

	type Props = MenuTriggerBaseProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		children: Snippet;
	};

	const { variant, size, class: className, children, ...restProps }: Props = $props();
</script>

<Menu.Trigger {...restProps} class={button({ variant, size, class: className })}>
	{@render children()}
</Menu.Trigger>
