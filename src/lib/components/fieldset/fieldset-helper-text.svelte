<script lang="ts">
	import { Fieldset } from '@ark-ui/svelte/fieldset';
	import type { FieldsetHelperTextProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: FieldsetHelperTextProps = $props();
</script>

<Fieldset.HelperText {...rest} class={cn('text-sm text-ink-dim', className)}>
	{@render children?.()}
</Fieldset.HelperText>
