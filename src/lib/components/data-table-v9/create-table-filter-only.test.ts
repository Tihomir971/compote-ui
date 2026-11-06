import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import DataTableFixture from '../../../test-fixtures/data-table-fixture.svelte';
import type { CreateDataTableOptions, DataTableInstance } from './create-table.svelte';

type Row = { name: string; brand: string };

/** A real table with a filter-only `brand` column, created inside a component as an app would. */
function renderTable(initialState?: CreateDataTableOptions<Row>['initialState']) {
	let table: DataTableInstance<Row> | undefined;
	void render(DataTableFixture<Row>, {
		props: {
			options: {
				data: [
					{ name: 'Ada', brand: 'Acme' },
					{ name: 'Bob', brand: 'Bosch' }
				],
				columns: [
					{ accessorKey: 'name', header: 'Name', type: 'text' },
					{ accessorKey: 'brand', header: 'Brand', type: 'select', filterOnly: true }
				],
				initialState
			},
			onTable: (created) => {
				table = created;
			}
		}
	}).body;
	if (!table) throw new Error('fixture did not create a table');
	return table;
}

const brandVisible = (table: DataTableInstance<Row>) => table.getColumn('brand')!.getIsVisible();

describe('createTable and filter-only columns', () => {
	it('starts hidden, even when the initial visibility shows it', () => {
		expect(brandVisible(renderTable())).toBe(false);
		expect(brandVisible(renderTable({ columnVisibility: { brand: true } }))).toBe(false);
	});

	it('stays hidden through show all, hide all and resets', () => {
		const table = renderTable();
		table.toggleAllColumnsVisible(true);
		expect(brandVisible(table)).toBe(false);
		table.toggleAllColumnsVisible(false);
		expect(brandVisible(table)).toBe(false);
		table.resetColumnVisibility(true);
		expect(brandVisible(table)).toBe(false);
		table.getColumn('brand')!.toggleVisibility(true);
		expect(brandVisible(table)).toBe(false);
	});

	it('leaves other columns to the visibility writes', () => {
		const table = renderTable();
		table.toggleAllColumnsVisible(false);
		expect(table.getColumn('name')!.getIsVisible()).toBe(false);
		table.toggleAllColumnsVisible(true);
		expect(table.getColumn('name')!.getIsVisible()).toBe(true);
	});

	it('stays hidden through a full reset when it was added after creation', () => {
		const table = renderTable();
		// A column added later has no entry in the creation-time state the reset restores.
		delete table.initialState.columnVisibility!.brand;
		table.reset();
		expect(brandVisible(table)).toBe(false);
	});

	it('keeps the state unchanged when a write only tries to show it', () => {
		// Same reference = no atom change, so `onColumnVisibilityChange` is not notified (the
		// subscription itself is gone by now: SSR destroys the component after rendering).
		const table = renderTable();
		const before = table.atoms.columnVisibility.get();
		table.toggleAllColumnsVisible(true);
		expect(table.atoms.columnVisibility.get()).toBe(before);
		table.toggleAllColumnsVisible(false);
		expect(table.atoms.columnVisibility.get()).not.toBe(before);
	});

	it('hides a column whose id is `__proto__`', () => {
		let table: DataTableInstance<Row> | undefined;
		void render(DataTableFixture<Row>, {
			props: {
				options: {
					data: [{ name: 'Ada', brand: 'Acme' }],
					columns: [
						{ accessorKey: 'name', header: 'Name' },
						{ id: '__proto__', accessorFn: (row) => row.brand, header: 'Odd', filterOnly: true }
					]
				},
				onTable: (created) => {
					table = created;
				}
			}
		}).body;
		table!.toggleAllColumnsVisible(true);
		expect(table!.getColumn('__proto__')!.getIsVisible()).toBe(false);
	});

	it('still filters the rows', () => {
		const table = renderTable();
		table.getColumn('brand')!.setFilterValue(['Bosch']);
		expect(table.getFilteredRowModel().rows.map((r) => r.original.name)).toEqual(['Bob']);
	});
});
