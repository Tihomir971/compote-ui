<script lang="ts">
	import { Drawer } from '@ark-ui/svelte/drawer';
	import type { DrawerContentBaseProps } from '@ark-ui/svelte/drawer';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	interface Props extends DrawerContentBaseProps {
		class?: ClassValue;
		backdropClass?: ClassValue;
		positionerClass?: ClassValue;
		maxWidth?: string;
		maxHeight?: string;
	}

	let {
		class: className,
		backdropClass,
		positionerClass,
		maxWidth,
		maxHeight,
		children,
		draggable = false,
		...rest
	}: Props = $props();
</script>

<Drawer.Backdrop
	class={cn(
		'fixed inset-0 z-50 bg-black/50',
		'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
		'data-[state=open]:animate-in data-[state=open]:fade-in-0',
		backdropClass
	)}
/>
<Drawer.Positioner
	class={cn(
		'fixed inset-0 z-50 flex items-end justify-center',
		'data-[swipe-direction=left]:items-stretch data-[swipe-direction=left]:justify-start',
		'data-[swipe-direction=right]:items-stretch data-[swipe-direction=right]:justify-end',
		'data-[swipe-direction=up]:items-start',
		positionerClass
	)}
>
	<Drawer.Content
		{...rest}
		{draggable}
		style={[
			maxWidth && `--drawer-max-width:${maxWidth}`,
			maxHeight && `--drawer-max-height:${maxHeight}`
		]
			.filter(Boolean)
			.join(';')}
		class={cn(
			'pointer-events-auto relative flex h-full w-full flex-col bg-surface-1 shadow-xl outline-none',
			className
		)}
	>
		{@render children?.()}
	</Drawer.Content>
</Drawer.Positioner>

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

	/* Bottom/top drawers: cap height, overridable via --drawer-max-height */
	:global(
		[data-scope='drawer'][data-part='content']:not([data-swipe-direction]),
		[data-scope='drawer'][data-part='content'][data-swipe-direction='down'],
		[data-scope='drawer'][data-part='content'][data-swipe-direction='up']
	) {
		max-height: var(--drawer-max-height, 96svh);
	}

	/* Side drawers: constrain width, remove height cap — overridable via --drawer-max-width */
	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='left'],
		[data-scope='drawer'][data-part='content'][data-swipe-direction='right']
	) {
		max-width: var(--drawer-max-width, 25rem);
		max-height: none;
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

	:global([data-scope='drawer'][data-part='content'][data-state='open']) {
		animation-name: enter;
		animation-duration: 500ms;
		animation-fill-mode: both;
	}
	:global([data-scope='drawer'][data-part='content'][data-state='closed']) {
		animation-name: exit;
		animation-duration: 300ms;
		animation-fill-mode: both;
	}

	:global(
		[data-scope='drawer'][data-part='content']:not([data-swipe-direction])[data-state='open'],
		[data-scope='drawer'][data-part='content'][data-swipe-direction='down'][data-state='open']
	) {
		--tw-enter-translate-y: 100%;
	}
	:global(
		[data-scope='drawer'][data-part='content']:not([data-swipe-direction])[data-state='closed'],
		[data-scope='drawer'][data-part='content'][data-swipe-direction='down'][data-state='closed']
	) {
		--tw-exit-translate-y: 100%;
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='up'][data-state='open']
	) {
		--tw-enter-translate-y: -100%;
	}
	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='up'][data-state='closed']
	) {
		--tw-exit-translate-y: -100%;
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='left'][data-state='open']
	) {
		--tw-enter-translate-x: -100%;
	}
	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='left'][data-state='closed']
	) {
		--tw-exit-translate-x: -100%;
	}

	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='right'][data-state='open']
	) {
		--tw-enter-translate-x: 100%;
	}
	:global(
		[data-scope='drawer'][data-part='content'][data-swipe-direction='right'][data-state='closed']
	) {
		--tw-exit-translate-x: 100%;
	}
</style>
