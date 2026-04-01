import type { Snippet } from 'svelte';
import type {
	FieldRootBaseProps,
	FieldLabelBaseProps,
	FieldInputProps as ArkFieldInputProps,
	FieldTextareaProps as ArkFieldTextareaProps,
	FieldHelperTextBaseProps,
	FieldErrorTextBaseProps
} from '@ark-ui/svelte/field';
export interface FieldRootProps extends FieldRootBaseProps {
	class?: string;
}

export interface FieldLabelProps extends FieldLabelBaseProps {
	class?: string;
}

export interface FieldInputProps extends ArkFieldInputProps {
	class?: string;
	startIcon?: Snippet;
	endIcon?: Snippet;
}

export interface FieldTextareaProps extends ArkFieldTextareaProps {
	class?: string;
}

export interface FieldHelperTextProps extends FieldHelperTextBaseProps {
	class?: string;
}

export interface FieldErrorTextProps extends FieldErrorTextBaseProps {
	class?: string;
}
