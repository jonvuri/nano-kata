import { Title } from '@solidjs/meta'

export default function Home() {
  return (
    <main class="min-h-screen bg-black text-slate-100">
      <Title>Nano Kata</Title>
      <section class="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16">
        <header>
          <p class="text-sm uppercase tracking-[0.3em] text-lime-300">Nano Kata</p>
          <h1 class="text-4xl font-semibold">Dashboard in progress</h1>
        </header>
        <p class="text-base text-slate-300">
          The kata tracking interface is under construction. Upcoming work includes the cycle
          strip, density and streak stats, and the check-in ledger described in the project
          plan.
        </p>
      </section>
    </main>
  )
}
