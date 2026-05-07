<script lang="ts" generics="T extends object">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { CellData, Header } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';
	import type { DataTableFeatures, DataTableInstance } from './create-table';
	import type { DataTableColumn } from './types';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		table: DataTableInstance<T>;
		columns: DataTableColumn<T>[];
		caption?: string;
		emptyMessage?: string;
		class?: ClassValue;
	};

	let {
		table,
		columns,
		caption,
		emptyMessage = 'No rows found',
		class: className,
		...rest
	}: Props = $props();

	function alignClass(align: DataTableColumn<T>['align']) {
		return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
	}

	function columnSizeStyle(size: number) {
		return `width: ${size}px`;
	}

	function tableSizeStyle() {
		return `width: max(100%, ${table.getTotalSize()}px)`;
	}

	function resizeHandleStyle(header: Header<DataTableFeatures, T, CellData>) {
		if (table.options.columnResizeMode !== 'onEnd') return undefined;
		const deltaOffset = table.store.state.columnResizing.deltaOffset;
		if (!header.column.getIsResizing() || deltaOffset === null) return undefined;
		return `transform: translateX(${deltaOffset}px)`;
	}

	const rowModel = $derived(table.getRowModel());
	const isColumnResizing = $derived(table.store.state.columnResizing.isResizingColumn !== false);
</script>

<div
	class={cn(
		'max-h-full min-h-0 overflow-auto rounded-lg border border-surface-3 bg-surface-1',
		className
	)}
	{...rest}
>
	{#if isColumnResizing}
		<div aria-hidden="true" class="fixed inset-0 z-50 cursor-col-resize select-none"></div>
	{/if}

	<table class="table-fixed border-collapse text-sm" style={tableSizeStyle()}>
		<colgroup>
			{#each table.getAllLeafColumns() as column (column.id)}
				<col style={columnSizeStyle(column.getSize())} />
			{/each}
		</colgroup>
		{#if caption}
			<caption class="sr-only">{caption}</caption>
		{/if}
		<thead class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim">
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<tr>
					{#each headerGroup.headers as header (header.id)}
						{@const columnDef = columns.find((column) => column.id === header.column.id)}
						<th
							class={cn(
								'relative border-b border-surface-3 bg-surface-2 px-3 py-2 font-medium',
								alignClass(columnDef?.align)
							)}
							colspan={header.colSpan}
						>
							{#if !header.isPlaceholder}
								<FlexRender {header} />
							{/if}
							{#if header.column.getCanResize()}
								<div
									aria-hidden="true"
									class="absolute top-0 -right-1 z-10 flex h-full w-2 cursor-col-resize touch-none items-center justify-center select-none before:h-4 before:w-px before:bg-border before:content-['']"
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
			{#each rowModel.rows as row (row.id)}
				<tr class="border-b border-surface-3 last:border-b-0 hover:bg-well/60">
					{#each row.getAllCells() as cell (cell.id)}
						{@const columnDef = columns.find((column) => column.id === cell.column.id)}
						<td class={cn('px-3 py-2 text-ink-dim', alignClass(columnDef?.align))}>
							<FlexRender {cell} />
						</td>
					{/each}
				</tr>
			{:else}
				<tr>
					<td class="px-3 py-10 text-center text-sm text-ink-dim" colspan={columns.length}>
						{emptyMessage}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
