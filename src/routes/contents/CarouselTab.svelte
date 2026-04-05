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

	const indices3 = [0, 1, 2];
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Image Carousel</h2>
		<Carousel.Root slideCount={images.length} slidesPerPage={1.5}>
			<Carousel.Control>
				<Carousel.PrevTrigger />
				<Carousel.ItemGroup>
					{#each images as img, i (i)}
						<Carousel.Item index={i}>
							<img
								src={img.src}
								alt={img.alt}
								class="w-full rounded-lg bg-surface-2 object-contain"
							/>
						</Carousel.Item>
					{/each}
				</Carousel.ItemGroup>
				<Carousel.NextTrigger />
			</Carousel.Control>
			<Carousel.IndicatorGroup>
				{#each images as img, i (i)}
					<Carousel.Indicator index={i} aria-label={img.alt} />
				{/each}
			</Carousel.IndicatorGroup>
		</Carousel.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Custom Content Carousel</h2>
		<Carousel.Root slideCount={3}>
			<Carousel.Control>
				<Carousel.PrevTrigger />
				<Carousel.ItemGroup>
					{#each indices3 as i (i)}
						<Carousel.Item index={i}>
							<div
								class="flex aspect-video w-full items-center justify-center rounded-lg bg-surface-2 text-2xl font-bold text-ink-dim"
							>
								Slide {i + 1}
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.ItemGroup>
				<Carousel.NextTrigger />
			</Carousel.Control>
		</Carousel.Root>
	</section>

	<Card.Root>
		<Card.Header>
			<Card.Title>Thumbnail Indicator Carousel</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			<Carousel.Root slideCount={images.length}>
				<Carousel.Control>
					<Carousel.PrevTrigger />
					<Carousel.ItemGroup>
						{#each images as img, i (i)}
							<Carousel.Item index={i}>
								<img
									src={img.src}
									alt={img.alt}
									class="w-full rounded-lg bg-surface-2 object-contain"
								/>
							</Carousel.Item>
						{/each}
					</Carousel.ItemGroup>
					<Carousel.NextTrigger />
				</Carousel.Control>
				<Carousel.IndicatorGroup>
					{#each images as img, i (i)}
						<Carousel.Indicator index={i} thumbnail>
							<img src={img.src} alt={img.alt} />
						</Carousel.Indicator>
					{/each}
				</Carousel.IndicatorGroup>
			</Carousel.Root>
		</Card.Content>
	</Card.Root>
</div>
