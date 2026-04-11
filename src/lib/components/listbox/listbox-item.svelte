<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxItemBaseProps } from '@ark-ui/svelte/listbox';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = ListboxItemBaseProps & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, item, children, ...restProps }: Props = $props();
</script>

<Listbox.Item
	{item}
	{...restProps}
	class={cn(
		'flex min-h-8 cursor-pointer items-center justify-between gap-2 rounded-xs px-2 text-sm transition-colors outline-none select-none hover:bg-surface-2 data-disabled:opacity-50 data-highlighted:bg-surface-2 data-[state=checked]:text-primary',
		className
	)}
>
	{@render children?.()}
</Listbox.Item>
