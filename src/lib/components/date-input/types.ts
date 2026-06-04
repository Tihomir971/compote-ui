import type { DateInputRootBaseProps } from '@ark-ui/svelte/date-input';
import type { DateInputDateValue as DateValue } from '@ark-ui/svelte/date-input';

export type { DateValue };

export type NativeDateInput = DateValue | string | Date | null | undefined;

export interface DateInputProps extends Omit<DateInputRootBaseProps, 'value' | 'defaultValue'> {
	value?: NativeDateInput;
	defaultValue?: NativeDateInput;
	label?: string;
	name?: string;
}
