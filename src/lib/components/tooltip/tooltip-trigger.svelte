<script lang="ts">
	import { Tooltip } from '@ark-ui/svelte/tooltip';
	import type { TooltipTriggerProps } from '@ark-ui/svelte/tooltip';
	import { button, type ButtonSize, type ButtonVariant } from '../button/button.variants';

	type Props = Omit<TooltipTriggerProps, 'class'> & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
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
