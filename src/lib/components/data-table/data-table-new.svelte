<script lang="ts" generics="T extends RowData">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { RowData } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { untrack } from 'svelte';
	import { createSubscriber } from 'svelte/reactivity';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { PhArrowSquareOut, PhCheck, PhX } from '$lib/icons';
	import Checkbox from '../checkbox/checkbox.svelte';
	import { type DataTableInstance } from './create-table';
	import {
		alignClass,
		getBooleanCellValue,
		getColumnMeta,
		getUrlCellValue,
		justifyClass,
		openUrlCell
	} from './data-table-utils';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		table: DataTableInstance<T>;
		caption?: string;
		emptyMessage?: string;
		class?: ClassValue;
		onRowClick?: (details: { row: T; event: MouseEvent }) => void;
		onRowDoubleClick?: (details: { row: T; event: MouseEvent }) => void;
	};

	let {
		table,
		caption,
		emptyMessage = 'No rows found',
		class: className,
		onRowClick,
		onRowDoubleClick,
		...rest
	}: Props = $props();

	const subscribeToTable = createSubscriber((update) => {
		const sub = table.store.subscribe(() => update());
		return () => sub.unsubscribe();
	});

	const rowModel = $derived(table.getRowModel());
	const headerGroups = $derived(table.getHeaderGroups());

	const columnSizes = $derived.by(() => {
		subscribeToTable();
		return untrack(() =>
			table.getVisibleLeafColumns().map((col) => ({
				id: col.id,
				size: col.getSize(),
				grow: getColumnMeta(col.columnDef)?.grow ?? false
			}))
		);
	});
	const hasGrowColumn = $derived(columnSizes.some((c) => c.grow));
	const tableWidth = $derived.by(() => {
		subscribeToTable();
		return untrack(() => table.getTotalSize());
	});
	const isRowSelectionEnabled = $derived(Boolean(table.options.enableRowSelection));
	const isMultiRowSelectionEnabled = $derived(table.options.enableMultiRowSelection !== false);
	// table.state is the public selected state — safe to read directly in template
	// table.store.state is the internal TanStack atom — accumulates subscriptions
	const rowSelection = $derived(table.state.rowSelection);
	const selectedCount = $derived(Object.keys(rowSelection).length);
</script>

<div
	class={cn(
		'flex max-h-full min-h-0 flex-col overflow-hidden rounded-lg border border-surface-3 bg-surface-1',
		className
	)}
	{...rest}
