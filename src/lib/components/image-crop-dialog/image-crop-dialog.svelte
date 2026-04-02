<script lang="ts">
	import Dialog from '../dialog/dialog.svelte';
	import ImageCropper from '../image-cropper/image-cropper.svelte';
	import { Button } from '$lib';
	import { cropImage, processImage } from '$lib/utils/image-processing';
	import type { ImageCropperCropData } from '../image-cropper/types';
	import type { ImageCropDialogProps } from './types';

	let {
		open = $bindable(),
		imageSrc,
		onConfirm,
		onCancel,
		title = 'Crop Image',
		description = 'Adjust the crop area or skip to use the full image.',
		aspectRatio = undefined,
		processOptions = undefined,
		showSkipCrop = true,
		confirmLabel = 'Crop & Save',
		skipLabel = 'Skip Crop'
	}: ImageCropDialogProps = $props();

	let getCropData = $state<(() => ImageCropperCropData) | undefined>(undefined);
	let processing = $state(false);

	async function handleCrop() {
		processing = true;
		try {
			const cropData = getCropData?.();
			if (cropData) {
				const processed = await cropImage(imageSrc, cropData, processOptions);
				onConfirm(processed);
			}
		} finally {
			processing = false;
		}
	}

	async function handleSkipCrop() {
		processing = true;
		try {
			const processed = await processImage(imageSrc, processOptions);
			onConfirm(processed);
		} finally {
			processing = false;
		}
	}
</script>

<Dialog
	bind:open
	{title}
	{description}
	onOpenChange={(details) => {
		if (!details.open) onCancel();
	}}
>
	<ImageCropper bind:getCropData src={imageSrc} alt="Crop preview" {aspectRatio} />
	{#snippet footer()}
		<Button variant="outline" onclick={onCancel} disabled={processing}>Cancel</Button>
		{#if showSkipCrop}
			<Button variant="outline" onclick={handleSkipCrop} disabled={processing}>
				{processing ? 'Processing...' : skipLabel}
			</Button>
		{/if}
		<Button onclick={handleCrop} disabled={processing}>
			{processing ? 'Processing...' : confirmLabel}
		</Button>
	{/snippet}
</Dialog>
