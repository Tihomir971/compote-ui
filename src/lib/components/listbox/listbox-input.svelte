<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxInputBaseProps } from '@ark-ui/svelte/listbox';
	import { cn } from 'tailwind-variants';
	import { getListboxContext } from './listbox-context';

	type Props = ListboxInputBaseProps & {
		class?: string;
		placeholder?: string;
		oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
	};

	let { class: className, oninput, ...restProps }: Props = $props();

	const ctx = getListboxContext();
</script>

<Listbox.Input
	{...restProps}
	oninput={(e) => {
		ctx.filter(e.currentTarget.value);
		oninput?.(e);
	}}
	class={cn(
		'w-full rounded-md border border-surface-3 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-ink-dim focus-visible:border-primary focus-visible:shadow-xs',
		className
	)}
/>
