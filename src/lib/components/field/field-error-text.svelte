<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import type { FieldErrorTextProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: FieldErrorTextProps = $props();
</script>

<Field.ErrorText {...rest} class={cn('text-xs font-medium text-danger', className)}>
	{@render children?.()}
</Field.ErrorText>
