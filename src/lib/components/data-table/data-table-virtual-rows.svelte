<script lang="ts" generics="T extends RowData">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { Row, RowData } from '@tanstack/svelte-table';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { get } from 'svelte/store';
	import { cn } from 'tailwind-variants';
	import { PhArrowSquareOut, PhCheck, PhX } from '$lib/icons';
	import Checkbox from '../checkbox/checkbox.svelte';
	import type { DataTableFeatures, DataTableInstance } from './create-table';
	import {
		alignClass,
		getBooleanCellValue,
		getColumnMeta,
		getPinningStyle,
		getRowSelectionState,
		getUrlCellValue,
		joinStyles,
		justifyClass,
		openUrlCell,
		virtualColumnSizeStyle,
		virtualSelectionColumnSizeStyle
	} from './data-table-utils';

	type Props = {
		rows: Row<DataTableFeatures, T>[];
		scrollContainer: HTMLDivElement;
		isRowSelectionEnabled: boolean;
		table: DataTableInstance<T>;
		emptyMessage: string;
		onRowDoubleClick?: (details: { row: T; event: MouseEvent }) => void;
	};

	let { rows, scrollContainer, isRowSelectionEnabled, table, emptyMessage, onRowDoubleClick }: Props = $props();

	const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		get count() {
			return rows.length;
		},
		estimateSize: () => 37,
		getScrollElement: () => scrollContainer,
		measureElement:
			typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
				? (element) => element.getBoundingClientRect().height
				: undefined,
		overscan: 5
	});

	$effect(() => {
		get(rowVirtualizer).setOptions({ count: rows.length });
	});

	function measureRowElement(node: HTMLTableRowElement) {
		get(rowVirtualizer).measureElement(node);
	}
</script>

<tbody style="display: grid; height: {$rowVirtualizer.getTotalSize()}px; position: relative">
	{#if rows.length === 0}
		<tr style="display: flex; position: absolute; width: 100%; top: 0">
			<td class="px-3 py-10 text-center text-sm text-ink-dim" style="flex: 1">
				{emptyMessage}
			</td>
		</tr>
	{:else}
		{#each $rowVirtualizer.getVirtualItems() as virtualRow (virtualRow.index)}
			{@const row = rows[virtualRow.index]}
			{@const rowSelected = getRowSelectionState(table, table.store.state.rowSelection, row.id)}
			<tr
				data-index={virtualRow.index}
				use:measureRowElement
				class={cn(
					'group/row border-b border-surface-2 last:border-b-0',
					'[--row-bg:var(--compote-surface-1)]',
					'hover:bg-well/60 hover:[--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]',
					rowSelected &&
						'bg-well/60 [--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]'
				)}
				style="display: flex; position: absolute; transform: translateY({virtualRow.start}px); width: 100%"
				ondblclick={(event) => onRowDoubleClick?.({ row: row.original, event })}
			>
				{#if isRowSelectionEnabled}
					<td
						class="items-center justify-center bg-(--row-bg) px-3 py-2 text-center align-middle"
						style={joinStyles(
							virtualSelectionColumnSizeStyle(),
							'position: sticky; left: 0; z-index: 1'
						)}
					>
						<Checkbox
							size="sm"
							aria-label="Select row"
							class="mx-auto size-4"
							checked={rowSelected}
							disabled={!row.getCanSelect()}
							onCheckedChange={({ checked }) => row.toggleSelected(checked === true)}
						/>
					</td>
				{/if}
				{#each row.getVisibleCells() as cell (cell.id)}
					{@const columnDef = getColumnMeta(cell.column.columnDef)}
					<td
						class={cn(
							'items-center truncate px-3 py-2',
							alignClass(columnDef?.align),
							justifyClass(columnDef?.align),
							cell.column.getIsPinned() && 'bg-(--row-bg)'
						)}
						style={joinStyles(
							virtualColumnSizeStyle(cell.column.getSize()),
							getPinningStyle(cell.column, false, isRowSelectionEnabled)
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
			</tr>
		{/each}
	{/if}
</tbody>
