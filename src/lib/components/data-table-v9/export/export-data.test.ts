import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import DataTableFixture from '../../../../test-fixtures/data-table-fixture.svelte';
import type { CreateDataTableOptions, DataTableInstance } from '../create-table.svelte';
import { getExportData, getExportRows } from './export-data';

type Row = {
	name?: string;
	amount: number | string;
	team: string;
	stats: { n: number };
};

const data: Row[] = [
	{ name: 'Ada', amount: 1234.5, team: 'A', stats: { n: 3 } },
	{ name: 'Bob', amount: -5, team: 'B', stats: { n: 1 } },
	{ name: undefined, amount: '42', team: 'A', stats: { n: 2 } }
];

/** Creates a real compote table inside a component, as an app would. */
function createTable(options: Partial<CreateDataTableOptions<Row>>) {
	let table: DataTableInstance<Row> | undefined;
	void render(DataTableFixture<Row>, {
		props: {
			options: { data, columns: [], ...options },
			onTable: (created) => (table = created)
		}
	}).body;
	if (!table) throw new Error('fixture did not create a table');
	return table;
}

const headers = (table: DataTableInstance<Row>) =>
	getExportData(table, 'filtered').columns.map((column) => column.header);
const texts = (table: DataTableInstance<Row>, scope: 'filtered' | 'selected' = 'filtered') =>
	getExportData(table, scope).rows.map((cells) => cells.map((cell) => cell.text));

describe('getExportData columns', () => {
	it('skips hidden, action and enableExport: false columns', () => {
		const table = createTable({
			columns: [
				{ accessorKey: 'name', header: 'Name' },
				{ accessorKey: 'team', header: 'Team' },
				{ accessorKey: 'amount', header: 'Amount', enableExport: false },
				{ accessorFn: () => null, id: 'actions', header: 'Actions', type: 'action' }
			],
			initialState: { columnVisibility: { team: false } }
		});
		expect(headers(table)).toEqual(['Name']);
	});

	it('keeps an action column that opts in', () => {
		const table = createTable({
			columns: [{ accessorKey: 'name', header: 'Name', type: 'action', enableExport: true }]
		});
		expect(headers(table)).toEqual(['Name']);
	});

	it('follows the pinned column order the table shows', () => {
		const table = createTable({
			columns: [
				{ accessorKey: 'name', header: 'Name', pinned: 'right' },
				{ accessorKey: 'team', header: 'Team' },
				{ accessorKey: 'amount', header: 'Amount', pinned: 'left' }
			]
		});
		expect(headers(table)).toEqual(['Amount', 'Team', 'Name']);
	});

	it('names a grouped column after its group', () => {
		const table = createTable({
			columns: [
				{
					header: 'Person',
					columns: [
						{ accessorKey: 'name', header: 'Name' },
						{ accessorKey: 'team', header: 'Team' }
					]
				}
			]
		});
		expect(headers(table)).toEqual(['Person / Name', 'Person / Team']);
	});
});

describe('getExportData cells', () => {
	it('writes the text the table shows, with empty cells left blank', () => {
		const table = createTable({
			columns: [
				{ accessorKey: 'name', header: 'Name' },
				{ accessorKey: 'amount', header: 'Amount', type: 'number', formatLocale: 'en-US' }
			]
		});
		expect(texts(table)).toEqual([
			['Ada', '1,234.5'],
			['Bob', '-5'],
			['', '42']
		]);
		expect(getExportData(table, 'filtered').rows[0]?.[1]?.value).toBe(1234.5);
	});

	it('uses a column cell renderer for the text', () => {
		const table = createTable({
			columns: [{ accessorKey: 'team', header: 'Team', cell: (value) => `Team ${value}` }]
		});
		expect(texts(table)[0]).toEqual(['Team A']);
		expect(getExportData(table, 'filtered').columns[0]?.hasCustomCell).toBe(true);
	});

	it('formats exportValue output by the column type', () => {
		const table = createTable({
			columns: [
				{
					accessorKey: 'stats',
					header: 'N',
					type: 'number',
					formatLocale: 'en-US',
					exportValue: (value) => (value as { n: number }).n * 1000
				}
			]
		});
		const { columns, rows } = getExportData(table, 'filtered');
		expect(rows[0]?.[0]).toEqual({ value: 3000, text: '3,000' });
		expect(columns[0]?.hasExportValue).toBe(true);
	});

	it('writes boolean, url and phone cells as the table draws them', () => {
		const table = createTable({
			columns: [
				{
					id: 'flag',
					header: 'Flag',
					type: 'boolean',
					// Ignored by the table for this type, so by the export too.
					cell: () => 'custom',
					accessorFn: (row) => (row.team === 'A' ? row.amount !== -5 : 0)
				},
				{
					id: 'site',
					header: 'Site',
					type: 'url',
					accessorFn: (row) => (row.team === 'A' ? 'https://example.com' : '')
				},
				{
					id: 'tel',
					header: 'Tel',
					type: 'phone',
					accessorFn: (row) => (row.team === 'B' ? '+381601234567' : undefined)
				}
			]
		});
		const { columns, rows } = getExportData(table, 'filtered');
		expect(rows.map((cells) => cells.map((cell) => cell.text))).toEqual([
			['Yes', 'https://example.com', ''],
			// `0` is not a boolean: the table shows `-`.
			['', '', '+381 601234567'],
			['Yes', 'https://example.com', '']
		]);
		expect(columns[0]?.hasCustomCell).toBe(false);
	});

	it('passes the accessor value, not exportValue, to a cell renderer', () => {
		const table = createTable({
			columns: [
				{
					accessorKey: 'stats',
					header: 'N',
					cell: (value) => `n=${(value as { n: number }).n}`,
					exportValue: (value) => (value as { n: number }).n
				}
			]
		});
		expect(getExportData(table, 'filtered').rows[0]?.[0]).toEqual({ value: 3, text: 'n=3' });
	});
});

describe('getExportRows', () => {
	const columns: CreateDataTableOptions<Row>['columns'] = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'team', header: 'Team', type: 'select' }
	];

	it('keeps the table sorting', () => {
		const table = createTable({
			columns,
			initialState: { sorting: [{ id: 'team', desc: true }] }
		});
		expect(texts(table).map((row) => row[1])).toEqual(['B', 'A', 'A']);
	});

	it('exports only selected rows the filter keeps, and counts them the same way', () => {
		const table = createTable({
			columns,
			enableRowSelection: true,
			initialState: {
				rowSelection: { '0': true, '1': true },
				columnFilters: [{ id: 'team', value: ['A'] }]
			}
		});
		expect(getExportRows(table, 'filtered')).toHaveLength(2);
		expect(getExportRows(table, 'selected')).toHaveLength(1);
		expect(texts(table, 'selected')).toEqual([['Ada', 'A']]);
	});
});
