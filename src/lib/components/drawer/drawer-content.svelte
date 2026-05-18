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
		'relative flex h-full max-h-[96svh] w-full flex-col rounded-t-xl bg-surface-1 px-5 shadow-xl outline-none',
		'data-[swipe-direction=left]:max-h-none data-[swipe-direction=left]:max-w-100 data-[swipe-direction=left]:rounded-none data-[swipe-direction=left]:rounded-r-xl data-[swipe-direction=left]:pr-10',
		'data-[swipe-direction=right]:max-h-none data-[swipe-direction=right]:max-w-100 data-[swipe-direction=right]:rounded-none data-[swipe-direction=right]:rounded-l-xl data-[swipe-direction=right]:pl-10',
		'data-[swipe-direction=up]:rounded-none data-[swipe-direction=up]:rounded-b-xl',
		className
	)}
>
	{@render children?.()}
</Drawer.Content>

<style>
	/* Side drawers: grabber becomes an absolutely-positioned vertical strip on the open edge */
	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='left']
			[data-scope='drawer'][data-part='grabber'],
		[data-scope='drawer'][data-part='content'][data-swipe-direction='right']
			[data-scope='drawer'][data-part='grabber']
	) {
		position: absolute;
		top: 0;
		bottom: 0;
		width: auto;
		height: 100%;
		padding: 0 0.75rem;
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='left']
			[data-scope='drawer'][data-part='grabber']
	) {
		right: 0;
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='right']
			[data-scope='drawer'][data-part='grabber']
	) {
		left: 0;
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='left']
			[data-scope='drawer'][data-part='grabber-indicator'],
		[data-scope='drawer'][data-part='content'][data-swipe-direction='right']
			[data-scope='drawer'][data-part='grabber-indicator']
	) {
		width: 4px;
		height: 2.5rem;
	}

	/* Bleed pseudo-element so background extends past rounded corners on the open edge */
	:global([data-scope='drawer'][data-part='content'])::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		height: 50px;
		background: inherit;
		pointer-events: none;
	}

	:global([data-scope='drawer'][data-part='content'][data-swipe-direction='up'])::after {
		top: auto;
		bottom: 100%;
	}

	:global([data-scope='drawer'][data-part='content'][data-swipe-direction='left'])::after {
		top: 0;
		bottom: 0;
		left: auto;
		right: 100%;
		width: 50px;
		height: auto;
	}

	:global([data-scope='drawer'][data-part='content'][data-swipe-direction='right'])::after {
		top: 0;
		bottom: 0;
		right: auto;
		left: 100%;
		width: 50px;
		height: auto;
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
