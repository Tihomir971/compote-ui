import { describe, expect, it } from 'vitest';
import { CalendarDate } from '@internationalized/date';
import { isEmptyDateRange, matchesDateRange, resolveDateRange } from './date-filter';

const day = (iso: string) => {
	const [y, m, d] = iso.split('-').map(Number);
	return new CalendarDate(y, m, d);
};

describe('resolveDateRange', () => {
	it('reads both bounds as calendar dates', () => {
		const range = resolveDateRange(['2024-03-01', '2024-03-31']);
		expect(range.from?.toString()).toBe('2024-03-01');
		expect(range.to?.toString()).toBe('2024-03-31');
	});

	it('leaves an empty bound open', () => {
		expect(resolveDateRange([undefined, '2024-03-31']).from).toBeUndefined();
		expect(resolveDateRange(['2024-03-01']).to).toBeUndefined();
	});

	it('swaps a reversed range', () => {
		const range = resolveDateRange(['2024-03-31', '2024-03-01']);
		expect([range.from?.toString(), range.to?.toString()]).toEqual(['2024-03-01', '2024-03-31']);
	});

	it('drops invalid bounds instead of throwing', () => {
		expect(resolveDateRange(['2024-02-30', 'soon'])).toEqual({ from: undefined, to: undefined });
		expect(resolveDateRange(['2024-03-15T10:00:00Z', 20240315])).toEqual({
			from: undefined,
			to: undefined
		});
	});

	it('always returns a range, so the table never falls back to the raw value', () => {
		for (const input of [undefined, null, 'x', {}, []]) {
			expect(resolveDateRange(input)).toEqual({});
		}
	});
});

describe('isEmptyDateRange', () => {
	it('is empty when no bound is usable', () => {
		expect(isEmptyDateRange(undefined)).toBe(true);
		expect(isEmptyDateRange([])).toBe(true);
		expect(isEmptyDateRange([undefined, undefined])).toBe(true);
		expect(isEmptyDateRange(['2024-02-30', ''])).toBe(true);
	});

	it('is not empty with one usable bound', () => {
		expect(isEmptyDateRange([undefined, '2024-03-01'])).toBe(false);
	});
});

describe('matchesDateRange', () => {
	const march15 = { from: day('2024-03-15'), to: day('2024-03-15') };

	it('includes both bounds', () => {
		const range = { from: day('2024-03-10'), to: day('2024-03-20') };
		expect(matchesDateRange('2024-03-10', range, 'UTC')).toBe(true);
		expect(matchesDateRange('2024-03-20', range, 'UTC')).toBe(true);
		expect(matchesDateRange('2024-03-09', range, 'UTC')).toBe(false);
		expect(matchesDateRange('2024-03-21', range, 'UTC')).toBe(false);
	});

	it('handles open-ended ranges', () => {
		expect(matchesDateRange('1999-01-01', { to: day('2024-03-15') }, 'UTC')).toBe(true);
		expect(matchesDateRange('2099-01-01', { from: day('2024-03-15') }, 'UTC')).toBe(true);
	});

	it('compares a date-only cell as its own calendar date, even west of UTC', () => {
		expect(matchesDateRange('2024-03-15', march15, 'America/Los_Angeles')).toBe(true);
	});

	it('judges an instant by the day it shows in the display zone', () => {
		// 02:00 UTC on the 15th is still the evening of the 14th in New York.
		const instant = '2024-03-15T02:00:00Z';
		expect(matchesDateRange(instant, march15, 'America/New_York')).toBe(false);
		expect(
			matchesDateRange(
				instant,
				{ from: day('2024-03-14'), to: day('2024-03-14') },
				'America/New_York'
			)
		).toBe(true);
		expect(matchesDateRange(instant, march15, 'Europe/Belgrade')).toBe(true);
		expect(matchesDateRange(new Date(instant), march15, 'Europe/Belgrade')).toBe(true);
	});

	it('ends a 23-hour DST day at the next calendar midnight, not 24 hours after it started', () => {
		// 2024-03-10 in New York starts at 05:00Z (EST) and the next day at 04:00Z (EDT).
		const march10 = { from: day('2024-03-10'), to: day('2024-03-10') };
		const zone = 'America/New_York';
		expect(matchesDateRange('2024-03-10T05:00:00Z', march10, zone)).toBe(true); // 00:00 EST
		expect(matchesDateRange('2024-03-11T03:59:59Z', march10, zone)).toBe(true); // 23:59:59 EDT
		expect(matchesDateRange('2024-03-11T04:00:00Z', march10, zone)).toBe(false); // 00:00 next day
		// Start + 24h would reach 05:00Z and wrongly keep 00:30 on the 11th.
		expect(matchesDateRange('2024-03-11T04:30:00Z', march10, zone)).toBe(false);
	});

	it('keeps the whole 25-hour day when clocks go back', () => {
		// 2024-11-03 in New York runs from 04:00Z (EDT) to 05:00Z the next day (EST).
		const nov3 = { from: day('2024-11-03'), to: day('2024-11-03') };
		const zone = 'America/New_York';
		expect(matchesDateRange('2024-11-04T04:30:00Z', nov3, zone)).toBe(true); // 23:30 EST
		expect(matchesDateRange('2024-11-04T05:00:00Z', nov3, zone)).toBe(false); // 00:00 next day
	});

	it('never matches an empty or unreadable cell', () => {
		for (const value of [null, undefined, '', 'n/a', '2024-02-30', new Date('nope')]) {
			expect(matchesDateRange(value, {}, 'UTC')).toBe(false);
		}
	});
});
