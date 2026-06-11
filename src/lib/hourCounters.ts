type DateRange = {
  start: string
  end: string
}

type StudyPeriod = {
  startDate: string
  endDate?: string
  dailyHours: number
  weekdays?: number[]
  excludedRanges?: DateRange[]
}

export type StudyCounterConfig = {
  baselineHours?: number
  periods: StudyPeriod[]
  excludedRanges?: DateRange[]
}

export type HourCounterResult = {
  hours: number
  days: number
}

const WORK_START_DATE = '2021-02-01'
const WORKDAY_START_HOUR = 8
const WORKDAY_END_HOUR = 17
const WORKDAY_HOURS = 8
const ANNUAL_VACATION_DAYS = 20
const VACATION_START_MONTH = 11
const VACATION_START_DAY = 20

export const DEFAULT_STUDY_COUNTER_CONFIG: StudyCounterConfig = {
  baselineHours: 3200,
  periods: [
    // Agrega aqui cada etapa real de estudio.
    // endDate es opcional: si no existe, se cuenta hasta hoy.
    // weekdays usa 0 = domingo, 1 = lunes ... 6 = sabado.
    // {
    //   startDate: '2026-01-15',
    //   endDate: '2026-06-30',
    //   dailyHours: 2,
    //   weekdays: [1, 2, 3, 4, 5],
    // },
  ],
  excludedRanges: [
    // Agrega aqui vacaciones, Semana Santa o recesos generales del estudio.
    // { start: '2026-03-30', end: '2026-04-05' },
  ],
}

function parseLocalDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfDay(date: Date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function addDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function nextMonday(date: Date) {
  const day = date.getDay()
  const daysToAdd = day === 1 ? 0 : (8 - day) % 7
  return addDays(date, daysToAdd)
}

function getEasterDate(year: number) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1

  return new Date(year, month - 1, day)
}

function getColombianHolidaySet(year: number) {
  const easter = getEasterDate(year)
  const fixedDates = [
    new Date(year, 0, 1),
    new Date(year, 4, 1),
    new Date(year, 6, 20),
    new Date(year, 7, 7),
    new Date(year, 11, 8),
    new Date(year, 11, 25),
  ]

  const movedToMonday = [
    new Date(year, 0, 6),
    new Date(year, 2, 19),
    new Date(year, 5, 29),
    new Date(year, 7, 15),
    new Date(year, 9, 12),
    new Date(year, 10, 1),
    new Date(year, 10, 11),
  ].map(nextMonday)

  const easterBased = [
    addDays(easter, -3),
    addDays(easter, -2),
    nextMonday(addDays(easter, 39)),
    nextMonday(addDays(easter, 60)),
    nextMonday(addDays(easter, 68)),
  ]

  const recentHolidays = year >= 2026 ? [nextMonday(new Date(year, 6, 9))] : []

  return new Set([...fixedDates, ...movedToMonday, ...easterBased, ...recentHolidays].map(toLocalDateString))
}

function isColombianHoliday(date: Date) {
  return getColombianHolidaySet(date.getFullYear()).has(toLocalDateString(date))
}

function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

function isBusinessDay(date: Date) {
  return !isWeekend(date) && !isColombianHoliday(date)
}

function getVacationRangeForYear(year: number) {
  const start = new Date(year, VACATION_START_MONTH, VACATION_START_DAY)
  let end = startOfDay(start)
  let usedBusinessDays = 0

  while (usedBusinessDays < ANNUAL_VACATION_DAYS) {
    if (isBusinessDay(end)) {
      usedBusinessDays += 1
    }

    if (usedBusinessDays < ANNUAL_VACATION_DAYS) {
      end = addDays(end, 1)
    }
  }

  return { start: startOfDay(start), end: startOfDay(end) }
}

function isWorkVacationDay(date: Date) {
  const normalizedDate = startOfDay(date)
  const year = normalizedDate.getFullYear()
  const ranges = [getVacationRangeForYear(year - 1), getVacationRangeForYear(year)]

  return ranges.some(({ start, end }) => normalizedDate >= start && normalizedDate <= end)
}

function getWorkDayFraction(now: Date) {
  const start = new Date(now)
  start.setHours(WORKDAY_START_HOUR, 0, 0, 0)

  const end = new Date(now)
  end.setHours(WORKDAY_END_HOUR, 0, 0, 0)

  const elapsed = Math.min(Math.max(now.getTime() - start.getTime(), 0), end.getTime() - start.getTime())
  return elapsed / (end.getTime() - start.getTime())
}

export function calculateWorkHours(now = new Date()): HourCounterResult {
  const today = startOfDay(now)
  const start = parseLocalDate(WORK_START_DATE)
  let cursor = startOfDay(start)
  let days = 0

  while (cursor < today) {
    if (isBusinessDay(cursor) && !isWorkVacationDay(cursor)) {
      days += 1
    }

    cursor = addDays(cursor, 1)
  }

  let hours = days * WORKDAY_HOURS

  if (today >= start && isBusinessDay(today) && !isWorkVacationDay(today)) {
    hours += getWorkDayFraction(now) * WORKDAY_HOURS
  }

  return { hours, days }
}

function isInsideRange(date: Date, range: DateRange) {
  const normalizedDate = startOfDay(date)
  return normalizedDate >= parseLocalDate(range.start) && normalizedDate <= parseLocalDate(range.end)
}

function isStudyDay(date: Date, period: StudyPeriod, config: StudyCounterConfig) {
  const weekdays = period.weekdays ?? [1, 2, 3, 4, 5]
  const excludedRanges = [...(config.excludedRanges ?? []), ...(period.excludedRanges ?? [])]

  return weekdays.includes(date.getDay()) && !excludedRanges.some((range) => isInsideRange(date, range))
}

function calculateStudyPeriodHours(period: StudyPeriod, config: StudyCounterConfig, now: Date): HourCounterResult {
  const today = startOfDay(now)
  const start = parseLocalDate(period.startDate)
  const configuredEnd = period.endDate ? parseLocalDate(period.endDate) : today
  const end = configuredEnd > today ? today : configuredEnd
  let cursor = startOfDay(start)
  let days = 0

  while (cursor <= end) {
    if (isStudyDay(cursor, period, config)) {
      days += 1
    }

    cursor = addDays(cursor, 1)
  }

  return {
    hours: days * period.dailyHours,
    days,
  }
}

export function calculateStudyHours(config = DEFAULT_STUDY_COUNTER_CONFIG, now = new Date()): HourCounterResult {
  const baselineHours = config.baselineHours ?? 0
  const totals = config.periods.reduce(
    (result, period) => {
      const periodResult = calculateStudyPeriodHours(period, config, now)

      return {
        hours: result.hours + periodResult.hours,
        days: result.days + periodResult.days,
      }
    },
    { hours: baselineHours, days: 0 },
  )

  return totals
}
