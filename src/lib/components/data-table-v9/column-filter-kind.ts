import type { DataTableColumnMeta, DataTableColumnType } from './types';

/** Which filter editor (and default filterFn) a column type uses. */
export type ColumnFilterKind = 'text' | 'range' | 'boolean' | 'select' | 'date';

/**
 * The filter kind for a column type. The single mapping both the filter editors and the
 * default filterFn follow, so a column never shows an editor its filterFn can't evaluate.
 * `action` columns carry no value and get no filter. `time` stays a text filter until it has
 * its own contract (a time-of-day range has to decide how to cross midnight).
 */
export function filterKindFor(type: DataTableColumnType | undefined): ColumnFilterKind | null {
	switch (type) {
		case 'number':
		case 'currency':
		case 'percent':
			return 'range';
		case 'boolean':
			return 'boolean';
		case 'select':
			return 'select';
		case 'date':
		case 'date-time':
			return 'date';
		case 'action':
			return null;
		default:
			return 'text';
	}
}

/**
 * The filter kind of a table column (from its `type`): the editor `ColumnFilterEditor` shows
 * for it and the filter value shape its default filterFn expects.
 */
export function getColumnFilterKind(column: {
	columnDef: { meta?: DataTableColumnMeta };
}): ColumnFilterKind | null {
	return filterKindFor(column.columnDef.meta?.type);
}
