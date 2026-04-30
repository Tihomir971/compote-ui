<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxItemTextBaseProps } from '@ark-ui/svelte/listbox';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	type Props = ListboxItemTextBaseProps & {
		class?: ClassValue;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<Listbox.ItemText {...restProps} class={cn('flex-1 truncate', className)}>
	{@render children?.()}
</Listbox.ItemText>
