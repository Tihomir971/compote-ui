<script lang="ts">
	import { Avatar } from '@ark-ui/svelte/avatar';
	import { cn } from 'tailwind-variants';
	import type { AvatarProps, AvatarSize } from './avatar.types';

	const sizeClasses: Record<AvatarSize, string> = {
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-12 text-base',
		xl: 'size-16 text-lg'
	};

	function getInitials(name: string): string {
		return name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();
	}

	let {
		src,
		alt,
		fallback,
		size = 'md',
		class: className,
		...rest
	}: AvatarProps & { class?: string } = $props();

	const displayFallback = $derived(fallback ? getInitials(fallback) : '');
</script>

<Avatar.Root
	class={cn(
		'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2 font-medium text-ink select-none',
		sizeClasses[size],
		className
	)}
	{...rest}
>
	<Avatar.Image
		{src}
		{alt}
		class="h-full w-full rounded-[inherit] object-cover data-[state=hidden]:hidden"
	/>
	<Avatar.Fallback class="data-[state=hidden]:hidden">
		{displayFallback}
	</Avatar.Fallback>
</Avatar.Root>
