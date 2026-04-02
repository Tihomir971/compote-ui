<script lang="ts">
	import { Fieldset } from '@ark-ui/svelte/fieldset';
	import type { FieldsetLegendProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: FieldsetLegendProps = $props();
</script>

<Fieldset.Legend
	{...rest}
	class={cn(
		'mb-1 font-semibold data-disabled:cursor-not-allowed data-disabled:opacity-70',
		className
	)}
>
	{@render children?.()}
</Fieldset.Legend>
