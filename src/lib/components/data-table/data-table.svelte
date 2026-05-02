<script lang="ts" generics="TData extends RowData, TSelected = object">
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import { FlexRender } from '@tanstack/svelte-table';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { PhArrowSquareOut } from '$lib/icons';
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
	const columnCount = $derived(table.getLeafHeaders().length);

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
</script>

<div class={cn('overflow-hidden rounded-lg border border-surface-3', className)} {...rest}>
	<table class={cn('w-full border-collapse text-sm', tableClass)}>
		<thead class="bg-surface-2 text-left text-ink-dim">
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<tr>
					{#each headerGroup.headers as header (header.id)}
						{@const headerMeta = getHeaderMeta(header)?.dataTable}
						{@const headerAlign = getColumnAlign(headerMeta?.align, headerMeta?.cell)}
						<th
							class={cn('border-b border-surface-3 px-3 py-2 font-medium', alignClass(headerAlign))}
							colspan={header.colSpan}
						>
							{#if !header.isPlaceholder}
								<FlexRender {header} />
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each table.getRowModel().rows as row (row.id)}
				<tr class="border-b border-surface-3 last:border-b-0">
					{#each row.getAllCells() as cell (cell.id)}
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
					<td class="px-3 py-6 text-center text-ink-dim" colspan={columnCount}> No results. </td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
