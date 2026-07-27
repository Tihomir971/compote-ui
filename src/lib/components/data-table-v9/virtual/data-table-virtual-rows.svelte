<script lang="ts" generics="T extends RowData">
	import type { RowData } from '@tanstack/svelte-table';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import { untrack } from 'svelte';
	import { cn } from 'tailwind-variants';
	import type { DataTableInstance } from '../data-table-utils';
	import type { DataTableViewState } from '../table-view-state.svelte';
	import DataTableCellContent from '../data-table-cell-content.svelte';
	import {
		alignClass,
		getColumnMeta,
		getPinningStyle,
		getRowCells,
		joinStyles,
		justifyClass,
		virtualColumnSizeStyle,
		virtualGrowColumnSizeStyle,
		virtualSelectionColumnSizeStyle
	} from '../data-table-utils';

	type Props = {
		table: DataTableInstance<T>;
		view: DataTableViewState<T>;
		scrollContainer: HTMLDivElement;
		emptyMessage: string;
		onRowClick?: (details: { row: T; event: MouseEvent }) => void;
		onRowDoubleClick?: (details: { row: T; event: MouseEvent }) => void;
	};

	let { table, view, scrollContainer, emptyMessage, onRowClick, onRowDoubleClick }: Props =
		$props();

	const rows = $derived(view.rowModel.rows);

	const rowVirtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		get count() {
			return rows.length;
		},
		estimateSize: () => 37,
		getScrollElement: () => scrollContainer,
		// Upstream-recommended workaround: dynamic measurement is skipped on
		// Firefox because its sub-pixel row heights make the virtualizer jitter.
		measureElement:
			typeof window !== 'undefined' && !navigator.userAgent.includes('Firefox')
				? (element) => element.getBoundingClientRect().height
				: undefined,
		overscan: 5
	});

	function measureRowElement(node: HTMLTableRowElement) {
		$rowVirtualizer.measureElement(node);
	}

	$effect(() => {
		const count = rows.length;
		untrack(() => {
			$rowVirtualizer.setOptions({ ...$rowVirtualizer.options, count });
		});
	});
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
			{#if row}
				{@const rowSelected = view.rowSelection[row.id] === true}
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
					onclick={(event) => onRowClick?.({ row: row.original, event })}
					ondblclick={(event) => onRowDoubleClick?.({ row: row.original, event })}
				>
					{#if view.isRowSelectionEnabled}
						<td
							class="items-center justify-center bg-(--row-bg) px-3 py-2 text-center align-middle"
							style={joinStyles(
								virtualSelectionColumnSizeStyle(),
								'position: sticky; left: 0; z-index: 1'
							)}
							onclick={(event) => event.stopPropagation()}
							ondblclick={(event) => event.stopPropagation()}
						>
							<input
								type="checkbox"
								aria-label="Select row"
								class="table-checkbox mx-auto block size-4"
								checked={rowSelected}
								disabled={!row.getCanSelect()}
								onchange={(e) => row.toggleSelected(e.currentTarget.checked)}
							/>
						</td>
					{/if}
					{#each getRowCells(row, view) as cell (cell.id)}
						{@const meta = getColumnMeta(cell.column.columnDef)}
						<td
							class={cn(
								'h-9 items-center truncate px-3 py-0',
								alignClass(meta?.align),
								justifyClass(meta?.align),
								cell.column.getIsPinned() && 'bg-(--row-bg)'
							)}
							style={joinStyles(
								meta?.grow
									? virtualGrowColumnSizeStyle()
									: virtualColumnSizeStyle(cell.column.getSize()),
								getPinningStyle(cell.column, table, view, false, view.isRowSelectionEnabled)
							)}
						>
							<DataTableCellContent {cell} />
						</td>
					{/each}
				</tr>
			{/if}
		{/each}
	{/if}
</tbody>
