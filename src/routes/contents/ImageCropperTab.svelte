<script lang="ts">
	import { ImageCropper } from '$lib';
	let imageCropperSrc = $state(
		'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&h=600&fit=crop'
	);
	let imageCropperAspectRatio = $state(16 / 9);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Image Cropper</h2>
		<ImageCropper src={imageCropperSrc} bind:aspectRatio={imageCropperAspectRatio} />
	</section>
</div>
