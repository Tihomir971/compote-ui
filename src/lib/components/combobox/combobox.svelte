<script lang="ts" generics="T extends ComboboxItem">
	import { Combobox, createListCollection } from '@ark-ui/svelte/combobox';
	import { Field } from '@ark-ui/svelte/field';
	import { useFilter } from '@ark-ui/svelte/locale';
	import { Portal } from '@ark-ui/svelte/portal';
	import type { ComboboxItem, ComboboxProps } from './types';
	import { cn } from 'tailwind-variants';
	import PhCaretDown from '$lib/icons/PhCaretDown.svelte';
	import PhCheck from '$lib/icons/PhCheck.svelte';
	import PhX from '$lib/icons/PhX.svelte';

	let {
		value = $bindable(),
		items,
		label,
		placeholder,
		layout = 'vertical',
		name,
		readOnly,
		multiple,
		loading = false,
		...restProps
	}: ComboboxProps<T> = $props();

	// Client-side filtering state
	let filterText = $state('');
	const filters = useFilter({ sensitivity: 'base' });

	// Base collection — only rebuilds when items prop changes
	const baseCollection = $derived(
		createListCollection({
			items,
			itemToString: (item) => item?.label ?? '',
			itemToValue: (item) => item?.value?.toString() ?? ''
		})
	);

	// Filtered view — lightweight .filter() on keystroke, full collection when empty
	const collection = $derived(
		filterText
			? baseCollection.filter((itemString) => filters().contains(itemString, filterText))
			: baseCollection
	);

	// Handle input change — only filter on actual user typing, not on selection/clear events
	function handleInputChange(details: Combobox.InputValueChangeDetails) {
		if (details.reason === 'input-change') {
			filterText = details.inputValue;
		} else {
			filterText = '';
		}
	}

	// Compute display label for current value — handles async-loaded items
	const displayValue = $derived.by(() => {
		if (value == null || multiple) return undefined;
		const v = Array.isArray(value) ? value[0] : value;
		const found = items.find((item) => item.value.toString() === v?.toString());
		return found ? found.label : undefined;
	});

	// Memoize value/inputValue props to prevent reactive cascade (new array/object refs cause Zag loops)
	const valueProp = $derived(
		value != null
			? Array.isArray(value)
				? value.map((v) => v.toString())
				: [value.toString()]
			: []
	);
	const controlledInputValue = $derived(multiple ? undefined : (displayValue ?? ''));

	// Handle value change - look up typed value from items prop by string match
	function handleValueChange(details: Combobox.ValueChangeDetails<T>) {
		if (details.value.length === 0) {
			value = multiple ? [] : null;
		} else if (multiple) {
			value = details.value
				.map((v) => items.find((item) => item.value.toString() === v)?.value)
				.filter((v) => v !== undefined);
		} else {
			const found = items.find((item) => item.value.toString() === details.value[0]);
			value = found?.value ?? null;
		}
	}
</script>

<Combobox.Root
	{collection}
	value={valueProp}
	inputValue={controlledInputValue}
	onValueChange={handleValueChange}
	onInputValueChange={handleInputChange}
	openOnClick
	{multiple}
	{readOnly}
	{...restProps}
	class={cn(layout === 'horizontal' ? 'flex items-center gap-1.5' : 'grid gap-1.5')}
>
	{#if label}
		<Combobox.Label class="text-sm">
			{label}
			<Field.RequiredIndicator class="text-danger" />
		</Combobox.Label>
	{/if}

	<Combobox.Control
		class={cn(
			'rounded-ark flex min-h-9 items-center gap-1 border px-3 shadow-sm',
			'focus-within:ring-1 focus-within:ring-primary',
			'data-invalid:border-danger data-invalid:focus-within:ring-danger',
			multiple && 'flex-wrap py-1'
		)}
	>
		{#if multiple && Array.isArray(value) && value.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each value as v (v)}
					{@const item = items.find((i) => i.value === v)}
					{#if item}
						<span class="inline-flex items-center gap-1 rounded bg-surface-2 px-2 py-0.5 text-xs">
							{item.label}
						</span>
					{/if}
				{/each}
			</div>
		{/if}
		<Combobox.Input
			placeholder={placeholder ?? 'Search...'}
			class="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-dim disabled:cursor-not-allowed disabled:opacity-50"
		/>
		{#if !readOnly}
			<Combobox.ClearTrigger class="text-ink-dim transition-colors hover:text-ink">
				<PhX class="size-4" />
			</Combobox.ClearTrigger>
		{/if}
		<Combobox.Trigger class="text-ink-dim">
			<PhCaretDown class="size-4 opacity-50" />
		</Combobox.Trigger>
	</Combobox.Control>

	<Portal>
		<Combobox.Positioner class="data-[state=closed]:pointer-events-none">
			<Combobox.Content
				class="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 max-h-60 min-w-(--reference-width) overflow-auto rounded-md border bg-surface-document p-1  shadow-md"
			>
				{#if loading}
					<div class="flex items-center justify-center py-4">
						<span
							class="size-5 animate-spin rounded-full border-2 border-surface-3 border-t-ink-dim"
						></span>
					</div>
				{:else}
					<Combobox.Empty class="py-2 text-center text-sm text-ink-dim">
						No results found
					</Combobox.Empty>
				{/if}

				{#each loading ? [] : collection.items as item (item.value)}
					<Combobox.Item
						{item}
						class="relative flex cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-1 data-[state=checked]:bg-surface-1"
					>
						<Combobox.ItemText>{item.label}</Combobox.ItemText>
						<Combobox.ItemIndicator class="absolute right-2 items-center justify-center">
							<PhCheck class="size-3.5" />
						</Combobox.ItemIndicator>
					</Combobox.Item>
				{/each}
			</Combobox.Content>
		</Combobox.Positioner>
	</Portal>

	{#if multiple && Array.isArray(value)}
		{#each value as v, i (v)}
			<input type="hidden" name="{name}[{i}]" value={v ?? ''} />
		{/each}
	{:else if value != null}
		<input type="hidden" {name} {value} />
	{/if}
</Combobox.Root>
