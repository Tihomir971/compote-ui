import {
	columnFilteringFeature,
	createFilteredRowModel,
	createTable as _createTable,
	filterFns,
	rowSelectionFeature,
	tableFeatures,
	type CellData,
	type ColumnDef,
	type Row,
	type RowData,
	type SvelteTable,
	type TableState
} from '@tanstack/svelte-table';

const _features = tableFeatures({
	rowSelectionFeature,
	columnFilteringFeature
});

export type DtFeatures = typeof _features;
export type DtState = Pick<TableState<DtFeatures>, 'rowSelection'>;
export type DtInstance<T extends RowData> = SvelteTable<DtFeatures, T, DtState>;
export type DtColumn<T extends RowData> = ColumnDef<DtFeatures, T, CellData>;

export type CreateTableOptions<T extends RowData> = {
	data: T[];
	columns: DtColumn<T>[];
	getRowId?: (row: T, index: number, parent?: Row<DtFeatures, T>) => string;
	enableRowSelection?: boolean | ((row: Row<DtFeatures, T>) => boolean);
	enableMultiRowSelection?: boolean;
};

export function createTable<T extends RowData>(options: CreateTableOptions<T>): DtInstance<T> {
	return _createTable(
		{
			_features,
			_rowModels: {
				filteredRowModel: createFilteredRowModel(filterFns)
			},
			get data() {
				return options.data;
			},
			columns: options.columns as ColumnDef<DtFeatures, T, CellData>[],
			getRowId: options.getRowId,
			enableRowSelection: options.enableRowSelection ?? false,
			enableMultiRowSelection: options.enableMultiRowSelection
		},
		(state): DtState => ({
			rowSelection: state.rowSelection
		})
	);
}
