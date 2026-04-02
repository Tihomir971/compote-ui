import type { DialogRootBaseProps } from '@ark-ui/svelte/dialog';
import type { Snippet } from 'svelte';

export type { DialogRootBaseProps };

type DialogSharedProps = Pick<
	DialogRootBaseProps,
	'closeOnEscape' | 'closeOnInteractOutside' | 'onOpenChange' | 'lazyMount' | 'unmountOnExit'
>;

export interface DialogProps extends DialogSharedProps {
	open: boolean;
	title: string;
	description?: string;
	children: Snippet;
	footer?: Snippet;
	contentClass?: string;
	initialFocusEl?: DialogRootBaseProps['initialFocusEl'];
}

export type AlertDialogVariant = 'default' | 'destructive';

export interface AlertDialogProps extends DialogSharedProps {
	open: boolean;
	title: string;
	description?: string | string[];
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	variant?: AlertDialogVariant;
}
