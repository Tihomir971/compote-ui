<script lang="ts">
	import { DatePicker } from '@ark-ui/svelte/date-picker';
	import { Portal } from '@ark-ui/svelte/portal';
	import { CalendarDateTime } from '@internationalized/date';
	import { PhArrowLeft, PhArrowRight } from '$lib/icons';
	import type { DateValue } from '@ark-ui/svelte/date-picker';
	import Select from '../select/select.svelte';

	let { showTimeInput = false, hourCycle = 24 }: { showTimeInput?: boolean; hourCycle?: 12 | 24 } =
		$props();

	function getHour(v: DateValue | undefined): number {
		if (!v || !('hour' in v)) return 0;
		const h = (v as CalendarDateTime).hour;
		return hourCycle === 12 ? h % 12 || 12 : h;
	}

	function getMinute(v: DateValue | undefined): number {
		if (!v || !('hour' in v)) return 0;
		return (v as CalendarDateTime).minute;
	}

	function isPM(v: DateValue | undefined): boolean {
		if (!v || !('hour' in v)) return false;
		return (v as CalendarDateTime).hour >= 12;
	}

	function setTime(v: DateValue | undefined, hours: number, minutes: number): CalendarDateTime {
		if (v && 'hour' in v) return (v as CalendarDateTime).set({ hour: hours, minute: minutes });
		const d = v ?? new CalendarDateTime(new Date().getFullYear(), 1, 1, 0, 0);
		return new CalendarDateTime(d.year, d.month, d.day, hours, minutes);
	}

	function updateHour(v: DateValue | undefined, displayHour: number): CalendarDateTime {
		let h = displayHour;
		if (hourCycle === 12) {
			const pm = isPM(v);
			h = pm ? (displayHour % 12) + 12 : displayHour % 12;
		}
		return setTime(v, h, getMinute(v));
	}

	function togglePeriod(v: DateValue | undefined): CalendarDateTime {
		const cur = v && 'hour' in v ? (v as CalendarDateTime).hour : 0;
		return setTime(v, cur >= 12 ? cur - 12 : cur + 12, getMinute(v));
	}

	const minuteItems = Array.from({ length: 60 }, (_, m) => ({
		value: m,
		label: String(m).padStart(2, '0')
	}));

	const hourItems = $derived(
		Array.from({ length: hourCycle === 12 ? 12 : 24 }, (_, i) => {
			const h = hourCycle === 12 ? i + 1 : i;
			return { value: h, label: String(h).padStart(2, '0') };
		})
	);
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
							{@const cur = datePicker().value[0]}
							<div class="mt-3 flex items-center justify-center gap-1">
								<Select
									items={hourItems}
									value={getHour(cur)}
									size="sm"
									placeholder="HH"
									onValueChange={(d) =>
										datePicker().setValue([updateHour(cur, Number(d.items[0]?.value))])}
								/>
								<span class="text-ink-dim">:</span>
								<Select
									items={minuteItems}
									value={getMinute(cur)}
									size="sm"
									placeholder="mm"
									onValueChange={(d) => {
										const m = Number(d.items[0]?.value);
										const h24 =
											hourCycle === 12
												? isPM(cur)
													? (getHour(cur) % 12) + 12
													: getHour(cur) % 12
												: getHour(cur);
										datePicker().setValue([setTime(cur, h24, m)]);
									}}
								/>
								{#if hourCycle === 12}
									<button
										type="button"
										onclick={() => datePicker().setValue([togglePeriod(cur)])}
										class="h-8 rounded-md border border-border bg-surface-1 px-2 text-sm shadow-sm hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
									>
										{isPM(cur) ? 'PM' : 'AM'}
									</button>
								{/if}
							</div>
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
