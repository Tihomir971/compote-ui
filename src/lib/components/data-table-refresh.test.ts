import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import DataTableRefresh from './data-table-v9/toolbar/data-table-refresh.svelte';

/** SSR the refresh trigger and return its opening `<button>` tag and full body. */
function renderRefresh(props: { loading?: boolean; triggerLabel?: string }) {
	const { body } = render(DataTableRefresh, { props: { onRefresh: () => {}, ...props } });
	const tag = body.match(/<button[^>]*>/)?.[0] ?? '';
	return { tag, body };
}

describe('DataTable.Refresh', () => {
	it('renders an icon-only button with an accessible name by default', () => {
		const { tag } = renderRefresh({});
		expect(tag).toContain('type="button"');
		expect(tag).toContain('aria-label="Refresh"');
		expect(tag).toContain('aria-busy="false"');
	});

	it('uses the text label instead of aria-label when triggerLabel is set', () => {
		const { tag, body } = renderRefresh({ triggerLabel: 'Reload' });
		expect(tag).not.toContain('aria-label');
		expect(body).toContain('Reload');
	});

	it('shows the busy state when loading is forced', () => {
		const { tag, body } = renderRefresh({ loading: true });
		expect(tag).toContain('aria-busy="true"');
		expect(tag).toContain('aria-disabled="true"');
		expect(body).toContain('animate-spin');
	});

	it('does not spin when idle', () => {
		const { body } = renderRefresh({});
		expect(body).not.toContain('animate-spin');
	});
});
