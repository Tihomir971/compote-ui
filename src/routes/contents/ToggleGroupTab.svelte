<script lang="ts">
	import { ToggleGroup } from '$lib';

	import PhTextBolder from '~icons/ph/text-bolder';
	import PhTextItalic from '~icons/ph/text-italic';
	import PhTextUnderline from '~icons/ph/text-underline';

	import PhTextAlignLeft from '~icons/ph/text-align-left';
	import PhTextAlignCenter from '~icons/ph/text-align-center';
	import PhTextAlignRight from '~icons/ph/text-align-right';
	import PhTextAlignJustify from '~icons/ph/text-align-justify';

	let alignment = $state(['left']);
	let formatting = $state(['bold']);
</script>

<div class="flex flex-col gap-8 p-4">
	<div class="flex flex-col gap-2">
		<p class="text-sm font-medium text-ink">Alignment (single)</p>
		<ToggleGroup.Root bind:value={alignment}>
			<ToggleGroup.Item value="left">
				<PhTextAlignLeft />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="center">
				<PhTextAlignCenter />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="right">
				<PhTextAlignRight />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="justify">
				<PhTextAlignJustify />
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
			>
				<PhTextBolder />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="italic"
				class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-ink-dim italic transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
			>
				<PhTextItalic />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="underline"
				class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-ink-dim underline transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
			>
				<PhTextUnderline />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		<p class="text-xs text-ink-dim">Selected: {formatting.join(', ') || 'none'}</p>
	</div>

	<div class="flex flex-col gap-2">
		<p class="text-sm font-medium text-ink">With disabled item</p>
		<ToggleGroup.Root defaultValue={['left']}>
			<ToggleGroup.Item value="left">
				<PhTextAlignLeft />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="center" disabled>
				<PhTextAlignCenter />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="right">
				<PhTextAlignRight />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	<div class="flex flex-col gap-2">
		<p class="text-sm font-medium text-ink">Vertical orientation</p>
		<ToggleGroup.Root defaultValue={['bold']} orientation="vertical" multiple>
			<ToggleGroup.Item
				value="bold"
				class="inline-flex size-10 items-center justify-center rounded-md text-sm font-bold text-ink-dim transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
			>
				<PhTextBolder />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="italic"
				class="inline-flex size-10 items-center justify-center rounded-md text-sm text-ink-dim italic transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
			>
				<PhTextItalic />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="underline"
				class="inline-flex size-10 items-center justify-center rounded-md text-sm text-ink-dim underline transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm"
			>
				<PhTextUnderline />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>
</div>
