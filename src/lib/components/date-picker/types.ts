import type { DatePickerRootBaseProps } from '@ark-ui/svelte/date-picker';
import type { DateValue } from '@ark-ui/svelte/date-picker';

export interface DatePickerProps extends Omit<DatePickerRootBaseProps, 'value' | 'defaultValue'> {
	value?: DateValue | null;
	defaultValue?: DateValue;
	label?: string;
	placeholder?: string;
	name?: string;
	granularity?: 'day' | 'hour' | 'minute' | 'second';
}
