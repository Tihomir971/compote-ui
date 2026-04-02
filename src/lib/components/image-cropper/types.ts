import type { UseImageCropperProps, UseImageCropperReturn } from '@ark-ui/svelte/image-cropper';
import type { ProcessImageOptions } from '$lib/utils/image-processing';

export type ImageCropperCropData = ReturnType<ReturnType<UseImageCropperReturn>['getCropData']>;

export interface ImageCropperProps extends UseImageCropperProps {
	src: string;
	alt?: string;
	getCroppedImage?: ReturnType<UseImageCropperReturn>['getCroppedImage'];
	getCropData?: ReturnType<UseImageCropperReturn>['getCropData'];
	/** Bindable: returns a processed (cropped + resized + converted) data URL in one call */
	getProcessedImage?: (opts?: ProcessImageOptions) => Promise<string>;
}
