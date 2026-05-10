<script lang="ts" generics="T extends RowData">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { HeaderGroup, RowData } from '@tanstack/svelte-table';
	import { cn } from 'tailwind-variants';
	import { PhCaretDown, PhCaretUp } from '$lib/icons';
	import Checkbox from '../checkbox/checkbox.svelte';
	import type { DataTableFeatures, DataTableInstance } from './create-table';
	import {
		alignClass,
		getColumnMeta,
		getHeaderAriaSort,
		getHeaderSortDirection,
		getHeaderSortLabel,
		getPinningStyle,
		joinStyles,
		justifyClass,
		resizeHandleClass,
		resizeHandleStyle,
		sortButtonDirectionClass,
		virtualColumnSizeStyle,
		virtualSelectionColumnSizeStyle
	} from './data-table-utils';

	type Props = {
		table: DataTableInstance<T>;
		headerGroups: HeaderGroup<DataTableFeatures, T>[];
		headerGroupCount: number;
		isRowSelectionEnabled: boolean;
		isMultiRowSelectionEnabled: boolean;
		allRowsSelectionState: boolean | 'indeterminate';
		isVirtual?: boolean;
	};

	let {
		table,
		headerGroups,
		headerGroupCount,
		isRowSelectionEnabled,
		isMultiRowSelectionEnabled,
		allRowsSelectionState,
		isVirtual = false
	}: Props = $props();

	function headerCellStyle(header: HeaderGroup<DataTableFeatures, T>['headers'][number]) {
		const canPinHeader = header.subHeaders.length === 0;

		return joinStyles(
			isVirtual ? virtualColumnSizeStyle(header.getSize()) : undefined,
			canPinHeader ? getPinningStyle(header.column, true, isRowSelectionEnabled) : undefined
		);
	}

	function selectionHeaderStyle() {
		return isVirtual
			? joinStyles(
					virtualSelectionColumnSizeStyle(),
					'min-width: 40px',
					'max-width: 40px',
					'position: sticky',
					'left: 0',
					'z-index: 30'
				)
			: 'width: 40px; min-width: 40px; max-width: 40px; position: sticky; left: 0; z-index: 15';
	}

	function headerRowStyle() {
		if (!isVirtual) return undefined;
		return joinStyles('display: flex', 'width: 100%');
	}

	function shouldRenderSelectionCheckbox(headerGroupIndex: number) {
		if (!isMultiRowSelectionEnabled) return false;
		return headerGroupIndex === headerGroupCount - 1;
	}

</script>

<thead
	class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim"
	style={isVirtual ? 'display: grid; position: sticky; top: 0; z-index: 20' : undefined}
>
	{#each headerGroups as headerGroup, headerGroupIndex (headerGroup.id)}
		{@const visibleHeaders = headerGroup.headers.filter((header) => header.colSpan > 0)}
		<tr class="h-9" style={headerRowStyle()}>
			{#if isRowSelectionEnabled}
				<th
					class={cn(
						'h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 text-center align-middle leading-5 font-medium',
						isVirtual && 'items-center justify-center'
					)}
					style={selectionHeaderStyle()}
				>
					{#if shouldRenderSelectionCheckbox(headerGroupIndex)}
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
			{#each visibleHeaders as header, headerIndex (header.id)}
				{@const columnDef = getColumnMeta(header.column.columnDef)}
				{@const sortDirection = getHeaderSortDirection(header, table.store.state.sorting)}
				<th
					class={cn(
						'relative h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 align-middle leading-5 font-medium',
						isVirtual && 'items-center',
						isVirtual && justifyClass(columnDef?.align),
						alignClass(columnDef?.align)
					)}
					colspan={header.colSpan}
					aria-sort={header.column.getCanSort() ? getHeaderAriaSort(sortDirection) : undefined}
					style={headerCellStyle(header)}
				>
					{#if !header.isPlaceholder}
						{#if header.column.getCanSort()}
							<button
								type="button"
								class={cn(
									'inline-flex max-w-full appearance-none items-center gap-1 rounded-sm border-0 bg-transparent p-0 align-middle text-sm leading-5 text-inherit outline-none hover:text-ink data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-ring',
									justifyClass(columnDef?.align),
									sortButtonDirectionClass(columnDef?.align)
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
							class={resizeHandleClass(headerIndex, visibleHeaders.length)}
							style={resizeHandleStyle(table, header)}
							ondblclick={() => header.column.resetSize()}
							onmousedown={header.getResizeHandler()}
							ontouchstart={header.getResizeHandler()}
						></div>
					{/if}
				</th>
			{/each}
			{#if !isVirtual}
				<th aria-hidden="true" class="h-9 border-b border-surface-3 bg-surface-2 p-0"></th>
			{/if}
		</tr>
	{/each}
</thead>
