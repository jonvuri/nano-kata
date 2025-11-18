# nano-kata

simple, focused tracking of kata cycles

## prerequisites

- Node.js `v24.11.1` (`nvm use` will pick this up from `.nvmrc`)
- pnpm (managed via Corepack)
- SQLite (the project creates `kata.sqlite` at the repo root)

Install dependencies with:

```bash
pnpm install
```

## development

```bash
pnpm dev
```

The dashboard surface is still in progress, but the tooling and database stack are ready for the follow-up tasks in `TODO.md`.

## mandatory checks

All changes must pass the following commands locally before pushing. A pre-push hook (managed by `simple-git-hooks`) runs them automatically, but you can run them manually any time:

```bash
pnpm lint        # ESLint (no --fix to keep hooks fast + deterministic)
pnpm typecheck   # strict TS compile (no emit)
pnpm test:run    # Vitest suites (coming in later steps)
```

Formatting: run `pnpm format` after making edits. It runs Prettier across the repo to keep markdown, config, and source files consistent.

## database utilities

The local SQLite database lives at `kata.sqlite`. Use the Kysely CLI for migrations:

```bash
# apply latest migrations locally
pnpm db:migrate
```

Helper scripts for ingesting data will arrive in later steps; for now, the schema and migrator are in place (see `kysely.config.ts` and the `migrations/` folder).

## building

```bash
pnpm build
pnpm start
```

Solid apps are built with presets (see `app.config.ts`). The default target is a Node runtime via Vinxi; other targets can be added later if needed.
