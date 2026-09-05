import type { DatePickerRootBaseProps } from '@ark-ui/svelte/date-picker';
import type { DateValue, DateInputValue } from '../../utils/date';

export type { DateValue, DateInputValue };

export interface DateRangeFieldProps extends Omit<
	DatePickerRootBaseProps,
	'value' | 'defaultValue' | 'selectionMode'
> {
	/**
	 * Bound start of the range. Accepts a `DateValue`, an ISO/DB string, or a
	 * native `Date` — no manual conversion needed. Emitted back in the same shape
	 * it was provided (string in → string out, `Date` in → `Date` out); when it
	 * starts `null`, changes are emitted as a string.
	 *
	 * Bind strings when feeding SvelteKit remote functions: `query`/`command`
	 * arguments are serialized with devalue, which handles strings and `Date` but
	 * not `@internationalized/date` class instances.
	 */
	start?: DateInputValue;
	/** Bound end of the range. Ignored while {@link start} is empty. */
	end?: DateInputValue;
	defaultStart?: DateInputValue;
	defaultEnd?: DateInputValue;
	label?: string;
	/** Shorthand: names the hidden inputs `${name}Start` and `${name}End`. */
	name?: string;
	/** Names the start hidden input outright. Overrides {@link name}. */
	startName?: string;
	/** Names the end hidden input outright. Overrides {@link name}. */
	endName?: string;
	granularity?: 'day' | 'hour' | 'minute' | 'second';
	hourCycle?: 12 | 24;
	/**
	 * Hide the trailing time-zone segment (e.g. `GMT+2`) that a zoned value shows
	 * at time granularity. Defaults to `true`, matching `DateInput`. Not inherited
	 * from Ark: `hideTimeZone` is a date-input prop, not a date-picker one.
	 */
	hideTimeZone?: boolean;
}
