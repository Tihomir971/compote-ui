<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerContentBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	interface Props extends DrawerContentBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Drawer.Content
	{...rest}
	class={cn(
		'relative flex h-full max-h-[96svh] w-full flex-col rounded-t-2xl bg-surface-1 px-5 shadow-xl outline-none',
		'data-[swipe-direction=left]:rounded-none data-[swipe-direction=left]:rounded-r-2xl',
		'data-[swipe-direction=right]:rounded-none data-[swipe-direction=right]:rounded-l-2xl',
		'data-[swipe-direction=up]:rounded-none data-[swipe-direction=up]:rounded-b-2xl',
		className
	)}
>
	{@render children?.()}
</Drawer.Content>

<style>
	/* Bottom bleed pseudo-element so background extends below rounded corners */
	:global([data-scope='drawer'][data-part='content'])::after {
		content: '';
		position: absolute;
		bottom: -50px;
		left: 0;
		right: 0;
		height: 50px;
		background: inherit;
	}

	/* Slide animations for bottom drawer (default) */
	:global(
		[data-scope='drawer'][data-part='content']:not([data-swipe-direction])[data-state='open'],
		[data-scope='drawer'][data-part='content'][data-swipe-direction='down'][data-state='open']
	) {
		animation: slide-in-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global(
		[data-scope='drawer'][data-part='content']:not([data-swipe-direction])[data-state='closed'],
		[data-scope='drawer'][data-part='content'][data-swipe-direction='down'][data-state='closed']
	) {
		animation: slide-out-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Slide animations for top drawer */
	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='up'][data-state='open']
	) {
		animation: slide-in-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='up'][data-state='closed']
	) {
		animation: slide-out-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Slide animations for left drawer */
	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='left'][data-state='open']
	) {
		animation: slide-in-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='left'][data-state='closed']
	) {
		animation: slide-out-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Slide animations for right drawer */
	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='right'][data-state='open']
	) {
		animation: slide-in-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='right'][data-state='closed']
	) {
		animation: slide-out-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes slide-in-bottom {
		from {
			transform: translate3d(0, 100%, 0);
		}
		to {
			transform: translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0);
		}
	}

	@keyframes slide-out-bottom {
		from {
			transform: translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0);
		}
		to {
			transform: translate3d(0, 100%, 0);
		}
	}

	@keyframes slide-in-top {
		from {
			transform: translate3d(0, -100%, 0);
		}
		to {
			transform: translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0);
		}
	}

	@keyframes slide-out-top {
		from {
			transform: translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0);
		}
		to {
			transform: translate3d(0, -100%, 0);
		}
	}

	@keyframes slide-in-left {
		from {
			transform: translate3d(-100%, 0, 0);
		}
		to {
			transform: translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0);
		}
	}

	@keyframes slide-out-left {
		from {
			transform: translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0);
		}
		to {
			transform: translate3d(-100%, 0, 0);
		}
	}

	@keyframes slide-in-right {
		from {
			transform: translate3d(100%, 0, 0);
		}
		to {
			transform: translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0);
		}
	}

	@keyframes slide-out-right {
		from {
			transform: translate3d(var(--drawer-translate-x, 0), var(--drawer-translate-y, 0), 0);
		}
		to {
			transform: translate3d(100%, 0, 0);
		}
	}
</style>
