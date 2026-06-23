# Files And Images

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
