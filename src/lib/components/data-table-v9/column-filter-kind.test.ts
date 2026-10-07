import { describe, expect, it } from 'vitest';
import { filterKindFor } from './column-filter-kind';

describe('filterKindFor', () => {
	it('maps numeric types to a range filter', () => {
		expect(filterKindFor('number')).toBe('range');
		expect(filterKindFor('currency')).toBe('range');
		expect(filterKindFor('percent')).toBe('range');
	});

	it('maps boolean and select to their own filters', () => {
		expect(filterKindFor('boolean')).toBe('boolean');
		expect(filterKindFor('select')).toBe('select');
	});

	it('falls back to a text filter for untyped and text-like columns', () => {
		expect(filterKindFor(undefined)).toBe('text');
		expect(filterKindFor('text')).toBe('text');
		expect(filterKindFor('url')).toBe('text');
		expect(filterKindFor('phone')).toBe('text');
		expect(filterKindFor('time')).toBe('text');
	});

	it('maps date and date-time to a calendar-day range filter', () => {
		expect(filterKindFor('date')).toBe('date');
		expect(filterKindFor('date-time')).toBe('date');
	});

	it('gives action columns no filter', () => {
		expect(filterKindFor('action')).toBeNull();
	});
});
