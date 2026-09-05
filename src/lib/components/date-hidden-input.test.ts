import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { Component } from 'svelte';
import { CalendarDate } from '@internationalized/date';
import DateInput from './date-input/date-input.svelte';
import DateField from './date-field/date-field.svelte';
import DateRangeField from './date-range-field/date-range-field.svelte';
import DatePicker from './date-picker/date-picker.svelte';

interface HiddenInput {
	name: string | undefined;
	value: string | undefined;
	disabled: boolean;
}

/** SSR a component and read back the hidden inputs a form submit would send. */
function submitted(component: Component<never>, props: Record<string, unknown>): HiddenInput[] {
	const { body } = render(component as Component, { props });
	return [...body.matchAll(/<input[^>]*type="hidden"[^>]*>/g)].map(([tag]) => ({
		name: tag.match(/ name="([^"]*)"/)?.[1],
		value: tag.match(/ value="([^"]*)"/)?.[1],
		disabled: / disabled=/.test(tag)
	}));
}

/** The segment kinds rendered, in order (`day`, `hour`, `timeZoneName`, ...). */
function segmentTypes(component: Component<never>, props: Record<string, unknown>): string[] {
	const { body } = render(component as Component, { props });
	return [...body.matchAll(/data-type="([a-zA-Z]+)"/g)].map(([, type]) => type);
}

