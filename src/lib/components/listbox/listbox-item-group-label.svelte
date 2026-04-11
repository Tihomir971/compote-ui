<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxItemGroupLabelBaseProps } from '@ark-ui/svelte/listbox';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = ListboxItemGroupLabelBaseProps & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<Listbox.ItemGroupLabel
	{...restProps}
	class={cn('px-2 py-1.5 text-xs font-semibold tracking-wide text-ink-dim uppercase', className)}
>
	{@render children?.()}
</Listbox.ItemGroupLabel>
