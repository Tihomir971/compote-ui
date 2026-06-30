import type { TagsInputRootProps } from '@ark-ui/svelte/tags-input';
import type { ClassValue } from 'tailwind-variants';

export interface TagsInputProps extends Omit<TagsInputRootProps, 'class'> {
	class?: ClassValue;
	label?: string;
	placeholder?: string;
}
