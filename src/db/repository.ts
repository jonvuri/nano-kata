import type { Selectable } from 'kysely'

import { getDb } from './client'
import type { CheckIns } from './generated'
import {
  formatDateKey,
  getCycleIndex,
  getEndOfDay,
  getStartOfDay,
  getWakingCycleCount,
  isWakingCycle,
  parseISODate,
} from './cycles'

export type CheckIn = Selectable<CheckIns>

export interface DayDensity {
  date: string // YYYY-MM-DD
  density: number // 0.0 - 1.0
  checkInCount: number
  wakingCycleCount: number
}

/**
 * Fetch all check-ins for a given day, ordered by checked_at descending (most recent first).
 */
export async function getCheckInsForDay(date: Date): Promise<CheckIn[]> {
  const db = getDb()
  const startOfDay = getStartOfDay(date)
  const endOfDay = getEndOfDay(date)

  const checkIns = await db
    .selectFrom('check_ins')
    .selectAll()
    .where('checked_at', '>=', startOfDay.toISOString())
    .where('checked_at', '<=', endOfDay.toISOString())
    .orderBy('checked_at', 'desc')
    .execute()

  return checkIns
}

/**
 * Compute the density for a specific day.
 * Density = (number of waking cycles with check-ins) / (total waking cycles)
 * Waking cycles are 6-E (9 cycles total).
 */
export async function getDayDensity(date: Date): Promise<DayDensity> {
  const checkIns = await getCheckInsForDay(date)
  const wakingCycleCount = getWakingCycleCount()

  // Group check-ins by cycle
  const cyclesWithCheckIns = new Set<number>()
  for (const checkIn of checkIns) {
    const checkInDate = parseISODate(checkIn.checked_at)
    const cycle = getCycleIndex(checkInDate)
    if (isWakingCycle(cycle)) {
      cyclesWithCheckIns.add(cycle)
    }
  }

  const checkInCount = cyclesWithCheckIns.size
  const density = checkInCount / wakingCycleCount

  return {
    date: formatDateKey(date),
    density: Math.round(density * 100) / 100, // Round to 2 decimal places
    checkInCount,
    wakingCycleCount,
  }
}

/**
 * Compute the current streak of days with 1.0 density.
 * Scans backwards from today until a day with density < 1.0 is found.
 */
export async function getCurrentStreak(endDate = new Date()): Promise<number> {
  let streak = 0
  let currentDate = new Date(endDate)

  // Set to start of day to ensure consistent date handling
  currentDate = getStartOfDay(currentDate)

  while (true) {
    const dayDensity = await getDayDensity(currentDate)

    // If density is 1.0, increment streak and go to previous day
    if (dayDensity.density >= 1.0) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      // Streak is broken, stop scanning
      break
    }

    // Safety check: don't scan more than 365 days
    if (streak >= 365) {
      break
    }
  }

  return streak
}

/**
 * Get all check-ins, ordered by checked_at descending.
 */
export async function getAllCheckIns(): Promise<CheckIn[]> {
  const db = getDb()
  return await db.selectFrom('check_ins').selectAll().orderBy('checked_at', 'desc').execute()
}

/**
 * Get check-ins for a date range.
 */
export async function getCheckInsForRange(startDate: Date, endDate: Date): Promise<CheckIn[]> {
  const db = getDb()
  const start = getStartOfDay(startDate)
  const end = getEndOfDay(endDate)

  return await db
    .selectFrom('check_ins')
    .selectAll()
    .where('checked_at', '>=', start.toISOString())
    .where('checked_at', '<=', end.toISOString())
    .orderBy('checked_at', 'desc')
    .execute()
}
