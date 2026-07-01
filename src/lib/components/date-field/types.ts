import type { DatePickerRootBaseProps } from '@ark-ui/svelte/date-picker';
import type { DateValue, DateInputValue } from '../../utils/date';

export type { DateValue };

export interface DateFieldProps extends Omit<DatePickerRootBaseProps, 'value' | 'defaultValue'> {
	/**
	 * Bound value. Accepts a `DateValue`, an ISO/DB string, or a native `Date` —
	 * no manual conversion needed. The value is emitted back in the same shape it
	 * was provided (string in → string out, `Date` in → `Date` out). When the
	 * value starts `null`, changes are emitted as a string by default.
	 *
	 * For UTC values from a database, bind the ISO string with its `Z`/offset and
	 * leave `timeZone` unset: the field displays the user's local zone and the
	 * emitted string is UTC.
	 */
	value?: DateInputValue;
	defaultValue?: DateInputValue;
	label?: string;
	name?: string;
	granularity?: 'day' | 'hour' | 'minute' | 'second';
	hourCycle?: 12 | 24;
}
