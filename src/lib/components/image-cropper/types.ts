import type {
	UseImageCropperProps,
	ImageCropperGetCroppedImageOptions
} from '@ark-ui/svelte/image-cropper';

export interface CropData {
	x: number;
	y: number;
	width: number;
	height: number;
	rotate: number;
	flipX: boolean;
	flipY: boolean;
}

export interface ImageCropperProps extends UseImageCropperProps {
	src: string;
	alt?: string;
	getCroppedImage?: (options?: ImageCropperGetCroppedImageOptions) => Promise<string | Blob | null>;
	getCropData?: () => CropData;
}
