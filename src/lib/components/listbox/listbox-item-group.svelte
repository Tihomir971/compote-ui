<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxItemGroupBaseProps } from '@ark-ui/svelte/listbox';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = ListboxItemGroupBaseProps & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<Listbox.ItemGroup {...restProps} class={cn('flex flex-col', className)}>
	{@render children?.()}
</Listbox.ItemGroup>
