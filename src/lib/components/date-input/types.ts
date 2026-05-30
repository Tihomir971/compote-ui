import type { DateInputRootBaseProps } from '@ark-ui/svelte/date-input';
import type { DateInputDateValue as DateValue } from '@ark-ui/svelte/date-input';

export interface DateInputProps extends Omit<DateInputRootBaseProps, 'value' | 'defaultValue'> {
	value?: DateValue | null;
	defaultValue?: DateValue;
	label?: string;
	name?: string;
}
