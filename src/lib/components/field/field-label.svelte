<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import type { FieldLabelProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: FieldLabelProps = $props();
</script>

<Field.Label
	{...rest}
	class={cn(
		'text-sm leading-none font-medium data-disabled:cursor-not-allowed data-disabled:opacity-70',
		className
	)}
>
	{@render children?.()}
	<Field.RequiredIndicator class="ml-1 text-danger" />
</Field.Label>
