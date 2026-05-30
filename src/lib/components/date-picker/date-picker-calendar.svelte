<script lang="ts">
	import { DatePicker } from '@ark-ui/svelte/date-picker';
	import { Portal } from '@ark-ui/svelte/portal';
	import { CalendarDateTime } from '@internationalized/date';
	import { PhArrowLeft, PhArrowRight } from '$lib/icons';
	import type { DateValue } from '@ark-ui/svelte/date-picker';

	let { showTimeInput = false }: { showTimeInput?: boolean } = $props();

	function getTimeValue(v: DateValue | undefined): string {
		if (!v || !('hour' in v)) return '';
		const dt = v as CalendarDateTime;
		return `${String(dt.hour).padStart(2, '0')}:${String(dt.minute).padStart(2, '0')}`;
	}

	function setTime(v: DateValue | undefined, hours: number, minutes: number): CalendarDateTime {
		if (v && 'hour' in v) return (v as CalendarDateTime).set({ hour: hours, minute: minutes });
		const d = v ?? new CalendarDateTime(new Date().getFullYear(), 1, 1, 0, 0);
		return new CalendarDateTime(d.year, d.month, d.day, hours, minutes);
	}
</script>

<Portal>
	<DatePicker.Positioner>
		<DatePicker.Content
			class="z-50 min-w-70 rounded-lg border border-border bg-surface-document p-4 shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
		>
			<DatePicker.View view="day">
				<DatePicker.Context>
					{#snippet render(datePicker)}
						<DatePicker.ViewControl class="mb-3 flex items-center justify-between">
							<DatePicker.PrevTrigger
								class="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-dim hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-40"
							>
								<PhArrowLeft class="size-4" />
							</DatePicker.PrevTrigger>
							<DatePicker.ViewTrigger
								class="flex-1 rounded-md py-1 text-center text-sm font-semibold text-ink hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<DatePicker.RangeText />
							</DatePicker.ViewTrigger>
							<DatePicker.NextTrigger
								class="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-dim hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-40"
							>
								<PhArrowRight class="size-4" />
							</DatePicker.NextTrigger>
						</DatePicker.ViewControl>
						<DatePicker.Table class="w-full border-collapse">
							<DatePicker.TableHead>
								<DatePicker.TableRow>
									{#each datePicker().weekDays as weekDay (weekDay.short)}
										<DatePicker.TableHeader
											class="pb-2 text-center text-xs font-medium uppercase text-ink-dim"
										>
											{weekDay.short}
										</DatePicker.TableHeader>
									{/each}
								</DatePicker.TableRow>
							</DatePicker.TableHead>
							<DatePicker.TableBody>
								{#each datePicker().weeks as week, weekIdx (weekIdx)}
									<DatePicker.TableRow>
										{#each week as day (day.toString())}
											<DatePicker.TableCell value={day}>
												<DatePicker.TableCellTrigger
													class="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm text-ink hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-40 data-in-range:rounded-none data-in-range:bg-primary/15 data-outside-range:opacity-40 data-outside-range:text-ink-dim data-range-end:rounded-r-md data-range-end:bg-primary data-range-end:text-ink-inverse data-range-start:rounded-l-md data-range-start:bg-primary data-range-start:text-ink-inverse data-selected:bg-primary data-selected:text-ink-inverse data-today:font-semibold data-today:text-primary data-unavailable:line-through data-unavailable:opacity-40 data-selected:data-today:text-ink-inverse"
												>
													{day.day}
												</DatePicker.TableCellTrigger>
											</DatePicker.TableCell>
										{/each}
									</DatePicker.TableRow>
								{/each}
							</DatePicker.TableBody>
						</DatePicker.Table>
						{#if showTimeInput}
							<input
								type="time"
								value={getTimeValue(datePicker().value[0])}
								oninput={(e) => {
									const [h, m] = e.currentTarget.value.split(':').map(Number);
									datePicker().setValue([setTime(datePicker().value[0], h, m)]);
								}}
								class="mt-3 h-9 w-full rounded-md border border-border bg-surface-1 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							/>
						{/if}
					{/snippet}
				</DatePicker.Context>
			</DatePicker.View>

			<DatePicker.View view="month">
				<DatePicker.Context>
					{#snippet render(datePicker)}
						<DatePicker.ViewControl class="mb-3 flex items-center justify-between">
							<DatePicker.PrevTrigger
								class="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-dim hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-40"
							>
								<PhArrowLeft class="size-4" />
							</DatePicker.PrevTrigger>
							<DatePicker.ViewTrigger
								class="flex-1 rounded-md py-1 text-center text-sm font-semibold text-ink hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<DatePicker.RangeText />
							</DatePicker.ViewTrigger>
							<DatePicker.NextTrigger
								class="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-dim hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-40"
							>
								<PhArrowRight class="size-4" />
							</DatePicker.NextTrigger>
						</DatePicker.ViewControl>
						<DatePicker.Table class="w-full border-collapse">
							<DatePicker.TableBody>
								{#each datePicker().getMonthsGrid( { columns: 4, format: 'short' } ) as monthRow, rowIdx (rowIdx)}
									<DatePicker.TableRow>
										{#each monthRow as month (month.value)}
											<DatePicker.TableCell value={month.value}>
												<DatePicker.TableCellTrigger
													class="inline-flex h-10 w-full items-center justify-center rounded-md px-2 text-sm text-ink hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-outside-range:invisible data-selected:bg-primary data-selected:text-ink-inverse"
												>
													{month.label}
												</DatePicker.TableCellTrigger>
											</DatePicker.TableCell>
										{/each}
									</DatePicker.TableRow>
								{/each}
							</DatePicker.TableBody>
						</DatePicker.Table>
					{/snippet}
				</DatePicker.Context>
			</DatePicker.View>

			<DatePicker.View view="year">
				<DatePicker.Context>
					{#snippet render(datePicker)}
						<DatePicker.ViewControl class="mb-3 flex items-center justify-between">
							<DatePicker.PrevTrigger
								class="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-dim hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-40"
							>
								<PhArrowLeft class="size-4" />
							</DatePicker.PrevTrigger>
							<DatePicker.ViewTrigger
								class="flex-1 rounded-md py-1 text-center text-sm font-semibold text-ink hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							>
								<DatePicker.RangeText />
							</DatePicker.ViewTrigger>
							<DatePicker.NextTrigger
								class="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-dim hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-40"
							>
								<PhArrowRight class="size-4" />
							</DatePicker.NextTrigger>
						</DatePicker.ViewControl>
						<DatePicker.Table class="w-full border-collapse">
							<DatePicker.TableBody>
								{#each datePicker().getYearsGrid({ columns: 4 }) as yearRow, rowIdx (rowIdx)}
									<DatePicker.TableRow>
										{#each yearRow as year (year.value)}
											<DatePicker.TableCell value={year.value}>
												<DatePicker.TableCellTrigger
													class="inline-flex h-10 w-full items-center justify-center rounded-md px-2 text-sm text-ink hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-outside-range:invisible data-selected:bg-primary data-selected:text-ink-inverse"
												>
													{year.label}
												</DatePicker.TableCellTrigger>
											</DatePicker.TableCell>
										{/each}
									</DatePicker.TableRow>
								{/each}
							</DatePicker.TableBody>
						</DatePicker.Table>
					{/snippet}
				</DatePicker.Context>
			</DatePicker.View>
		</DatePicker.Content>
	</DatePicker.Positioner>
</Portal>
