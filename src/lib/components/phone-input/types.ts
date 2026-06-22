import type { CountryCode, TelInputOptions } from 'svelte-tel-input/types';

export interface PhoneInputProps {
	value?: string;
	country?: CountryCode | null;
	valid?: boolean;
	label?: string;
	placeholder?: string;
	name?: string;
	layout?: 'vertical' | 'horizontal';
	disabled?: boolean;
	readonly?: boolean;
	invalid?: boolean;
	required?: boolean;
	class?: string;
	options?: TelInputOptions;
}
