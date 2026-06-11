import type { Header, HeaderGroup, RowData } from '@tanstack/svelte-table';
import type { DataTableInstance } from './data-table-utils';
import { getColumnMeta } from './data-table-utils';
import type { DataTableFeatures } from './features';

export type DataTableViewState<T extends RowData> = ReturnType<typeof createTableViewState<T>>;

export type DataTableHeaderSection = 'left' | 'center' | 'right';

/**
 * Shared derived state for the standard and virtualized table roots.
 *
 * Writable slice atoms are rune-backed, so reading them inside a $derived
 * registers the dependency. Derived table APIs (getRowModel, header groups,
 * getVisibleLeafColumns, …) are not reliably tracked by the beta adapter, so
 * each derived below first reads the slices its result depends on.
 */
export function createTableViewState<T extends RowData>(getTable: () => DataTableInstance<T>) {
	const table = $derived.by(getTable);
	const columnPinning = $derived.by(() => table.atoms.columnPinning.get());
	const columnResizing = $derived.by(() => table.atoms.columnResizing.get());
	const columnSizing = $derived.by(() => table.atoms.columnSizing.get());
	const columnVisibility = $derived.by(() => table.atoms.columnVisibility.get());
	const rowSelection = $derived.by(() => table.atoms.rowSelection.get());
	const sorting = $derived.by(() => table.atoms.sorting.get());
	const columnFilters = $derived.by(() => table.atoms.columnFilters.get());
	const globalFilter = $derived.by(() => table.atoms.globalFilter.get());

	const rowModel = $derived.by(() => {
		void columnFilters;
		void globalFilter;
		void sorting;
		return table.getRowModel();
	});

	const headerGroupsData = $derived.by(() => {
		void columnPinning;
		void columnSizing;
		void columnVisibility;
		return buildHeaderGroups(table);
	});

	const visibleLeafColumns = $derived.by(() => {
		void columnSizing;
		void columnVisibility;
		return table.getVisibleLeafColumns();
	});

	const growColumn = $derived(visibleLeafColumns.find((col) => getColumnMeta(col.columnDef)?.grow));
	const isRowSelectionEnabled = $derived(Boolean(table.options.enableRowSelection));
	const isMultiRowSelectionEnabled = $derived(table.options.enableMultiRowSelection !== false);

	const allRowsSelectionState = $derived.by((): boolean | 'indeterminate' => {
		void rowSelection;
		void rowModel;
		return table.getIsAllRowsSelected()
			? true
			: table.getIsSomeRowsSelected()
				? 'indeterminate'
				: false;
	});
	const selectedRowCount = $derived.by(() => {
		void rowSelection;
		void rowModel;
		return table.getSelectedRowModel().rows.length;
	});

	const isColumnResizing = $derived(columnResizing.isResizingColumn !== false);
	const hasFooter = $derived(
		visibleLeafColumns.some((col) => {
			const meta = getColumnMeta(col.columnDef);
			return !!(meta?.sum || meta?.footer);
		})
	);

	return {
		get table() {
			return table;
		},
		get columnPinning() {
			return columnPinning;
		},
		get columnResizing() {
			return columnResizing;
		},
		get columnSizing() {
			return columnSizing;
		},
		get columnVisibility() {
			return columnVisibility;
		},
		get rowSelection() {
			return rowSelection;
		},
		get sorting() {
			return sorting;
		},
		get rowModel() {
			return rowModel;
		},
		get headerGroups() {
			return headerGroupsData.groups;
		},
		getHeaderSection(header: Header<DataTableFeatures, T, unknown>) {
			return headerGroupsData.sections.get(header);
		},
		get visibleLeafColumns() {
			return visibleLeafColumns;
		},
		get growColumn() {
			return growColumn;
		},
		get hasGrowColumn() {
			return growColumn !== undefined;
		},
		get isRowSelectionEnabled() {
			return isRowSelectionEnabled;
		},
		get isMultiRowSelectionEnabled() {
			return isMultiRowSelectionEnabled;
		},
		get allRowsSelectionState() {
			return allRowsSelectionState;
		},
		get selectedRowCount() {
			return selectedRowCount;
		},
		get isColumnResizing() {
			return isColumnResizing;
		},
		get hasFooter() {
			return hasFooter;
		}
	};
}

/**
 * Concatenate the left/center/right header-group sections into single rows.
 *
 * When a column group spans pinned and unpinned columns, TanStack splits it
 * into separate header objects (one per section). The fragments are kept
 * separate — the pinned fragment gets sticky positioning so the group label
 * stays visible during horizontal scroll — but the label renders only once:
 * on the pinned fragment, with the other fragments cloned as placeholders.
 * The clone preserves the header's prototype so its methods (getContext,
 * getSize, …) keep working.
 *
 * The returned WeakMap records which section each header came from; the head
 * component needs it because a fragment's `column` spans all sections and
 * can't identify the fragment's own section.
 */
function buildHeaderGroups<T extends RowData>(table: DataTableInstance<T>) {
	type HeaderEntry = Header<DataTableFeatures, T, unknown>;
	const sections = new WeakMap<HeaderEntry, DataTableHeaderSection>();
	const leftHeaderGroups = table.getLeftHeaderGroups();
	const centerHeaderGroups = table.getCenterHeaderGroups();
	const rightHeaderGroups = table.getRightHeaderGroups();

	const groups: HeaderGroup<DataTableFeatures, T>[] = centerHeaderGroups.map(
		(headerGroup, index) => {
			const parts: Array<{ header: HeaderEntry; section: DataTableHeaderSection }> = [
				...(leftHeaderGroups[index]?.headers ?? []).map((header) => ({
					header,
					section: 'left' as const
				})),
				...headerGroup.headers.map((header) => ({ header, section: 'center' as const })),
				...(rightHeaderGroups[index]?.headers ?? []).map((header) => ({
					header,
					section: 'right' as const
				}))
			];

			const headers: HeaderEntry[] = [];
			let i = 0;
			while (i < parts.length) {
				let j = i;
				while (
					j + 1 < parts.length &&
					parts[j + 1].header.column.id === parts[i].header.column.id
				) {
					j++;
				}
				const run = parts.slice(i, j + 1);
				// The label lives on the pinned fragment so it stays visible; left wins
				// over right when a group somehow spans both pinned sections.
				const labelIndex = Math.max(
					0,
					run.findIndex((part) => part.section !== 'center')
				);
				run.forEach((part, k) => {
					let header = part.header;
					if (run.length > 1 && k !== labelIndex && !header.isPlaceholder) {
						const clone = Object.assign(
							Object.create(Object.getPrototypeOf(header)),
							header
						) as HeaderEntry;
						clone.isPlaceholder = true;
						header = clone;
					}
					sections.set(header, part.section);
					headers.push(header);
				});
				i = j + 1;
			}

			return {
				...headerGroup,
				id: `${leftHeaderGroups[index]?.id ?? ''}|${headerGroup.id}|${rightHeaderGroups[index]?.id ?? ''}`,
				headers
			};
		}
	);

	return { groups, sections };
}
