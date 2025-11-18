/**
 * Client/server utilities for cycle visualization and state management.
 */

import { getCycleIndex, TOTAL_CYCLES, isWakingCycle, cycleToHex } from '../db/cycles'
import type { CheckIn } from '../db/repository'

export type CycleState = 'future' | 'past' | 'checked'

export interface CycleMetadata {
  index: number
  hex: string
  state: CycleState
  isWaking: boolean
  hasCheckIn: boolean
}

/**
 * Get cycle metadata for all 16 cycles (0-F) for a given day.
 * Determines if each cycle is in the future, past, or has a check-in.
 */
export function getTodayCycles(checkIns: CheckIn[], currentTime = new Date()): CycleMetadata[] {
  const currentCycle = getCycleIndex(currentTime)

  // Create a set of cycles that have check-ins
  const cyclesWithCheckIns = new Set<number>()
  for (const checkIn of checkIns) {
    const checkInDate = new Date(checkIn.checked_at)
    const cycle = getCycleIndex(checkInDate)
    cyclesWithCheckIns.add(cycle)
  }

  // Build metadata for all cycles
  const cycles: CycleMetadata[] = []
  for (let i = 0; i < TOTAL_CYCLES; i++) {
    const hasCheckIn = cyclesWithCheckIns.has(i)
    let state: CycleState

    if (hasCheckIn) {
      state = 'checked'
    } else if (i > currentCycle) {
      state = 'future'
    } else {
      state = 'past'
    }

    cycles.push({
      index: i,
      hex: cycleToHex(i),
      state,
      isWaking: isWakingCycle(i),
      hasCheckIn,
    })
  }

  return cycles
}
