/**
 * Client-side image processing utilities using the Canvas API.
 * These are browser-only utilities — they will throw if called during SSR.
 */

export interface ProcessImageOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number;
	format?: 'image/webp' | 'image/jpeg' | 'image/png';
	/** Trim near-white/near-transparent edges before resizing (default: false) */
	trim?: boolean;
	/** 0–255 tolerance for what counts as "white" (default: 10) */
	trimThreshold?: number;
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
	format: 'image/webp',
	trim: false,
	trimThreshold: 10
};

function canvasToBlob(canvas: HTMLCanvasElement, format: string, quality: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob);
				else reject(new Error('canvas.toBlob failed'));
			},
			format,
			quality
		);
	});
}

/** Returns the bounding box of non-white/non-transparent pixels */
function getTrimBounds(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	threshold: number
): CropRegion {
	const { data } = ctx.getImageData(0, 0, width, height);

	function isBackground(i: number) {
		const a = data[i + 3];
		if (a < threshold) return true; // transparent
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];
		return r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold;
	}

	let top = 0;
	outer: for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (!isBackground((y * width + x) * 4)) { top = y; break outer; }
		}
	}

	let bottom = height - 1;
	outer: for (let y = height - 1; y >= 0; y--) {
		for (let x = 0; x < width; x++) {
			if (!isBackground((y * width + x) * 4)) { bottom = y; break outer; }
		}
	}

	let left = 0;
	outer: for (let x = 0; x < width; x++) {
		for (let y = top; y <= bottom; y++) {
			if (!isBackground((y * width + x) * 4)) { left = x; break outer; }
		}
	}

	let right = width - 1;
	outer: for (let x = width - 1; x >= 0; x--) {
		for (let y = top; y <= bottom; y++) {
			if (!isBackground((y * width + x) * 4)) { right = x; break outer; }
		}
	}

	return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

function applyTrim(
	sourceCanvas: HTMLCanvasElement,
	threshold: number
): HTMLCanvasElement {
	const ctx = sourceCanvas.getContext('2d')!;
	const { x, y, width, height } = getTrimBounds(ctx, sourceCanvas.width, sourceCanvas.height, threshold);
	const trimmed = document.createElement('canvas');
	trimmed.width = width;
	trimmed.height = height;
	trimmed.getContext('2d')!.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
	return trimmed;
}

function scaleCanvas(src: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement {
	let { width, height } = src;
	if (width > maxWidth || height > maxHeight) {
		const ratio = Math.min(maxWidth / width, maxHeight / height);
		width = Math.round(width * ratio);
		height = Math.round(height * ratio);
	}
	if (width === src.width && height === src.height) return src;
	const scaled = document.createElement('canvas');
	scaled.width = width;
	scaled.height = height;
	scaled.getContext('2d')!.drawImage(src, 0, 0, width, height);
	return scaled;
}

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
): Promise<Blob> {
	const { maxWidth, maxHeight, quality, format, trim, trimThreshold } = { ...defaults, ...opts };
	const img = await loadImage(src);

	let canvas = document.createElement('canvas');
	canvas.width = crop.width;
	canvas.height = crop.height;
	canvas.getContext('2d')!.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

	if (trim) canvas = applyTrim(canvas, trimThreshold);
	canvas = scaleCanvas(canvas, maxWidth, maxHeight);

	return canvasToBlob(canvas, format, quality);
}

/** Resize and convert an image without cropping, returns a Blob */
export async function processImage(src: string, opts?: ProcessImageOptions): Promise<Blob> {
	const { maxWidth, maxHeight, quality, format, trim, trimThreshold } = { ...defaults, ...opts };
	const img = await loadImage(src);

	let canvas = document.createElement('canvas');
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	canvas.getContext('2d')!.drawImage(img, 0, 0);

	if (trim) canvas = applyTrim(canvas, trimThreshold);
	canvas = scaleCanvas(canvas, maxWidth, maxHeight);

	return canvasToBlob(canvas, format, quality);
}
