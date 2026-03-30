<script lang="ts" generics="T extends string | number">
	import { Checkbox } from '@ark-ui/svelte/checkbox';
	import type { CheckboxGroupProps } from './checkbox-group.types';
	import CheckboxItem from './checkbox.svelte';

	let {
		items,
		value = $bindable([]),
		onValueChange,
		orientation = 'horizontal',
		...rest
	}: CheckboxGroupProps<T> = $props();

	const arkValue = $derived(value.map(String));
</script>

<Checkbox.Group
	value={arkValue}
	onValueChange={(newValue) => {
		value = items.filter((item) => newValue.includes(String(item.value))).map((item) => item.value);
		onValueChange?.(newValue);
	}}
	{...rest}
	class={orientation === 'vertical' ? 'flex flex-col gap-0.5' : 'flex flex-wrap gap-4'}
>
	{#each items as item (item.value)}
		<CheckboxItem value={String(item.value)} label={item.label} />
	{/each}
</Checkbox.Group>
