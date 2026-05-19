<script lang="ts">
	import { ToggleGroup } from '@ark-ui/svelte/toggle-group';
	import type { ToggleGroupRootBaseProps } from '@ark-ui/svelte/toggle-group';
	import { cn } from 'tailwind-variants';
	import type { ToggleSize } from '../toggle/toggle.variants';
	import { setToggleGroupContext, type ToggleGroupVariant } from './toggle-group-context';

	interface Props extends ToggleGroupRootBaseProps {
		class?: string;
		size?: ToggleSize;
		variant?: ToggleGroupVariant;
		icon?: boolean;
	}

	let {
		class: className,
		children,
		value = $bindable(),
		size = 'md',
		variant = 'outline',
		icon = false,
		...rootProps
	}: Props = $props();

	setToggleGroupContext({
		get size() {
			return size;
		},
		get variant() {
			return variant;
		},
		get icon() {
			return icon;
		}
	});

	const rootClass = $derived(
		variant === 'ghost'
			? cn('inline-flex w-fit gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-1', className)
			: cn(
					'inline-flex w-fit rounded border border-border data-[orientation=vertical]:flex-col [&>:not([hidden])~:not([hidden])]:border-border data-[orientation=horizontal]:[&>:not([hidden])~:not([hidden])]:border-s data-[orientation=horizontal]:[&>:not([hidden])~:not([hidden])]:border-e-0 data-[orientation=vertical]:[&>:not([hidden])~:not([hidden])]:border-t data-[orientation=vertical]:[&>:not([hidden])~:not([hidden])]:border-b-0',
					className
				)
	);
</script>

<ToggleGroup.Root
	{...rootProps}
	bind:value
	class={rootClass}
>
	{@render children?.()}
</ToggleGroup.Root>
