<script lang="ts">
	import { TagsInput } from '$lib';

	let frameworks = $state(['Svelte', 'React']);
	let empty = $state<string[]>([]);
	let readOnlyTags = $state(['Locked', 'Tags']);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Tags Input</h2>
		<div class="flex flex-col gap-4">
			<TagsInput label="Frameworks (predefined tags)" bind:value={frameworks} />
			<p class="text-sm text-ink-dim">Value: {frameworks.join(', ')}</p>

			<TagsInput label="Empty" placeholder="Add a tag" bind:value={empty} />

			<TagsInput label="Invalid" bind:value={empty} invalid />

			<TagsInput label="Disabled" bind:value={frameworks} disabled />

			<TagsInput label="Read only" bind:value={readOnlyTags} readOnly />
		</div>
	</section>
</div>
