<script lang="ts" generics="TData extends RowData, TSelected = object">
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { FlexRender } from '@tanstack/svelte-table';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { PhArrowSquareOut, PhCaretDown, PhCaretUp } from '$lib/icons';
	import Checkbox from '../checkbox/checkbox.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Header, RowData } from '@tanstack/svelte-table';
	import {
		getDataTableCellConfig,
		hasCustomDataTableCell,
		type DataTable,
		type DataTableCell,
		type DataTableCellConfig,
		type DataTableColumnAlign,
		type DataTableColumnMeta,
		type DataTableFeatures
	} from './core';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		table: DataTable<TData, TSelected>;
		class?: ClassValue;
		tableClass?: ClassValue;
	};

	let { table, class: className, tableClass, ...rest }: Props = $props();

	const locale = useLocaleContext();
	const columnCount = $derived(table.getVisibleLeafColumns().length);
	const headerGroupCount = $derived(table.getHeaderGroups().length);
	const isRowSelectionEnabled = $derived(Boolean(table.options.enableRowSelection));
	const isMultiRowSelectionEnabled = $derived(table.options.enableMultiRowSelection !== false);
	const tableColumnCount = $derived(columnCount + (isRowSelectionEnabled ? 1 : 0));
	const allRowsSelected = $derived(table.getIsAllRowsSelected());
	const someRowsSelected = $derived(table.getIsSomeRowsSelected());
	const allRowsSelectionState = $derived(
		allRowsSelected ? true : someRowsSelected ? 'indeterminate' : false
	);
	const rowSelectionColumnSize = 40;
	const tableSize = $derived(
		table.getTotalSize() + (isRowSelectionEnabled ? rowSelectionColumnSize : 0)
	);
	const isColumnResizing = $derived(table.store.state.columnResizing.isResizingColumn !== false);

	function formatNumericValue(
		value: unknown,
		options: Intl.NumberFormatOptions & { locale?: string }
	) {
		if (typeof value !== 'number') return formatTextValue(value);
		const { locale: optionLocale, ...numberFormatOptions } = options;
		return new Intl.NumberFormat(optionLocale ?? locale().locale, numberFormatOptions).format(
			value
		);
	}

	function formatTextValue(value: unknown, fallback = '') {
		if (value === null || value === undefined || value === '') return fallback;
		return String(value);
	}

	function fractionOptions(options: { fractionDigits?: number }) {
		if (options.fractionDigits === undefined) return {};

		return {
			minimumFractionDigits: options.fractionDigits,
			maximumFractionDigits: options.fractionDigits
		};
	}

	function isNumericCellConfig(cellConfig: DataTableCellConfig<TData> | undefined) {
		return (
			cellConfig?.type === 'number' ||
			cellConfig?.type === 'currency' ||
			cellConfig?.type === 'percentage'
		);
	}

	function getLinkHref<TValue>(
		cell: DataTableCell<TData, TValue>,
		href: string | ((value: TValue, row: TData) => string) | undefined
	) {
		const value = cell.getValue();
		if (!href) return formatTextValue(value);
		return typeof href === 'function' ? href(value, cell.row.original) : href;
	}

	function getLinkLabel(value: unknown, fallback = 'Open link') {
		return formatTextValue(value, fallback);
	}

	function getCellMeta<TValue>(cell: DataTableCell<TData, TValue>) {
		return (cell.column.columnDef.meta as DataTableColumnMeta<TData, TValue> | undefined)
			?.dataTable;
	}

	function getHeaderMeta(header: Header<DataTableFeatures, TData, unknown>) {
		return header.column.columnDef.meta as DataTableColumnMeta<TData> | undefined;
	}

	function getColumnAlign(
		align: DataTableColumnAlign | undefined,
		cellConfig: DataTableCellConfig<TData> | undefined
	) {
		return align ?? (isNumericCellConfig(cellConfig) ? 'right' : 'left');
	}

	function alignClass(align: DataTableColumnAlign | undefined) {
		return {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right'
		}[align ?? 'left'];
	}

	function justifyClass(align: DataTableColumnAlign | undefined) {
		return {
			left: 'justify-start',
			center: 'justify-center',
			right: 'justify-end'
		}[align ?? 'left'];
	}

	function sortButtonDirectionClass(align: DataTableColumnAlign | undefined) {
		return align === 'right' ? 'flex-row-reverse' : 'flex-row';
	}

	function columnSizeStyle(size: number) {
		return `width: ${size}px`;
	}

	function tableSizeStyle() {
		return `width: max(100%, ${tableSize}px)`;
	}

	function resizeHandleStyle(header: Header<DataTableFeatures, TData, unknown>) {
		if (table.options.columnResizeMode !== 'onEnd') return undefined;
		const deltaOffset = table.store.state.columnResizing.deltaOffset;
		if (!header.column.getIsResizing() || deltaOffset === null) return undefined;
		return `transform: translateX(${deltaOffset}px)`;
	}

	function getHeaderSortDirection(
		header: Header<DataTableFeatures, TData, unknown>,
		sortingState: unknown
	) {
		void sortingState;
		return header.column.getIsSorted();
	}

	function getHeaderSortLabel(sortDirection: false | 'asc' | 'desc') {
		if (sortDirection === 'asc') return 'Sorted ascending';
		if (sortDirection === 'desc') return 'Sorted descending';
		return 'Not sorted';
	}

	function getHeaderAriaSort(sortDirection: false | 'asc' | 'desc') {
		if (sortDirection === 'asc') return 'ascending';
		if (sortDirection === 'desc') return 'descending';
		return 'none';
	}
