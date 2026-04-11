<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxEmptyBaseProps } from '@ark-ui/svelte/listbox';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = ListboxEmptyBaseProps & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<Listbox.Empty {...restProps} class={cn('py-4 text-center text-sm text-ink-dim', className)}>
	{@render children?.()}
</Listbox.Empty>
