import { DebouncedFilterEdits } from '#lib/utils/debounced-filter-edit.svelte';
import { mergeRangeFilter, rangeBounds, type PendingRange } from '#lib/utils/range-filter';
import { getFilterRevisions } from './filter-revisions.svelte';

/** The slice of a TanStack column the filter editors read and write. */
export type FilterableColumn = {
	id: string;
	getFilterValue(): unknown;
	setFilterValue(value: unknown): void;
};

export type ColumnFilterEditingOptions = {
	/** The table the edited columns belong to; read on every access so it may change. */
	table: () => object;
	/**
	 * Whether `columnId` still has an editor. An editor torn down by an outside change can
	 * still emit — Ark's NumberInput commits the typed number on the blur its unmount
	 * triggers — and that must not write back a filter the app just cleared.
	 */
	isActive?: (columnId: string) => boolean;
};

/**
 * The debounced edits pending on one table's filters. Shared by every component that edits
 * them (the toolbar filter, each header filter), so the latest edit to a column wins no
 * matter where it was made, and cancelling reaches edits made from any of them.
 */
class PendingFilterEdits {
	text = new DebouncedFilterEdits<string>();
	range = new DebouncedFilterEdits<PendingRange>();
}

const registry = new WeakMap<object, PendingFilterEdits>();

function pendingEdits(table: object): PendingFilterEdits {
	let edits = registry.get(table);
	if (!edits) {
		edits = new PendingFilterEdits();
		registry.set(table, edits);
	}
	return edits;
}

/** Drops every pending filter edit on `table` without committing, whichever host made it. */
export function cancelPendingFilterEdits(table: object): void {
	const edits = registry.get(table);
	edits?.text.cancelAll();
	edits?.range.cancelAll();
}

/**
 * One host's access to a table's pending filter edits (see PendingFilterEdits). The edits
 * live with the table, not with the host or its editors, so an edit still commits after its
 * editor unmounts with a closing popover.
 *
 * A control shows its pending edit if there is one, otherwise the column's live filter
 * value — so a filter changed from outside (the app calling setFilterValue /
 * setColumnFilters / resetColumnFilters) never leaves a stale value in the inputs, an edit
 * pending during that change is dropped rather than re-applied, and committing one range
 * bound never restores the other's old value.
 */
export class ColumnFilterEditing {
	#table: () => object;
	#isActive: (columnId: string) => boolean;

	constructor(options: ColumnFilterEditingOptions) {
		this.#table = options.table;
		this.#isActive = options.isActive ?? (() => true);
	}

	get #edits(): PendingFilterEdits {
		return pendingEdits(this.#table());
	}

	/**
	 * What an edit is based on: the column's filter revision, which only ever goes up, so a
	 * filter cleared and set back to its old value still makes the edit stale. Tables not
	 * made by compote's createTable have no revisions; fall back to the filter value.
	 */
	#base(column: FilterableColumn): unknown {
		const revisions = getFilterRevisions(this.#table());
		return revisions ? revisions.get(column.id) : column.getFilterValue();
	}

	textValue(column: FilterableColumn): string {
		const value = column.getFilterValue();
		return (
			this.#edits.text.get(column.id, this.#base(column)) ??
			(typeof value === 'string' ? value : '')
		);
	}

	editText(column: FilterableColumn, value: string): void {
		if (!this.#isActive(column.id)) return;
		this.#edits.text.edit(
			column.id,
			this.#base(column),
			() => value,
			() => this.#base(column),
			(text) => column.setFilterValue(text || undefined)
		);
	}

	rangeBound(column: FilterableColumn, which: 'min' | 'max'): number | null {
		const pending = this.#edits.range.get(column.id, this.#base(column));
		if (pending && which in pending) return pending[which] ?? null;
		return rangeBounds(column.getFilterValue())[which === 'min' ? 0 : 1] ?? null;
	}

	editRange(column: FilterableColumn, which: 'min' | 'max', value: number | null): void {
		if (!this.#isActive(column.id)) return;
		this.#edits.range.edit(
			column.id,
			this.#base(column),
			(pending) => ({ ...pending, [which]: value }),
			() => this.#base(column),
			(pending) => column.setFilterValue(mergeRangeFilter(column.getFilterValue(), pending))
		);
	}

	/** Drops the pending edits for one column without committing them. */
	cancel(columnId: string): void {
		this.#edits.text.cancel(columnId);
		this.#edits.range.cancel(columnId);
	}

	/** Drops every pending edit on the table without committing — including other hosts'. */
	cancelAll(): void {
		cancelPendingFilterEdits(this.#table());
	}
}
