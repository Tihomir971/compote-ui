import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { Component } from 'svelte';
import NumberInput from './number-input/number-input.svelte';

/** SSR NumberInput and read back the value of the visible (non-hidden) input. */
function shownValue(props: Record<string, unknown>): string | undefined {
	const { body } = render(NumberInput as Component, { props });
	const input = [...body.matchAll(/<input[^>]*>/g)]
		.map(([tag]) => tag)
		.find((tag) => !/type="hidden"/.test(tag));
	return input?.match(/ value="([^"]*)"/)?.[1] ?? '';
}

describe('NumberInput value', () => {
	it('shows a controlled number', () => {
		expect(shownValue({ value: 10 })).toBe('10');
	});

	it('shows an empty input for a cleared controlled value, not Ark internal state', () => {
		// Regression: null used to reach Ark as undefined, so Ark fell back to its own state
		// (here: defaultValue) and a bound cleared from outside kept its old number.
		expect(shownValue({ value: null, defaultValue: '10' })).toBe('');
	});

	it('still honours defaultValue when no value is given', () => {
		expect(shownValue({ defaultValue: '10' })).toBe('10');
	});
});
