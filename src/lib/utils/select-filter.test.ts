import { describe, expect, it } from 'vitest';
import {
	EMPTY_SELECT_VALUE,
	formatSelectValue,
	matchesSelectFilter,
	selectCellValues,
	selectFilterOptions
} from './select-filter';

describe('selectCellValues', () => {
	it('wraps a scalar value', () => {
		expect(selectCellValues('Active')).toEqual(['Active']);
	});

	it('spreads an array value', () => {
		expect(selectCellValues(['Battery', 'Mains'])).toEqual(['Battery', 'Mains']);
	});

	it('collapses every empty shape to a single empty value', () => {
		for (const empty of [null, undefined, '', [], [null, '']]) {
			expect(selectCellValues(empty)).toEqual([EMPTY_SELECT_VALUE]);
		}
	});

	it('keeps each option once per row when an array repeats it', () => {
		expect(selectCellValues(['Battery', 'Battery', 'Mains'])).toEqual(['Battery', 'Mains']);
		// Distinct by filter value: 1 and '1' are the same option.
		expect(selectCellValues([1, '1'])).toEqual([1]);
	});

	it('keeps the string "null" as a regular value', () => {
		expect(selectCellValues('null')).toEqual(['null']);
		expect(selectCellValues(['null'])).toEqual(['null']);
	});
});

describe('matchesSelectFilter', () => {
	it('matches a scalar against the selected options', () => {
		expect(matchesSelectFilter('Active', ['Active', 'Pending'])).toBe(true);
		expect(matchesSelectFilter('Inactive', ['Active'])).toBe(false);
	});

	it('matches an array when any item is selected', () => {
		expect(matchesSelectFilter(['Battery', 'Mains'], ['Mains'])).toBe(true);
		expect(matchesSelectFilter(['Battery'], ['Mains'])).toBe(false);
	});

	it('matches stringified non-string values', () => {
		expect(matchesSelectFilter([1, 2], ['2'])).toBe(true);
	});

	it('matches empty cells with the empty option', () => {
		expect(matchesSelectFilter(null, [EMPTY_SELECT_VALUE])).toBe(true);
		expect(matchesSelectFilter([], [EMPTY_SELECT_VALUE])).toBe(true);
		expect(matchesSelectFilter(['Battery'], [EMPTY_SELECT_VALUE])).toBe(false);
	});

	it('keeps the string "null" and empty cells apart', () => {
		expect(matchesSelectFilter('null', ['null'])).toBe(true);
		expect(matchesSelectFilter('null', [EMPTY_SELECT_VALUE])).toBe(false);
		expect(matchesSelectFilter(null, ['null'])).toBe(false);
	});
});

describe('selectFilterOptions', () => {
	it('sorts by label, puts the empty option last and merges empty keys', () => {
		const facets = new Map<unknown, number>([
			[null, 2],
			['Čokolada', 10],
			['Bombonjera', 2],
			[undefined, 1]
		]);
		expect(selectFilterOptions(facets)).toEqual([
			{ value: 'Bombonjera', label: 'Bombonjera', count: 2 },
			{ value: 'Čokolada', label: 'Čokolada', count: 10 },
			{ value: EMPTY_SELECT_VALUE, label: '(empty)', count: 3 }
		]);
	});
});

describe('selectFilterOptions with the string "null"', () => {
	it('lists "null" as a regular option when there are no empty cells', () => {
		const facets = new Map<unknown, number>([
			['null', 2],
			['Active', 1]
		]);
		expect(selectFilterOptions(facets)).toEqual([
			{ value: 'Active', label: 'Active', count: 1 },
			{ value: 'null', label: 'null', count: 2 }
		]);
	});

	it('keeps "null" and the empty option separate when both exist', () => {
		const facets = new Map<unknown, number>([
			['null', 2],
			[EMPTY_SELECT_VALUE, 3]
		]);
		expect(selectFilterOptions(facets)).toEqual([
			{ value: 'null', label: 'null', count: 2 },
			{ value: EMPTY_SELECT_VALUE, label: '(empty)', count: 3 }
		]);
	});
});

describe('faceting a row with a repeated item', () => {
	it('counts the row once for that option', () => {
		// What TanStack does with getUniqueValues: count every returned value per row.
		const facets = new Map<unknown, number>();
		for (const row of [['Battery', 'Battery'], ['Mains']]) {
			for (const value of selectCellValues(row)) {
				facets.set(value, (facets.get(value) ?? 0) + 1);
			}
		}
		expect(selectFilterOptions(facets)).toEqual([
			{ value: 'Battery', label: 'Battery', count: 1 },
			{ value: 'Mains', label: 'Mains', count: 1 }
		]);
	});
});

describe('formatSelectValue', () => {
	it('joins array items and leaves scalars as they are', () => {
		expect(formatSelectValue(['Battery', 'Mains'])).toBe('Battery, Mains');
		expect(formatSelectValue('Active')).toBe('Active');
	});

	it('shows a repeated item once, skipping empty items', () => {
		expect(formatSelectValue(['Battery', 'Battery', 'Mains'])).toBe('Battery, Mains');
		expect(formatSelectValue(['Battery', null, '', 'Battery'])).toBe('Battery');
	});

	it('returns undefined for empty values', () => {
		expect(formatSelectValue([])).toBeUndefined();
		expect(formatSelectValue([null, ''])).toBeUndefined();
		expect(formatSelectValue('')).toBeUndefined();
		expect(formatSelectValue(null)).toBeUndefined();
	});
});
