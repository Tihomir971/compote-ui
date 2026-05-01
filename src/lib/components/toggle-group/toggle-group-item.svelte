<script lang="ts">
	import { ToggleGroup } from '@ark-ui/svelte/toggle-group';
	import type { ToggleGroupItemBaseProps } from '@ark-ui/svelte/toggle-group';
	import type { ClassValue } from 'svelte/elements';
	import { toggle, type ToggleSize } from '../toggle/toggle.variants';
	import { getToggleGroupContext } from './toggle-group-context';

	interface Props extends ToggleGroupItemBaseProps {
		class?: ClassValue | null;
		size?: ToggleSize;
	}

	let { class: className, children, size, ...rest }: Props = $props();
	const groupContext = getToggleGroupContext();
	const itemSize = $derived(size ?? groupContext.size);
</script>

<ToggleGroup.Item
	{...rest}
	class={toggle({ size: itemSize, class: ['rounded-none', className] as never })}
>
	{@render children?.()}
</ToggleGroup.Item>
