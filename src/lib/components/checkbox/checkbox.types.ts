import type { CheckboxRootBaseProps } from '@ark-ui/svelte/checkbox';
import type { Snippet } from 'svelte';

export interface CheckboxProps extends Omit<CheckboxRootBaseProps, 'children' | 'asChild' | 'ref'> {
	label?: string;
	children?: Snippet;
}
