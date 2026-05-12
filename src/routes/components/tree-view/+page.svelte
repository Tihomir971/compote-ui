<script lang="ts">
	import { TreeView, Menu } from '$lib';

	const treeItems = [
		{
			value: 1,
			label: 'src',
			icon: 'ph:file-html',
			children: [
				{ value: 2, label: 'App.svelte', icon: 'ph:file-html' },
				{ value: 3, label: 'main.ts', icon: 'ph:file-ts' },
				{
					value: 4,
					label: 'components',
					icon: 'ph:folder',
					children: [
						{ value: 5, label: 'Button.svelte', icon: 'ph:file-html' },
						{ value: 6, label: 'Card.svelte', icon: 'ph:file-html' }
					]
				}
			]
		},
		{
			value: 7,
			label: 'public',
			icon: 'ph:folder',
			children: [
				{ value: 8, label: 'favicon.png', icon: 'ph:file-image' },
				{ value: 9, label: 'logo.svg', icon: 'ph:file-svg' }
			]
		},
		{ value: 10, label: 'package.json', icon: 'ph:file-js' },
		{ value: 11, label: 'README.md' }
	];

	let treeSelected = $state([treeItems[1].value.toString()]);
	let treeChecked = $state([treeItems[2].value.toString()]);

	let contextNodeId = $state<string | null>(null);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Tree View</h2>
		<Menu.Root>
			<Menu.ContextTrigger class="h-80 rounded-lg border border-surface-3">
				<TreeView
					items={treeItems}
					label="Project"
					bind:selectedValue={treeSelected}
					onContextMenu={({ nodeId }) => (contextNodeId = nodeId)}
				/>
			</Menu.ContextTrigger>
			<Menu.Content>
				<Menu.Item value="rename">Rename '{contextNodeId}'</Menu.Item>
				<Menu.Item value="duplicate">Duplicate</Menu.Item>
				<Menu.Separator />
				<Menu.Item value="delete">Delete</Menu.Item>
			</Menu.Content>
		</Menu.Root>
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
