<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxValueTextBaseProps } from '@ark-ui/svelte/listbox';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	type Props = ListboxValueTextBaseProps & {
		class?: ClassValue;
	};

	let { class: className, ...restProps }: Props = $props();
</script>

<Listbox.ValueText {...restProps} class={cn('text-sm text-ink', className)} />
