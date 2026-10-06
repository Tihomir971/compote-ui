import { describe, expect, it } from 'vitest';
import { mergeRangeFilter, rangeBounds } from './range-filter';

describe('rangeBounds', () => {
	it('reads both bounds of a tuple', () => {
		expect(rangeBounds([1, 5])).toEqual([1, 5]);
		expect(rangeBounds([undefined, 5])).toEqual([undefined, 5]);
	});

	it('has no bounds without a filter value', () => {
		expect(rangeBounds(undefined)).toEqual([undefined, undefined]);
		expect(rangeBounds('5')).toEqual([undefined, undefined]);
	});
});

describe('mergeRangeFilter', () => {
	it('keeps the live other bound when one bound is edited', () => {
		expect(mergeRangeFilter([1, 5], { max: 10 })).toEqual([1, 10]);
	});

	it('does not bring back a bound cleared elsewhere', () => {
		// The filter was reset externally (undefined); editing max must not restore an old min.
		expect(mergeRangeFilter(undefined, { max: 10 })).toEqual([undefined, 10]);
	});

	it('clears a bound set to null', () => {
		expect(mergeRangeFilter([1, 5], { min: null })).toEqual([undefined, 5]);
	});

	it('removes the filter when both bounds end up empty', () => {
		expect(mergeRangeFilter([1, undefined], { min: null })).toBeUndefined();
		expect(mergeRangeFilter(undefined, {})).toBeUndefined();
	});
});
