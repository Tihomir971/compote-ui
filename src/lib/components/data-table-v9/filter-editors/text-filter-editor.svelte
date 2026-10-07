<script lang="ts">
	import * as Field from '../../field';
	import type { ColumnFilterEditing, FilterableColumn } from '../column-filter-editing.svelte';

	type Props = {
		column: FilterableColumn;
		editing: ColumnFilterEditing;
	};

	let { column, editing }: Props = $props();
</script>

<Field.Root hideMessageLine>
	<Field.Input
		placeholder="Search..."
		bind:value={
			() => editing.textValue(column), (text) => editing.editText(column, String(text ?? ''))
		}
	/>
</Field.Root>
