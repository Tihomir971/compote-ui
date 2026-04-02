<script lang="ts">
	import { Fieldset } from '@ark-ui/svelte/fieldset';
	import type { FieldsetErrorTextProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: FieldsetErrorTextProps = $props();
</script>

<Fieldset.ErrorText {...rest} class={cn('text-xs font-medium text-danger', className)}>
	{@render children?.()}
</Fieldset.ErrorText>
