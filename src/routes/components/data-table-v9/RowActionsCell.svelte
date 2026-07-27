<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import { PhEye } from '$lib/icons';

	let { label }: { label: string } = $props();
</script>

<Button
	variant="ghost"
	size="icon-sm"
	aria-label="View {label}"
	onclick={(event: MouseEvent) => {
		event.stopPropagation();
		alert(`View ${label}`);
	}}
>
	<PhEye class="size-4" />
</Button>
