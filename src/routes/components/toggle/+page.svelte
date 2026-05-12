<script lang="ts">
	import { Toggle, ToggleGroup, Tooltip } from '$lib';

	import PhBell from '~icons/ph/bell';
	import PhHeart from '~icons/ph/heart';
	import PhTextBolder from '~icons/ph/text-bolder';
	import PhTextItalic from '~icons/ph/text-italic';
	import PhTextUnderline from '~icons/ph/text-underline';

	import PhTextAlignLeft from '~icons/ph/text-align-left';
	import PhTextAlignCenter from '~icons/ph/text-align-center';
	import PhTextAlignRight from '~icons/ph/text-align-right';
	import PhTextAlignJustify from '~icons/ph/text-align-justify';

	let notifications = $state(false);
	let favorite = $state(true);
	let alignment = $state(['left']);
	let formatting = $state(['bold']);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Toggle</h2>
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-3">
				<Toggle bind:pressed={notifications} aria-label="Toggle notifications">
					<PhBell />
				</Toggle>
				<p class="text-sm text-ink-dim">Notifications: {notifications ? 'on' : 'off'}</p>
			</div>

			<div class="flex items-center gap-3">
				<Toggle bind:pressed={favorite} aria-label="Toggle favorite">
					<PhHeart />
					Favorite
				</Toggle>
				<p class="text-sm text-ink-dim">Favorite: {favorite ? 'on' : 'off'}</p>
			</div>

			<div class="flex items-center gap-3">
				<Toggle size="sm" aria-label="Small notifications toggle">
					<PhBell />
				</Toggle>
				<Toggle defaultPressed aria-label="Medium bold toggle">
					<PhTextBolder />
				</Toggle>
				<Toggle size="lg" disabled aria-label="Large disabled toggle">
					<PhBell />
					Disabled
				</Toggle>
			</div>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Toggle Group</h2>
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-2">
				<p class="text-sm font-medium text-ink">Alignment (single)</p>
				<ToggleGroup.Root bind:value={alignment}>
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet asChild(props)}
								<ToggleGroup.Item {...props()} value="left">
									<PhTextAlignLeft />
								</ToggleGroup.Item>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>Align left</Tooltip.Content>
					</Tooltip.Root>
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
				<p class="text-sm font-medium text-ink">Formatting (multiple, large)</p>
				<ToggleGroup.Root bind:value={formatting} multiple size="lg">
					<ToggleGroup.Item value="bold" class="font-bold">
						<PhTextBolder />
					</ToggleGroup.Item>
					<ToggleGroup.Item value="italic" class="italic">
						<PhTextItalic />
					</ToggleGroup.Item>
					<ToggleGroup.Item value="underline" class="underline">
						<PhTextUnderline />
					</ToggleGroup.Item>
				</ToggleGroup.Root>
				<p class="text-xs text-ink-dim">Selected: {formatting.join(', ') || 'none'}</p>
			</div>

			<div class="flex flex-col gap-2">
				<p class="text-sm font-medium text-ink">Sizes</p>
				<div class="flex flex-wrap items-center gap-3">
					<ToggleGroup.Root defaultValue={['left']} size="sm">
						<ToggleGroup.Item value="left">
							<PhTextAlignLeft />
						</ToggleGroup.Item>
						<ToggleGroup.Item value="center">
							<PhTextAlignCenter />
						</ToggleGroup.Item>
					</ToggleGroup.Root>
					<ToggleGroup.Root defaultValue={['left']}>
						<ToggleGroup.Item value="left">
							<PhTextAlignLeft />
						</ToggleGroup.Item>
						<ToggleGroup.Item value="center">
							<PhTextAlignCenter />
						</ToggleGroup.Item>
					</ToggleGroup.Root>
					<ToggleGroup.Root defaultValue={['left']} size="lg">
						<ToggleGroup.Item value="left">
							<PhTextAlignLeft />
						</ToggleGroup.Item>
						<ToggleGroup.Item value="center">
							<PhTextAlignCenter />
						</ToggleGroup.Item>
					</ToggleGroup.Root>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<p class="text-sm font-medium text-ink">Disabled and vertical</p>
				<div class="flex items-start gap-3">
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
					<ToggleGroup.Root defaultValue={['bold']} orientation="vertical" multiple>
						<ToggleGroup.Item value="bold" class="font-bold">
							<PhTextBolder />
						</ToggleGroup.Item>
						<ToggleGroup.Item value="italic" class="italic">
							<PhTextItalic />
						</ToggleGroup.Item>
						<ToggleGroup.Item value="underline" class="underline">
							<PhTextUnderline />
						</ToggleGroup.Item>
					</ToggleGroup.Root>
				</div>
			</div>
		</div>
	</section>
</div>
