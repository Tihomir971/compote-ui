<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxLabelBaseProps } from '@ark-ui/svelte/listbox';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = ListboxLabelBaseProps & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<Listbox.Label {...restProps} class={cn('text-sm font-medium text-ink', className)}>
	{@render children?.()}
</Listbox.Label>
