import {
	tableFeatures,
	metaHelper,
	rowSortingFeature,
	rowSelectionFeature,
	columnFilteringFeature,
	columnFacetingFeature,
	globalFilteringFeature,
	columnVisibilityFeature,
	columnPinningFeature,
	columnSizingFeature,
	columnResizingFeature,
	createSortedRowModel,
	createFilteredRowModel,
	createFacetedRowModel,
	createFacetedUniqueValues,
	createFacetedMinMaxValues,
	sortFn_alphanumeric,
	sortFn_basic,
	sortFn_datetime,
	sortFn_text,
	filterFn_arrIncludes,
	filterFn_equals,
	filterFn_inDateRange,
	filterFn_inNumberRange,
	filterFn_includesString,
	filterFn_weakEquals
} from '@tanstack/svelte-table';
import type { DataTableColumnMeta } from './types';

// Fixed feature registry for the data table. Declared once at module scope so the
// reference is stable across instances (v9 requires a stable `features` object).
export const dataTableFeatures = tableFeatures({
	rowSortingFeature,
	rowSelectionFeature,
	columnFilteringFeature,
	columnFacetingFeature,
	globalFilteringFeature,
	columnVisibilityFeature,
	columnPinningFeature,
	columnSizingFeature,
	columnResizingFeature,
	sortedRowModel: createSortedRowModel(),
	filteredRowModel: createFilteredRowModel(),
	facetedRowModel: createFacetedRowModel(),
	facetedUniqueValues: createFacetedUniqueValues(),
	facetedMinMaxValues: createFacetedMinMaxValues(),
	// Only the sort fns `sortFn: 'auto'` can resolve to; `sortFn` is not a public column option.
	sortFns: {
		alphanumeric: sortFn_alphanumeric,
		basic: sortFn_basic,
		datetime: sortFn_datetime,
		text: sortFn_text
	},
	// Only the filter fns the data table uses: the type defaults plus what `filterFn: 'auto'`
	// resolves to for text columns.
	filterFns: {
		arrIncludes: filterFn_arrIncludes,
		equals: filterFn_equals,
		inDateRange: filterFn_inDateRange,
		inNumberRange: filterFn_inNumberRange,
		includesString: filterFn_includesString,
		weakEquals: filterFn_weakEquals
	},
	// Type-only slot: types `columnDef.meta` as DataTableColumnMeta wherever
	// DataTableFeatures flows. Stripped at runtime by constructTable.
	columnMeta: metaHelper<DataTableColumnMeta>()
});

export type DataTableFeatures = typeof dataTableFeatures;
