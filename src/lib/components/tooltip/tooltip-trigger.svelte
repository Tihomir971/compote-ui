<script lang="ts">
	import { Tooltip } from '@ark-ui/svelte/tooltip';
	import type { TooltipTriggerBaseProps } from '@ark-ui/svelte/tooltip';
	import type { Snippet } from 'svelte';
	import { button, type ButtonSize, type ButtonVariant } from '../button/button.variants';

	type Props = TooltipTriggerBaseProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		children?: Snippet;
	};

	const {
		asChild,
		variant = 'ghost',
		size = 'icon',
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<Tooltip.Trigger
	{...restProps}
	{asChild}
	class={asChild ? className : button({ variant, size, class: className })}
>
	{@render children?.()}
</Tooltip.Trigger>
