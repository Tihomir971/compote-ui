import type { ColumnFiltersState } from '@tanstack/svelte-table';

/**
 * A per-column counter that goes up on every change to that column's filter value. Unlike
 * the value itself it never returns to an earlier state, so a filter cleared and then set
 * back to the same value still reads as changed (the ABA case a value comparison misses).
 */
export class FilterRevisions {
	// Raw record replaced on change: reads in templates/deriveds stay reactive.
	#revisions = $state.raw<Record<string, number>>({});

	get(columnId: string): number {
		return this.#revisions[columnId] ?? 0;
	}

	bump(columnIds: string[]): void {
		if (columnIds.length === 0) return;
		const next = { ...this.#revisions };
		for (const id of columnIds) next[id] = (next[id] ?? 0) + 1;
		this.#revisions = next;
	}
}

/** Ids of the columns whose filter value differs (by reference) between two filter states. */
export function changedFilterIds(prev: ColumnFiltersState, next: ColumnFiltersState): string[] {
	if (prev === next) return [];
	const before: Record<string, unknown> = Object.create(null);
	const after: Record<string, unknown> = Object.create(null);
	for (const filter of prev) before[filter.id] = filter.value;
	for (const filter of next) after[filter.id] = filter.value;
	const ids = Object.keys({ ...before, ...after });
	return ids.filter((id) => !Object.is(before[id], after[id]));
}

const registry = new WeakMap<object, FilterRevisions>();

/** Links a table to its filter revisions (done by `createTable`). */
export function registerFilterRevisions(table: object, revisions: FilterRevisions): void {
	registry.set(table, revisions);
}

/** The filter revisions of a table made by `createTable`; undefined for any other table. */
export function getFilterRevisions(table: object): FilterRevisions | undefined {
	return registry.get(table);
}
