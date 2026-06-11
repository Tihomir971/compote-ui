<script lang="ts" generics="T extends RowData">
	import type { Column, RowData } from '@tanstack/svelte-table';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { cn } from 'tailwind-variants';
	import type { DataTableInstance } from './data-table-utils';
	import type { DataTableViewState } from './table-view-state.svelte';
	import type { DataTableFeatures } from './features';
	import {
		alignClass,
		formatColumnFooter,
		getColumnMeta,
		getPinningStyle,
		justifyClass,
		joinStyles,
		virtualColumnSizeStyle,
		virtualGrowColumnSizeStyle,
		virtualSelectionColumnSizeStyle
	} from './data-table-utils';

	type Props = {
		table: DataTableInstance<T>;
		view: DataTableViewState<T>;
		hasGrowColumn: boolean;
		isVirtual?: boolean;
	};

	let { table, view, hasGrowColumn, isVirtual = false }: Props = $props();

	const localeCtx = useLocaleContext();
	const locale = $derived(localeCtx().locale);

	// One pass over the rows collects values for every footer column, instead of
	// re-reading all rows per column on each render.
	const footerTexts = $derived.by(() => {
		const footerColumns = view.visibleLeafColumns.filter((column) => {
			const meta = getColumnMeta(column.columnDef);
			return !!(meta?.sum || meta?.footer);
		});
		const valuesByColumn: Record<string, unknown[]> = {};
		for (const column of footerColumns) {
			valuesByColumn[column.id] = [];
		}
		for (const row of view.rowModel.rows) {
			for (const columnId in valuesByColumn) {
				valuesByColumn[columnId].push(row.getValue(columnId));
			}
		}
		const texts: Record<string, string | undefined> = {};
		for (const column of footerColumns) {
			const meta = getColumnMeta(column.columnDef);
			texts[column.id] = formatColumnFooter(meta ?? {}, valuesByColumn[column.id], locale);
		}
		return texts;
	});

	function footCellStyle(column: Column<DataTableFeatures, T, unknown>) {
		const meta = getColumnMeta(column.columnDef);
		if (!isVirtual) return getPinningStyle(column, table, view, true, view.isRowSelectionEnabled);
		return joinStyles(
			meta?.grow ? virtualGrowColumnSizeStyle() : virtualColumnSizeStyle(column.getSize()),
			getPinningStyle(column, table, view, true, view.isRowSelectionEnabled)
		);
	}

	function selectionCellStyle() {
		return isVirtual
			? joinStyles(
					virtualSelectionColumnSizeStyle(),
					'min-width: 40px',
					'max-width: 40px',
					'position: sticky',
					'left: 0',
					'z-index: 15'
				)
			: 'width: 40px; min-width: 40px; max-width: 40px; position: sticky; left: 0; z-index: 15';
	}
</script>

<tfoot
	class="sticky bottom-0 z-20 bg-surface-2 text-ink-dim"
	style={isVirtual ? 'display: grid; position: sticky; bottom: 0; z-index: 20' : undefined}
>
	<tr class="h-9" style={isVirtual ? 'display: flex; width: 100%' : undefined}>
		{#if view.isRowSelectionEnabled}
			<td
				class={cn(
					'h-9 border-t border-surface-3 bg-surface-2 px-3 py-0',
					isVirtual && 'flex items-center'
				)}
				style={selectionCellStyle()}
			></td>
		{/if}
		{#each view.visibleLeafColumns as column (column.id)}
			{@const meta = getColumnMeta(column.columnDef)}
			<td
				class={cn(
					'h-9 truncate border-t border-surface-3 bg-surface-2 px-3 py-0 align-middle text-sm font-medium',
					alignClass(meta?.align),
					isVirtual && 'flex items-center',
					isVirtual && justifyClass(meta?.align)
				)}
				style={footCellStyle(column)}
			>
				{footerTexts[column.id] ?? ''}
			</td>
		{/each}
		{#if !isVirtual && !hasGrowColumn}
			<td aria-hidden="true" class="h-9 border-t border-surface-3 bg-surface-2 p-0"></td>
		{/if}
	</tr>
</tfoot>
