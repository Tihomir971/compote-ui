<script lang="ts">
	import { JsonTreeView } from '@ark-ui/svelte/json-tree-view';
	import type {
		JsonTreeViewRootBaseProps,
		JsonTreeViewTreeBaseProps
	} from '@ark-ui/svelte/json-tree-view';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';
	import { PhCaretRight } from '$lib/icons';

	interface Props extends JsonTreeViewRootBaseProps {
		class?: ClassValue;
		treeClass?: ClassValue;
		indentGuide?: JsonTreeViewTreeBaseProps['indentGuide'];
		renderValue?: JsonTreeViewTreeBaseProps['renderValue'];
	}

	let {
		class: className,
		treeClass,
		defaultExpandedDepth = 1,
		indentGuide = true,
		renderValue,
		...rootProps
	}: Props = $props();
</script>

<JsonTreeView.Root
	{defaultExpandedDepth}
	class={cn(
		'w-full overflow-auto font-mono text-xs text-ink',
		'**:data-[part=branch-content]:relative',
		'**:data-[part=branch-control]:flex **:data-[part=branch-control]:min-w-0 **:data-[part=branch-control]:cursor-pointer **:data-[part=branch-control]:items-baseline **:data-[part=branch-control]:rounded-sm **:data-[part=branch-control]:py-0.5 **:data-[part=branch-control]:pe-2 **:data-[part=branch-control]:outline-none **:data-[part=branch-control]:select-none',
		'[&_[data-part=branch-control]:focus-visible]:ring-2 [&_[data-part=branch-control]:focus-visible]:ring-ring [&_[data-part=branch-control]:focus-visible]:ring-offset-1 [&_[data-part=branch-control]:focus-visible]:ring-offset-surface-1 [&_[data-part=branch-control]:hover]:bg-surface-2 [&_[data-part=branch-control][data-highlighted]]:bg-surface-2 [&_[data-part=branch-control][data-selected]]:bg-surface-2',
		'**:data-[part=branch-indicator]:me-1 **:data-[part=branch-indicator]:inline-flex **:data-[part=branch-indicator]:size-3 **:data-[part=branch-indicator]:shrink-0 **:data-[part=branch-indicator]:origin-center **:data-[part=branch-indicator]:items-center **:data-[part=branch-indicator]:justify-center **:data-[part=branch-indicator]:text-ink-dim **:data-[part=branch-indicator]:transition-transform **:data-[part=branch-indicator]:duration-150',
		'[&_[data-part=branch-indicator][data-state=open]]:rotate-90',
		'**:data-[part=item]:relative **:data-[part=item]:flex **:data-[part=item]:min-w-0 **:data-[part=item]:rounded-sm **:data-[part=item]:py-0.5 **:data-[part=item]:pe-2 **:data-[part=item]:outline-none',
		'[&_[data-part=item]:focus-visible]:ring-2 [&_[data-part=item]:focus-visible]:ring-ring [&_[data-part=item]:focus-visible]:ring-offset-1 [&_[data-part=item]:focus-visible]:ring-offset-surface-1 [&_[data-part=item]:hover]:bg-surface-2 [&_[data-part=item][data-highlighted]]:bg-surface-2 [&_[data-part=item][data-selected]]:bg-surface-2',
		'**:data-[part=item-text]:flex **:data-[part=item-text]:min-w-0 **:data-[part=item-text]:flex-wrap **:data-[part=item-text]:items-baseline **:data-[part=item-text]:wrap-break-word',
		'**:data-[part=branch-text]:flex **:data-[part=branch-text]:min-w-0 **:data-[part=branch-text]:flex-wrap **:data-[part=branch-text]:items-baseline **:data-[part=branch-text]:wrap-break-word',
		className
	)}
	{...rootProps}
>
	<JsonTreeView.Tree
		class={cn('flex flex-col leading-[1.8] [&_svg]:size-3', treeClass)}
		{indentGuide}
		{renderValue}
	>
		{#snippet arrow()}
			<PhCaretRight class="size-3" />
		{/snippet}
	</JsonTreeView.Tree>
</JsonTreeView.Root>

<style>
	/* depth-based indentation requires calc(var(--depth)...) — not expressible in Tailwind */
	:global([data-scope='json-tree-view'] [data-part='branch-indent-guide']) {
		position: absolute;
		height: 100%;
		width: 1px;
		background: var(--compote-border);
		inset-inline-start: calc((var(--depth) - 1) * 1rem + 0.75rem);
	}

	:global([data-scope='json-tree-view'] [data-part='branch-indent-guide'][data-depth='1']) {
		inset-inline-start: 0.75rem;
	}

	:global([data-scope='json-tree-view'] [data-part='branch-control']) {
		padding-inline-start: calc((var(--depth) - 1) * 0.75rem);
	}

	:global([data-scope='json-tree-view'] [data-part='branch-control'][data-depth='1']) {
		padding-inline-start: 0.25rem;
	}

	:global([data-scope='json-tree-view'] [data-part='item']) {
		padding-inline-start: calc(((var(--depth) - 1) * 0.75rem) + 0.75rem);
	}

	:global([data-scope='json-tree-view'] [data-part='item'][data-depth='1']) {
		padding-inline-start: 1.5rem;
	}

	/* Value types — light-dark() for dark mode, not expressible in Tailwind */
	:global([data-scope='json-tree-view'] [data-type='string']) {
		color: light-dark(#16a34a, #4ade80);
	}

	:global([data-scope='json-tree-view'] [data-type='number']) {
		color: light-dark(#2563eb, #60a5fa);
	}

	:global([data-scope='json-tree-view'] [data-type='boolean']) {
		color: light-dark(#d97706, #fbbf24);
		font-weight: 600;
	}

	:global([data-scope='json-tree-view'] [data-type='null']),
	:global([data-scope='json-tree-view'] [data-type='undefined']) {
		color: var(--compote-ink-dim);
		font-style: italic;
		font-weight: 600;
	}

	:global([data-scope='json-tree-view'] [data-type='function']) {
		color: light-dark(#9333ea, #c084fc);
		font-style: italic;
	}

	:global([data-scope='json-tree-view'] [data-type='date']) {
		color: light-dark(#0891b2, #22d3ee);
	}

	:global([data-scope='json-tree-view'] [data-type='error']) {
		color: light-dark(#dc2626, #f87171);
		font-weight: 500;
	}

	:global([data-scope='json-tree-view'] [data-type='regex']) {
		color: light-dark(#7c3aed, #a78bfa);
	}

	/* Syntax elements */
	:global([data-scope='json-tree-view'] [data-kind='brace']) {
		color: var(--compote-ink);
		font-weight: 700;
	}

	:global([data-scope='json-tree-view'] [data-kind='key']) {
		color: var(--compote-primary);
		font-weight: 500;
	}

	:global([data-scope='json-tree-view'] [data-kind='colon']) {
		color: var(--compote-ink-dim);
		margin-inline: 0.25rem;
	}

	:global([data-scope='json-tree-view'] [data-kind='preview-text']) {
		color: var(--compote-ink-dim);
		font-style: italic;
	}

	:global([data-scope='json-tree-view'] [data-kind='constructor']) {
		color: var(--compote-primary);
		font-weight: 500;
	}
</style>
