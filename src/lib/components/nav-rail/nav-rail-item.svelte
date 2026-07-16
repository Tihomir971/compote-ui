<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';

	type Props = Omit<HTMLAnchorAttributes, 'class'> &
		Omit<HTMLButtonAttributes, 'class'> & {
			icon?: Snippet;
			label: string;
			active?: boolean;
			class?: ClassValue;
		};

	let { icon, label, active = false, class: className, ...rest }: Props = $props();

	const base = $derived(
		cn(
			'flex items-center gap-3 w-full rounded-md p-2 text-left text-ink-dim transition-colors',
			'hover:bg-surface-2 hover:text-ink data-active:bg-surface-2 data-active:text-primary',
			className
		)
	);

	const iconBox = 'grid size-6 shrink-0 place-items-center [&>svg]:size-5';
	const labelClass = cn(
		'min-w-0 truncate whitespace-nowrap opacity-0 transition-opacity',
		'group-hover:opacity-100 group-focus-within:opacity-100 group-data-expanded:opacity-100'
	);
</script>

{#if rest.href}
	<a
		title={label}
		aria-current={active ? 'page' : undefined}
		data-active={active || undefined}
		class={base}
		{...rest}
	>
		<span class={iconBox}>{@render icon?.()}</span>
		<span class={labelClass}>{label}</span>
	</a>
{:else}
	<button
		type="button"
		title={label}
		aria-current={active ? 'page' : undefined}
		data-active={active || undefined}
		class={base}
		{...rest}
	>
		<span class={iconBox}>{@render icon?.()}</span>
		<span class={labelClass}>{label}</span>
	</button>
{/if}
