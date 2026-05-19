<script lang="ts">
	import { ToggleGroup } from '@ark-ui/svelte/toggle-group';
	import type { ToggleGroupItemBaseProps } from '@ark-ui/svelte/toggle-group';
	import type { ClassValue } from 'svelte/elements';
	import { toggle, type ToggleSize } from '../toggle/toggle.variants';
	import { getToggleGroupContext } from './toggle-group-context';

	interface Props extends ToggleGroupItemBaseProps {
		class?: ClassValue | null;
		size?: ToggleSize;
		icon?: boolean;
	}

	let { class: className, children, size, icon, ...rest }: Props = $props();
	const groupContext = getToggleGroupContext();
	const itemSize = $derived(size ?? groupContext.size);
	const itemIcon = $derived(icon ?? groupContext.icon);
	const itemClass = $derived(
		groupContext.variant === 'ghost'
			? toggle({ size: itemSize, icon: itemIcon, class: className as never })
			: toggle({ size: itemSize, icon: itemIcon, class: ['rounded-none', className] as never })
	);
</script>

<ToggleGroup.Item
	{...rest}
	class={itemClass}
>
	{@render children?.()}
</ToggleGroup.Item>
