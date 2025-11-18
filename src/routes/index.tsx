import { Title } from '@solidjs/meta'
import { createAsync, cache } from '@solidjs/router'

import { getCheckInsForDay, getDayDensity, getCurrentStreak } from '../db/repository'
import { getTodayCycles } from '../lib/cycles'
import type { CycleMetadata } from '../lib/cycles'
import type { CheckIn, DayDensity } from '../db/repository'

/**
 * Server-side data loader for the dashboard.
 * Fetches all data needed to render the kata tracking interface.
 */
const loadDashboardData = cache(async () => {
  'use server'

  const today = new Date()

  // Fetch all required data in parallel
  const [checkIns, dayDensity, streak] = await Promise.all([
    getCheckInsForDay(today),
    getDayDensity(today),
    getCurrentStreak(today),
  ])

  // Compute cycle metadata based on check-ins and current time
  const cycles = getTodayCycles(checkIns, today)

  return {
    checkIns,
    dayDensity,
    streak,
    cycles,
  }
}, 'dashboard-data')

export interface DashboardData {
  checkIns: CheckIn[]
  dayDensity: DayDensity
  streak: number
  cycles: CycleMetadata[]
}

export default function Home() {
  const data = createAsync(() => loadDashboardData())

  return (
    <main class="min-h-screen bg-black text-slate-100">
      <Title>Nano Kata</Title>
      <section class="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16">
        <header>
          <p class="text-sm uppercase tracking-[0.3em] text-lime-300">Nano Kata</p>
          <h1 class="text-4xl font-semibold">Dashboard</h1>
        </header>

        {/* Show loading state while data is being fetched */}
        {!data() && <p class="text-base text-slate-300">Loading dashboard data...</p>}

        {/* Show dashboard data once loaded */}
        {data() && (
          <>
            <div class="text-base text-slate-300">
              <p>Check-ins today: {data()!.checkIns.length}</p>
              <p>Daily density: {data()!.dayDensity.density.toFixed(2)}</p>
              <p>Current streak: {data()!.streak} days</p>
              <p>Cycles: {data()!.cycles.length}</p>
            </div>

            <div class="rounded border border-slate-700 bg-slate-900 p-4">
              <h2 class="mb-2 text-lg font-semibold">Debug: Loaded Data</h2>
              <pre class="overflow-auto text-xs text-slate-400">
                {JSON.stringify(data(), null, 2)}
              </pre>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
