import type { DatePickerRootBaseProps } from '@ark-ui/svelte/date-picker';
import type { DateValue } from '@ark-ui/svelte/date-picker';

export interface DateRangeFieldProps extends Omit<
	DatePickerRootBaseProps,
	'value' | 'defaultValue' | 'selectionMode'
> {
	value?: DateValue[];
	defaultValue?: DateValue[];
	label?: string;
	name?: string;
	granularity?: 'day' | 'hour' | 'minute' | 'second';
	hourCycle?: 12 | 24;
}
