/**
 * Utilities for working with 90-minute cycles.
 * Cycles are numbered 0-F (hexadecimal), with:
 * - Cycle 0: 00:00 - 01:30
 * - Cycle 1: 01:30 - 03:00
 * - ...
 * - Cycle F: 22:30 - 00:00
 *
 * Waking cycles are 6-E (09:00 - 22:30).
 */

export const CYCLE_DURATION_MS = 90 * 60 * 1000 // 90 minutes in milliseconds
export const WAKING_CYCLE_START = 0x6 // Cycle 6 (09:00)
export const WAKING_CYCLE_END = 0xe // Cycle E (21:00)
export const TOTAL_CYCLES = 0x10 // 16 cycles per day

/**
 * Get the cycle index (0-F) for a given timestamp.
 */
export function getCycleIndex(date: Date): number {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const totalMinutes = hours * 60 + minutes
  const cycleIndex = Math.floor(totalMinutes / 90)
  return Math.min(cycleIndex, 15) // Cap at F (15)
}

/**
 * Convert a cycle index to its hexadecimal representation.
 */
export function cycleToHex(cycle: number): string {
  return cycle.toString(16).toUpperCase()
}

/**
 * Check if a cycle index is within waking hours (6-E).
 */
export function isWakingCycle(cycle: number): boolean {
  return cycle >= WAKING_CYCLE_START && cycle <= WAKING_CYCLE_END
}

/**
 * Get the number of waking cycles (6-E inclusive).
 */
export function getWakingCycleCount(): number {
  return WAKING_CYCLE_END - WAKING_CYCLE_START + 1 // 9 cycles
}

/**
 * Get the start of day (midnight) for a given date.
 */
export function getStartOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get the end of day (just before midnight) for a given date.
 */
export function getEndOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Format a date as YYYY-MM-DD for day-based grouping.
 */
export function formatDateKey(date: Date): string {
  const isoString = date.toISOString()
  const datePart = isoString.split('T')[0]
  if (!datePart) {
    throw new Error(`Invalid date format: ${isoString}`)
  }
  return datePart
}

/**
 * Parse an ISO date string to a Date object.
 */
export function parseISODate(isoString: string): Date {
  return new Date(isoString)
}
