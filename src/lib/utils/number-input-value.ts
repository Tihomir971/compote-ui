/**
 * The string value NumberInput hands to Ark's NumberInput.Root.
 *
 * An empty value (`null`, `undefined` or NaN) becomes `''`, a controlled empty value. Passing
 * `undefined` instead would switch Ark to its internal state, which keeps showing the last
 * number — so clearing a bound from outside (e.g. a filter going from [10, 100] to
 * [undefined, 100]) would leave the 10 on screen. The one exception: an `undefined` value
 * with a `defaultValue` set stays `undefined`, so uncontrolled use keeps working.
 */
export function toNumberInputValue(
	value: number | null | undefined,
	locale: string,
	hasDefaultValue = false
): string | undefined {
	if (value == null || Number.isNaN(value)) {
		return value === undefined && hasDefaultValue ? undefined : '';
	}
	return new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 }).format(
		value
	);
}
