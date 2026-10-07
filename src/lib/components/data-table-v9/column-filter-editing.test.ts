import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	cancelPendingFilterEdits,
	ColumnFilterEditing,
	type FilterableColumn
} from './column-filter-editing.svelte';
import { FilterRevisions, registerFilterRevisions } from './filter-revisions.svelte';

/** A column whose filter value the "app" can also change from outside. */
function fakeColumn(id: string, initial?: unknown): FilterableColumn & { value: unknown } {
	return {
		id,
		value: initial,
		getFilterValue() {
			return this.value;
		},
		setFilterValue(value: unknown) {
			this.value = value;
		}
	};
}

/**
 * A table with filter revisions, like one made by createTable: every filter write through
 * a column bumps that column's revision, as onColumnFiltersChange does.
 */
function fakeTable() {
	const table = {};
	const revisions = new FilterRevisions();
	registerFilterRevisions(table, revisions);
	function column(id: string, initial?: unknown) {
		const col = fakeColumn(id, initial);
		const set = col.setFilterValue.bind(col);
		col.setFilterValue = (value: unknown) => {
			if (!Object.is(value, col.value)) revisions.bump([id]);
			set(value);
		};
		return col;
	}
	return { table, revisions, column };
}

describe('ColumnFilterEditing', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shows a pending text edit and commits it after the debounce', () => {
		const table = {};
		const editing = new ColumnFilterEditing({ table: () => table });
		const column = fakeColumn('name');

		editing.editText(column, 'ada');
		expect(editing.textValue(column)).toBe('ada');
		expect(column.value).toBeUndefined();

		vi.advanceTimersByTime(300);
		expect(column.value).toBe('ada');
		expect(editing.textValue(column)).toBe('ada');
	});

	it('removes the filter when the text is cleared', () => {
		const table = {};
		const editing = new ColumnFilterEditing({ table: () => table });
		const column = fakeColumn('name', 'ada');

		editing.editText(column, '');
		vi.advanceTimersByTime(300);
		expect(column.value).toBeUndefined();
	});

	it('ignores edits for a column whose editor is gone', () => {
		const table = {};
		const editing = new ColumnFilterEditing({ table: () => table, isActive: () => false });
		const column = fakeColumn('size');

		editing.editRange(column, 'min', 5);
		vi.advanceTimersByTime(300);
		expect(column.value).toBeUndefined();
	});

	it('reads range bounds from the pending edit, then from the live filter', () => {
		const table = {};
		const editing = new ColumnFilterEditing({ table: () => table });
		const column = fakeColumn('size', [10, 100]);

		editing.editRange(column, 'min', 20);
		expect(editing.rangeBound(column, 'min')).toBe(20);
		expect(editing.rangeBound(column, 'max')).toBe(100);

		vi.advanceTimersByTime(300);
		expect(column.value).toEqual([20, 100]);
	});

	it('cancels both kinds of pending edit for one column', () => {
		const table = {};
		const editing = new ColumnFilterEditing({ table: () => table });
		const column = fakeColumn('size');

		editing.editText(column, 'x');
		editing.editRange(column, 'max', 9);
		editing.cancel('size');
		vi.advanceTimersByTime(300);
		expect(column.value).toBeUndefined();
	});

	it('drops an edit when the filter changes and returns to its old value (revisions)', () => {
		const { table, revisions, column: makeColumn } = fakeTable();
		const editing = new ColumnFilterEditing({ table: () => table });
		const column = makeColumn('name', 'old');

		editing.editText(column, 'new');
		// Cleared and set back from outside: same value, but two revisions later.
		revisions.bump(['name']);
		revisions.bump(['name']);

		expect(editing.textValue(column)).toBe('old');
		vi.advanceTimersByTime(300);
		expect(column.value).toBe('old');
	});

	it('drops an edit when the filter is reset from outside during the debounce', () => {
		const { table, column: makeColumn } = fakeTable();
		const editing = new ColumnFilterEditing({ table: () => table });
		const column = makeColumn('name', 'old');

		editing.editText(column, 'new');
		vi.advanceTimersByTime(100);
		column.setFilterValue(undefined); // the app resets the filter

		vi.advanceTimersByTime(300);
		expect(column.value).toBeUndefined();
	});

	it('still commits an edit after the host that made it is gone (popover closed)', () => {
		const table = {};
		const column = fakeColumn('name');
		let host: ColumnFilterEditing | undefined = new ColumnFilterEditing({ table: () => table });

		host.editText(column, 'ada');
		host = undefined;

		vi.advanceTimersByTime(300);
		expect(host).toBeUndefined();
		expect(column.value).toBe('ada');
	});
});

describe('ColumnFilterEditing across hosts on one table', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('lets the latest text edit to a column win, whichever host made it', () => {
		const { table, column: makeColumn } = fakeTable();
		const header = new ColumnFilterEditing({ table: () => table });
		const toolbar = new ColumnFilterEditing({ table: () => table });
		const column = makeColumn('name');

		header.editText(column, 'A');
		vi.advanceTimersByTime(100);
		toolbar.editText(column, 'B');
		expect(header.textValue(column)).toBe('B');

		vi.advanceTimersByTime(300);
		expect(column.value).toBe('B');
	});

	it('merges range bounds edited from different hosts', () => {
		const { table, column: makeColumn } = fakeTable();
		const header = new ColumnFilterEditing({ table: () => table });
		const toolbar = new ColumnFilterEditing({ table: () => table });
		const column = makeColumn('size');

		header.editRange(column, 'min', 10);
		vi.advanceTimersByTime(100);
		toolbar.editRange(column, 'max', 50);

		vi.advanceTimersByTime(300);
		expect(column.value).toEqual([10, 50]);
	});

	it('cancels every host’s pending edits on clear all', () => {
		const { table, column: makeColumn } = fakeTable();
		const header = new ColumnFilterEditing({ table: () => table });
		const toolbar = new ColumnFilterEditing({ table: () => table });
		const existing = makeColumn('status', ['open']);
		const column = makeColumn('name');

		header.editText(column, 'ada');
		// Clear all: cancel pending edits, then reset — which only touches `status`, so the
		// `name` edit would not go stale on its own.
		toolbar.cancelAll();
		existing.setFilterValue(undefined);

		vi.advanceTimersByTime(300);
		expect(column.value).toBeUndefined();
	});

	it('cancels pending edits when the table goes away', () => {
		const { table, column: makeColumn } = fakeTable();
		const header = new ColumnFilterEditing({ table: () => table });
		const column = makeColumn('name');

		header.editText(column, 'ada');
		cancelPendingFilterEdits(table);

		vi.advanceTimersByTime(300);
		expect(column.value).toBeUndefined();
	});
});
