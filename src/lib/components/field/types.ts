import type { Snippet } from 'svelte';
import type {
	FieldRootBaseProps,
	FieldLabelBaseProps,
	FieldInputProps as ArkFieldInputProps,
	FieldTextareaProps as ArkFieldTextareaProps,
	FieldHelperTextBaseProps,
	FieldErrorTextBaseProps
} from '@ark-ui/svelte/field';
import type { ClassValue } from 'svelte/elements';

export interface FormAdapter {
	invalid(field: string): boolean;
	isRequired(field: string): boolean;
	errors: Record<string, string[]>;
}

export interface FieldRootProps extends FieldRootBaseProps {
	class?: ClassValue;
	form?: FormAdapter;
	field?: string;
	helperText?: string;
}

export interface FieldLabelProps extends FieldLabelBaseProps {
	class?: ClassValue;
}

export interface FieldInputProps extends ArkFieldInputProps {
	class?: ClassValue;
	startIcon?: Snippet;
	endIcon?: Snippet;
}

export interface FieldTextareaProps extends ArkFieldTextareaProps {
	class?: ClassValue;
}

export interface FieldHelperTextProps extends FieldHelperTextBaseProps {
	class?: ClassValue;
}

export interface FieldErrorTextProps extends FieldErrorTextBaseProps {
	class?: ClassValue;
}
