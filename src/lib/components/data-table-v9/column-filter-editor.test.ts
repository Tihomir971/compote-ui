import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import DataTableFixture from '../../../test-fixtures/data-table-fixture.svelte';
import { createDataTableColumnHelper } from './column-helper';

type Row = { id: string; name: string; age: number; active: boolean };

const col = createDataTableColumnHelper<Row>();
const columns = col.columns([
	col.accessor('name', { header: 'Name' }),
	col.accessor('age', { header: 'Age', type: 'number' }),
	col.accessor('active', { header: 'Active', type: 'boolean' })
]);

/** SSR the standalone editor of one column, with no `editing` passed in. */
function renderEditor(columnId: string, columnFilters: { id: string; value: unknown }[] = []) {
	const { body } = render(DataTableFixture<Row>, {
		props: {
			options: {
				data: [{ id: '1', name: 'Ada', age: 36, active: true }],
				columns,
				initialState: { columnFilters }
			},
			editorColumn: columnId
		}
	});
	return body;
}

/** The `<input>` tags in the markup that carry every one of `attrs`. */
function inputs(html: string, ...attrs: string[]) {
	const tags = html.match(/<input[^>]*>/g) ?? [];
	return tags.filter((tag) => attrs.every((attr) => tag.includes(attr)));
}

describe('ColumnFilterEditor outside the table', () => {
	it("renders the editor for the column's type without a host's editing state", () => {
		expect(inputs(renderEditor('age'), 'role="spinbutton"')).toHaveLength(2); // From / To
		expect(renderEditor('active')).toMatch(/<button[^>]*>(<!---->)?Yes/);
		expect(inputs(renderEditor('name'), 'placeholder="Search..."')).toHaveLength(1);
	});

	it("shows the column's live filter value", () => {
		const text = renderEditor('name', [{ id: 'name', value: 'Ad' }]);
		expect(inputs(text, 'placeholder="Search..."', ' value="Ad"')).toHaveLength(1);
		const range = renderEditor('age', [{ id: 'age', value: [30, undefined] }]);
		expect(inputs(range, 'role="spinbutton"', ' value="30"')).toHaveLength(1);
	});
});
