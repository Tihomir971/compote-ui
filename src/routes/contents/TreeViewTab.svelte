<script lang="ts">
	import { TreeView } from '$lib';

	const treeItems = [
		{
			value: 'folder-1',
			label: 'src',
			children: [
				{ value: 'file-1', label: 'App.svelte' },
				{ value: 'file-2', label: 'main.ts' },
				{
					value: 'folder-2',
					label: 'components',
					children: [
						{ value: 'file-3', label: 'Button.svelte' },
						{ value: 'file-4', label: 'Card.svelte' }
					]
				}
			]
		},
		{
			value: 'folder-3',
			label: 'public',
			children: [
				{ value: 'file-5', label: 'favicon.png' },
				{ value: 'file-6', label: 'logo.svg' }
			]
		},
		{ value: 'file-7', label: 'package.json' },
		{ value: 'file-8', label: 'README.md' }
	];

	let treeSelected = $state([treeItems[1].value]);
	let treeChecked = $state([treeItems[2].value]);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Tree View</h2>
		<div class="h-80 rounded-lg border border-surface-3">
			<TreeView items={treeItems} label="Project" bind:selectedValue={treeSelected} />
		</div>
		<p class="mt-2 text-sm text-ink-dim">Selected: {treeSelected.join(', ')}</p>

		<section>
			<h2 class="mb-4 text-lg font-semibold">Tree View with Checkboxes</h2>
			<div class="h-80 rounded-lg border border-surface-3">
				<TreeView
					items={treeItems}
					label="Project"
					bind:selectedValue={treeSelected}
					bind:checkedValue={treeChecked}
					selectionMode="multiple"
				/>
			</div>
			<p class="mt-2 text-sm text-ink-dim">Checked: {treeChecked.join(', ')}</p>
		</section>
	</section>
</div>
