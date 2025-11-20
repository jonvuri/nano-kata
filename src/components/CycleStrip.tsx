import { For, onMount, onCleanup } from 'solid-js'

import type { CycleMetadata } from '../lib/cycles'
import { createPointGridRenderer, CYCLE_CONFIGS } from '../lib/pointGrid'

interface CycleStripProps {
  cycles: CycleMetadata[]
}

interface CycleGridProps {
  cycle: CycleMetadata
}

function CycleGrid(props: CycleGridProps) {
  let canvasRef: HTMLCanvasElement | undefined
  let animationFrameId: number | undefined

  onMount(() => {
    if (!canvasRef) return

    // Select config based on cycle state
    const config = CYCLE_CONFIGS[props.cycle.state]
    const renderer = createPointGridRenderer(canvasRef, config)

    // Main loop
    function loop() {
      renderer.render()
      animationFrameId = requestAnimationFrame(loop)
    }

    // Start the animation loop
    loop()
  })

  onCleanup(() => {
    if (animationFrameId !== undefined) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return (
    <div
      role="listitem"
      title={`Cycle ${props.cycle.hex} (${props.cycle.state}${props.cycle.isWaking ? ', waking' : ', non-waking'})${props.cycle.earliestCheckInTime ? `\nChecked in at ${props.cycle.earliestCheckInTime}` : ''}`}
      class="flex flex-col gap-2"
    >
      <canvas
        ref={canvasRef}
        width="100"
        height="100"
        class="w-[100px] h-[100px] flex-shrink-0 rounded"
      />

      <div class="text-xs font-mono space-y-0.5 pl-2">
        <div class="text-text-tertiary">{props.cycle.hex}</div>
        {props.cycle.earliestCheckInTime && (
          <div class="text-accent-lime font-semibold">{props.cycle.earliestCheckInTime}</div>
        )}
      </div>
    </div>
  )
}

export function CycleStrip(props: CycleStripProps) {
  // Filter to only show waking cycles
  const wakingCycles = () => props.cycles.filter((cycle) => cycle.isWaking)

  return (
    <div
      role="list"
      aria-label="Daily cycle visualization"
      class="flex flex-col lg:flex-row gap-4 justify-between"
    >
      <For each={wakingCycles()}>{(cycle) => <CycleGrid cycle={cycle} />}</For>
    </div>
  )
}
