<script lang="ts">
	import { Carousel } from '$lib';

	let selectedCarouselImages = $state<(string | number)[]>([]);
	const carouselImages = [
		{
			id: 'carousel-1',
			src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
			alt: 'Mountain landscape'
		},
		{
			id: 'carousel-2',
			src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
			alt: 'Forest path'
		},
		{
			id: 'carousel-3',
			src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=400&fit=crop',
			alt: 'Misty forest'
		}
	];
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Image Carousel</h2>
		<Carousel
			images={carouselImages}
			bind:selectedIds={selectedCarouselImages}
			indicator
			selectable
		/>
		<p class="text-sm text-ink-dim">
			Selected: {selectedCarouselImages.join(', ') || 'none'}
		</p>
	</section>
</div>
