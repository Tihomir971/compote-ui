import type { DateInputRootBaseProps } from '@ark-ui/svelte/date-input';
import type { DateValue, DateInputValue } from '../../utils/date';

export type { DateValue, DateInputValue };

export interface DateInputProps extends Omit<
	DateInputRootBaseProps,
	'value' | 'defaultValue' | 'granularity' | 'hourCycle'
> {
	/**
	 * Bound value. Accepts a `DateValue`, an ISO/DB string, or a native `Date` —
	 * no manual conversion needed. The value is emitted back in the same shape it
	 * was provided (string in → string out, `Date` in → `Date` out). When the
	 * value starts `null`, changes are emitted as a string by default.
	 *
	 * For UTC values from a database, bind the ISO string with its `Z`/offset and
	 * leave `timeZone` unset: the segments display in the user's local zone and the
	 * emitted string is UTC (e.g. `"2024-01-15T10:30:00.000Z"`).
	 */
	value?: DateInputValue;
	defaultValue?: DateInputValue;
	label?: string;
	name?: string;
	granularity?: 'day' | 'hour' | 'minute' | 'second';
	hourCycle?: 12 | 24;
	/** BCP-47 locale (e.g. `'de-DE'`). Overrides the `LocaleProvider` / browser locale. */
	locale?: string;
}
