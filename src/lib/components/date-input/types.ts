import type { DateInputRootBaseProps } from '@ark-ui/svelte/date-input';
import type { DateValue } from '@internationalized/date';

export type { DateValue };

export interface DateInputProps extends Omit<DateInputRootBaseProps, 'value' | 'defaultValue'> {
	value?: DateValue | null;
	defaultValue?: DateValue | null;
	label?: string;
	name?: string;
}
