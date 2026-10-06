/**
 * Value handling for `type: 'select'` data-table columns. A select cell holds either one
 * value or an array of values (multi-value / tag columns); both facet, filter and render
 * through the same helpers so the Funnel works the same for either shape.
 */

/**
 * Filter value standing for "no value". It is `null`, not a string, so it can never
 * collide with a real option — a cell whose value is the string `'null'` stays a regular
 * option. Every other selected option is the `String()` of the cell value.
 */
export const EMPTY_SELECT_VALUE = null;

export type SelectFilterValue = string | typeof EMPTY_SELECT_VALUE;

function isEmpty(value: unknown): boolean {
	return value == null || value === '';
}

/**
 * The values a select cell contributes to facets and filters: each distinct item of an
 * array, or the scalar itself. Items are distinct by their filter value (`String()`), so a
 * row counts once per option even when its array repeats an item. A missing cell (null,
 * undefined, '' or an empty array) is one `EMPTY_SELECT_VALUE`, so it facets and filters
 * as a single "empty" option.
 */
export function selectCellValues(value: unknown): unknown[] {
	if (!Array.isArray(value)) return [isEmpty(value) ? EMPTY_SELECT_VALUE : value];

	const seen = new Set<string>();
	const items: unknown[] = [];
	for (const item of value) {
		if (isEmpty(item)) continue;
		const key = String(item);
		if (seen.has(key)) continue;
		seen.add(key);
		items.push(item);
	}
	return items.length ? items : [EMPTY_SELECT_VALUE];
}

function toFilterValue(item: unknown): SelectFilterValue {
	return item === EMPTY_SELECT_VALUE ? EMPTY_SELECT_VALUE : String(item);
}

/** One-of filter: the cell matches when any of its values is among the selected options. */
export function matchesSelectFilter(value: unknown, filterValue: SelectFilterValue[]): boolean {
	return selectCellValues(value).some((item) => filterValue.includes(toFilterValue(item)));
}

export type SelectFilterOption = { value: SelectFilterValue; label: string; count: number };

/**
 * Filter options from a column's faceted unique values: sorted by label, with the empty
 * option (labelled `emptyLabel`) last.
 */
export function selectFilterOptions(
	facets: Map<unknown, number>,
	emptyLabel = '(empty)'
): SelectFilterOption[] {
	const counts = new Map<string, number>();
	let emptyCount = 0;
	for (const [key, count] of facets) {
		if (isEmpty(key)) {
			emptyCount += count;
			continue;
		}
		const value = String(key);
		counts.set(value, (counts.get(value) ?? 0) + count);
	}

	const options: SelectFilterOption[] = [...counts].map(([value, count]) => ({
		value,
		label: value,
		count
	}));
	options.sort((a, b) => a.label.localeCompare(b.label));
	if (emptyCount > 0) {
		options.push({ value: EMPTY_SELECT_VALUE, label: emptyLabel, count: emptyCount });
	}
	return options;
}

/** Cell text for a select value: array items joined with `, `; undefined when empty. */
export function formatSelectValue(value: unknown): string | number | boolean | undefined {
	if (Array.isArray(value)) {
		const items = value.filter((item) => !isEmpty(item));
		return items.length ? items.join(', ') : undefined;
	}
	return isEmpty(value) ? undefined : (value as string | number | boolean);
}
