<script lang="ts">
	import { ToggleGroup } from '$lib';

	let alignment = $state(['left']);
	let formatting = $state(['bold']);
</script>

<div class="flex flex-col gap-8 p-4">
	<div class="flex flex-col gap-2">
		<p class="text-sm font-medium text-ink">Alignment (single)</p>
		<ToggleGroup.Root bind:value={alignment}>
			<ToggleGroup.Item value="left">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="21" x2="3" y1="6" y2="6" /><line x1="15" x2="3" y1="12" y2="12" /><line
						x1="17"
						x2="3"
						y1="18"
						y2="18"
					/></svg
				>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="21" x2="3" y1="6" y2="6" /><line x1="17" x2="7" y1="12" y2="12" /><line
						x1="19"
						x2="5"
						y1="18"
						y2="18"
					/></svg
				>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="right">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="21" x2="3" y1="6" y2="6" /><line x1="21" x2="9" y1="12" y2="12" /><line
						x1="21"
						x2="7"
						y1="18"
						y2="18"
					/></svg
				>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="justify">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="21" x2="3" y1="6" y2="6" /><line x1="21" x2="3" y1="12" y2="12" /><line
						x1="21"
						x2="3"
						y1="18"
						y2="18"
					/></svg
				>
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		<p class="text-xs text-ink-dim">Selected: {alignment.join(', ') || 'none'}</p>
	</div>

	<div class="flex flex-col gap-2">
		<p class="text-sm font-medium text-ink">Formatting (multiple)</p>
		<ToggleGroup.Root bind:value={formatting} multiple>
			<ToggleGroup.Item
				value="bold"
				class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold text-ink-dim transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
				>B</ToggleGroup.Item
			>
			<ToggleGroup.Item
				value="italic"
				class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-ink-dim italic transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
				>I</ToggleGroup.Item
			>
			<ToggleGroup.Item
				value="underline"
				class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-ink-dim underline transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
				>U</ToggleGroup.Item
			>
		</ToggleGroup.Root>
		<p class="text-xs text-ink-dim">Selected: {formatting.join(', ') || 'none'}</p>
	</div>

	<div class="flex flex-col gap-2">
		<p class="text-sm font-medium text-ink">With disabled item</p>
		<ToggleGroup.Root defaultValue={['left']}>
			<ToggleGroup.Item value="left">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="21" x2="3" y1="6" y2="6" /><line x1="15" x2="3" y1="12" y2="12" /><line
						x1="17"
						x2="3"
						y1="18"
						y2="18"
					/></svg
				>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="center" disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="21" x2="3" y1="6" y2="6" /><line x1="17" x2="7" y1="12" y2="12" /><line
						x1="19"
						x2="5"
						y1="18"
						y2="18"
					/></svg
				>
			</ToggleGroup.Item>
			<ToggleGroup.Item value="right">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="21" x2="3" y1="6" y2="6" /><line x1="21" x2="9" y1="12" y2="12" /><line
						x1="21"
						x2="7"
						y1="18"
						y2="18"
					/></svg
				>
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	<div class="flex flex-col gap-2">
		<p class="text-sm font-medium text-ink">Vertical orientation</p>
		<ToggleGroup.Root defaultValue={['bold']} orientation="vertical" multiple>
			<ToggleGroup.Item
				value="bold"
				class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold text-ink-dim transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
				>B</ToggleGroup.Item
			>
			<ToggleGroup.Item
				value="italic"
				class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-ink-dim italic transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
				>I</ToggleGroup.Item
			>
			<ToggleGroup.Item
				value="underline"
				class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-ink-dim underline transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
				>U</ToggleGroup.Item
			>
		</ToggleGroup.Root>
	</div>
</div>
