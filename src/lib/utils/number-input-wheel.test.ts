import { describe, expect, it } from 'vitest';
import { getWheelDirection, getWheelNextValue, getWheelStep } from './number-input-wheel';

const mods = (shiftKey = false, altKey = false) => ({ shiftKey, altKey });

describe('getWheelStep', () => {
	it('returns null for a plain wheel', () => {
		expect(getWheelStep(mods(), { step: 0.5 })).toBeNull();
	});

	it('uses 10 × step for Shift and step / 10 for Alt by default', () => {
		expect(getWheelStep(mods(true), { step: 0.5 })).toBe(5);
		expect(getWheelStep(mods(false, true), { step: 1 })).toBe(0.1);
		expect(getWheelStep(mods(true), {})).toBe(10);
	});

	it('matches the Zag default step for percent formatting', () => {
		const formatOptions = { style: 'percent' } as const;
		expect(getWheelStep(mods(true), { formatOptions })).toBeCloseTo(0.1);
		expect(getWheelStep(mods(false, true), { formatOptions })).toBeCloseTo(0.001);
		expect(getWheelStep(mods(true), { formatOptions, step: 0.05 })).toBeCloseTo(0.5);
	});

	it('honours explicit largeStep / smallStep', () => {
		expect(getWheelStep(mods(true), { step: 1, largeStep: 100 })).toBe(100);
		expect(getWheelStep(mods(false, true), { step: 1, smallStep: 0.01 })).toBe(0.01);
	});
});

describe('getWheelDirection', () => {
	it('scroll up increments, down decrements', () => {
		expect(getWheelDirection({ deltaX: 0, deltaY: -100 })).toBe(1);
		expect(getWheelDirection({ deltaX: 0, deltaY: 100 })).toBe(-1);
	});

	it('falls back to deltaX (Shift+wheel in Chrome/Edge)', () => {
		expect(getWheelDirection({ deltaX: -100, deltaY: 0 })).toBe(1);
		expect(getWheelDirection({ deltaX: 100, deltaY: 0 })).toBe(-1);
	});

	it('is 0 without movement', () => {
		expect(getWheelDirection({ deltaX: 0, deltaY: 0 })).toBe(0);
	});
});

describe('getWheelNextValue', () => {
	it('avoids floating point noise', () => {
		expect(getWheelNextValue({ current: 0.2, direction: 1, stepSize: 0.1 })).toBe(0.3);
		expect(getWheelNextValue({ current: 1.1, direction: -1, stepSize: 0.1 })).toBe(1);
	});

	it('clamps to min / max unless allowOverflow', () => {
		expect(getWheelNextValue({ current: 95, direction: 1, stepSize: 10, max: 100 })).toBe(100);
		expect(getWheelNextValue({ current: 5, direction: -1, stepSize: 10, min: 0 })).toBe(0);
		expect(
			getWheelNextValue({ current: 95, direction: 1, stepSize: 10, max: 100, allowOverflow: true })
		).toBe(105);
	});

	it('starts from 0 for an empty value', () => {
		expect(getWheelNextValue({ current: NaN, direction: 1, stepSize: 5 })).toBe(5);
	});
});
