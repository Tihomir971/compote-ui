import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte',
			autoInstall: true
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				test: {
					name: 'server',
					environment: 'node',
					// `.svelte.test.ts` is reserved for browser-mode component tests, which
					// this project does not have yet — see the `client` project the Svelte
					// CLI's vitest addon generates if interaction tests are ever needed.
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
