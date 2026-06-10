<script lang="ts" generics="T extends RowData">
	import type { Column, Row, RowData } from '@tanstack/svelte-table';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { cn } from 'tailwind-variants';
	import type { DataTableInstance } from './data-table-utils';
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
		visibleLeafColumns: Column<DataTableFeatures, T, unknown>[];
		rows: Row<DataTableFeatures, T>[];
		isRowSelectionEnabled: boolean;
		hasGrowColumn: boolean;
		isVirtual?: boolean;
	};

	let {
		table,
		visibleLeafColumns,
		rows,
		isRowSelectionEnabled,
		hasGrowColumn,
		isVirtual = false
	}: Props = $props();

	const localeCtx = useLocaleContext();
	const locale = $derived(localeCtx().locale);

	function footCellStyle(column: Column<DataTableFeatures, T, unknown>) {
		const meta = getColumnMeta(column.columnDef);
		if (!isVirtual) return getPinningStyle(column, table, true, isRowSelectionEnabled);
		return joinStyles(
			meta?.grow ? virtualGrowColumnSizeStyle() : virtualColumnSizeStyle(column.getSize()),
			getPinningStyle(column, table, true, isRowSelectionEnabled)
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
		{#if isRowSelectionEnabled}
			<td
				class={cn(
					'h-9 border-t border-surface-3 bg-surface-2 px-3 py-0',
					isVirtual && 'flex items-center'
				)}
				style={selectionCellStyle()}
			></td>
		{/if}
		{#each visibleLeafColumns as column (column.id)}
			{@const meta = getColumnMeta(column.columnDef)}
			{@const values = rows.map((row) => row.getValue(column.id))}
			{@const footerText = formatColumnFooter(meta ?? {}, values, locale)}
			<td
				class={cn(
					'h-9 truncate border-t border-surface-3 bg-surface-2 px-3 py-0 align-middle text-sm font-medium',
					alignClass(meta?.align),
					isVirtual && 'flex items-center',
					isVirtual && justifyClass(meta?.align)
				)}
				style={footCellStyle(column)}
			>
				{footerText ?? ''}
			</td>
		{/each}
		{#if !isVirtual && !hasGrowColumn}
			<td aria-hidden="true" class="h-9 border-t border-surface-3 bg-surface-2 p-0"></td>
		{/if}
	</tr>
</tfoot>
