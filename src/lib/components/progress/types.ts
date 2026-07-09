import type { ProgressRootBaseProps } from '@ark-ui/svelte/progress';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info';

interface ProgressSharedProps extends ProgressRootBaseProps {
	/** Optional label rendered above the progress indicator. */
	label?: string;
	/** Render the formatted value text (e.g. `50%`). */
	showValueText?: boolean;
	/** Color of the filled range. */
	variant?: ProgressVariant;
	class?: string;
}

export interface ProgressLinearProps extends ProgressSharedProps {
	/** Thickness of the track. */
	size?: ProgressSize;
}

export interface ProgressCircularProps extends ProgressSharedProps {
	/** Diameter of the ring in pixels. */
	size?: ProgressSize | number;
	/** Stroke width of the ring in pixels. */
	thickness?: number;
}
