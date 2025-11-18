import Database from 'better-sqlite3'
import { SqliteDialect } from 'kysely'
import { defineConfig } from 'kysely-ctl'

const databaseFile = './kata.sqlite'

export default defineConfig({
  dialect: new SqliteDialect({
    database: new Database(databaseFile),
  }),
  migrations: {
    migrationFolder: 'migrations',
  },
})

