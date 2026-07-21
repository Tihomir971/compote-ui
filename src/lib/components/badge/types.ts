import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ClassValue } from 'tailwind-variants';
import type { BadgeColor, BadgeVariant } from './badge.variants';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'class'> {
	variant?: BadgeVariant;
	color?: BadgeColor;
	icon?: Snippet;
	class?: ClassValue;
}

export type { BadgeColor, BadgeVariant };
