import type { Snippet } from 'svelte';
import type {
	FieldRootBaseProps,
	FieldLabelBaseProps,
	FieldInputProps as ArkFieldInputProps,
	FieldTextareaProps as ArkFieldTextareaProps,
	FieldHelperTextBaseProps,
	FieldErrorTextBaseProps
} from '@ark-ui/svelte/field';

export interface FormAdapter {
	invalid(field: string): boolean;
	isRequired(field: string): boolean;
	errors: Record<string, string[]>;
}

export interface FieldRootProps extends FieldRootBaseProps {
	class?: string;
	form?: FormAdapter;
	field?: string;
	helperText?: string;
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
