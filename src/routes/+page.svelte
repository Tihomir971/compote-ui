<script lang="ts">
	import { Button, Checkbox, CheckboxGroup, Combobox } from '$lib';

	const variants = ['solid', 'outline', 'ghost'] as const;
	const sizes = ['sm', 'md', 'lg'] as const;

	let checked = $state(false);
	const frameworkItems = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' }
	];
	let selectedFrameworks = $state<string[]>([]);
	const languageItems = [
		{ value: 'javascript', label: 'JavaScript' },
		{ value: 'typescript', label: 'TypeScript' },
		{ value: 'python', label: 'Python' },
		{ value: 'rust', label: 'Rust' },
		{ value: 'go', label: 'Go' }
	];
	let selectedLanguage = $state<string>('');
	let selectedLanguages = $state<string[]>([]);
</script>

<div
	class="mx-auto min-h-screen max-w-1/2 space-y-5 p-8 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4"
>
	<section>
		<h2 class="mb-4 text-lg font-semibold">Button</h2>
		<div class="flex flex-col gap-6">
			{#each variants as variant (variant)}
				<div class="flex items-center gap-2">
					<span class="w-16 text-sm capitalize">{variant}</span>
					<div class="flex items-center gap-3">
						{#each sizes as size (size)}
							<Button {variant} {size}>{size}</Button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>
	<section class="flex gap-2 *:size-20 *:rounded *:border">
		<div class="bg-well"></div>
		<div class="bg-surface-document"></div>
		<div class="bg-surface-1"></div>
		<div class="bg-surface-2"></div>
		<div class="bg-surface-3"></div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Checkbox</h2>
		<div class="flex flex-col gap-4">
			<Checkbox
				label="Accept terms and conditions"
				{checked}
				onCheckedChange={(e) => (checked = !!e.checked)}
			>
				You agree to our terms of service and privacy policy.
			</Checkbox>
			<Checkbox
				label="Accept terms and conditions"
				{checked}
				onCheckedChange={(e) => (checked = !!e.checked)}
			/>
			<p>Status id: {checked}</p>
		</div>
	</section>
	<section>
		<h2 class="mb-4 text-lg font-semibold">Checkbox Group</h2>
		<CheckboxGroup items={frameworkItems} bind:value={selectedFrameworks} />
		<CheckboxGroup items={frameworkItems} bind:value={selectedFrameworks} orientation="vertical" />
		<p class="text-foreground/60 mt-4 text-sm">
			Selected: {selectedFrameworks.join(', ') || 'none'}
		</p>
	</section>
	<section>
		<h2 class="mb-4 text-lg font-semibold">Combobox</h2>
		<div class="flex flex-col gap-4">
			<Combobox
				items={languageItems}
				bind:value={selectedLanguage}
				label="Single-select Combobox"
				placeholder="Select a language"
			/>
			<p class="text-foreground/60 text-sm">Selected: {selectedLanguage || 'none'}</p>
			<Combobox
				items={languageItems}
				bind:value={selectedLanguages}
				label="Multi-select Combobox"
				placeholder="Select languages"
				multiple
			/>
			<p class="text-foreground/60 text-sm">
				Selected: {selectedLanguages.join(', ') || 'none'}
			</p>
		</div>
	</section>
</div>
