# TODO

## 0. Repository hygiene & tooling

- [x] Remove leftover scaffold components/routes that are outside the kata scope (`src/routes/about.tsx`, `src/components/Counter.*`, etc.).
- [x] Document mandatory checks (`npm run typecheck`, `npm run lint`, `npm run test:run`) in `README.md` and set up a pre-push script or Git hook to run them.

## 1. Database + migrations

- [x] Decide on SQLite file location (e.g. `/Users/jonvuri/Development/nano-kata/kata.sqlite`) and add it to `.gitignore`.
- [x] Initialize `kysely-ctl` (config file + migrations folder) targeting the SQLite database with the sqlite-dialect driver.
- [x] Write an initial migration that creates a minimalist `check_ins` table with columns: `id`, `checked_at` (datetime), `now`, `focus` (`rhyt|hyker|other`), `soul`, `prep`, and timestamps; cycle data stays derived at runtime.
- [x] Seed the migration folder with future-proof helpers (e.g. `helpers.ts` exporting column builders) to keep schema changes consistent.
- [x] Run migrations locally and add a sanity check script (`npm run db:migrate`) to the package scripts.

## 2. Type generation & data access

- [x] Configure `kysely-codegen` to point at the local SQLite DB and output generated types (e.g. `src/db/generated.ts`).
- [x] Create a typed `Database` wrapper (`src/db/client.ts`) that instantiates Kysely with the sqlite dialect and re-exports helper queries.
- [x] Define repository helpers for commonly needed reads:
  - fetch all check-ins for a given day ordered desc
  - compute per-day density (count of waking cycles with check-ins / total waking cycles) by grouping timestamps into fixed cycles
  - compute current streak by scanning previous days with density 1.0

## 3. Data-ingest script

- [x] Create a CLI entry point (`scripts/add-check-in.ts`) runnable via `tsx` that accepts args (`--when`, `--now`, `--focus`, `--soul`, `--prep`) and inserts into `check_ins`.
- [x] Validate focus values (`rhyt|hyker|other`), and default `--when` to current time.
- [x] Add convenience commands in `package.json` (`"checkins:add": "tsx scripts/add-check-in.ts"`).

## 4. SolidStart server routes

- [x] Expose a server data loader in `src/routes/index.tsx` that fetches:
  - today's check-ins
  - daily density value
  - streak metadata
  - metadata for every cycle `0-F` indicating past/future/checked status, computed from current time plus check-in timestamps
- [x] Implement shared utilities (e.g. `getTodayCycles()` and `classNames` helpers) in `src/lib/`.

## 5. UI layout requirements

- [x] Replace the starter page with a single dashboard composed of:
  - **Cycle strip**: 16 squares aligned horizontally; state colors → future (dark), past (medium), checked (lime) derived purely from current time and in-memory check-ins.
  - **Value panel**: to the right of the strip, large numeric display showing (a) today's density (0.0–1.0) across all waking cycles, including future ones in the same day, and (b) the current streak of 1.0-density days.
  - **Check-in table**: below the top row, list entries newest first; include `checked_at`, `cycle hex` (derived), `now`, `focus`, `soul`, `prep`.
- [x] Ensure the layout remains responsive (stack vertically on small widths) and uses app-wide CSS tokens defined in `src/app.css`.
- [x] Consider accessibility: text contrast for dark backgrounds, focus styles, aria labels for color-only states.

## 6. State management & interactions

- [x] Use Solid signals/resources to hydrate data from the loader; avoid client-side fetch duplication.

## 7. Metrics logic

- [x] Implement utility to map timestamps to cycle hex indexes and determine waking cycles (6–E) on the fly, no persistence.
- [x] Calculate density as `wakingCyclesWithCheckIns / 9` (since cycles 6–E inclusive) and round to two decimals.
- [x] Compute streak by checking previous days (descending) until a day with density < 1.0 is hit.

## 8. Testing & QA

- [ ] Add Vitest suites for utilities (cycle math, density, streak).
- [ ] Write integration tests (or e2e with Playwright) for the page loader to ensure DB queries wire correctly.

## 9. Future-friendly enhancements

- [ ] Abstract visualization primitives so the future hexagon/point-grid upgrade only swaps the renderer.
- [ ] Show the earliest check-in time for each cycle (if any).
- [ ] Capture design debt + UX wishlist (filters, editing, multi-day view) in `README.md`.
- [ ] Add manual inputs with a dialog-based form for entering a new check-in.
