import type { RowData } from '@tanstack/svelte-table';
import type { Component } from 'svelte';
import type { DataTableInstance } from '../data-table-utils';
import type { DataTableExportData, DataTableExportScope } from './export-data';

export type DataTableExportContext<T extends RowData> = {
	table: DataTableInstance<T>;
	scope: DataTableExportScope;
	/** File name without extension. */
	filename: string;
	/**
	 * The columns and cells to write. Lazy: an exporter that exports on the server only needs
	 * `table` (its sorting, filters and visible columns) and need not call it.
	 */
	getData: () => DataTableExportData;
};

/** One file format `DataTable.Export` offers. */
export type DataTableExporter = {
	id: string;
	label: string;
	icon?: Component;
	/** If it returns a promise, the Export trigger stays busy until it settles. */
	export: <T extends RowData>(context: DataTableExportContext<T>) => void | Promise<unknown>;
};
