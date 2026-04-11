<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxValueTextBaseProps } from '@ark-ui/svelte/listbox';
	import { cn } from 'tailwind-variants';

	type Props = ListboxValueTextBaseProps & {
		class?: string;
	};

	let { class: className, ...restProps }: Props = $props();
</script>

<Listbox.ValueText {...restProps} class={cn('text-sm text-ink', className)} />
