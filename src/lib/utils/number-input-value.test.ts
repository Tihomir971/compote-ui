import { describe, expect, it } from 'vitest';
import { toNumberInputValue } from './number-input-value';

describe('toNumberInputValue', () => {
	it('formats a number without grouping', () => {
		expect(toNumberInputValue(1234.5, 'en-US')).toBe('1234.5');
		expect(toNumberInputValue(1234.5, 'sr-RS')).toBe('1234,5');
	});

	it('keeps an empty value controlled so Ark clears the input', () => {
		// A range bound cleared from outside ([10, 100] → [undefined, 100]) arrives as null.
		expect(toNumberInputValue(null, 'en-US')).toBe('');
		expect(toNumberInputValue(undefined, 'en-US')).toBe('');
		expect(toNumberInputValue(Number.NaN, 'en-US')).toBe('');
	});

	it('leaves an undefined value uncontrolled only when a defaultValue is set', () => {
		expect(toNumberInputValue(undefined, 'en-US', true)).toBeUndefined();
		expect(toNumberInputValue(null, 'en-US', true)).toBe('');
	});
});
