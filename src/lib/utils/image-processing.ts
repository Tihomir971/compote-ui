/**
 * Client-side image processing utilities using the Canvas API.
 * These are browser-only utilities — they will throw if called during SSR.
 */

export interface ProcessImageOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number;
	format?: 'image/webp' | 'image/jpeg' | 'image/png' | 'image/avif';
}

export interface CropRegion {
	x: number;
	y: number;
	width: number;
	height: number;
}

const defaults: Required<ProcessImageOptions> = {
	maxWidth: 1000,
	maxHeight: 1000,
	quality: 0.85,
	format: 'image/webp'
};

/** Load an image element from a src URL (data URL, blob URL, or regular URL) */
export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = src;
	});
}

/** Convert a File to a base64 data URL */
export function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsDataURL(file);
	});
}

/**
 * Crop a full-resolution source image using natural pixel coordinates, then resize and convert.
 * Use this instead of getCroppedImage() from Ark UI which outputs at CSS/display resolution.
 */
export async function cropImage(
	src: string,
	crop: CropRegion,
	opts?: ProcessImageOptions
): Promise<string> {
	const { maxWidth, maxHeight, quality, format } = { ...defaults, ...opts };
	const img = await loadImage(src);

	let { width, height } = crop;
	if (width > maxWidth || height > maxHeight) {
		const ratio = Math.min(maxWidth / width, maxHeight / height);
		width = Math.round(width * ratio);
		height = Math.round(height * ratio);
	}

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);
	return canvas.toDataURL(format, quality);
}

/** Resize and convert an image without cropping, returns a base64 data URL */
export async function processImage(src: string, opts?: ProcessImageOptions): Promise<string> {
	const { maxWidth, maxHeight, quality, format } = { ...defaults, ...opts };
	const img = await loadImage(src);

	let { width, height } = img;

	if (width > maxWidth || height > maxHeight) {
		const ratio = Math.min(maxWidth / width, maxHeight / height);
		width = Math.round(width * ratio);
		height = Math.round(height * ratio);
	}

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, 0, 0, width, height);
	return canvas.toDataURL(format, quality);
}
