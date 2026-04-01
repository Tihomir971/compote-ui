<script lang="ts" generics="T extends TreeNode">
	import { TreeView, createTreeCollection } from '@ark-ui/svelte/tree-view';
	import { useFilter } from '@ark-ui/svelte/locale';
	import type { TreeNode, TreeViewProps } from './types';
	import { Debounced } from 'runed';
	import PhX from '$lib/icons/PhX.svelte';
	import PhCaretRight from '$lib/icons/PhCaretRight.svelte';
	import PhMinus from '$lib/icons/PhMinus.svelte';
	import PhCheck from '$lib/icons/PhCheck.svelte';
	import PhListMagnifyingGlass from '$lib/icons/PhListMagnifyingGlass.svelte';
	import PhArrowsInSimple from '$lib/icons/PhArrowsInSimple.svelte';
	import { Button, Field } from '$lib';
	import { SvelteSet } from 'svelte/reactivity';
	import PhMagnifyingGlass from '$lib/icons/PhMagnifyingGlass.svelte';

	let {
		items = [],
		label,
		// eslint-disable-next-line no-useless-assignment
		contextNode = $bindable(null),
		selectedValue = $bindable([]),
		checkedValue = $bindable([]),
		selectionMode = 'single',
		onSelectionChange,
		onExpandedChange,
		onCheckedChange,
		...restProps
	}: TreeViewProps<T> = $props();

	const filterFns = useFilter({ sensitivity: 'base' });
	let searchTerm: string | undefined = $state();
	const debouncedSearchTerm = new Debounced(() => searchTerm, 250);
	const baseCollection = $derived(
		createTreeCollection<T>({
			nodeToValue: (node) => node.value.toString(),
			nodeToString: (node) => node.label,
			rootNode: { value: 'ROOT', label: '', children: items } as unknown as T
		})
	);
	const collection = $derived.by(() => {
		const term = debouncedSearchTerm.current ?? '';
		return term.length > 0
			? baseCollection.filter((node) => filterFns().contains(node.label, term))
			: baseCollection;
	});
	const getParentValues = (targetValues: string[]): string[] => {
		if (!targetValues?.length) return [];
		const allParentValues = new SvelteSet<string>();
		for (const targetValue of targetValues) {
			const parentNodes = baseCollection.getParentNodes(targetValue);
			if (parentNodes) {
				parentNodes.forEach((node) => allParentValues.add(node.value.toString()));
			}
		}
		return Array.from(allParentValues);
	};

	// User's manually expanded state — initialized from selected parents
	let userExpandedValue = $state<string[]>(getParentValues(selectedValue ?? []));

	// When search is active, expand everything; otherwise use user's state
	const expandedValue = $derived.by(() => {
		const cur = debouncedSearchTerm.current ?? '';
		return cur.length > 0 ? baseCollection.getBranchValues() : userExpandedValue;
	});

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		const target = event.target as HTMLElement;
		const targetNode = target.closest('[data-part="item"], [data-part="branch-control"]');
		if (targetNode) {
			const nodeId = targetNode.getAttribute('data-value');
			contextNode = nodeId ?? null;
		}
	}
	$inspect('searchTerm:', searchTerm);
</script>