/** The text a user actually sees — segments, not the hidden input. */
function visibleText(component: Component<never>, props: Record<string, unknown>): string {
	const { body } = render(component as Component, { props });
	return body
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

// Zag formats the hidden input with the same Intl.DateTimeFormat that drives the
// visible segments unless `format` is overridden, which would submit "6/15/2025"
// under en-US and "15.6.2025" under de-DE. Every component must submit ISO.
describe('single-value components submit ISO', () => {
	it.each([
		['DateInput', DateInput],
		['DateField', DateField],
		['DatePicker', DatePicker]
	])('%s submits a date-only value unchanged', (_label, component) => {
		expect(
			submitted(component as Component<never>, { name: 'startDate', value: '2025-06-15' })
		).toEqual([{ name: 'startDate', value: '2025-06-15', disabled: false }]);
	});

	it.each([
		['DateInput', DateInput],
		['DateField', DateField]
	])('%s submits an absolute UTC string at minute granularity', (_label, component) => {
		expect(
			submitted(component as Component<never>, {
				name: 'startsAt',
				value: '2025-07-11T10:12:01.982258+00:00',
				granularity: 'minute'
			})
		).toEqual([{ name: 'startsAt', value: '2025-07-11T10:12:01.982Z', disabled: false }]);
	});
});

// The regression this guards: overriding zag's `format` must not leak into the
// segments. A German user still reads 15.6.2025 but the server still gets ISO.
describe('locale affects the display, never the submitted value', () => {
	const props = { name: 'startDate', value: '2025-06-15', locale: 'de-DE' };

	it('submits ISO under de-DE', () => {
		expect(submitted(DateInput as Component<never>, props)[0].value).toBe('2025-06-15');
	});

	it('still displays the German format', () => {
		expect(visibleText(DateInput as Component<never>, props)).toContain('15.6.2025');
	});
});

// `hideTimeZone` is a zag date-input prop, so it is not inherited from the
// date-picker props DateField/DateRangeField extend — each has to forward it.
describe('the time-zone segment is hidden by default', () => {
	const props = { value: '2025-07-11T10:12:01.982258+00:00', granularity: 'minute' };

	it.each([
		['DateInput', DateInput],
		['DateField', DateField]
	])('%s renders no timeZoneName segment', (_label, component) => {
		expect(segmentTypes(component as Component<never>, props)).not.toContain('timeZoneName');
	});

	it.each([
		['DateInput', DateInput],
		['DateField', DateField]
	])('%s renders one when hideTimeZone is false', (_label, component) => {
		expect(
			segmentTypes(component as Component<never>, { ...props, hideTimeZone: false })
		).toContain('timeZoneName');
	});

	it('DateRangeField hides it too', () => {
		const types = segmentTypes(DateRangeField as Component<never>, {
			start: '2025-07-11T10:12:01.982258+00:00',
			granularity: 'minute'
		});
		expect(types).not.toContain('timeZoneName');
	});
});

// A single field name cannot carry two dates, and Ark's own HiddenInput names
// itself `name` or `name[0]`/`name[1]` depending on how many dates are selected.
// Two fixed names keep the server contract stable as the user fills the range in.
describe('DateRangeField submits a stable pair of names', () => {
	const start = new CalendarDate(2025, 6, 1);
	const end = new CalendarDate(2025, 6, 15);

	it('expands the `name` shorthand into a Start/End pair', () => {
		expect(submitted(DateRangeField as Component<never>, { name: 'stay', start, end })).toEqual([
			{ name: 'stayStart', value: '2025-06-01', disabled: false },
			{ name: 'stayEnd', value: '2025-06-15', disabled: false }
		]);
	});

	it('uses startName/endName verbatim when given', () => {
		expect(
			submitted(DateRangeField as Component<never>, {
				startName: 'stay_start',
				endName: 'stay_end',
				start,
				end
			})
		).toEqual([
			{ name: 'stay_start', value: '2025-06-01', disabled: false },
			{ name: 'stay_end', value: '2025-06-15', disabled: false }
		]);
	});

	it('lets startName/endName override the shorthand', () => {
		const names = submitted(DateRangeField as Component<never>, {
			name: 'stay',
			startName: 'from',
			endName: 'until',
			start,
			end
		}).map((i) => i.name);
		expect(names).toEqual(['from', 'until']);
	});

	it('submits an empty end while only the start is picked', () => {
		expect(submitted(DateRangeField as Component<never>, { name: 'stay', start })).toEqual([
			{ name: 'stayStart', value: '2025-06-01', disabled: false },
			{ name: 'stayEnd', value: '', disabled: false }
		]);
	});

	it('keeps the names identical however many dates are picked', () => {
		const names = (props: Record<string, unknown>) =>
			submitted(DateRangeField as Component<never>, { name: 'stay', ...props }).map((i) => i.name);
		expect(names({})).toEqual(['stayStart', 'stayEnd']);
		expect(names({ start })).toEqual(['stayStart', 'stayEnd']);
		expect(names({ start, end })).toEqual(['stayStart', 'stayEnd']);
	});

	// Each end accepts a DateValue, an ISO/DB string or a native Date. Whichever
	// notation goes in, ISO comes out — the server contract never varies.
	it.each([
		['a DateValue', start, '2025-06-01'],
		['an ISO string', '2025-06-01', '2025-06-01'],
		['a Supabase timestamptz string', '2025-06-01 00:00:00+00', '2025-06-01T00:00:00.000Z'],
		['a native Date', new Date('2025-06-01T00:00:00Z'), '2025-06-01T00:00:00.000Z']
	])('submits ISO when the start is bound as %s', (_label, bound, expected) => {
		expect(
			submitted(DateRangeField as Component<never>, { name: 'stay', start: bound })[0]
		).toEqual({ name: 'stayStart', value: expected, disabled: false });
	});

	it.each([
		['null', null],
		['undefined', undefined]
	])('submits an empty string when the start is %s', (_label, bound) => {
		expect(
			submitted(DateRangeField as Component<never>, { name: 'stay', start: bound })[0]
		).toEqual({ name: 'stayStart', value: '', disabled: false });
	});

	it('mixes notations across the two ends without changing the output', () => {
		const values = submitted(DateRangeField as Component<never>, {
			name: 'stay',
			start: '2025-06-01',
			end: new Date('2025-06-15T00:00:00Z')
		}).map((i) => i.value);
		expect(values).toEqual(['2025-06-01', '2025-06-15T00:00:00.000Z']);
	});

	it('marks both inputs disabled so neither is submitted', () => {
		const inputs = submitted(DateRangeField as Component<never>, {
			name: 'stay',
			start,
			end,
			disabled: true
		});
		expect(inputs.map((i) => i.disabled)).toEqual([true, true]);
	});

	it('renders no hidden inputs without any name', () => {
		expect(submitted(DateRangeField as Component<never>, { start, end })).toEqual([]);
	});

	// zag reads the range positionally, so a lone end would silently become the start.
	it('drops an end bound without a start', () => {
		expect(submitted(DateRangeField as Component<never>, { name: 'stay', end })).toEqual([
			{ name: 'stayStart', value: '', disabled: false },
			{ name: 'stayEnd', value: '', disabled: false }
		]);
	});
});
