<script lang="ts">
	import PhArrowLeft from '$lib/icons/PhArrowLeft.svelte';
	import PhArrowRight from '$lib/icons/PhArrowRight.svelte';
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselRootProps } from '@ark-ui/svelte/carousel';
	import type { Snippet } from 'svelte';

	interface Props extends CarouselRootProps {
		slide: Snippet<[number]>;
		indicator?: boolean | Snippet<[number]>;
	}

	let { slideCount, slide, indicator = false, ...rootProps }: Props = $props();
</script>

<Carousel.Root {slideCount} {...rootProps}>
	<Carousel.Control class="flex items-center gap-2">
		<Carousel.PrevTrigger
			class="inline-flex size-9 items-center justify-center rounded-md border bg-surface-1 shadow-sm hover:bg-surface-2 active:bg-surface-3 disabled:opacity-50"
		>
			<PhArrowLeft class="size-4" />
		</Carousel.PrevTrigger>
		<Carousel.ItemGroup class="flex flex-1 overflow-hidden rounded-lg">
			{#each { length: slideCount } as _, index}
				<Carousel.Item {index} class="min-w-0 flex-[0_0_100%]">
					{@render slide(index)}
				</Carousel.Item>
			{/each}
		</Carousel.ItemGroup>
		<Carousel.NextTrigger
			class="inline-flex size-9 items-center justify-center rounded-md border bg-surface-1 shadow-sm hover:bg-surface-2 active:bg-surface-3 disabled:opacity-50"
		>
			<PhArrowRight class="size-4" />
		</Carousel.NextTrigger>
	</Carousel.Control>
	{#if indicator}
		<Carousel.Context>
			{#snippet render(api)}
				<Carousel.IndicatorGroup class="mt-2 flex justify-center gap-2">
					{#each api().pageSnapPoints as _, index}
						<Carousel.Indicator
							{index}
							class={typeof indicator === 'function'
								? 'h-14 w-14 cursor-pointer overflow-hidden rounded-sm border-2 border-transparent opacity-60 transition-all data-current:border-primary data-current:opacity-100'
								: 'size-2 cursor-pointer rounded-full bg-surface-3 data-current:bg-primary'}
						>
							{#if typeof indicator === 'function'}
								{@render indicator(index)}
							{/if}
						</Carousel.Indicator>
					{/each}
				</Carousel.IndicatorGroup>
			{/snippet}
		</Carousel.Context>
	{/if}
</Carousel.Root>
