<script lang="ts">
	import { LocaleProvider } from '@ark-ui/svelte/locale';
	import './layout.css';
	import '@fontsource-variable/wix-madefor-text/wght.css';

	const { children } = $props();
</script>

<LocaleProvider locale="sr-Latn-RS">
	{@render children()}
</LocaleProvider>
