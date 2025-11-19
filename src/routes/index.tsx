import { createAsync, cache } from '@solidjs/router'

import { getDb } from '../db/client'
import { getTodayCycles } from '../lib/cycles'
import { getCycleIndex, isWakingCycle, getWakingCycleCount } from '../db/cycles'
import { CycleStrip } from '../components/CycleStrip'
import { StatsPanel } from '../components/StatsPanel'
import { CheckInTable } from '../components/CheckInTable'
import type { CheckIn } from '../db/repository'

/**
 * Server-side data loader for the dashboard.
 * Returns the last 48 hours of check-ins to account for timezone differences.
 * All filtering and computation based on local time happens client-side.
 */
const loadDashboardData = cache(async () => {
  'use server'

  const db = getDb()

  // Get check-ins from the last 48 hours
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

  const checkIns = await db
    .selectFrom('check_ins')
    .selectAll()
    .where('checked_at', '>=', fortyEightHoursAgo.toISOString())
    .orderBy('checked_at', 'desc')
    .execute()

  return {
    checkIns,
  }
}, 'dashboard-data')

export interface DashboardData {
  checkIns: CheckIn[]
}

/**
 * Filter check-ins to only those from today (client's local time)
 */
function filterCheckInsToday(checkIns: CheckIn[], now: Date): CheckIn[] {
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)

  return checkIns.filter((checkIn) => {
    const checkInDate = new Date(checkIn.checked_at)
    return checkInDate >= startOfDay && checkInDate <= endOfDay
  })
}

/**
 * Compute density for today (client's local time)
 */
function computeDensity(checkIns: CheckIn[]): number {
  const wakingCycleCount = getWakingCycleCount()

  // Group check-ins by cycle
  const cyclesWithCheckIns = new Set<number>()
  for (const checkIn of checkIns) {
    const checkInDate = new Date(checkIn.checked_at)
    const cycle = getCycleIndex(checkInDate)
    if (isWakingCycle(cycle)) {
      cyclesWithCheckIns.add(cycle)
    }
  }

  const checkInCount = cyclesWithCheckIns.size
  const density = checkInCount / wakingCycleCount

  return Math.round(density * 100) / 100
}

/**
 * Compute streak of 1.0 density days (client's local time)
 */
function computeStreak(allCheckIns: CheckIn[], today: Date): number {
  let streak = 0
  const todayStart = new Date(today)
  todayStart.setHours(0, 0, 0, 0)

  for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
    const startOfDay = new Date(todayStart)
    startOfDay.setDate(todayStart.getDate() - dayOffset)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(startOfDay)
    endOfDay.setHours(23, 59, 59, 999)

    // Filter check-ins for this day
    const dayCheckIns = allCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.checked_at)
      return checkInDate >= startOfDay && checkInDate <= endOfDay
    })

    const density = computeDensity(dayCheckIns)

    if (density >= 1.0) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export default function Home() {
  const data = createAsync(() => loadDashboardData())

  // Client-side computations using local time
  const todayCheckIns = () => {
    const dashboardData = data()
    if (!dashboardData) return []
    return filterCheckInsToday(dashboardData.checkIns, new Date())
  }

  const cycles = () => {
    return getTodayCycles(todayCheckIns(), new Date())
  }

  const density = () => {
    return computeDensity(todayCheckIns())
  }

  const streak = () => {
    const dashboardData = data()
    if (!dashboardData) return 0
    return computeStreak(dashboardData.checkIns, new Date())
  }

  return (
    <main class="min-h-screen bg-black text-slate-100">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {data() && (
          <div class="space-y-8">
            {/* Top row: Cycle strip and stats panel */}
            <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Cycle strip - scrollable on mobile */}
              <div class="flex-1 overflow-x-auto">
                <div class="min-w-max">
                  <CycleStrip cycles={cycles()} />
                </div>
              </div>

              {/* Stats panel */}
              <div class="flex-shrink-0 lg:ml-8">
                <StatsPanel density={density()} streak={streak()} />
              </div>
            </div>

            {/* Check-in table */}
            <section aria-labelledby="checkins-heading">
              <h2 id="checkins-heading" class="mb-4 text-xl font-semibold">
                Today's Check-Ins
              </h2>
              <div class="rounded-lg border border-slate-800 bg-slate-900">
                <CheckInTable checkIns={todayCheckIns()} />
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
