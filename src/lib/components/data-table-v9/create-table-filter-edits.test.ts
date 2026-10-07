import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'svelte/server';
import DataTableFixture from '../../../test-fixtures/data-table-fixture.svelte';
import { ColumnFilterEditing } from './column-filter-editing.svelte';
import type { DataTableInstance } from './create-table.svelte';

type Row = { name: string; status: string };

/**
 * Creates a real compote table inside a component, as an app would. `whileMounted` runs
 * before the component is destroyed — SSR destroys it as soon as rendering finishes.
 */
function renderTable(whileMounted?: (table: DataTableInstance<Row>) => void) {
	let table: DataTableInstance<Row> | undefined;
	// `render` is lazy: reading `body` is what runs (and then destroys) the component.
	void render(DataTableFixture<Row>, {
		props: {
			options: {
				data: [
					{ name: 'Ada', status: 'open' },
					{ name: 'Bob', status: 'closed' }
				],
				columns: [
					{ accessorKey: 'name', header: 'Name', type: 'text' },
					{ accessorKey: 'status', header: 'Status', type: 'select' }
				]
			},
			onTable: (created) => {
				table = created;
				whileMounted?.(created);
			}
		}
	}).body;
	if (!table) throw new Error('fixture did not create a table');
	return table;
}

/** A table with a `status` filter applied and an unfiltered `name` column. */
function filteredTable() {
	const table = renderTable();
	table.getColumn('status')!.setFilterValue(['open']);
	return {
		table,
		name: table.getColumn('name')!,
		editing: new ColumnFilterEditing({ table: () => table })
	};
}

describe('createTable and pending filter edits', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('commits a pending edit when nothing resets the filters', () => {
		const { name, editing } = filteredTable();

		editing.editText(name, 'ada');
		vi.advanceTimersByTime(300);
		expect(name.getFilterValue()).toBe('ada');
	});

	it('resetColumnFilters cancels a pending edit on a column without a filter', () => {
		const { table, name, editing } = filteredTable();

		editing.editText(name, 'ada');
		table.resetColumnFilters();

		vi.advanceTimersByTime(300);
		expect(name.getFilterValue()).toBeUndefined();
		expect(table.atoms.columnFilters.get()).toEqual([]);
	});

	it('reset cancels a pending edit on a column without a filter', () => {
		const { table, name, editing } = filteredTable();

		editing.editText(name, 'ada');
		table.reset();

		vi.advanceTimersByTime(300);
		expect(name.getFilterValue()).toBeUndefined();
		expect(table.atoms.columnFilters.get()).toEqual([]);
	});

	it('cancels pending edits when the component that created the table is destroyed', () => {
		const table = renderTable((mounted) => {
			new ColumnFilterEditing({ table: () => mounted }).editText(mounted.getColumn('name')!, 'ada');
		});

		vi.advanceTimersByTime(300);
		expect(table.getColumn('name')!.getFilterValue()).toBeUndefined();
	});
});
