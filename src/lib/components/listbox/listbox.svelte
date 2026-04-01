<script module>
	// eslint-disable-next-line no-import-assign
	export type { ListboxItem, ListboxProps } from './types';
</script>

<script lang="ts" generics="T extends number | string = number | string">
	import { Listbox, createListCollection } from '@ark-ui/svelte/listbox';
	import { useFilter } from '@ark-ui/svelte/locale';
	import type { ListboxItem, ListboxProps } from './types';
	import { cn } from 'tailwind-variants';
	import PhCheck from '$lib/icons/PhCheck.svelte';

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
			...(hasGroups ? { groupBy: (item: ListboxItem<T>) => item.group ?? '' } : {})
		})
	);

	const collection = $derived(
		filterable && filterText
			? baseCollection.filter((itemString) => filters().contains(itemString, filterText))
			: baseCollection
	);

	const stringValue = $derived(value?.map(String) ?? []);

	function handleValueChange(details: Parameters<NonNullable<Props['onValueChange']>>[0]) {
		value = details.value as unknown as T[];
		onValueChange?.(details);
	}
</script>

<Listbox.Root
	value={stringValue}
	{collection}
	onValueChange={handleValueChange}
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
			class="h-8 w-full rounded-xs border border-surface-3 bg-transparent px-2.5 text-sm outline-none placeholder:text-ink-dim focus-visible:ring-1 focus-visible:ring-primary"
		/>
	{/if}
	<Listbox.Content class="flex min-h-0 w-full flex-1 flex-col gap-1 overflow-y-auto outline-none">
		{#if hasGroups}
			{#each collection.group() as [type, group] (type)}
				<Listbox.ItemGroup class="flex flex-col gap-1 px-1 py-1">
					<Listbox.ItemGroupLabel class="flex h-10 items-center text-sm font-medium text-ink-dim">
						{type}
					</Listbox.ItemGroupLabel>
					{#each group as item (item.value)}
						<Listbox.Item
							{item}
							class="flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-sm font-medium transition-all duration-150 hover:bg-surface-2 data-disabled:opacity-50 data-highlighted:bg-surface-2"
						>
							<Listbox.ItemText class="flex-1 truncate">{item.label}</Listbox.ItemText>
							<Listbox.ItemIndicator
								class="h-5 w-5 text-primary data-[state=checked]:flex data-[state=unchecked]:hidden"
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
					class="flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-sm font-medium transition-all duration-150 hover:bg-surface-2 data-disabled:opacity-50 data-highlighted:bg-surface-2"
				>
					<Listbox.ItemText class="flex-1 truncate">{item.label}</Listbox.ItemText>
					<Listbox.ItemIndicator
						class="h-5 w-5 text-primary data-[state=checked]:flex data-[state=unchecked]:hidden"
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
