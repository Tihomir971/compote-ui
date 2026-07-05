import type { ClassValue } from 'tailwind-variants';
import type { ProcessImageOptions } from '$lib/utils/image-processing';

export type ImageUploadShape = 'circle' | 'square';

export interface ImageUploadProps {
	/** Current image src (data URL, blob URL, or remote URL). Bindable. */
	value?: string;
	alt?: string;
	shape?: ImageUploadShape;
	/** Sizing classes for the preview box, e.g. 'size-24' or 'w-full aspect-video' */
	class?: ClassValue;
	disabled?: boolean;
	/** Aspect ratio locked in the crop dialog (undefined = free) */
	aspectRatio?: number;
	/** Resize/convert options applied when cropping or skipping crop */
	processOptions?: ProcessImageOptions;
	uploadLabel?: string;
	replaceLabel?: string;
	deleteLabel?: string;
	/** Called with the processed Blob after the user crops/confirms a new image */
	onChange?: (blob: Blob) => void;
	/** Called when the user deletes the current image */
	onDelete?: () => void;
}
