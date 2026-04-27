<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerBackdropBaseProps } from '@ark-ui/svelte/drawer';

	interface Props extends DrawerBackdropBaseProps {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<Drawer.Backdrop {...rest} class={className ?? 'fixed inset-0 z-50 bg-black/50'} />

<style>
	:global([data-scope='drawer'][data-part='backdrop'][data-state='open']) {
		animation: fade-in 0.5s cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global([data-scope='drawer'][data-part='backdrop'][data-state='closed']) {
		animation: fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
