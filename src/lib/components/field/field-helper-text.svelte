<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import type { FieldHelperTextProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: FieldHelperTextProps = $props();
</script>

<Field.HelperText {...rest} class={cn('text-xs text-ink-dim', className)}>
	{@render children?.()}
</Field.HelperText>
