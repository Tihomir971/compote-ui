import { describe, expect, it } from 'vitest';
import { formatDateCell } from './date-cell';
import { matchesDateRange, resolveDateRange } from '#lib/utils/date-filter';

// en-CA formats a date as YYYY-MM-DD, so the shown day is easy to compare with a filter bound.
const LOCALE = 'en-CA';

/** Whether a cell shown in `timeZone` passes a single-day filter on `day`. */
function filteredOn(value: unknown, day: string, timeZone: string) {
	return matchesDateRange(value, resolveDateRange([day, day]), timeZone);
}

describe('formatDateCell', () => {
	it('shows a date-only value on its own day, even west of UTC', () => {
		const zone = { timeZone: 'America/Los_Angeles' };
		expect(formatDateCell('2024-03-15', 'date', LOCALE, zone)).toBe('2024-03-15');
	});

	it('shows an instant on the day it falls in the display zone', () => {
		const instant = '2024-03-15T02:00:00Z';
		expect(formatDateCell(instant, 'date', LOCALE, { timeZone: 'America/New_York' })).toBe(
			'2024-03-14'
		);
		expect(formatDateCell(instant, 'date', LOCALE, { timeZone: 'Europe/Belgrade' })).toBe(
			'2024-03-15'
		);
	});

	it('formats the time of an instant in the display zone', () => {
		expect(
			formatDateCell('2024-03-15T02:00:00Z', 'time', LOCALE, {
				timeZone: 'America/New_York',
				hourCycle: 'h23'
			})
		).toBe('22:00');
	});

	it('returns undefined for values it cannot read', () => {
		expect(formatDateCell('2024-02-30', 'date', LOCALE)).toBeUndefined();
		expect(formatDateCell(new Date('nope'), 'date', LOCALE)).toBeUndefined();
	});
});

describe('date cells show the day they are filtered by', () => {
	const cases: { value: unknown; timeZone: string }[] = [
		{ value: '2024-03-15', timeZone: 'America/Los_Angeles' },
		{ value: '2024-03-15', timeZone: 'Asia/Tokyo' },
		{ value: '2024-03-15T02:00:00Z', timeZone: 'America/New_York' },
		{ value: '2024-03-15T23:30:00+01:00', timeZone: 'Asia/Tokyo' },
		{ value: new Date(Date.UTC(2024, 2, 10, 5, 30)), timeZone: 'America/New_York' },
		{ value: '2024-11-04T04:30:00Z', timeZone: 'America/New_York' }
	];

	for (const { value, timeZone } of cases) {
		it(`${String(value instanceof Date ? value.toISOString() : value)} in ${timeZone}`, () => {
			const shown = formatDateCell(value, 'date', LOCALE, { timeZone });
			expect(shown).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			expect(filteredOn(value, shown!, timeZone)).toBe(true);
		});
	}
});
