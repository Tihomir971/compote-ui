<script lang="ts">
	import { Card, Carousel } from '$lib';

	const images = [
		{
			src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
			alt: 'Mountain landscape'
		},
		{
			src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
			alt: 'Forest path'
		},
		{
			src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=400&fit=crop',
			alt: 'Misty forest'
		}
	];
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Image Carousel</h2>
		<Carousel slideCount={images.length} slidesPerPage={1.5} indicator>
			{#snippet slide(index)}
				<img
					src={images[index].src}
					alt={images[index].alt}
					class="w-full rounded-lg bg-surface-2 object-contain"
				/>
			{/snippet}
		</Carousel>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Custom Content Carousel</h2>
		<Carousel slideCount={3}>
			{#snippet slide(index)}
				<div
					class="flex aspect-video w-full items-center justify-center rounded-lg bg-surface-2 text-2xl font-bold text-ink-dim"
				>
					Slide {index + 1}
				</div>
			{/snippet}
		</Carousel>
	</section>
	<Card.Root>
		<Card.Header>
			<Card.Title>Thumbnail Indicator Carousel</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			<Carousel slideCount={images.length}>
				{#snippet slide(index)}
					<img
						src={images[index].src}
						alt={images[index].alt}
						class="w-full rounded-lg bg-surface-2 object-contain"
					/>
				{/snippet}
				{#snippet indicator(index)}
					<img src={images[index].src} alt={images[index].alt} class="h-full w-full object-cover" />
				{/snippet}
			</Carousel>
		</Card.Content>
	</Card.Root>
	<section>
		<h2 class="mb-4 text-lg font-semibold">Thumbnail Indicator Carousel</h2>
		<Carousel slideCount={images.length}>
			{#snippet slide(index)}
				<img
					src={images[index].src}
					alt={images[index].alt}
					class="w-full rounded-lg bg-surface-2 object-contain"
				/>
			{/snippet}
			{#snippet indicator(index)}
				<img src={images[index].src} alt={images[index].alt} class="h-full w-full object-cover" />
			{/snippet}
		</Carousel>
	</section>
</div>
