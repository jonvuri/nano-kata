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
            aria-label={`Cycle ${cycle.hex}: ${cycle.state}${cycle.isWaking ? ', waking cycle' : ''}${cycle.earliestCheckInTime ? `, checked in at ${cycle.earliestCheckInTime}` : ''}`}
            title={`Cycle ${cycle.hex} (${cycle.state}${cycle.isWaking ? ', waking' : ', non-waking'})${cycle.earliestCheckInTime ? `\nChecked in at ${cycle.earliestCheckInTime}` : ''}`}
            class={classNames(
              'h-12 w-12 flex-shrink-0 rounded transition-colors flex items-center justify-center text-xs font-mono',
              cycle.state === 'future' && 'cycle-future',
              cycle.state === 'past' && 'cycle-past',
              cycle.state === 'checked' && 'cycle-checked',
              // Add a subtle border for non-waking cycles
              !cycle.isWaking && 'opacity-40',
            )}
          >
            {cycle.earliestCheckInTime && (
              <span class="text-black font-semibold">{cycle.earliestCheckInTime}</span>
            )}
            <span class="sr-only">
              Cycle {cycle.hex}: {cycle.state}
              {cycle.isWaking ? ', waking cycle' : ''}
              {cycle.earliestCheckInTime ? `, checked in at ${cycle.earliestCheckInTime}` : ''}
            </span>
          </div>
        )}
      </For>
    </div>
  )
}
