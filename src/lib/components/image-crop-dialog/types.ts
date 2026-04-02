import type { ProcessImageOptions } from '../../utils/image-processing';

export interface ImageCropDialogProps {
	/** Controls dialog open state */
	open: boolean;
	/** Source image (data URL, blob URL, or regular URL) */
	imageSrc: string;
	/** Called with the processed data URL on crop or skip */
	onConfirm: (processedDataUrl: string) => void;
	/** Called when the user cancels (Cancel button or clicking outside/Escape) */
	onCancel: () => void;
	/** Dialog title */
	title?: string;
	/** Dialog description */
	description?: string;
	/** Default aspect ratio for the cropper (undefined = free) */
	aspectRatio?: number;
	/** Processing options applied to both crop and skip paths */
	processOptions?: ProcessImageOptions;
	/** Whether to show the "Skip Crop" button (default: true) */
	showSkipCrop?: boolean;
	/** Label for the confirm button */
	confirmLabel?: string;
	/** Label for the skip button */
	skipLabel?: string;
}
