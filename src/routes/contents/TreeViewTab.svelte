<script lang="ts">
	import { TreeView } from '$lib';

	const treeItems = [
		{
			value: 'folder-1',
			label: 'src',
			icon: 'ph:file-html',
			children: [
				{ value: 'file-1', label: 'App.svelte', icon: 'ph:file-html' },
				{ value: 'file-2', label: 'main.ts', icon: 'ph:file-ts' },
				{
					value: 'folder-2',
					label: 'components',
					icon: 'ph:folder',
					children: [
						{ value: 'file-3', label: 'Button.svelte', icon: 'ph:file-html' },
						{ value: 'file-4', label: 'Card.svelte', icon: 'ph:file-html' }
					]
				}
			]
		},
		{
			value: 'folder-3',
			label: 'public',
			icon: 'ph:folder',
			children: [
				{ value: 'file-5', label: 'favicon.png', icon: 'ph:file-image' },
				{ value: 'file-6', label: 'logo.svg', icon: 'ph:file-svg' }
			]
		},
		{ value: 'file-7', label: 'package.json', icon: 'ph:file-js' },
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
