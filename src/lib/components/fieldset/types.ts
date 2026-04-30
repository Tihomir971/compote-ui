import type {
	FieldsetRootBaseProps,
	FieldsetLegendBaseProps,
	FieldsetHelperTextBaseProps,
	FieldsetErrorTextBaseProps
} from '@ark-ui/svelte/fieldset';
import type { ClassValue } from 'svelte/elements';

export interface FieldsetRootProps extends FieldsetRootBaseProps {
	class?: ClassValue;
}

export interface FieldsetLegendProps extends FieldsetLegendBaseProps {
	class?: ClassValue;
}

export interface FieldsetHelperTextProps extends FieldsetHelperTextBaseProps {
	class?: ClassValue;
}

export interface FieldsetErrorTextProps extends FieldsetErrorTextBaseProps {
	class?: ClassValue;
}
