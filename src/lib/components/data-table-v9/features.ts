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
	columnResizingFeature
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
	// Type-only slot: types `columnDef.meta` as DataTableColumnMeta wherever
	// DataTableFeatures flows. Stripped at runtime by constructTable.
	columnMeta: metaHelper<DataTableColumnMeta>()
});

export type DataTableFeatures = typeof dataTableFeatures;
