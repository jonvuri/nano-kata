#!/usr/bin/env node
/**
 * Script to fix timestamps that are in SQLite format (YYYY-MM-DD HH:MM:SS)
 * and convert them to proper ISO format (YYYY-MM-DDTHH:MM:SS.mmmZ)
 */

import { getDb, closeDb } from '../src/db/client'

async function fixTimestamps() {
  const db = getDb()

  try {
    // Get all check-ins
    const checkIns = await db.selectFrom('check_ins').selectAll().execute()

    console.log(`Found ${checkIns.length} check-ins to process`)

    let fixedCount = 0

    for (const checkIn of checkIns) {
      // Check if the timestamp is in ISO format (has 'T' and 'Z')
      if (checkIn.checked_at.includes('T') && checkIn.checked_at.includes('Z')) {
        console.log(`✓ Check-in ${checkIn.id}: Already in ISO format (${checkIn.checked_at})`)
        continue
      }

      // Parse the SQLite timestamp and convert to ISO
      // SQLite format: YYYY-MM-DD HH:MM:SS (assumed to be UTC)
      const date = new Date(checkIn.checked_at + 'Z') // Add Z to indicate UTC
      const isoTimestamp = date.toISOString()

      console.log(
        `→ Check-in ${checkIn.id}: Converting ${checkIn.checked_at} to ${isoTimestamp}`,
      )

      // Update the record
      await db
        .updateTable('check_ins')
        .set({ checked_at: isoTimestamp })
        .where('id', '=', checkIn.id)
        .execute()

      fixedCount++
    }

    console.log(`\n✓ Fixed ${fixedCount} timestamps`)
  } catch (error) {
    console.error('Error fixing timestamps:', error)
    process.exit(1)
  } finally {
    closeDb()
  }
}

fixTimestamps().catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
