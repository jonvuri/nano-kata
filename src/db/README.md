# Database Module

This module provides typed database access and repository functions for the nano-kata application.

## Files

- **`generated.ts`** - Auto-generated Kysely types from the SQLite database schema. Regenerate with `npm run db:codegen`.
- **`client.ts`** - Database client singleton providing a typed Kysely instance.
- **`cycles.ts`** - Utility functions for working with 90-minute cycles (0-F hexadecimal).
- **`repository.ts`** - Repository functions for querying check-ins, computing density, and calculating streaks.

## Usage

```typescript
import { getDb } from '~/db/client'
import { getCheckInsForDay, getDayDensity, getCurrentStreak } from '~/db/repository'

// Get today's check-ins
const checkIns = await getCheckInsForDay(new Date())

// Get today's density (0.0-1.0)
const density = await getDayDensity(new Date())

// Get current streak of 1.0-density days
const streak = await getCurrentStreak()
```

## Cycle System

- Cycles are 90-minute intervals numbered 0-F (hexadecimal)
- Cycle 0: 00:00 - 01:30
- Cycle F: 22:30 - 00:00
- Waking cycles: 6-E (09:00 - 22:30) = 9 cycles total

## Density Calculation

Density = (number of waking cycles with check-ins) / 9

A perfect day (density 1.0) has at least one check-in in each waking cycle (6-E).

## Streak Calculation

The streak counts consecutive days (going backwards from today) with density 1.0.
The streak breaks when a day with density < 1.0 is encountered.
