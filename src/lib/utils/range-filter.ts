/**
 * Value handling for numeric range filters (`inNumberRange`): the filter value is a
 * `[min, max]` tuple where either bound may be `undefined`.
 */

export type RangeFilterValue = [number | undefined, number | undefined];

/** Bounds edited in the UI but not committed yet; `null` means the bound was cleared. */
export type PendingRange = { min?: number | null; max?: number | null };

/** The `[min, max]` bounds of a range filter value, or both undefined when there is none. */
export function rangeBounds(filterValue: unknown): RangeFilterValue {
	if (!Array.isArray(filterValue)) return [undefined, undefined];
	const [min, max] = filterValue as unknown[];
	return [typeof min === 'number' ? min : undefined, typeof max === 'number' ? max : undefined];
}

/**
 * The filter value after committing `pending` edits onto the current filter value. A bound
 * that wasn't edited keeps its current (live) value, so a stale bound can't come back after
 * the filter was changed elsewhere. Returns `undefined` when both bounds are empty, which
 * removes the filter.
 */
export function mergeRangeFilter(
	current: unknown,
	pending: PendingRange
): RangeFilterValue | undefined {
	const [currentMin, currentMax] = rangeBounds(current);
	const min = 'min' in pending ? (pending.min ?? undefined) : currentMin;
	const max = 'max' in pending ? (pending.max ?? undefined) : currentMax;
	return min === undefined && max === undefined ? undefined : [min, max];
}
