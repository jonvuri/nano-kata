# development practices

## static analysis and tests

check these tasks after every major change:

- static types (Typescript): `npm run typecheck`
- linter (ESLint): `npm run lint`
- tests (Vitest): `npm run test:run`

# project plan

## concepts

- kata: a regular ritual or 'form' meant to maintain determination, focus, and confidence throughout the day
- cycle: a 90-minute interval at a set time of day. cycles are numbered in hexadecimal, 0 through F, with 0 going from 00:00 to 01:30, 1 going from 01:30 to 03:00, up to F from 22:30 to 00:00 again
  - waking cycle: the cycles from 6-E

## high-level objectives

- track kata check-ins for every waking cycle
- track kata stats:
  - current continuous check-in streak (days with a density of 1.0)
  - daily density of check-ins, meaning percentage of fully awake cycles checked in expressed as a real number from 0.0 to 1.0
- for each check-in, record:
  - 'now' - a simple word or phrase describing current activity
  - 'focus' - one of the values 'rhyt', 'hyker', or 'other'
  - 'soul' - a simple word or phrase describing mood, energy level, or outlook
  - 'prep' - a simple word or phrase describing intentions for spending time in the next cycle

## implementation details

- this project was bootstrapped, no need to maintain anything from the initial example components
- store all data in a local SQLite database, in the same directory as the project
- use Kysely with its sqlite dialect for the app's server-side queries (https://kysely.dev/docs/getting-started?dialect=sqlite#dialects)
- use kysely-codegen to generate Typescript types for the database, and kysely-ctl to set up migrations
- add records to the database with a simple executable Node.js script, also in the project directory
  - the script should accept all its inputs as command line arguments
  - the script should use Kysely for database queries
  - use tsx (https://github.com/privatenumber/tsx) to run a Typescript script
- the app is intended mainly for displaying and visualizing the records
- other than that, follow best practices for a SolidStart project

## pages

- just a single page for now, with three sections:
  - a section showing the day's cycles as a line of squares, shaded dark if the cycle is still in the future, medium dark if the cycle is in the past, and lime green if the cycle contains a check-in
  - a section just to the right of the cycle visualization, displaying the current daily density, considering all of the day's waking cycles including those in the future
  - a section below both of those showing the check-ins in tabular format, most recent first

## check-in schema

- check-ins should store the following data at a minimum (add other columns as needed for implementation purposes):
  - date-time of the check-in
  - now, as a string
  - focus, as a string
  - soul, as a string
  - prep, as a string

## future plans

- convert the cycle visualization from squares to something like point grids or interleaved hexagons
