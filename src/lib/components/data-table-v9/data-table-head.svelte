<script lang="ts" generics="T extends RowData">
	import type { HeaderGroup, RowData } from '@tanstack/svelte-table';
	import { FlexRender } from '@tanstack/svelte-table';
	import { cn } from 'tailwind-variants';
	import { PhCaretDown, PhCaretUp } from '$lib/icons';
	import type { DataTableInstance } from './data-table-utils';
	import type { DataTableViewState } from './table-view-state.svelte';
	import type { DataTableFeatures } from './features';
	import {
		alignClass,
		getColumnMeta,
		getGroupPinningStyle,
		getHeaderAriaSort,
		getHeaderSortLabel,
		getPinningStyle,
		joinStyles,
		justifyClass,
		resizeHandleClass,
		resizeHandleStyle,
		sortButtonDirectionClass,
		virtualColumnSizeStyle,
		virtualGroupWithGrowSizeStyle,
		virtualGrowColumnSizeStyle,
		virtualSelectionColumnSizeStyle
	} from './data-table-utils';

	type Props = {
		table: DataTableInstance<T>;
		view: DataTableViewState<T>;
		isVirtual?: boolean;
		hasGrowColumn?: boolean;
	};

	let { table, view, isVirtual = false, hasGrowColumn = false }: Props = $props();

	type Header = HeaderGroup<DataTableFeatures, T>['headers'][number];

	function findGrowLeafHeader(header: Header): Header | undefined {
		if (header.subHeaders.length === 0) {
			return getColumnMeta(header.column.columnDef)?.grow ? header : undefined;
		}
		for (const sub of header.subHeaders) {
			const found = findGrowLeafHeader(sub);
			if (found) return found;
		}
		return undefined;
	}

	function headerSortDirection(header: Header) {
		void view.sorting;
		return header.column.getIsSorted();
	}

	function headerCellStyle(header: Header) {
		const canPinHeader = header.subHeaders.length === 0;

		let virtualSizeStyle: string | undefined;
		if (isVirtual) {
			void view.columnSizing;
			const isGrowLeaf = canPinHeader && getColumnMeta(header.column.columnDef)?.grow;
			if (isGrowLeaf) {
				virtualSizeStyle = virtualGrowColumnSizeStyle();
			} else {
				const growLeaf = findGrowLeafHeader(header);
				virtualSizeStyle = growLeaf
					? virtualGroupWithGrowSizeStyle(header.getSize() - growLeaf.getSize())
					: virtualColumnSizeStyle(header.getSize());
			}
		}

		return joinStyles(
			virtualSizeStyle,
			canPinHeader
				? getPinningStyle(header.column, table, view, true, view.isRowSelectionEnabled)
				: getGroupPinningStyle(
						header,
						view.getHeaderSection(header),
						view,
						view.isRowSelectionEnabled
					)
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
		if (!view.isMultiRowSelectionEnabled) return false;
		return headerGroupIndex === view.headerGroups.length - 1;
	}
</script>

<thead
	class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim"
	style={isVirtual ? 'display: grid; position: sticky; top: 0; z-index: 20' : undefined}
>
	{#each view.headerGroups as headerGroup, headerGroupIndex (`${headerGroup.id}:${headerGroup.headers.map((header) => `${header.id}:${header.colSpan}`).join('|')}`)}
		{@const visibleHeaders = headerGroup.headers.filter((header) => header.colSpan > 0)}
		<tr class="h-9" style={headerRowStyle()}>
			{#if view.isRowSelectionEnabled}
				<th
					scope="col"
					class={cn(
						'h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 text-center align-middle leading-5 font-medium',
						isVirtual && 'items-center justify-center'
					)}
					style={selectionHeaderStyle()}
				>
					{#if shouldRenderSelectionCheckbox(headerGroupIndex)}
						<input
							type="checkbox"
							aria-label="Select all rows"
							class="table-checkbox mx-auto block size-4"
							checked={view.allRowsSelectionState === true}
							indeterminate={view.allRowsSelectionState === 'indeterminate'}
							onchange={(e) => table.toggleAllRowsSelected(e.currentTarget.checked)}
						/>
					{/if}
				</th>
			{/if}
			{#each visibleHeaders as header, headerIndex (`${header.id}:${view.getHeaderSection(header) ?? ''}:${header.colSpan}:${header.column.getIsVisible()}`)}
				{@const meta = getColumnMeta(header.column.columnDef)}
				{@const sortDirection = headerSortDirection(header)}
				{@const continuesInNextFragment =
					visibleHeaders[headerIndex + 1]?.column.id === header.column.id}
				<th
					scope="col"
					class={cn(
						'relative h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 align-middle leading-5 font-medium',
						isVirtual && 'items-center',
						isVirtual && justifyClass(meta?.align),
						alignClass(meta?.align)
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
									justifyClass(meta?.align),
									sortButtonDirectionClass(meta?.align)
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
					<!-- A group split by pinning renders as adjacent fragments; skip the
					     divider between them so the group reads as one continuous header. -->
					{#if header.column.getCanResize() && !continuesInNextFragment}
						<div
							aria-hidden="true"
							class={resizeHandleClass(headerIndex, visibleHeaders.length)}
							style={resizeHandleStyle(table, header, view.columnResizing)}
							ondblclick={() => header.column.resetSize()}
							onmousedown={header.getResizeHandler()}
							ontouchstart={header.getResizeHandler()}
						></div>
					{/if}
				</th>
			{/each}
			{#if !isVirtual && !hasGrowColumn}
				<th aria-hidden="true" class="h-9 border-b border-surface-3 bg-surface-2 p-0"></th>
			{/if}
		</tr>
	{/each}
</thead>
