import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import DataTableFixture from '../../test-fixtures/data-table-fixture.svelte';
import DataTableExport from './data-table-v9/toolbar/data-table-export.svelte';
import { csvExporter } from './data-table-v9/export/csv-exporter';
import type { DataTableExporter } from './data-table-v9/export/types';
import type {
	CreateDataTableOptions,
	DataTableInstance
} from './data-table-v9/create-table.svelte';

type Row = { name: string };

function createTable(options: Partial<CreateDataTableOptions<Row>> = {}) {
	let table: DataTableInstance<Row> | undefined;
	void render(DataTableFixture<Row>, {
		props: {
			options: {
				data: [{ name: 'Ada' }, { name: 'Bob' }],
				columns: [{ accessorKey: 'name', header: 'Name' }],
				...options
			},
			onTable: (created) => (table = created)
		}
	}).body;
	if (!table) throw new Error('fixture did not create a table');
	return table;
}

const otherExporter: DataTableExporter = { id: 'other', label: 'Other', export: () => {} };

/** SSR the Export trigger and return its opening `<button>` tag. */
function renderExport(table: DataTableInstance<Row>, exporters?: DataTableExporter[]) {
	const { body } = render(DataTableExport<Row>, { props: { table, exporters } });
	return body.match(/<button[^>]*>/)?.[0] ?? '';
}

describe('DataTable.Export', () => {
	it('is a plain button for one format and no selected rows', () => {
		const tag = renderExport(createTable(), [csvExporter]);
		expect(tag).toContain('type="button"');
		expect(tag).toContain('aria-label="Export CSV"');
		expect(tag).not.toContain('aria-haspopup');
	});

	it('opens a menu for more than one format', () => {
		const tag = renderExport(createTable(), [csvExporter, otherExporter]);
		expect(tag).toContain('aria-label="Export"');
		expect(tag).toContain('aria-haspopup="menu"');
	});

	it('opens a menu when rows are selected, to choose all or selected rows', () => {
		const table = createTable({
			enableRowSelection: true,
			initialState: { rowSelection: { '0': true } }
		});
		expect(renderExport(table, [csvExporter])).toContain('aria-haspopup="menu"');
	});

	it('stays a plain button when the selected rows are all filtered out', () => {
		const table = createTable({
			enableRowSelection: true,
			initialState: {
				rowSelection: { '0': true },
				columnFilters: [{ id: 'name', value: 'Bob' }]
			}
		});
		expect(renderExport(table, [csvExporter])).not.toContain('aria-haspopup');
	});
});
