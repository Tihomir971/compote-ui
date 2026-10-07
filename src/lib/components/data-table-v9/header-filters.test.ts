import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import DataTableFixture from '../../../test-fixtures/data-table-fixture.svelte';
import { createDataTableColumnHelper } from './column-helper';
import type { CreateDataTableOptions } from './create-table.svelte';

type Row = { id: string; name: string; age: number; note: string };

const col = createDataTableColumnHelper<Row>();
const columns = col.columns([
	col.accessor('name', { header: 'Name' }),
	col.group('Info', [
		col.accessor('age', { header: 'Age', type: 'number' }),
		col.accessor('note', { header: 'Note', enableColumnFilter: false })
	]),
	col.accessorFn(() => null, { id: 'actions', header: 'Actions', type: 'action' })
]);

/** SSR a table and return its `<thead>` markup. */
function renderHead(
	props: { headerFilters?: boolean; root?: 'table' | 'virtual' },
	initialState?: CreateDataTableOptions<Row>['initialState']
) {
	const { body } = render(DataTableFixture<Row>, {
		props: {
			options: {
				data: [{ id: '1', name: 'Ada', age: 36, note: '' }],
				columns,
				initialState
			},
			root: props.root ?? 'table',
			headerFilters: props.headerFilters
		}
	});
	return body.match(/<thead[\s\S]*<\/thead>/)?.[0] ?? '';
}

/** The opening tag of the funnel trigger for `label`, or undefined when none renders. */
function funnel(head: string, label: string) {
	return head.match(new RegExp(`<button[^>]*aria-label="Filter ${label}"[^>]*>`))?.[0];
}

/** Whether a tag carries the `data-active` attribute (not just a `data-active:` class). */
const ACTIVE = /\sdata-active(?:=""|[\s>])/;

/** The opening `<th>` tag of the header cell whose funnel or label is `label`. */
function headerCell(head: string, label: string) {
	const cells = head.match(/<th[\s\S]*?<\/th>/g) ?? [];
	const cell = cells.find((th) => th.includes(`aria-label="Filter ${label}"`));
	return cell?.match(/<th[^>]*>/)?.[0];
}

describe('header filters', () => {
	it('renders no funnel unless headerFilters is set', () => {
		const head = renderHead({});
		expect(head).toContain('Name');
		expect(head).not.toContain('aria-label="Filter ');
	});

	for (const root of ['table', 'virtual'] as const) {
		it(`renders a funnel on each filterable leaf column (${root})`, () => {
			const head = renderHead({ headerFilters: true, root });
			expect(funnel(head, 'Name')).toBeDefined();
			expect(funnel(head, 'Age')).toBeDefined();
		});
	}

	it('skips columns that cannot filter and group headers', () => {
		const head = renderHead({ headerFilters: true });
		expect(funnel(head, 'Note')).toBeUndefined(); // enableColumnFilter: false
		expect(funnel(head, 'Actions')).toBeUndefined(); // action columns never filter
		expect(funnel(head, 'Info')).toBeUndefined(); // group header
	});

	it('marks the funnel of a filtered column active and pads its edge', () => {
		const head = renderHead(
			{ headerFilters: true },
			{ columnFilters: [{ id: 'age', value: [30, undefined] }] }
		);
		expect(funnel(head, 'Age')).toMatch(ACTIVE);
		expect(funnel(head, 'Name')).not.toMatch(ACTIVE);
		// Age is right aligned, so its funnel sits on the left edge.
		expect(headerCell(head, 'Age')).toMatch(/\bpl-6\b/);
		expect(headerCell(head, 'Name')).not.toMatch(/\bp[lr]-6\b/);
	});
});