<div class="flex h-full flex-col" role="none" oncontextmenu={handleContextMenu}>
	<!--
    | Varijabla       | Vrednost | Opis |
    |---|---|---|
    | `--tree-indent` | `0.75rem` | indent po nivou |
    | `--tree-icon`   | `1rem`    | širina ikone |
    | `--tree-gap`    | `0.5rem`  | razmak između elemenata |
    | `--tree-px`     | `0.75rem` | bazni levi padding
    -->
	<TreeView.Root
		{...restProps}
		{collection}
		{selectionMode}
		{selectedValue}
		{expandedValue}
		{checkedValue}
		onSelectionChange={(details) => {
			onSelectionChange?.(details);
		}}
		onExpandedChange={(details) => {
			userExpandedValue = details.expandedValue;
			onExpandedChange?.(details);
		}}
		onCheckedChange={(details) => {
			checkedValue = details.checkedValue;
			onCheckedChange?.(details);
		}}
		class="flex h-full flex-col"
		style="--tree-indent: 0rem; --tree-icon: 1rem; --tree-gap: 0.5rem; --tree-px: 0.75rem"
	>
		{#if label}
			<TreeView.Label class="px-3 pt-3 text-sm font-medium">{label}</TreeView.Label>
		{/if}

		<div class="flex gap-2 p-3">
			<TreeView.Context>
				{#snippet render(tree)}
					<Button
						variant="outline"
						size="icon"
						title="Collapse all"
						onclick={() => tree().collapse()}
					>
						<PhArrowsInSimple class="size-4" />
					</Button>
				{/snippet}
			</TreeView.Context>

			<div class="flex-1">
				<Field.Root>
					<Field.Input bind:value={searchTerm} placeholder="Search...">
						{#snippet startIcon()}
							<PhMagnifyingGlass class="size-4" />
						{/snippet}
						{#snippet endIcon()}
							<Button variant="ghost" size="icon" onclick={() => (searchTerm = '')}>
								<PhX />
							</Button>
						{/snippet}
					</Field.Input>
				</Field.Root>
			</div>
		</div>

		<div class="flex-1 overflow-x-hidden overflow-y-auto">
			<TreeView.Tree class="flex flex-col text-sm">
				{#each collection.rootNode.children ?? [] as node, index (node.value)}
					{@render renderNode(node as T, [index])}
				{/each}
			</TreeView.Tree>
		</div>
	</TreeView.Root>
</div>

{#snippet nodeCheckbox()}
	<TreeView.NodeCheckbox
		class="border-input bg-background text-primary-foreground inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary"
	>
		<TreeView.NodeCheckboxIndicator>
			{#snippet indeterminate()}
				<PhMinus class="size-3" />
			{/snippet}
			{#snippet fallback()}
				<span class="size-3"></span>
			{/snippet}
			<PhCheck class="size-3" />
		</TreeView.NodeCheckboxIndicator>
	</TreeView.NodeCheckbox>
{/snippet}

{#snippet renderNode(node: T, indexPath: number[])}
	<TreeView.NodeProvider {node} {indexPath}>
		{#if node.children}
			<TreeView.Branch class="relative">
				<TreeView.BranchControl
					class="hover:bg-accent data-selected:bg-accent data-selected:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pr-3 text-sm select-none"
					style="padding-inline-start: calc(var(--tree-px) + (var(--depth) - 1) * (var(--tree-indent) + var(--tree-icon) * 0.5))"
				>
					{#if selectionMode === 'multiple'}
						{@render nodeCheckbox()}
					{/if}
					<TreeView.BranchIndicator
						class="text-muted-foreground inline-flex items-center justify-center transition-transform duration-150 data-[state=open]:rotate-90"
					>
						<PhCaretRight class="size-3.5" />
					</TreeView.BranchIndicator>
					<TreeView.BranchText class="flex-1 truncate">
						{node.label}
					</TreeView.BranchText>
				</TreeView.BranchControl>
				<TreeView.BranchContent class="relative">
					<TreeView.BranchIndentGuide class="bg-border absolute inset-y-0 w-px" />
					{#each node.children as child, childIndex (child.value)}
						{@render renderNode(child as T, [...indexPath, childIndex])}
					{/each}
				</TreeView.BranchContent>
			</TreeView.Branch>
		{:else}
			<TreeView.Item
				class="hover:bg-accent data-selected:bg-accent data-selected:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md py-1.5 pr-3 text-sm select-none"
				style="padding-inline-start: calc(var(--tree-px) + (var(--depth) - 1) * (var(--tree-indent) + var(--tree-icon) * 0.5) + var(--tree-icon) + var(--tree-gap))"
			>
				{#if selectionMode === 'multiple'}
					{@render nodeCheckbox()}
				{/if}
				<TreeView.ItemText class="flex-1 truncate">
					{node.label}
				</TreeView.ItemText>
			</TreeView.Item>
		{/if}
	</TreeView.NodeProvider>
{/snippet}
