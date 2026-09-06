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
	/**
	 * Error to render below the control, for validation that does not go through
	 * a {@link FormAdapter} (e.g. a SvelteKit remote form's `field.issues()`).
	 * Passing it also marks the field invalid unless `invalid` is set explicitly.
	 * Ignored when `form` and `field` are given — the adapter wins, as it does
	 * for `invalid` and `required`.
	 */
	errorText?: string | null;
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
