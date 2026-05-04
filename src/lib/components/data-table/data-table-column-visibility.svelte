<script lang="ts" generics="TData extends RowData, TSelected = object">
	import { cn, type ClassValue } from 'tailwind-variants';
	import Checkbox from '../checkbox/checkbox.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Column, RowData } from '@tanstack/svelte-table';
	import type { DataTable, DataTableFeatures } from './core';

	type Props = Omit<HTMLAttributes<HTMLDetailsElement>, 'class'> & {
		table: DataTable<TData, TSelected>;
		class?: ClassValue;
		triggerLabel?: string;
	};

	let { table, class: className, triggerLabel = 'Columns', ...rest }: Props = $props();

	const columnVisibility = $derived(table.store.state.columnVisibility);
	const allColumnsVisible = $derived(table.getIsAllColumnsVisible());
	const someColumnsVisible = $derived(
		table.getAllLeafColumns().some((column) => column.getCanHide() && column.getIsVisible())
	);
	const allColumnsVisibilityState = $derived(
		allColumnsVisible ? true : someColumnsVisible ? 'indeterminate' : false
	);

	function getColumnLabel(column: Column<DataTableFeatures, TData, unknown>) {
		return typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
	}

	function getColumnIsVisible(
		column: Column<DataTableFeatures, TData, unknown>,
		visibilityState: unknown
	) {
		void visibilityState;
		return column.getIsVisible();
	}
</script>

<details class={cn('relative', className)} {...rest}>
	<summary
		class="flex h-9 cursor-pointer list-none items-center rounded-md border border-surface-3 bg-surface-1 px-3 text-sm font-medium text-ink shadow-sm outline-none hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden"
	>
		{triggerLabel}
	</summary>

	<div
		class="absolute right-0 z-30 mt-2 w-56 rounded-md border border-surface-3 bg-surface-1 p-2 shadow-lg"
	>
		<div class="border-b border-surface-3 px-2 pb-2">
			<Checkbox
				size="sm"
				label="All columns"
				checked={allColumnsVisibilityState}
				onCheckedChange={({ checked }) => table.toggleAllColumnsVisible(checked === true)}
			/>
		</div>

		<div class="flex max-h-72 flex-col overflow-auto py-1">
			{#each table.getAllLeafColumns() as column (column.id)}
				<Checkbox
					size="md"
					label={getColumnLabel(column)}
					class="min-h-8 rounded-sm px-2 hover:bg-surface-2"
					checked={getColumnIsVisible(column, columnVisibility)}
					disabled={!column.getCanHide()}
					onCheckedChange={({ checked }) => column.toggleVisibility(checked === true)}
				/>
			{/each}
		</div>
	</div>
</details>
