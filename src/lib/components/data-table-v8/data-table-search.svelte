<script lang="ts" generics="T extends RowData">
	import { onDestroy } from 'svelte';
	import type { RowData } from '@tanstack/table-core';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { PhMagnifyingGlass, PhX } from '$lib/icons';
	import * as Field from '../field';
	import { getReactiveTableState, type DataTableInstance } from './data-table-utils';

	type Props = {
		table: DataTableInstance<T>;
		placeholder?: string;
		class?: ClassValue;
	};

	let { table, placeholder = 'Search...', class: className }: Props = $props();

	const globalFilter = $derived(
		(getReactiveTableState(table).globalFilter as string | undefined) ?? ''
	);

	let timer: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => clearTimeout(timer));

	function handleInput(e: Event) {
		const value = (e.currentTarget as HTMLInputElement).value;
		clearTimeout(timer);
		timer = setTimeout(() => {
			table.setGlobalFilter(value || undefined);
		}, 300);
	}

	function clearFilter() {
		clearTimeout(timer);
		table.setGlobalFilter(undefined);
	}
</script>

<Field.Root class={cn(className)}>
	<Field.Input {placeholder} value={globalFilter} oninput={handleInput}>
		{#snippet startIcon()}
			<PhMagnifyingGlass class="size-4" />
		{/snippet}
		{#snippet endIcon()}
			{#if globalFilter}
				<button
					type="button"
					onclick={clearFilter}
					aria-label="Clear search"
					class="flex size-5 items-center justify-center rounded text-ink-dim hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
				>
					<PhX class="size-3.5" />
				</button>
			{/if}
		{/snippet}
	</Field.Input>
</Field.Root>
