<script module>
	// eslint-disable-next-line no-import-assign
	export type { ListboxProps } from './types';
</script>

<script lang="ts" generics="T extends number | string = number | string">
	import { Listbox, createListCollection } from '@ark-ui/svelte/listbox';
	import { useFilter } from '@ark-ui/svelte/locale';
	import type { ListboxProps } from './types';
	import type { ListItem } from '$lib/utils/collections';
	import { cn } from 'tailwind-variants';
	import { PhCheck } from '$lib/icons';

	type Props = ListboxProps<T>;

	let {
		value = $bindable(),
		items,
		label,
		name,
		onValueChange,
		filterable = false,
		filterPlaceholder = 'Search...',
		class: className,
		...restProps
	}: Props = $props();

	const filters = useFilter({ sensitivity: 'base' });
	let filterText = $state('');
	const hasGroups = $derived(items.some((i) => i.group));

	const baseCollection = $derived(
		createListCollection({
			items,
			itemToValue: (item) => item.value.toString(),
			isItemDisabled: (item) => item.disabled === true,
			...(hasGroups ? { groupBy: (item: ListItem<T>) => item.group ?? '' } : {})
		})
	);

	const collection = $derived(
		filterable && filterText
			? baseCollection.filter((itemString) => filters().contains(itemString, filterText))
			: baseCollection
	);

	const stringValue = $derived(value?.map(String) ?? []);
</script>

<Listbox.Root
	value={stringValue}
	{collection}
	onValueChange={(details) => {
		value = details.value as unknown as T[];
		onValueChange?.(details);
	}}
	{...restProps}
	class={cn('flex h-full w-full flex-col gap-1.5 overflow-hidden p-0.5', className)}
>
	{#if label}
		<Listbox.Label>{label}</Listbox.Label>
	{/if}
	{#if filterable}
		<Listbox.Input
			placeholder={filterPlaceholder}
			oninput={(e) => (filterText = e.currentTarget.value)}
			class="h-8 w-full rounded-xs border border-surface-3 bg-transparent px-2.5 text-sm outline-none placeholder:text-ink-dim focus-visible:ring-1 focus-visible:ring-ring"
		/>
	{/if}
	<Listbox.Content class="flex min-h-0 w-full flex-1 flex-col overflow-y-auto outline-none">
		{#if hasGroups}
			{#each collection.group() as [type, group] (type)}
				<Listbox.ItemGroup class="flex flex-col">
					<Listbox.ItemGroupLabel
						class="px-2 py-1.5 text-xs font-semibold tracking-wide text-ink-dim uppercase"
					>
						{type}
					</Listbox.ItemGroupLabel>
					{#each group as item (item.value)}
						<Listbox.Item
							{item}
							class="flex min-h-8 cursor-pointer items-center justify-between gap-2 rounded-xs px-2 text-sm transition-colors outline-none select-none hover:bg-surface-2 data-disabled:opacity-50 data-highlighted:bg-surface-2 data-[state=checked]:text-primary"
						>
							<Listbox.ItemText class="flex-1 truncate">{item.label}</Listbox.ItemText>
							<Listbox.ItemIndicator
								class="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-primary data-[state=unchecked]:hidden"
							>
								<PhCheck />
							</Listbox.ItemIndicator>
						</Listbox.Item>
					{/each}
				</Listbox.ItemGroup>
			{/each}
		{:else}
			{#each collection.items as item (item.value)}
				<Listbox.Item
					{item}
					class="flex min-h-8 cursor-pointer items-center justify-between gap-2 rounded-xs px-2 text-sm transition-colors outline-none select-none hover:bg-surface-2 data-disabled:opacity-50 data-highlighted:bg-surface-2 data-[state=checked]:text-primary"
				>
					<Listbox.ItemText class="flex-1 truncate">{item.label}</Listbox.ItemText>
					<Listbox.ItemIndicator
						class="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-primary data-[state=unchecked]:hidden"
					>
						<PhCheck />
					</Listbox.ItemIndicator>
				</Listbox.Item>
			{/each}
		{/if}
		<Listbox.Empty class="py-4 text-center text-sm text-ink-dim">No results found</Listbox.Empty>
	</Listbox.Content>
</Listbox.Root>

{#if name}
	{#each value ?? [] as v, i (v)}
		<input type="hidden" name="{name}[{i}]" value={v ?? ''} />
	{/each}
{/if}
