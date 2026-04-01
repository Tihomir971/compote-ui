<script lang="ts" generics="T extends SelectItem">
	import { Field } from '@ark-ui/svelte/field';
	import { Portal } from '@ark-ui/svelte/portal';
	import { Select, createListCollection } from '@ark-ui/svelte/select';
	import type { SelectItem, SelectProps } from './types';
	import { cn } from 'tailwind-variants';
	import PhCaretDown from '$lib/icons/PhCaretDown.svelte';
	import PhCheck from '$lib/icons/PhCheck.svelte';

	let {
		value = $bindable(),
		items = [],
		label,
		placeholder,
		layout = 'vertical',
		name,
		...restProps
	}: SelectProps<T> = $props();
	const rootClass = $derived(
		layout === 'horizontal' ? 'flex items-center gap-1.5' : 'grid gap-1.5'
	);

	const collection = $derived(
		createListCollection<T>({
			items: items,
			itemToValue: (item) => item.value.toString(),
			isItemDisabled: (item) => item.disabled === true
		})
	);
</script>

<Select.Root
	{collection}
	{...restProps}
	deselectable
	value={value ? [value.toString()] : []}
	onValueChange={(valueChangeDetails) => {
		if (valueChangeDetails.items.length === 0 || valueChangeDetails.items == null) {
			value = null;
		} else {
			value = valueChangeDetails.items[0].value;
		}
		if (restProps.onValueChange) {
			restProps.onValueChange(valueChangeDetails);
		}
	}}
	class={rootClass}
>
	{#if label}
		<Select.Label>
			{label}
			<Field.RequiredIndicator />
		</Select.Label>
	{/if}
	<Select.Control>
		<Select.Trigger
			class="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border bg-surface-1 px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none active:bg-surface-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger data-invalid:focus-visible:ring-danger"
		>
			<div class="flex items-center gap-2">
				<Select.ValueText
					placeholder={placeholder ?? 'Select a item'}
					class={cn('text-nowrap', value ? '' : 'text-ink-dim')}
				/>
			</div>
			<Select.Indicator>
				<PhCaretDown class="h-4 w-4 opacity-50" />
			</Select.Indicator>
		</Select.Trigger>
	</Select.Control>
	<Portal>
		<Select.Positioner>
			<Select.Content
				class="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 max-h-60 min-w-(--reference-width) overflow-auto rounded-md border bg-surface-1 p-1 text-ink shadow-md"
			>
				<Select.ItemGroup>
					{#each items as item (item.value)}
						<Select.Item
							{item}
							class="relative flex cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm text-ink select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-2 data-[state=checked]:bg-surface-2"
						>
							<Select.ItemText>{item.label}</Select.ItemText>
							<Select.ItemIndicator class="absolute right-2 items-center justify-center">
								<PhCheck class="size-3.5" />
							</Select.ItemIndicator>
						</Select.Item>
					{/each}
				</Select.ItemGroup>
			</Select.Content>
		</Select.Positioner>
	</Portal>
	<input type="hidden" {name} value={value ?? ''} />
	<Select.HiddenSelect />
</Select.Root>