</script>

<div
	class={cn('max-h-full min-h-0 overflow-auto rounded-lg border border-surface-3', className)}
	{...rest}
>
	{#if isColumnResizing}
		<div aria-hidden="true" class="fixed inset-0 z-50 cursor-col-resize select-none"></div>
	{/if}

	<table class={cn('table-fixed border-collapse text-sm', tableClass)} style={tableSizeStyle()}>
		<colgroup>
			{#if isRowSelectionEnabled}
				<col style={columnSizeStyle(rowSelectionColumnSize)} />
			{/if}
			{#each table.getVisibleLeafColumns() as column (column.id)}
				<col style={columnSizeStyle(column.getSize())} />
			{/each}
		</colgroup>
		<thead class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim">
			{#each table.getHeaderGroups() as headerGroup, headerGroupIndex (headerGroup.id)}
				<tr>
					{#if isRowSelectionEnabled && headerGroupIndex === 0}
						<th
							class="border-b border-surface-3 bg-surface-2 px-3 py-2 text-center align-middle font-medium"
							rowspan={headerGroupCount}
						>
							{#if isMultiRowSelectionEnabled}
								<Checkbox
									size="sm"
									aria-label="Select all rows"
									class="mx-auto size-4"
									checked={allRowsSelectionState}
									onCheckedChange={({ checked }) => table.toggleAllRowsSelected(checked === true)}
								/>
							{/if}
						</th>
					{/if}
					{#each headerGroup.headers as header (header.id)}
						{@const headerMeta = getHeaderMeta(header)?.dataTable}
						{@const headerAlign = getColumnAlign(headerMeta?.align, headerMeta?.cell)}
						{@const sortDirection = getHeaderSortDirection(header, table.store.state.sorting)}
						<th
							class={cn(
								'relative border-b border-surface-3 bg-surface-2 px-3 py-2 font-medium',
								alignClass(headerAlign)
							)}
							colspan={header.colSpan}
							aria-sort={header.column.getCanSort() ? getHeaderAriaSort(sortDirection) : undefined}
						>
							{#if !header.isPlaceholder}
								{#if header.column.getCanSort()}
									<button
										type="button"
										class={cn(
											'inline-flex max-w-full items-center gap-1 rounded-sm outline-none hover:text-ink data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-ring',
											justifyClass(headerAlign),
											sortButtonDirectionClass(headerAlign)
										)}
										aria-label={`${getHeaderSortLabel(sortDirection)}. Toggle sorting.`}
										onclick={header.column.getToggleSortingHandler()}
									>
										<span class="min-w-0 truncate">
											<FlexRender {header} />
										</span>
										<span
											class="inline-flex size-3.5 shrink-0 items-center justify-center text-ink-dim"
										>
											{#if sortDirection === 'asc'}
												<PhCaretUp class="size-3.5" />
											{:else if sortDirection === 'desc'}
												<PhCaretDown class="size-3.5" />
											{/if}
										</span>
									</button>
								{:else}
									<FlexRender {header} />
								{/if}
							{/if}
							{#if header.column.getCanResize()}
								<div
									aria-hidden="true"
									class={cn(
										'absolute top-0 -right-1 z-10 flex h-full w-2 cursor-col-resize touch-none items-center justify-center select-none before:h-4 before:w-px before:bg-border before:content-[""]'
									)}
									style={resizeHandleStyle(header)}
									ondblclick={() => header.column.resetSize()}
									onmousedown={header.getResizeHandler()}
									ontouchstart={header.getResizeHandler()}
								></div>
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each table.getRowModel().rows as row (row.id)}
				<tr class="border-b border-surface-3 last:border-b-0">
					{#if isRowSelectionEnabled}
						<td class="px-3 py-2 text-center align-middle">
							<Checkbox
								size="sm"
								aria-label="Select row"
								class="mx-auto size-4"
								checked={row.getIsSelected()}
								disabled={!row.getCanSelect()}
								onCheckedChange={({ checked }) => row.toggleSelected(checked === true)}
							/>
						</td>
					{/if}
					{#each row.getVisibleCells() as cell (cell.id)}
						{@const cellMeta = getCellMeta(cell)}
						{@const cellConfig = getDataTableCellConfig(cell)}
						{@const cellAlign = getColumnAlign(cellMeta?.align, cellConfig)}
						<td
							class={cn(
								'px-3 py-2',
								alignClass(cellAlign),
								isNumericCellConfig(cellConfig) && 'tabular-nums'
							)}
						>
							{#if cellConfig && !hasCustomDataTableCell(cell)}
								{@const value = cell.getValue()}
								{#if cellConfig.type === 'number'}
									{formatNumericValue(value, {
										...cellConfig,
										...fractionOptions(cellConfig)
									})}
								{:else if cellConfig.type === 'currency'}
									{formatNumericValue(value, {
										...cellConfig,
										...fractionOptions(cellConfig),
										style: 'currency'
									})}
								{:else if cellConfig.type === 'percentage'}
									{formatNumericValue(value, {
										...cellConfig,
										...fractionOptions(cellConfig),
										style: 'percent'
									})}
								{:else if cellConfig.type === 'boolean'}
									{value === true
										? (cellConfig.trueLabel ?? 'Yes')
										: value === false
											? (cellConfig.falseLabel ?? 'No')
											: (cellConfig.nullLabel ?? '')}
								{:else if cellConfig.type === 'link'}
									{@const href = getLinkHref(cell, cellConfig.href)}
									{#if href}
										<a
											class="inline-flex size-7 items-center justify-center rounded-md text-primary hover:bg-surface-2"
											{href}
											target={cellConfig.target ?? '_blank'}
											rel="external noreferrer"
											aria-label={getLinkLabel(value, cellConfig.fallback)}
											title={getLinkLabel(value, cellConfig.fallback)}
										>
											<PhArrowSquareOut class="size-4" />
										</a>
									{:else}
										{formatTextValue(value, cellConfig.fallback)}
									{/if}
								{:else}
									{formatTextValue(value, cellConfig.fallback)}
								{/if}
							{:else}
								<FlexRender {cell} />
							{/if}
						</td>
					{/each}
				</tr>
			{:else}
				<tr>
					<td class="px-3 py-6 text-center text-ink-dim" colspan={tableColumnCount}>
						No results.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
