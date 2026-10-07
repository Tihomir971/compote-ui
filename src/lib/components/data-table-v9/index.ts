export { createDataTableColumnHelper } from './column-helper';
export { createTable } from './create-table.svelte';
export { renderComponent, renderSnippet, FlexRender } from '@tanstack/svelte-table';
export { default as Root } from './data-table.svelte';
export { default as Title } from './data-table-title.svelte';
export { default as Toolbar } from './toolbar/data-table-toolbar.svelte';
export { default as ColumnFilter } from './toolbar/data-table-column-filter.svelte';
export { default as ColumnVisibility } from './toolbar/data-table-column-visibility.svelte';
export { default as Search } from './toolbar/data-table-search.svelte';
export { default as Refresh } from './toolbar/data-table-refresh.svelte';

// Building blocks for filter UI outside the toolbar and header popups (e.g. a facet panel):
// the same editors, pending-edit handling and select options the Funnel uses.
export { default as ColumnFilterEditor } from './filter-editors/column-filter-editor.svelte';
export { ColumnFilterEditing } from './column-filter-editing.svelte';
export { filterKindFor, getColumnFilterKind } from './column-filter-kind';
export { getColumnLabel } from './data-table-utils';
export { EMPTY_SELECT_VALUE, selectFilterOptions } from '../../utils/select-filter';

export type { CreateDataTableOptions, DataTableInstance } from './create-table.svelte';
export type { ColumnFilterEditingOptions, FilterableColumn } from './column-filter-editing.svelte';
export type { ColumnFilterKind } from './column-filter-kind';
export type { SelectFilterOption, SelectFilterValue } from '../../utils/select-filter';
export type {
	DataTableAlign,
	DataTableAccessorFnColumn,
	DataTableAccessorKeyColumn,
	DataTableColumn,
	DataTableColumnBase,
	DataTableColumnInstance,
	DataTableColumnOptions,
	DataTableColumnType,
	DataTableCellPropsResolver,
	DataTableCellRenderProps,
	DataTableGroupColumn,
	DataTableLeafColumnBase,
	DataTableLeafColumn
} from './types';
