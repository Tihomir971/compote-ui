<script lang="ts">
	import { Combobox, Field } from '$lib';

	const languageItems = [
		{ value: 'english', label: 'English' },
		{ value: 'spanish', label: 'Spanish' },
		{ value: 'french', label: 'French' },
		{ value: 'german', label: 'German' },
		{ value: 'japanese', label: 'Japanese' }
	];

	let selectedLanguage = $state(languageItems[0].value);
	let selectedLanguages = $state([languageItems[0].value]);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Combobox</h2>
		<div class="flex flex-col gap-4">
			<Field.Root required>
				<Combobox
					items={languageItems}
					label="Select a language"
					bind:value={selectedLanguage}
					placeholder="Choose a language..."
				/>
			</Field.Root>
			<p class="text-sm text-ink-dim">
				Selected: <strong>{selectedLanguage}</strong>
			</p>
			<Field.Root required>
				<Combobox
					items={languageItems}
					label="Select languages"
					bind:value={selectedLanguages}
					multiple
					placeholder="Choose languages..."
				/>
			</Field.Root>
			<p class="text-sm text-ink-dim">
				Selected: <strong>{selectedLanguages.join(', ')}</strong>
			</p>
		</div>
	</section>
</div>
