<script lang="ts" generics="TData extends RowData, TSelected = object">
	import { FlexRender } from '@tanstack/svelte-table';
	import { cn, type ClassValue } from 'tailwind-variants';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { RowData } from '@tanstack/svelte-table';
	import {
		getDataTableCellConfig,
		hasCustomDataTableCell,
		type DataTable,
		type DataTableCell,
		type DataTableCellConfig
	} from './core';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		table: DataTable<TData, TSelected>;
		class?: ClassValue;
		tableClass?: ClassValue;
	};

	let { table, class: className, tableClass, ...rest }: Props = $props();

	const columnCount = $derived(table.getLeafHeaders().length);

	function formatNumericValue(
		value: unknown,
		options: Intl.NumberFormatOptions & { locale?: string }
	) {
		if (typeof value !== 'number') return formatTextValue(value);
		return new Intl.NumberFormat(options.locale, options).format(value);
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

	function isNumericCell(cellConfig: DataTableCellConfig<TData> | undefined) {
		return (
			cellConfig?.type === 'number' ||
			cellConfig?.type === 'currency' ||
			cellConfig?.type === 'percentage'
		);
	}

	function getLinkHref<TValue>(
		cell: DataTableCell<TData, TValue>,
		href: string | ((value: TValue, row: TData) => string)
	) {
		const value = cell.getValue();
		return typeof href === 'function' ? href(value, cell.row.original) : href;
	}
</script>

<div class={cn('overflow-hidden rounded-lg border border-surface-3', className)} {...rest}>
	<table class={cn('w-full border-collapse text-sm', tableClass)}>
		<thead class="bg-surface-2 text-left text-ink-dim">
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<tr>
					{#each headerGroup.headers as header (header.id)}
						<th class="border-b border-surface-3 px-3 py-2 font-medium" colspan={header.colSpan}>
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
						{@const cellConfig = getDataTableCellConfig(cell)}
						<td class={cn('px-3 py-2', isNumericCell(cellConfig) && 'text-right tabular-nums')}>
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
									<a
										class="font-medium text-primary underline-offset-4 hover:underline"
										href={getLinkHref(cell, cellConfig.href)}
										target={cellConfig.target}
										rel="external noreferrer"
									>
										{formatTextValue(value, cellConfig.fallback)}
									</a>
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
