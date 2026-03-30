<script module>
	export type { ListboxItem, ListboxProps } from './types';
</script>

<script lang="ts" generics="T extends number | string = number | string">
	import { Listbox, createListCollection } from '@ark-ui/svelte/listbox';
	import { useFilter } from '@ark-ui/svelte/locale';
	import PhCheckBold from '~icons/ph/check-bold';
	import type { ListboxItem, ListboxProps } from './types';
	import { cn } from 'tailwind-variants';

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
	class={cn('flex flex-col gap-1.5 w-full h-full overflow-hidden', className)}
>
	{#if label}
		<Listbox.Label>{label}</Listbox.Label>
	{/if}
	{#if filterable}
		<Listbox.Input
			placeholder={filterPlaceholder}
			oninput={(e) => (filterText = e.currentTarget.value)}
			class="w-full bg-transparent mx-1 border border-(--ark-border) rounded-xs px-2.5 h-8 text-sm outline-none focus:ring-1 focus:ring-(--ark-ring) placeholder:text-(--ark-muted)"
		/>
	{/if}
	<Listbox.Content class="flex flex-col outline-none gap-1 w-full flex-1 min-h-0 overflow-y-auto">
		{#if hasGroups}
			{#each collection.group() as [type, group] (type)}
				<Listbox.ItemGroup class="flex flex-col gap-1 px-1 py-1">
					<Listbox.ItemGroupLabel
						class="font-medium text-sm text-(--ark-muted) h-10 flex items-center"
					>
						{type}
					</Listbox.ItemGroupLabel>
					{#each group as item (item.value)}
						<Listbox.Item
							{item}
							class="items-center rounded-xs data-highlighted:bg-(--ark-accent-bg) cursor-pointer flex justify-between font-medium data-disabled:opacity-50 text-sm transition-all duration-150 py-1.5 px-2.5 hover:bg-(--ark-accent-bg)"
						>
							<Listbox.ItemText class="flex-1 truncate">{item.label}</Listbox.ItemText>
							<Listbox.ItemIndicator
								class="text-primary w-5 h-5 data-[state=checked]:flex data-[state=unchecked]:hidden"
							>
								<PhCheckBold />
							</Listbox.ItemIndicator>
						</Listbox.Item>
					{/each}
				</Listbox.ItemGroup>
			{/each}
		{:else}
			{#each collection.items as item (item.value)}
				<Listbox.Item
					{item}
					class="items-center rounded-xs data-highlighted:bg-(--ark-accent-bg) cursor-pointer flex justify-between font-medium data-disabled:opacity-50 text-sm transition-all duration-150 py-1.5 px-2.5 hover:bg-(--ark-accent-bg)"
				>
					<Listbox.ItemText class="flex-1 truncate">{item.label}</Listbox.ItemText>
					<Listbox.ItemIndicator
						class="text-primary w-5 h-5 data-[state=checked]:flex data-[state=unchecked]:hidden"
					>
						<PhCheckBold />
					</Listbox.ItemIndicator>
				</Listbox.Item>
			{/each}
		{/if}
		<Listbox.Empty class="py-4 text-center text-sm text-(--ark-muted)"
			>No results found</Listbox.Empty
		>
	</Listbox.Content>
</Listbox.Root>

{#if name}
	{#each value ?? [] as v, i (v)}
		<input type="hidden" name="{name}[{i}]" value={v ?? ''} />
	{/each}
{/if}
