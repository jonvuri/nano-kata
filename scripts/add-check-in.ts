#!/usr/bin/env node
/**
 * CLI script to add a check-in record to the database.
 * Usage: tsx scripts/add-check-in.ts --now "coding" --focus rhyt --soul "energized" --prep "continue sprint"
 */

import { parseArgs } from 'node:util'
import { getDb, closeDb } from '../src/db/client'
import type { FocusValue } from '../migrations/helpers'

const FOCUS_VALUES: readonly FocusValue[] = ['rhyt', 'hyker', 'other'] as const

interface CheckInArgs {
  when?: string
  now: string
  focus: FocusValue
  soul: string
  prep: string
}

function validateFocus(focus: string): focus is FocusValue {
  return FOCUS_VALUES.includes(focus as FocusValue)
}

function parseArguments(): CheckInArgs {
  const { values } = parseArgs({
    options: {
      when: { type: 'string', short: 'w' },
      now: { type: 'string', short: 'n' },
      focus: { type: 'string', short: 'f' },
      soul: { type: 'string', short: 's' },
      prep: { type: 'string', short: 'p' },
      help: { type: 'boolean', short: 'h' },
    },
  })

  if (values.help) {
    console.log(`
Usage: tsx scripts/add-check-in.ts [options]

Options:
  --when, -w    Datetime of check-in (ISO format, defaults to current time)
  --now, -n     Current activity (required)
  --focus, -f   Focus area: rhyt, hyker, or other (required)
  --soul, -s    Mood/energy/outlook (required)
  --prep, -p    Intentions for next cycle (required)
  --help, -h    Show this help message
`)
    process.exit(0)
  }

  // Validate required fields
  if (!values.now || typeof values.now !== 'string') {
    console.error('Error: --now is required')
    process.exit(1)
  }
  if (!values.focus || typeof values.focus !== 'string') {
    console.error('Error: --focus is required')
    process.exit(1)
  }
  if (!values.soul || typeof values.soul !== 'string') {
    console.error('Error: --soul is required')
    process.exit(1)
  }
  if (!values.prep || typeof values.prep !== 'string') {
    console.error('Error: --prep is required')
    process.exit(1)
  }

  // Validate focus value
  if (!validateFocus(values.focus)) {
    console.error(
      `Error: --focus must be one of: ${FOCUS_VALUES.join(', ')}. Got: ${values.focus}`,
    )
    process.exit(1)
  }

  return {
    when: values.when,
    now: values.now,
    focus: values.focus,
    soul: values.soul,
    prep: values.prep,
  }
}

async function addCheckIn(args: CheckInArgs) {
  const db = getDb()

  try {
    // Determine the timestamp to use
    let checkedAt: string
    if (args.when) {
      // Validate that it's a valid ISO date
      const date = new Date(args.when)
      if (isNaN(date.getTime())) {
        console.error(`Error: --when must be a valid ISO datetime string. Got: ${args.when}`)
        process.exit(1)
      }
      checkedAt = date.toISOString()
    } else {
      // Use current time in ISO format (not SQLite's CURRENT_TIMESTAMP)
      checkedAt = new Date().toISOString()
    }

    // Build the insert query - always include checked_at explicitly
    const insertData = {
      now: args.now,
      focus: args.focus,
      soul: args.soul,
      prep: args.prep,
      checked_at: checkedAt,
    }

    const result = await db.insertInto('check_ins').values(insertData).executeTakeFirst()

    console.log('✓ Check-in added successfully!')
    console.log(`  ID: ${result.insertId}`)
    console.log(`  Checked at: ${checkedAt}`)
    console.log(`  Now: ${args.now}`)
    console.log(`  Focus: ${args.focus}`)
    console.log(`  Soul: ${args.soul}`)
    console.log(`  Prep: ${args.prep}`)
  } catch (error) {
    console.error('Error adding check-in:', error)
    process.exit(1)
  } finally {
    closeDb()
  }
}

// Main execution
const args = parseArguments()
addCheckIn(args).catch((error) => {
  console.error('Unexpected error:', error)
  process.exit(1)
})
