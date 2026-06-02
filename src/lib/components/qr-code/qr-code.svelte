<script lang="ts">
	import { QrCode, type QrCodeRootBaseProps } from '@ark-ui/svelte/qr-code';
	import { cn } from 'tailwind-variants';

	type Size = 'sm' | 'md' | 'lg' | 'xl';

	interface Props extends QrCodeRootBaseProps {
		size?: Size;
		class?: string;
	}

	const sizeMap: Record<Size, number> = {
		sm: 80,
		md: 120,
		lg: 160,
		xl: 200
	};

	let { size = 'md', class: className, ...restProps }: Props = $props();

	const px = $derived(sizeMap[size]);
</script>

<QrCode.Root {...restProps} class={cn('inline-flex flex-col', className)} style="--qr-size: {px}px">
	<QrCode.Frame class="fill-current" style="width: var(--qr-size); height: var(--qr-size);">
		<QrCode.Pattern />
	</QrCode.Frame>
</QrCode.Root>
