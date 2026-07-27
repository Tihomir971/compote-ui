<script lang="ts" generics="T extends ListItem">
	import { Combobox } from '@ark-ui/svelte/combobox';
	import { Field, useFieldContext } from '@ark-ui/svelte/field';
	import { useFilter } from '@ark-ui/svelte/locale';
	import { Portal } from '@ark-ui/svelte/portal';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { untrack } from 'svelte';
	import type { ComboboxProps } from './types';
	import { createListCollection, type ListItem } from '../../utils/collections';
	import { cn } from 'tailwind-variants';
	import { PhCaretDown, PhCheck, PhX } from '$lib/icons';

	let {
		value = $bindable(),
		items,
		label,
		placeholder,
		layout = 'vertical',
		name,
		invalid,
		readOnly,
		disabled,
		multiple,
		loading = false,
		virtualized = false,
		class: className,
		onValueChange,
		...restProps
	}: ComboboxProps<T> = $props();

	const field = useFieldContext();
	const isInvalid = $derived(invalid ?? field?.()?.invalid ?? false);
	const isReadOnly = $derived(readOnly ?? field?.()?.readOnly ?? false);
	const isDisabled = $derived(disabled ?? field?.()?.disabled ?? false);

	let filterText = $state('');

	const filters = useFilter({ sensitivity: 'base' });
	const baseCollection = $derived(createListCollection(items));
	const collection = $derived(
		filterText
			? baseCollection.filter((itemString) => filters().contains(itemString, filterText))
			: baseCollection
	);

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
		onValueChange?.(details);
	}

	let contentRef = $state<HTMLDivElement | null>(null);

	const virtualizer = createVirtualizer({
		get count() {
			return virtualized ? collection.size : 0;
		},
		getScrollElement: () => contentRef,
		estimateSize: () => 36,
		overscan: 10
	});

	$effect(() => {
		const count = virtualized ? collection.size : 0;
		const scrollElement = contentRef;

		if (!scrollElement) return;

		untrack(() => {
			$virtualizer.setOptions({ ...$virtualizer.options, count });
			$virtualizer.measure();
		});
	});
</script>

<Combobox.Root
	{collection}
	value={valueProp}
	inputValue={controlledInputValue}
	onValueChange={handleValueChange}
	onInputValueChange={handleInputChange}
	scrollToIndexFn={virtualized
		? (d) => $virtualizer.scrollToIndex(d.index, { align: 'center' })
		: undefined}
	openOnClick
	{multiple}
	invalid={isInvalid}
	readOnly={isReadOnly}
	disabled={isDisabled}
	{...restProps}
	class={cn(
		layout === 'horizontal' ? 'flex items-center gap-1.5' : 'grid gap-1.5',
		'w-full',
		className
	)}
>
	{#if label}
		<Combobox.Label class="text-sm leading-none font-medium">
			{label}
			<Field.RequiredIndicator class="text-danger" />
		</Combobox.Label>
	{/if}

	<Combobox.Control
		class={cn(
			'flex min-h-9 min-w-0 items-center gap-1 rounded border bg-surface-1 px-3 shadow-sm',
			'focus-within:ring-1 focus-within:ring-ring',
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
			class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-dim disabled:cursor-not-allowed disabled:opacity-50"
		/>
		{#if !isReadOnly}
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
				class={cn(
					'z-200 min-w-(--reference-width) rounded-md border bg-surface-document p-1 shadow-md',
					'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
					'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
					virtualized ? 'overflow-hidden' : 'max-h-60 overflow-auto'
				)}
			>
				{#if virtualized}
					{#if loading}
						<div class="flex items-center justify-center py-4">
							<span
								class="size-5 animate-spin rounded-full border-2 border-surface-3 border-t-ink-dim"
							></span>
						</div>
					{:else if collection.size === 0}
						<Combobox.Empty class="py-2 text-center text-sm text-ink-dim">
							No results found
						</Combobox.Empty>
					{:else}
						<div
							bind:this={contentRef}
							class="overflow-auto overscroll-contain"
							style="height: min(15rem, {$virtualizer.getTotalSize()}px);"
						>
							<div
								style="height: {$virtualizer.getTotalSize()}px; width: 100%; position: relative;"
							>
								{#each $virtualizer.getVirtualItems() as vItem (vItem.key)}
									{@const item = collection.items[vItem.index]}
									{#if item}
										<Combobox.Item
											{item}
											aria-setsize={collection.size}
											aria-posinset={vItem.index + 1}
											style="position:absolute;top:0;left:0;width:100%;height:{vItem.size}px;transform:translateY({vItem.start}px)"
											class="relative flex cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-1 data-[state=checked]:bg-surface-1"
										>
											<Combobox.ItemText>{item.label}</Combobox.ItemText>
											<Combobox.ItemIndicator class="absolute right-2 items-center justify-center">
												<PhCheck class="size-3.5" />
											</Combobox.ItemIndicator>
										</Combobox.Item>
									{/if}
								{/each}
							</div>
						</div>
					{/if}
				{:else}
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
				{/if}
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
