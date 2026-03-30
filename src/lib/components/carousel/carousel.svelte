<script lang="ts">
	import PhArrowLeft from '$lib/icons/PhArrowLeft.svelte';
	import PhArrowRight from '$lib/icons/PhArrowRight.svelte';
	import PhCheck from '$lib/icons/PhCheck.svelte';
	import PhImage from '$lib/icons/PhImage.svelte';
	import PhStar from '$lib/icons/PhStar.svelte';
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselRootProps } from '@ark-ui/svelte/carousel';

	interface ImageItem {
		id?: string | number;
		src: string;
		alt?: string;
		is_primary?: boolean;
		position?: number;
	}

	interface Props extends Omit<CarouselRootProps, 'slideCount'> {
		images: ImageItem[];
		indicator?: boolean;
		selectable?: boolean;
		selectedIds?: (string | number)[];
		onSetStar?: (id: string | number) => void;
	}

	let {
		images,
		indicator = false,
		selectable = false,
		selectedIds = $bindable([]),
		onSetStar,
		...rootProps
	}: Props = $props();

	function toggleSelect(id: string | number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((i) => i !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}
</script>

{#if images.length === 0}
	<div
		class="text-ink-dim flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-12 text-center"
	>
		<PhImage class="size-10 opacity-40" />
		<p class="text-sm">No images yet.</p>
	</div>
{:else}
	<Carousel.Root slideCount={images.length} {...rootProps}>
		<Carousel.Control class="flex items-center gap-2">
			<Carousel.PrevTrigger
				class="bg-background hover:bg-accent inline-flex size-9 items-center justify-center rounded-md border shadow-sm disabled:opacity-50"
			>
				<PhArrowLeft class="size-4" />
			</Carousel.PrevTrigger>
			<Carousel.ItemGroup class="flex flex-1 overflow-hidden rounded-lg">
				{#each images as image, index (image.id ?? index)}
					{@const key = image.id ?? index}
					{@const isSelected = selectable && selectedIds.includes(key)}
					<Carousel.Item {index} class="min-w-0 flex-[0_0_100%]">
						<div class="group/slide relative">
							<img
								src={image.src}
								alt={image.alt ?? ''}
								class="bg-muted aspect-square w-full rounded-lg object-contain"
							/>
							{#if onSetStar && image.id != null}
								<button
									class="absolute top-2 left-2 z-10 transition-opacity {image.is_primary
										? 'opacity-100'
										: 'opacity-0 group-hover/slide:opacity-100'}"
									title={image.is_primary ? 'Primary image' : 'Set as primary'}
									onclick={() => onSetStar(image.id!)}
								>
									<PhStar
										class="size-5 drop-shadow {image.is_primary
											? 'fill-yellow-400 text-yellow-400'
											: 'text-white/70 hover:text-yellow-300'}"
									/>
								</button>
							{/if}
							{#if selectable}
								<button
									class="absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full border-2 transition-all {isSelected
										? 'text-primary-foreground border-primary bg-primary opacity-100'
										: 'border-white/80 bg-black/40 opacity-0 group-hover/slide:opacity-100'}"
									onclick={() => toggleSelect(key)}
								>
									{#if isSelected}
										<PhCheck class="size-3.5" />
									{/if}
								</button>
							{/if}
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.ItemGroup>
			<Carousel.NextTrigger
				class="bg-background hover:bg-accent inline-flex size-9 items-center justify-center rounded-md border shadow-sm disabled:opacity-50"
			>
				<PhArrowRight class="size-4" />
			</Carousel.NextTrigger>
		</Carousel.Control>
		{#if indicator}
			<Carousel.IndicatorGroup class="mt-2 flex justify-center gap-2">
				{#each images as image, index}
					<Carousel.Indicator
						{index}
						class="h-15 w-15 cursor-pointer overflow-hidden rounded-sm border-2 border-transparent opacity-60 transition-all data-current:border-primary data-current:opacity-100"
					>
						<img src={image.src} alt={image.alt ?? ''} class="h-full w-full object-cover" />
					</Carousel.Indicator>
				{/each}
			</Carousel.IndicatorGroup>
		{/if}
	</Carousel.Root>
{/if}
