import type { UseImageCropperProps, UseImageCropperReturn } from '@ark-ui/svelte/image-cropper';

export type ImageCropperCropData = ReturnType<ReturnType<UseImageCropperReturn>['getCropData']>;

export interface ImageCropperProps extends UseImageCropperProps {
	src: string;
	alt?: string;
	getCroppedImage?: ReturnType<UseImageCropperReturn>['getCroppedImage'];
	getCropData?: ReturnType<UseImageCropperReturn>['getCropData'];
}
