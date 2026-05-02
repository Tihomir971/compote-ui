import {
	createCoreRowModel,
	createTable as createTanStackTable,
	functionalUpdate,
	tableFeatures
} from '@tanstack/svelte-table';

import type {
	CellData,
	ColumnDef,
	RowData,
	SvelteTable,
	TableOptions,
	TableState,
	Updater
} from '@tanstack/svelte-table';

import { normalizeDataTableColumns, type DataTableColumnDef } from './cells';

const dataTableFeatures = tableFeatures({});

export type DataTableFeatures = typeof dataTableFeatures;

type DataTableData<TData extends RowData> = ReadonlyArray<TData> | (() => ReadonlyArray<TData>);

export type DataTableOptions<TData extends RowData> = Omit<
	TableOptions<DataTableFeatures, TData>,
	'_features' | 'data' | 'columns'
> & {
	data: DataTableData<TData>;
	columns: DataTableColumnDef<TData>[];
} & Partial<Pick<TableOptions<DataTableFeatures, TData>, '_features'>>;

export type DataTable<TData extends RowData, TSelected = object> = SvelteTable<
	DataTableFeatures,
	TData,
	TSelected
> & {
	setData: (data: ReadonlyArray<TData>) => void;
	updateData: (updater: Updater<ReadonlyArray<TData>>) => void;
};

class DataTableState<TData extends RowData, TSelected = object> {
	#options = $state.raw<DataTableOptions<TData>>({} as DataTableOptions<TData>);
	#table: SvelteTable<DataTableFeatures, TData, TSelected>;
	#columns: ColumnDef<DataTableFeatures, TData, CellData>[];

	constructor(
		options: DataTableOptions<TData>,
		selector?: (state: TableState<DataTableFeatures>) => TSelected
	) {
		this.#options = options;
		this.#columns = normalizeDataTableColumns(options.columns);
		const getData = () => this.#getData();

		this.#table = createTanStackTable(
			{
				...options,
				columns: this.#columns,
				get data() {
					return getData();
				},
				_features: options._features ?? dataTableFeatures,
				_rowModels: {
					coreRowModel: createCoreRowModel(),
					...options._rowModels
				}
			},
			selector
		);
	}

	get table(): DataTable<TData, TSelected> {
		const table = this.#table as DataTable<TData, TSelected>;

		table.setData = (data) => {
			this.setData(data);
		};

		table.updateData = (updater) => {
			this.updateData(updater);
		};

		return table;
	}

	setData(data: ReadonlyArray<TData>): void {
		this.#options = {
			...this.#options,
			data
		} as DataTableOptions<TData>;
	}

	updateData(updater: Updater<ReadonlyArray<TData>>): void {
		this.setData(functionalUpdate(updater, this.#getData()));
	}

	#resolveData(data: DataTableData<TData>): ReadonlyArray<TData> {
		return typeof data === 'function' ? data() : data;
	}

	#getData(): ReadonlyArray<TData> {
		return this.#resolveData(this.#options.data);
	}
}

export function createDataTable<TData extends RowData, TSelected = object>(
	options: DataTableOptions<TData>,
	selector?: (state: TableState<DataTableFeatures>) => TSelected
): DataTable<TData, TSelected> {
	return new DataTableState(options, selector).table;
}
