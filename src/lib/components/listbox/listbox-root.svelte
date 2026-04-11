<script lang="ts" generics="T extends string | number = string">
	import { Listbox, createListCollection } from '@ark-ui/svelte/listbox';
	import type { ListboxRootBaseProps } from '@ark-ui/svelte/listbox';
	import { useFilter } from '@ark-ui/svelte/locale';
	import type { Snippet } from 'svelte';
	import type { ListCollection } from '@ark-ui/svelte/collection';
	import type { ListItem } from '$lib/utils/collections';
	import { cn } from 'tailwind-variants';
	import { setListboxContext } from './listbox-context';

	type Props = Omit<ListboxRootBaseProps<ListItem<T>>, 'collection' | 'value'> & {
		items: ListItem<T>[];
		value?: T[];
		name?: string;
		class?: string;
		children?: Snippet;
	};

	let {
		items,
		value = $bindable(),
		name,
		class: className,
		children,
		onValueChange,
		...restProps
	}: Props = $props();

	const filters = useFilter({ sensitivity: 'base' });
	let filterText = $state('');

	const hasGroups = $derived(items.some((i) => i.group));

	const baseCollection = $derived(
		createListCollection({
			items,
			itemToValue: (item) => item.value.toString(),
			itemToString: (item) => item.label,
			isItemDisabled: (item) => item.disabled === true,
			...(hasGroups ? { groupBy: (item: ListItem<T>) => item.group ?? '' } : {})
		})
	);

	const collection = $derived(
		filterText
			? baseCollection.filter((itemString) => filters().contains(itemString, filterText))
			: baseCollection
	);

	const stringValue = $derived(value?.map(String) ?? []);

	setListboxContext({
		get collection() {
			return collection as unknown as ListCollection<ListItem>;
		},
		filter: (text) => {
			filterText = text;
		}
	});
</script>

<Listbox.Root
	{collection}
	value={stringValue}
	onValueChange={(details) => {
		value = details.value as unknown as T[];
		onValueChange?.(details);
	}}
	{...restProps}
	class={cn('flex h-full w-full flex-col gap-1.5 overflow-hidden', className)}
>
	{@render children?.()}
</Listbox.Root>

{#if name}
	{#each value ?? [] as v, i (v)}
		<input type="hidden" name="{name}[{i}]" value={v ?? ''} />
	{/each}
{/if}
