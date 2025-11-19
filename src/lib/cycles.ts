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
  earliestCheckInTime?: string // HH:MM format for display
}

/**
 * Get cycle metadata for all 16 cycles (0-F) for a given day.
 * Determines if each cycle is in the future, past, or has a check-in.
 */
export function getTodayCycles(checkIns: CheckIn[], currentTime = new Date()): CycleMetadata[] {
  const currentCycle = getCycleIndex(currentTime)

  // Create a map of cycles to their earliest check-in time
  const cycleCheckInTimes = new Map<number, Date>()
  for (const checkIn of checkIns) {
    const checkInDate = new Date(checkIn.checked_at)
    const cycle = getCycleIndex(checkInDate)

    const existingTime = cycleCheckInTimes.get(cycle)
    if (!existingTime || checkInDate < existingTime) {
      cycleCheckInTimes.set(cycle, checkInDate)
    }
  }

  // Build metadata for all cycles
  const cycles: CycleMetadata[] = []
  for (let i = 0; i < TOTAL_CYCLES; i++) {
    const hasCheckIn = cycleCheckInTimes.has(i)
    let state: CycleState

    if (hasCheckIn) {
      state = 'checked'
    } else if (i > currentCycle) {
      state = 'future'
    } else {
      state = 'past'
    }

    // Format the earliest check-in time as HH:MM
    let earliestCheckInTime: string | undefined
    if (hasCheckIn) {
      const checkInDate = cycleCheckInTimes.get(i)!
      const hours = checkInDate.getHours().toString().padStart(2, '0')
      const minutes = checkInDate.getMinutes().toString().padStart(2, '0')
      earliestCheckInTime = `${hours}:${minutes}`
    }

    cycles.push({
      index: i,
      hex: cycleToHex(i),
      state,
      isWaking: isWakingCycle(i),
      hasCheckIn,
      earliestCheckInTime,
    })
  }

  return cycles
}
