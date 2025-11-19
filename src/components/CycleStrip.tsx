import { For } from 'solid-js'

import type { CycleMetadata } from '../lib/cycles'
import { classNames } from '../lib/classNames'

interface CycleStripProps {
  cycles: CycleMetadata[]
}

export function CycleStrip(props: CycleStripProps) {
  return (
    <div role="list" aria-label="Daily cycle visualization" class="flex gap-2">
      <For each={props.cycles}>
        {(cycle) => (
          <div
            role="listitem"
            aria-label={`Cycle ${cycle.hex}: ${cycle.state}${cycle.isWaking ? ', waking cycle' : ''}`}
            title={`Cycle ${cycle.hex} (${cycle.state}${cycle.isWaking ? ', waking' : ', non-waking'})`}
            class={classNames(
              'h-12 w-12 flex-shrink-0 rounded transition-colors',
              cycle.state === 'future' && 'cycle-future',
              cycle.state === 'past' && 'cycle-past',
              cycle.state === 'checked' && 'cycle-checked',
              // Add a subtle border for non-waking cycles
              !cycle.isWaking && 'opacity-40',
            )}
          >
            <span class="sr-only">
              Cycle {cycle.hex}: {cycle.state}
              {cycle.isWaking ? ', waking cycle' : ''}
            </span>
          </div>
        )}
      </For>
    </div>
  )
}
