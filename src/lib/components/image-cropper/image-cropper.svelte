<script lang="ts">
	import { ImageCropper, useImageCropper } from '@ark-ui/svelte/image-cropper';
	import type { ImageCropperProps } from './types';
	import { Button } from '$lib';
	import { cropImage } from '$lib/utils/image-processing';
	import type { ProcessImageOptions } from '$lib/utils/image-processing';

	let {
		src,
		alt = 'Image',
		aspectRatio = $bindable(),
		// eslint-disable-next-line no-useless-assignment
		getCroppedImage = $bindable(),
		// eslint-disable-next-line no-useless-assignment
		getCropData = $bindable(),
		// eslint-disable-next-line no-useless-assignment
		getProcessedImage = $bindable(),
		...cropperProps
	}: ImageCropperProps = $props();

	const ASPECT_RATIO_OPTIONS = [
		{ label: 'Free', value: undefined as number | undefined },
		{ label: '1:1', value: 1 },
		{ label: '4:3', value: 4 / 3 },
		{ label: '16:9', value: 16 / 9 },
		{ label: '9:16', value: 9 / 16 }
	];

	let imageAspectRatio = $state<number | undefined>(undefined);

	$effect(() => {
		if (!src) return;
		const img = new Image();
		let cancelled = false;
		img.onload = () => {
			if (!cancelled) imageAspectRatio = img.naturalWidth / img.naturalHeight;
		};
		img.src = src;
		return () => {
			cancelled = true;
		};
	});

	const imageCropper = useImageCropper(() => ({ ...cropperProps, aspectRatio }));

	// eslint-disable-next-line no-useless-assignment
	getCroppedImage = (options) => imageCropper().getCroppedImage(options);
	// eslint-disable-next-line no-useless-assignment
	getCropData = () => imageCropper().getCropData();
	// eslint-disable-next-line no-useless-assignment
	getProcessedImage = (opts?: ProcessImageOptions) =>
		cropImage(src, imageCropper().getCropData(), opts);

	let cropData = $derived(imageCropper().getCropData());
</script>

<div>
	<div class="mb-2 flex flex-wrap items-center justify-between gap-1.5">
		<div>
			{#each ASPECT_RATIO_OPTIONS as option (option.label)}
				<Button
					variant={aspectRatio === option.value ? 'default' : 'outline'}
					size="sm"
					onclick={() => {
						aspectRatio = option.value;
					}}
				>
					{option.label}
				</Button>
			{/each}
		</div>
		<p>Width: {cropData.width}px / Height: {cropData.height}px</p>
	</div>

	<ImageCropper.RootProvider value={imageCropper}>
		<ImageCropper.Viewport
			class="relative overflow-hidden rounded-lg bg-surface-2"
			style={imageAspectRatio ? `aspect-ratio: ${imageAspectRatio}` : 'aspect-ratio: 1'}
		>
			<ImageCropper.Image
				{src}
				{alt}
				crossorigin="anonymous"
				class="pointer-events-none absolute inset-0 h-full w-full object-fill select-none"
			/>
			<ImageCropper.Selection
				class="cursor-move border-2 border-white/50 [box-shadow:0_0_0_9999px_rgb(0_0_0/0.5)] outline-none focus-visible:border-primary data-dragging:cursor-grabbing data-dragging:border-white/80"
			>
				{#each ImageCropper.handles as position (position)}
					<ImageCropper.Handle
						{position}
						class="absolute flex touch-none items-center justify-center
              data-[position=bottom]:cursor-ns-resize
              data-[position=bottom-left]:cursor-nesw-resize
              data-[position=bottom-right]:cursor-nwse-resize
              data-[position=left]:cursor-ew-resize
              data-[position=right]:cursor-ew-resize
              data-[position=top]:cursor-ns-resize
              data-[position=top-left]:cursor-nwse-resize
              data-[position=top-right]:cursor-nesw-resize"
					>
						<div class="size-2 rounded-full bg-white shadow-md"></div>
					</ImageCropper.Handle>
				{/each}
				<ImageCropper.Grid
					axis="horizontal"
					class="pointer-events-none absolute inset-[33.33%_0] border-y border-white/40 opacity-0 transition-opacity data-dragging:opacity-100 data-panning:opacity-100"
				/>
				<ImageCropper.Grid
					axis="vertical"
					class="pointer-events-none absolute inset-[0_33.33%] border-x border-white/40 opacity-0 transition-opacity data-dragging:opacity-100 data-panning:opacity-100"
				/>
			</ImageCropper.Selection>
		</ImageCropper.Viewport>
	</ImageCropper.RootProvider>
</div>
