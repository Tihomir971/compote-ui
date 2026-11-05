export interface WheelStepOptions {
	step?: number;
	formatOptions?: Intl.NumberFormatOptions;
	largeStep?: number;
	smallStep?: number;
}

/** Zag's default step: 1, or 0.01 for percent formatting without an explicit `step`. */
export function getDefaultStep(step?: number, formatOptions?: Intl.NumberFormatOptions): number {
	if (step !== undefined && !Number.isNaN(step)) return step;
	return formatOptions?.style === 'percent' ? 0.01 : 1;
}

/**
 * Step size for a wheel event, mirroring Zag's keyboard modifiers: Shift → `largeStep`
 * (default `10 × step`), Alt → `smallStep` (default `step / 10`). Returns `null` for a plain
 * wheel so Zag's own handler keeps handling it.
 */
export function getWheelStep(
	event: Pick<WheelEvent, 'shiftKey' | 'altKey'>,
	{ step: stepProp, formatOptions, largeStep, smallStep }: WheelStepOptions
): number | null {
	const step = getDefaultStep(stepProp, formatOptions);
	if (event.shiftKey) return largeStep ?? step * 10;
	if (event.altKey) return smallStep ?? step / 10;
	return null;
}

/**
 * Wheel direction: +1 for scrolling up (increment), -1 for down, 0 for none. Browsers report
 * Shift+wheel on `deltaX` instead of `deltaY` (Chrome/Edge), hence the fallback.
 */
export function getWheelDirection(event: Pick<WheelEvent, 'deltaX' | 'deltaY'>): -1 | 0 | 1 {
	const delta = event.deltaY || event.deltaX;
	return (Math.sign(delta) * -1 || 0) as -1 | 0 | 1;
}

function decimals(n: number): number {
	if (!Number.isFinite(n)) return 0;
	const [mantissa, exponent] = n.toString().split('e');
	const fraction = mantissa.split('.')[1]?.length ?? 0;
	return Math.max(0, fraction - Number(exponent ?? 0));
}

/**
 * `current + direction × stepSize`, rounded to the precision of the operands (no
 * `0.30000000000000004`) and clamped to `[min, max]` unless `allowOverflow`. An empty
 * (`NaN`) current value starts from 0.
 */
export function getWheelNextValue(options: {
	current: number;
	direction: -1 | 1;
	stepSize: number;
	min?: number;
	max?: number;
	allowOverflow?: boolean;
}): number {
	const { direction, stepSize, min = -Infinity, max = Infinity, allowOverflow } = options;
	const current = Number.isNaN(options.current) ? 0 : options.current;
	const precision = Math.max(decimals(current), decimals(stepSize));
	const next = Number((current + direction * stepSize).toFixed(Math.min(precision, 20)));
	return allowOverflow ? next : Math.min(max, Math.max(min, next));
}
