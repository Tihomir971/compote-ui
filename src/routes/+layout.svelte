<script lang="ts">
	import { LocaleProvider } from '@ark-ui/svelte/locale';
	import './layout.css';
	// Supports weights 200-900
	import '@fontsource-variable/nunito-sans/wght.css';

	const { children } = $props();
</script>

<LocaleProvider locale="sr-Latn-RS">
	{@render children()}
</LocaleProvider>
