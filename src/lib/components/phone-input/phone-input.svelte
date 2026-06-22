<script lang="ts">
	import { Select } from '@ark-ui/svelte/select';
	import { Portal } from '@ark-ui/svelte/portal';
	import { useFilter } from '@ark-ui/svelte/locale';
	import { TelInput, countries } from 'svelte-tel-input';
	import type { CountryCode } from 'svelte-tel-input/types';
	import type { PhoneInputProps } from './types';
	import { createListCollection } from '../../utils/collections';
	import { cn } from 'tailwind-variants';
	import { PhCaretDown, PhCheck } from '$lib/icons';
	import 'svelte-tel-input/styles/flags.css';

	interface CountryItem {
		value: string;
		label: string;
		flagClass: string;
		dialCode: string;
	}

	const countryItems: CountryItem[] = countries.map((c) => ({
		value: c.iso2,
		label: `${c.name} +${c.dialCode}`,
		flagClass: `flag-${c.iso2.toLowerCase()}`,
		dialCode: c.dialCode
	}));
	const baseCollection = createListCollection(countryItems);

	let filterText = $state('');
	const filters = useFilter({ sensitivity: 'base' });
	const collection = $derived(
		filterText
			? baseCollection.filter((label) => filters().contains(label, filterText))
			: baseCollection
	);

	let {
		value = $bindable(''),
		country = $bindable(null),
		valid = $bindable(false),
		label,
		layout = 'vertical',
		disabled,
		readonly,
		invalid,
		required,
		class: className,
		...restProps
	}: PhoneInputProps = $props();

	const id = $props.id();
	const numberId = `${id}-number`;

	const selectedItem = $derived(countryItems.find((c) => c.value === country));
	const showInvalid = $derived(invalid ?? (value.length > 0 && !valid));

	const rootClass = $derived(
		layout === 'horizontal'
			? 'flex items-center justify-between gap-1.5 w-full'
			: 'flex flex-col gap-1.5 w-full max-w-72'
	);
</script>

<div class={rootClass}>
	{#if label}
		<label for={numberId} class="text-sm leading-none font-medium">
			{label}
			{#if required}<span class="text-danger">*</span>{/if}
		</label>
	{/if}
	<div
		class={cn(
			'flex h-9 w-full items-center rounded-md border bg-surface-1 shadow-sm transition-shadow focus-within:ring-1 focus-within:ring-ring',
			'data-disabled:cursor-not-allowed data-disabled:opacity-50',
			showInvalid && 'border-danger focus-within:ring-danger',
			className
		)}
		data-disabled={disabled ? '' : undefined}
	>
		<Select.Root
			{collection}
			value={country ? [country] : []}
			onValueChange={(details) => {
				country = (details.items[0]?.value as CountryCode | undefined) ?? null;
			}}
			onOpenChange={(details) => {
				if (!details.open) filterText = '';
			}}
			{disabled}
			readOnly={readonly}
			class="h-9 shrink-0"
		>
			<Select.Control class="h-full">
				<Select.Trigger
					aria-label="Country"
					class="flex h-9 cursor-pointer items-center gap-1.5 rounded-l-md border-r px-2.5 text-sm outline-none transition-colors hover:bg-surface-2 active:bg-surface-2 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent"
				>
					{#if selectedItem}
						<span
							class="flag {selectedItem.flagClass} shrink-0 rounded-xs shadow-[inset_0_0_0_1px_var(--compote-border)]"
						></span>
					{:else}
						<span class="text-ink-dim">Country</span>
					{/if}
					<PhCaretDown class="size-3 shrink-0 text-ink-dim" />
				</Select.Trigger>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content
						class="z-200 flex max-h-72 min-w-52 flex-col overflow-hidden rounded-md border bg-surface-document p-1 shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
					>
						<input
							type="text"
							bind:value={filterText}
							placeholder="Search"
							class="mb-1 shrink-0 rounded-sm border bg-surface-1 px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
							onkeydown={(e) => e.stopPropagation()}
						/>
						<div class="overflow-auto">
							{#each collection.items as item (item.value)}
								<Select.Item
									{item}
									class="relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm text-ink transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-1 data-[state=checked]:bg-surface-1"
								>
									<span
										class="flag {item.flagClass} shrink-0 rounded-xs shadow-[inset_0_0_0_1px_var(--compote-border)]"
									></span>
									<Select.ItemText class="flex-1 truncate">{item.label}</Select.ItemText>
									<Select.ItemIndicator class="absolute right-2 flex items-center justify-center">
										<PhCheck class="size-3.5" />
									</Select.ItemIndicator>
								</Select.Item>
							{:else}
								<div class="py-2 text-center text-sm text-ink-dim">No results found</div>
							{/each}
						</div>
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
		<TelInput
			id={numberId}
			bind:value
			bind:country
			bind:valid
			{disabled}
			{readonly}
			{required}
			{...restProps}
			class="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-ink-dim disabled:cursor-not-allowed"
		/>
	</div>
</div>
