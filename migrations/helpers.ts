import { sql, type CreateTableBuilder } from 'kysely'

export type FocusValue = 'rhyt' | 'hyker' | 'other'

export const FOCUS_VALUES: readonly FocusValue[] = ['rhyt', 'hyker', 'other'] as const

export function addIdColumn<TableName extends string>(
  table: CreateTableBuilder<TableName>,
  columnName = 'id'
) {
  return table.addColumn(columnName, 'integer', (col) => col.primaryKey().autoIncrement())
}

export function addTimestamps<TableName extends string>(table: CreateTableBuilder<TableName>) {
  return table
    .addColumn('created_at', 'text', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'text', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
}

export function focusCheckExpression(columnName = 'focus') {
  const values = FOCUS_VALUES.map((value) => sql.lit(value))
  return sql`${sql.ref(columnName)} in (${sql.join(values, sql`, `)})`
}

