<script lang="ts">
	import { Fieldset } from '@ark-ui/svelte/fieldset';
	import type { FieldsetRootProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: FieldsetRootProps = $props();
</script>

<Fieldset.Root {...rest} class={cn('m-0 flex min-w-0 flex-col gap-3 border-0 p-0', className)}>
	{@render children?.()}
</Fieldset.Root>
