import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ColumnFiltersState } from '@tanstack/svelte-table';
import { changedFilterIds, FilterRevisions } from './filter-revisions.svelte';
import { DebouncedFilterEdits } from '../../utils/debounced-filter-edit.svelte';

describe('changedFilterIds', () => {
	const range = [10, 100];

	it('lists added, removed and changed filters', () => {
		const prev: ColumnFiltersState = [
			{ id: 'name', value: 'old' },
			{ id: 'size', value: range }
		];
		const next: ColumnFiltersState = [
			{ id: 'size', value: range },
			{ id: 'status', value: ['Active'] }
		];
		expect(changedFilterIds(prev, next).sort()).toEqual(['name', 'status']);
	});

	it('compares values by reference', () => {
		expect(
			changedFilterIds([{ id: 'size', value: range }], [{ id: 'size', value: [10, 100] }])
		).toEqual(['size']);
	});

	it('reports nothing for the same state', () => {
		const state: ColumnFiltersState = [{ id: 'name', value: 'old' }];
		expect(changedFilterIds(state, state)).toEqual([]);
		expect(changedFilterIds(state, [{ id: 'name', value: 'old' }])).toEqual([]);
	});
});

describe('FilterRevisions', () => {
	it('counts changes per column', () => {
		const revisions = new FilterRevisions();
		expect(revisions.get('name')).toBe(0);
		revisions.bump(['name']);
		revisions.bump(['name', 'size']);
		expect(revisions.get('name')).toBe(2);
		expect(revisions.get('size')).toBe(1);
	});
});

describe('a pending edit based on the filter revision', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	/** A column filter the app changes from outside, with the revision createTable keeps. */
	function trackedFilter(initial: string | undefined) {
		const revisions = new FilterRevisions();
		let value = initial;
		return {
			value: () => value,
			revision: () => revisions.get('name'),
			set: (next: string | undefined) => {
				if (!Object.is(next, value)) revisions.bump(['name']);
				value = next;
			}
		};
	}

	it('stays stale when the filter is cleared and set back to its old value', () => {
		const filter = trackedFilter('old');
		const edits = new DebouncedFilterEdits<string>(300);

		edits.edit('name', filter.revision(), () => 'typed', filter.revision, filter.set);
		filter.set(undefined); // app resets...
		filter.set('old'); // ...and restores saved filters within the debounce

		expect(edits.get('name', filter.revision())).toBeUndefined();
		vi.advanceTimersByTime(300);
		expect(filter.value()).toBe('old');
	});

	it('still commits when nothing changed the filter', () => {
		const filter = trackedFilter('old');
		const edits = new DebouncedFilterEdits<string>(300);

		edits.edit('name', filter.revision(), () => 'typed', filter.revision, filter.set);
		vi.advanceTimersByTime(300);
		expect(filter.value()).toBe('typed');
	});
});
