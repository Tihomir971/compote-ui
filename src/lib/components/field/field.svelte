<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import type { FieldRootProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: FieldRootProps = $props();
</script>

<Field.Root {...rest} class={cn('group flex flex-col gap-1.5', className)}>
	{@render children?.()}
</Field.Root>
