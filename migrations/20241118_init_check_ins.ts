import { sql, type Kysely } from 'kysely'

import { addIdColumn, addTimestamps, focusCheckExpression } from './helpers'

export async function up(db: Kysely<any>) {
  await addTimestamps(
    addIdColumn(
      db.schema
        .createTable('check_ins')
        .addColumn('checked_at', 'text', (col) =>
          col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
        )
        .addColumn('now', 'text', (col) => col.notNull())
        .addColumn('focus', 'text', (col) => col.notNull().check(focusCheckExpression()))
        .addColumn('soul', 'text', (col) => col.notNull())
        .addColumn('prep', 'text', (col) => col.notNull())
    )
  ).execute()

  await db.schema.createIndex('check_ins_checked_at_idx').on('check_ins').column('checked_at').execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex('check_ins_checked_at_idx').execute()
  await db.schema.dropTable('check_ins').execute()
}

