import type { Props as TelInputProps } from 'svelte-tel-input/types';

export interface PhoneInputProps extends Omit<
	TelInputProps,
	'value' | 'class' | 'id' | 'readonly'
> {
	value?: string;
	label?: string;
	layout?: 'vertical' | 'horizontal';
	readonly?: boolean;
	invalid?: boolean;
	class?: string;
}
