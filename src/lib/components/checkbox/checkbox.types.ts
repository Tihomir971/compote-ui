import type { CheckboxRootProps } from '@ark-ui/svelte/checkbox';
import type { Snippet } from 'svelte';
import type { ClassValue } from 'tailwind-variants';

export interface CheckboxProps extends Omit<
	CheckboxRootProps,
	'children' | 'asChild' | 'class' | 'ref'
> {
	class?: ClassValue;
	label?: string;
	children?: Snippet;
}
