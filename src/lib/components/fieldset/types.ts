import type {
	FieldsetRootBaseProps,
	FieldsetLegendBaseProps,
	FieldsetHelperTextBaseProps,
	FieldsetErrorTextBaseProps
} from '@ark-ui/svelte/fieldset';

export interface FieldsetRootProps extends FieldsetRootBaseProps {
	class?: string;
}

export interface FieldsetLegendProps extends FieldsetLegendBaseProps {
	class?: string;
}

export interface FieldsetHelperTextProps extends FieldsetHelperTextBaseProps {
	class?: string;
}

export interface FieldsetErrorTextProps extends FieldsetErrorTextBaseProps {
	class?: string;
}
