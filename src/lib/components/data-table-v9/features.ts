import {
	tableFeatures,
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
	columnResizingFeature
});

export type DataTableFeatures = typeof dataTableFeatures;
