// eslint-disable-next-line import-x/no-named-as-default
import Database from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'

import type { DB } from './generated'

const databaseFile = './kata.sqlite'

let db: Kysely<DB> | null = null

/**
 * Get the singleton Kysely database instance.
 * Creates the instance on first call.
 */
export function getDb(): Kysely<DB> {
  if (!db) {
    db = new Kysely<DB>({
      dialect: new SqliteDialect({
        database: new Database(databaseFile),
      }),
    })
  }
  return db
}

/**
 * Close the database connection (useful for testing or cleanup).
 */
export function closeDb(): void {
  if (db) {
    db.destroy()
    db = null
  }
}
