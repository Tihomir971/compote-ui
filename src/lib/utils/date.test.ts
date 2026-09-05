import { describe, expect, it } from 'vitest';
import { CalendarDate, CalendarDateTime, ZonedDateTime } from '@internationalized/date';
import {
	dateValueShape,
	dateValueToDate,
	dateValueToString,
	fromDateValue,
	toDateValue
} from './date';

describe('toDateValue', () => {
	it('parses a date-only string as a calendar date', () => {
		const value = toDateValue('2025-06-15');
		expect(value).toBeInstanceOf(CalendarDate);
		expect(value?.toString()).toBe('2025-06-15');
	});

	it('parses a naive datetime string without attaching a zone', () => {
		const value = toDateValue('2025-06-15T10:30:00');
		expect(value).toBeInstanceOf(CalendarDateTime);
		expect(value?.toString()).toBe('2025-06-15T10:30:00');
	});

	it('parses an offset-bearing string into the requested zone', () => {
		const value = toDateValue('2025-06-15T10:30:00Z', 'America/New_York') as ZonedDateTime;
		expect(value).toBeInstanceOf(ZonedDateTime);
		expect(value.timeZone).toBe('America/New_York');
		// Same instant, rendered in the local zone: 10:30 UTC is 06:30 EDT.
		expect(value.hour).toBe(6);
	});

	it('normalizes a Supabase timestamptz (space separator, bare +00 offset)', () => {
		const value = toDateValue('2025-07-11 10:12:01.982258+00', 'UTC');
		expect(dateValueToString(value!)).toBe('2025-07-11T10:12:01.982Z');
	});

	it('converts a native Date in the given zone', () => {
		const value = toDateValue(new Date('2025-06-15T10:30:00Z'), 'UTC');
		expect(dateValueToString(value!)).toBe('2025-06-15T10:30:00.000Z');
	});

	it('passes a DateValue through untouched', () => {
		const input = new CalendarDate(2025, 6, 15);
		expect(toDateValue(input)).toBe(input);
	});

	it.each([
		['null', null],
		['undefined', undefined],
		['an empty string', ''],
		['a whitespace-only string', '   ']
	])('returns null for %s', (_label, input) => {
		expect(toDateValue(input)).toBeNull();
	});
});

describe('dateValueToString', () => {
	it('emits a plain ISO date for a calendar date', () => {
		expect(dateValueToString(new CalendarDate(2025, 6, 15))).toBe('2025-06-15');
	});

	it('emits an absolute UTC string for a zoned value, whatever its zone', () => {
		const newYork = toDateValue('2025-06-15T10:30:00Z', 'America/New_York')!;
		const tokyo = toDateValue('2025-06-15T10:30:00Z', 'Asia/Tokyo')!;
		expect(dateValueToString(newYork)).toBe('2025-06-15T10:30:00.000Z');
		expect(dateValueToString(tokyo)).toBe(dateValueToString(newYork));
	});
});

describe('dateValueToDate', () => {
	it('resolves a calendar date against the given zone', () => {
		expect(dateValueToDate(new CalendarDate(2025, 6, 15), 'UTC').toISOString()).toBe(
			'2025-06-15T00:00:00.000Z'
		);
	});

	it('ignores the zone argument for an already-zoned value', () => {
		const zoned = toDateValue('2025-06-15T10:30:00Z', 'Asia/Tokyo')!;
		expect(dateValueToDate(zoned, 'UTC').toISOString()).toBe('2025-06-15T10:30:00.000Z');
	});
});

describe('dateValueShape', () => {
	it.each([
		['a string', '2025-06-15', 'string'],
		['an empty string', '', 'string'],
		['a Date', new Date(), 'date'],
		['a DateValue', new CalendarDate(2025, 6, 15), 'date-value']
	])('reports %s', (_label, input, expected) => {
		expect(dateValueShape(input)).toBe(expected);
	});

	it.each([
		['null', null],
		['undefined', undefined]
	])('reports nothing for %s', (_label, input) => {
		expect(dateValueShape(input)).toBeNull();
	});
});

describe('fromDateValue', () => {
	const value = new CalendarDate(2025, 6, 15);

	it('emits a string for the string shape', () => {
		expect(fromDateValue(value, 'string')).toBe('2025-06-15');
	});

	it('emits a Date for the date shape', () => {
		const result = fromDateValue(value, 'date', 'UTC');
		expect(result).toBeInstanceOf(Date);
		expect((result as Date).toISOString()).toBe('2025-06-15T00:00:00.000Z');
	});

	it('emits the DateValue itself for the date-value shape', () => {
		expect(fromDateValue(value, 'date-value')).toBe(value);
	});

	it('emits null regardless of shape', () => {
		expect(fromDateValue(null, 'date')).toBeNull();
	});
});

// The contract the date components rely on: whatever the consumer binds comes
// back in the same notation, so a DB string survives an edit round trip.
describe('string round trip', () => {
	it.each([
		['date column', '2025-06-15', '2025-06-15'],
		['naive timestamp', '2025-06-15T10:30:00', '2025-06-15T10:30:00'],
		['UTC timestamptz', '2025-06-15T10:30:00Z', '2025-06-15T10:30:00.000Z'],
		['offset timestamptz', '2025-06-15T12:30:00+02:00', '2025-06-15T10:30:00.000Z'],
		['Supabase timestamptz', '2025-07-11 10:12:01.982258+00', '2025-07-11T10:12:01.982Z']
	])('%s', (_label, input, expected) => {
		const emitted = fromDateValue(toDateValue(input, 'UTC'), 'string', 'UTC');
		expect(emitted).toBe(expected);
		// Feeding the emitted value back in must be a fixed point.
		expect(fromDateValue(toDateValue(emitted as string, 'UTC'), 'string', 'UTC')).toBe(expected);
	});
});
