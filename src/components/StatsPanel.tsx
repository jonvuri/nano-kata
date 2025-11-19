interface StatsPanelProps {
  density: number
  streak: number
}

export function StatsPanel(props: StatsPanelProps) {
  return (
    <div class="flex flex-col gap-6">
      <div>
        <p class="text-sm uppercase tracking-wider text-slate-400">Daily Density</p>
        <p
          class="text-5xl font-bold tabular-nums"
          aria-label={`Daily density: ${props.density.toFixed(2)}`}
        >
          {props.density.toFixed(2)}
        </p>
        <p class="mt-1 text-xs text-slate-500">Across all waking cycles (6-E)</p>
      </div>

      <div>
        <p class="text-sm uppercase tracking-wider text-slate-400">Current Streak</p>
        <p
          class="text-5xl font-bold tabular-nums text-lime-300"
          aria-label={`Current streak: ${props.streak} ${props.streak === 1 ? 'day' : 'days'}`}
        >
          {props.streak}
        </p>
        <p class="mt-1 text-xs text-slate-500">
          {props.streak === 1 ? 'day' : 'days'} with 1.0 density
        </p>
      </div>
    </div>
  )
}
