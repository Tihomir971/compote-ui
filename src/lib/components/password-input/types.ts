import type { PasswordInputRootBaseProps } from '@ark-ui/svelte/password-input';

export interface PasswordInputProps extends PasswordInputRootBaseProps {
	label?: string;
	layout?: 'vertical' | 'horizontal';
	placeholder?: string;
	class?: string;
}
