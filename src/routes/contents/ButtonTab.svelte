<script lang="ts">
	import { Button } from '$lib';

	const variants = ['default', 'outline', 'ghost'] as const;
	const sizes = ['sm', 'default', 'lg'] as const;
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Button Variants</h2>
		<div class="flex flex-col gap-6">
			{#each variants as variant (variant)}
				<div class="flex items-center gap-2">
					<span class="w-16 text-sm capitalize">{variant}</span>
					<div class="flex items-center gap-3">
						{#each sizes as size (size)}
							<Button {variant} {size}>Button</Button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
