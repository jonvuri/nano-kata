import { For } from 'solid-js'

import type { CheckIn } from '../db/repository'
import { getCycleIndex, cycleToHex } from '../db/cycles'

interface CheckInTableProps {
  checkIns: CheckIn[]
}

export function CheckInTable(props: CheckInTableProps) {
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    })
  }

  const getCycleHex = (isoString: string) => {
    const date = new Date(isoString)
    const cycle = getCycleIndex(date)
    return cycleToHex(cycle)
  }

  return (
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-neutral-700">
            <th class="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Time
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Cycle
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Now
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Focus
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Soul
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Prep
            </th>
          </tr>
        </thead>
        <tbody>
          {props.checkIns.length === 0 ?
            <tr>
              <td colspan="6" class="px-4 py-8 text-center text-neutral-500">
                No check-ins yet today
              </td>
            </tr>
          : <For each={props.checkIns}>
              {(checkIn) => (
                <tr class="border-b border-neutral-800 transition-colors hover:bg-neutral-900">
                  <td class="px-4 py-3 text-sm text-neutral-300">
                    {formatDateTime(checkIn.checked_at)}
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <span class="rounded bg-lime-300 px-2 py-1 font-mono text-xs font-bold text-black">
                      {getCycleHex(checkIn.checked_at)}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-neutral-200">{checkIn.now}</td>
                  <td class="px-4 py-3 text-sm">
                    <span
                      class="rounded-full px-2 py-1 text-xs font-medium"
                      classList={{
                        'bg-blue-900 text-blue-200': checkIn.focus === 'rhyt',
                        'bg-purple-900 text-purple-200': checkIn.focus === 'hyker',
                        'bg-neutral-700 text-neutral-300': checkIn.focus === 'other',
                      }}
                    >
                      {checkIn.focus}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-neutral-300">{checkIn.soul}</td>
                  <td class="px-4 py-3 text-sm text-neutral-300">{checkIn.prep}</td>
                </tr>
              )}
            </For>
          }
        </tbody>
      </table>
    </div>
  )
}
