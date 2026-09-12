# Files And Images

## ImageUpload

Single-image upload/replace/delete widget — a preview box with a corner `Menu` badge
(click-triggered, works on touch) opening "Upload/Replace" and "Delete" actions. Selecting a file
routes through `ImageCropDialog` automatically, so this is the easiest way to wire up an avatar or
banner uploader — no manual dropzone/crop-dialog wiring needed.

```svelte
<script lang="ts">
	let avatarUrl = $state<string | undefined>();

	function handleChange(blob: Blob) {
		const form = new FormData();
		form.append('image', blob, 'avatar.webp');
		fetch('/upload', { method: 'POST', body: form });
	}
</script>

<ImageUpload
	bind:value={avatarUrl}
	aspectRatio={1}
	onChange={handleChange}
	onDelete={() => {
		/* clear on server */
	}}
/>

<!-- Square/banner variant: size + shape via class -->
<ImageUpload
	bind:value={bannerUrl}
	shape="square"
	class="aspect-video w-64"
	aspectRatio={16 / 9}
	uploadLabel="Upload banner"
/>
```

Props: `value?: string` (bindable), `shape?: 'circle' | 'square'` (default `'circle'`),
`class?: ClassValue` (default `'size-24'` — controls preview box sizing), `aspectRatio?: number`
(passed to the crop dialog), `processOptions?: ProcessImageOptions`,
`uploadLabel?`/`replaceLabel?`/`deleteLabel?: string`, `onChange: (blob: Blob) => void`,
`onDelete: () => void`.

`value` is updated internally to an object URL after a successful crop; the previous object URL is
revoked automatically. Delete has **no built-in confirmation** — wrap `onDelete` in your own
`AlertDialog` if you need one.

## ImageCropDialog

Use `ImageCropDialog` for the complete upload/crop flow.

```svelte
<script lang="ts">
	import { FileUploadDropzone, ImageCropDialog, fileToDataUrl } from 'compote-ui';

	let cropOpen = $state(false);
	let imageSrc = $state('');
	let previewUrl = $state<string | undefined>();

	async function handleFile(file: File) {
		imageSrc = await fileToDataUrl(file);
		cropOpen = true;
	}

	function handleConfirm(blob: Blob) {
		cropOpen = false;
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		previewUrl = URL.createObjectURL(blob);
	}
</script>

<FileUploadDropzone
	fileType="image"
	onFileAccept={(details) => {
		if (details.files[0]) handleFile(details.files[0]);
	}}
/>

<ImageCropDialog
	bind:open={cropOpen}
	{imageSrc}
	onConfirm={handleConfirm}
	onCancel={() => (cropOpen = false)}
/>
```

Image utilities are browser-only:

```ts
import { fileToDataUrl, processImage, cropImage } from 'compote-ui';
```

`ProcessImageOptions`:

```ts
type ProcessImageOptions = {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number;
	format?: 'image/webp' | 'image/jpeg' | 'image/png';
	trim?: boolean;
	trimThreshold?: number;
};
```

Prefer `getProcessedImage` over Ark UI display-resolution crop output:

```svelte
<script lang="ts">
	let getProcessedImage = $state<((opts?: ProcessImageOptions) => Promise<Blob>) | undefined>();
</script>

<ImageCropper src={imageSrc} bind:getProcessedImage aspectRatio={1} />

<Button
	onclick={async () => {
		const blob = await getProcessedImage?.({ maxWidth: 1200 });
	}}
>
	Save
</Button>
```
