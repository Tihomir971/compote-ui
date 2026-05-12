<script lang="ts">
	import { HoverCard } from '$lib';
	import Button from '$lib/components/button/button.svelte';
	import type { Placement } from '@zag-js/popper';
</script>

<div class="max-w-4xl space-y-12 p-8">
	<section class="space-y-4">
		<h2 class="text-sm font-semibold tracking-wide text-ink-dim uppercase">Basic</h2>
		<HoverCard.Root>
			<p class="text-sm text-ink">
				Liked by
				<HoverCard.Trigger>
					{#snippet asChild(props)}
						<a
							href="#profile"
							{...props()}
							class="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
						>
							@sarah_chen
						</a>
					{/snippet}
				</HoverCard.Trigger>
				and 3 others
			</p>
			<HoverCard.Content>
				<div class="flex flex-col gap-3">
					<div class="flex items-start justify-between gap-3">
						<img
							class="size-16 rounded-full object-cover"
							src="https://i.pravatar.cc/300?u=sarah"
							alt="Sarah Chen"
						/>
						<Button class="rounded-full">Follow</Button>
					</div>
					<div>
						<p class="text-sm font-bold text-ink">Sarah Chen</p>
						<p class="text-sm text-ink-dim">@sarah_chen</p>
					</div>
					<p class="text-sm leading-relaxed text-ink">
						Design Engineer at Acme Inc. Building beautiful interfaces and design systems.
					</p>
					<div class="flex gap-4 text-sm">
						<div class="flex gap-1">
							<span class="font-bold text-ink">2,456</span>
							<span class="text-ink-dim">Following</span>
						</div>
						<div class="flex gap-1">
							<span class="font-bold text-ink">14.5K</span>
							<span class="text-ink-dim">Followers</span>
						</div>
					</div>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	</section>

	<section class="space-y-4">
		<h2 class="text-sm font-semibold tracking-wide text-ink-dim uppercase">No Arrow</h2>
		<HoverCard.Root>
			<HoverCard.Trigger>
				{#snippet asChild(props)}
					<a
						href="#profile2"
						{...props()}
						class="text-sm font-medium text-primary underline underline-offset-2"
					>
						@john_doe
					</a>
				{/snippet}
			</HoverCard.Trigger>
			<HoverCard.Content showArrow={false}>
				<div class="flex flex-col gap-3">
					<div class="flex items-start justify-between gap-3">
						<img
							class="size-16 rounded-full object-cover"
							src="https://i.pravatar.cc/300?u=john"
							alt="John Doe"
						/>
						<Button class="rounded-full">Follow</Button>
					</div>
					<div>
						<p class="text-sm font-bold text-ink">John Doe</p>
						<p class="text-sm text-ink-dim">@john_doe</p>
					</div>
					<p class="text-sm leading-relaxed text-ink">
						Full-stack developer and open source contributor.
					</p>
					<div class="flex gap-4 text-sm">
						<div class="flex gap-1">
							<span class="font-bold text-ink">891</span>
							<span class="text-ink-dim">Following</span>
						</div>
						<div class="flex gap-1">
							<span class="font-bold text-ink">3.2K</span>
							<span class="text-ink-dim">Followers</span>
						</div>
					</div>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	</section>

	<section class="space-y-4">
		<h2 class="text-sm font-semibold tracking-wide text-ink-dim uppercase">Custom Delays</h2>
		<HoverCard.Root openDelay={200} closeDelay={100}>
			<HoverCard.Trigger>
				{#snippet asChild(props)}
					<a
						href="#profile3"
						{...props()}
						class="text-sm font-medium text-primary underline underline-offset-2"
					>
						@quick_hover (200ms open / 100ms close)
					</a>
				{/snippet}
			</HoverCard.Trigger>
			<HoverCard.Content>
				<div class="flex flex-col gap-2">
					<p class="text-sm font-bold text-ink">Quick Hover</p>
					<p class="text-sm text-ink-dim">Opens faster with shorter delays.</p>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	</section>

	<section class="space-y-4">
		<h2 class="text-sm font-semibold tracking-wide text-ink-dim uppercase">Positioning</h2>
		<div class="flex flex-wrap gap-6">
			{#each ['top', 'bottom', 'left', 'right'] as side (side)}
				<HoverCard.Root positioning={{ placement: side as Placement }}>
					<HoverCard.Trigger>
						{#snippet asChild(props)}
							<a
								href="#pos"
								{...props()}
								class="text-sm font-medium text-primary underline underline-offset-2"
							>
								{side}
							</a>
						{/snippet}
					</HoverCard.Trigger>
					<HoverCard.Content>
						<p class="text-sm text-ink">Positioned on the <strong>{side}</strong>.</p>
					</HoverCard.Content>
				</HoverCard.Root>
			{/each}
		</div>
	</section>
</div>
