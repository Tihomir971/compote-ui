import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DebouncedFilterEdits } from './debounced-filter-edit.svelte';
import { mergeRangeFilter, type PendingRange } from './range-filter';

/** A column filter value the "app" can change from outside, like table state. */
function filterState(initial: unknown) {
	let value = initial;
	return {
		read: () => value,
		set: (next: unknown) => {
			value = next;
		}
	};
}

describe('DebouncedFilterEdits', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shows the pending edit and commits it after the delay', () => {
		const filter = filterState(undefined);
		const edits = new DebouncedFilterEdits<string>(300);

		edits.edit('name', filter.read(), () => 'ada', filter.read, filter.set);
		expect(edits.get('name', filter.read())).toBe('ada');
		expect(filter.read()).toBeUndefined();

		vi.advanceTimersByTime(300);
		expect(filter.read()).toBe('ada');
		expect(edits.get('name', filter.read())).toBeUndefined();
	});

	it('drops a text edit when the filter is reset during the debounce', () => {
		const filter = filterState('old');
		const edits = new DebouncedFilterEdits<string>(300);

		edits.edit('name', filter.read(), () => 'new', filter.read, filter.set);
		vi.advanceTimersByTime(100);
		filter.set(undefined); // external reset

		expect(edits.get('name', filter.read())).toBeUndefined();
		vi.advanceTimersByTime(300);
		expect(filter.read()).toBeUndefined();
	});

	it('drops a range edit when the filter is reset during the debounce', () => {
		const filter = filterState([10, 100]);
		const edits = new DebouncedFilterEdits<PendingRange>(300);
		const commit = (pending: PendingRange) => filter.set(mergeRangeFilter(filter.read(), pending));

		edits.edit('size', filter.read(), (p) => ({ ...p, min: 20 }), filter.read, commit);
		filter.set(undefined); // external reset

		vi.advanceTimersByTime(300);
		expect(filter.read()).toBeUndefined();
	});

	it('merges edits to both bounds made within one debounce window', () => {
		const filter = filterState(undefined);
		const edits = new DebouncedFilterEdits<PendingRange>(300);
		const commit = (pending: PendingRange) => filter.set(mergeRangeFilter(filter.read(), pending));

		edits.edit('size', filter.read(), (p) => ({ ...p, min: 20 }), filter.read, commit);
		edits.edit('size', filter.read(), (p) => ({ ...p, max: 60 }), filter.read, commit);
		vi.advanceTimersByTime(300);
		expect(filter.read()).toEqual([20, 60]);
	});

	it('starts a fresh edit instead of reviving a stale one', () => {
		const filter = filterState([10, 100]);
		const edits = new DebouncedFilterEdits<PendingRange>(300);
		const commit = (pending: PendingRange) => filter.set(mergeRangeFilter(filter.read(), pending));

		edits.edit('size', filter.read(), (p) => ({ ...p, min: 20 }), filter.read, commit);
		filter.set(undefined); // external reset makes the min edit stale
		edits.edit('size', filter.read(), (p) => ({ ...p, max: 60 }), filter.read, commit);

		vi.advanceTimersByTime(300);
		expect(filter.read()).toEqual([undefined, 60]);
	});

	it('cancels without committing', () => {
		const filter = filterState(undefined);
		const edits = new DebouncedFilterEdits<string>(300);

		edits.edit('name', filter.read(), () => 'ada', filter.read, filter.set);
		edits.cancel('name');
		vi.advanceTimersByTime(300);
		expect(filter.read()).toBeUndefined();
		expect(edits.get('name', filter.read())).toBeUndefined();
	});
});