>
	<div class="min-h-0 flex-1 overflow-auto">
		<table
			class="table-fixed border-separate border-spacing-0 text-sm"
			style="width: max(100%, {tableWidth + (isRowSelectionEnabled ? 40 : 0)}px)"
		>
			<colgroup>
				{#if isRowSelectionEnabled}
					<col style="width: 40px" />
				{/if}
				{#each columnSizes as col (col.id)}
					<col style={col.grow ? undefined : `width: ${col.size}px`} />
				{/each}
				{#if !hasGrowColumn}
					<col />
				{/if}
			</colgroup>
			{#if caption}
				<caption class="sr-only">{caption}</caption>
			{/if}
			<thead class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim">
				{#each headerGroups as headerGroup, headerGroupIndex (headerGroup.id)}
					<tr class="h-9">
						{#if isRowSelectionEnabled}
							<th
								class="h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 text-center align-middle"
								style="position: sticky; left: 0; z-index: 15; width: 40px; min-width: 40px; max-width: 40px"
							>
								{#if isMultiRowSelectionEnabled && headerGroupIndex === headerGroups.length - 1}
									<Checkbox
										size="sm"
										aria-label="Select all rows"
										class="mx-auto size-4"
										checked={table.getIsAllRowsSelected()
											? true
											: table.getIsSomeRowsSelected()
												? 'indeterminate'
												: false}
										onCheckedChange={({ checked }) => table.toggleAllRowsSelected(checked === true)}
									/>
								{/if}
							</th>
						{/if}
						{#each headerGroup.headers as header (header.id)}
							{@const columnDef = getColumnMeta(header.column.columnDef)}
							<th
								class={cn(
									'h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 align-middle leading-5 font-medium',
									alignClass(columnDef?.align)
								)}
								colspan={header.colSpan}
							>
								{#if !header.isPlaceholder}
									<FlexRender {header} />
								{/if}
							</th>
						{/each}
						{#if !hasGrowColumn}
							<th aria-hidden="true" class="h-9 border-b border-surface-3 bg-surface-2 p-0"></th>
						{/if}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each rowModel.rows as row (row.id)}
					{@const isSelected = Boolean(rowSelection[row.id])}
					<tr
						class={cn(
							'group/row',
							'[--row-bg:var(--compote-surface-1)]',
							'hover:bg-well/60 hover:[--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]',
							isSelected &&
								'bg-well/60 [--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]'
						)}
						onclick={(event) => onRowClick?.({ row: row.original, event })}
						ondblclick={(event) => onRowDoubleClick?.({ row: row.original, event })}
					>
						{#if isRowSelectionEnabled}
							<td
								class="border-b border-surface-2 bg-(--row-bg) px-3 py-2 text-center align-middle group-last/row:border-b-0"
								style="position: sticky; left: 0; z-index: 1"
							>
								<Checkbox
									size="sm"
									aria-label="Select row"
									class="mx-auto size-4"
									checked={isSelected}
									disabled={!row.getCanSelect()}
									onCheckedChange={({ checked }) => row.toggleSelected(checked === true)}
								/>
							</td>
						{/if}
						{#each row.getVisibleCells() as cell (cell.id)}
							{@const columnDef = getColumnMeta(cell.column.columnDef)}
							<td
								class={cn(
									'truncate border-b border-b-surface-2 px-3 py-2 group-last/row:border-b-0',
									alignClass(columnDef?.align)
								)}
							>
								{#if columnDef?.type === 'boolean'}
									{@const value = getBooleanCellValue(cell.getValue())}
									{#if value === true}
										<span
											class="inline-flex size-5 items-center justify-center text-success"
											role="img"
											aria-label="Yes"
										>
											<PhCheck class="size-4" />
										</span>
									{:else if value === false}
										<span
											class="inline-flex size-5 items-center justify-center text-danger"
											role="img"
											aria-label="No"
										>
											<PhX class="size-4" />
										</span>
									{:else}
										-
									{/if}
								{:else if columnDef?.type === 'url'}
									{@const value = getUrlCellValue(cell.getValue())}
									{#if value}
										<button
											type="button"
											class={cn(
												'inline-flex max-w-full appearance-none items-center gap-1.5 rounded-sm border-0 bg-transparent p-0 align-middle leading-5 font-medium text-ink underline decoration-border decoration-dotted underline-offset-4 outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
												justifyClass(columnDef.align)
											)}
											onclick={() => openUrlCell(value)}
										>
											<PhArrowSquareOut class="size-3.5 shrink-0" />
										</button>
									{:else}
										-
									{/if}
								{:else}
									<FlexRender {cell} />
								{/if}
							</td>
						{/each}
						{#if !hasGrowColumn}
							<td aria-hidden="true" class="border-b border-surface-2 p-0 group-last/row:border-b-0"
							></td>
						{/if}
					</tr>
				{:else}
					<tr>
						<td
							class="px-3 py-10 text-center text-sm text-ink-dim"
							colspan={columnSizes.length + (isRowSelectionEnabled ? 2 : 1)}
						>
							{emptyMessage}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="shrink-0 border-t border-surface-3 bg-surface-2 px-3 py-2 text-sm text-ink-dim">
		{#if isRowSelectionEnabled}
			{selectedCount} of {rowModel.rows.length} rows selected
		{:else}
			{rowModel.rows.length} rows
		{/if}
	</div>
</div>
