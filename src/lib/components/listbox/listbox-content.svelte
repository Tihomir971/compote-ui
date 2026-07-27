<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxContentBaseProps } from '@ark-ui/svelte/listbox';
	import type { Snippet } from 'svelte';
	import type { ListItem } from '$lib/utils/collections';
	import { cn } from 'tailwind-variants';
	import { getListboxContext } from './listbox-context';
	import type { ClassValue } from 'svelte/elements';

	type Props = ListboxContentBaseProps & {
		class?: ClassValue;
		items?: Snippet<[{ items: ListItem[]; group: [string, ListItem[]][] }]>;
	};

	let { class: className, items, ...restProps }: Props = $props();

	const ctx = getListboxContext();
</script>

<Listbox.Content
	{...restProps}
	class={cn(
		'flex min-h-0 w-full flex-1 scrollbar-thin flex-col overflow-y-auto rounded border bg-surface-document p-1 outline-none',
		className
	)}
>
	{@render items?.({ items: ctx.collection.items, group: ctx.collection.group() })}
</Listbox.Content>
