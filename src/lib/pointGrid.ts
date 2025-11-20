/**
 * Point grid animation rendering logic for cycle visualization.
 * Based on animated point grid concept with configurable states.
 */

export interface PointGridConfig {
  /** Base animation speed. Set to 0 for static grids. */
  baseSpeed: number
  /** Optional fixed color for static grids. If not provided, uses calcColor. */
  staticColor?: string
}

export interface PointGridConstants {
  POINT_MIN_SIZE: number
  POINT_MAX_SIZE: number
  POINT_SPACING: number
  MOTION_F_X: number
  MOTION_F_Y: number
  HEIGHT_VARIANCE: number
}

const DEFAULT_CONSTANTS: PointGridConstants = {
  POINT_MIN_SIZE: 2,
  POINT_MAX_SIZE: 3,
  POINT_SPACING: 6,
  MOTION_F_X: 0.2,
  MOTION_F_Y: 0.3,
  HEIGHT_VARIANCE: 2,
}

/**
 * Creates a point grid renderer for a given canvas element.
 */
export function createPointGridRenderer(
  canvas: HTMLCanvasElement,
  config: PointGridConfig,
  truncate: boolean = false,
  constants: PointGridConstants = DEFAULT_CONSTANTS,
) {
  const randomSeed = Math.floor(Math.random() * 1000000)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not get 2d context from canvas')
  }

  // Derived constants
  const POINT_RANGE = constants.POINT_MAX_SIZE - constants.POINT_MIN_SIZE
  const POINT_COLS = Math.floor(
    (canvas.width - constants.POINT_SPACING) /
      (constants.POINT_MIN_SIZE + constants.POINT_SPACING),
  )
  const POINT_ROWS = Math.floor(
    (canvas.height - constants.POINT_SPACING) /
      (constants.POINT_MIN_SIZE + constants.POINT_SPACING),
  )
  const R_360 = 2 * Math.PI

  // Converts a number from -1 to 1 into a number from 0 to <value>
  function normalize(sine: number, value: number): number {
    return value * 0.5 + sine * (value * 0.5)
  }

  // Return a value between -1 and 1 for a given timestamp and co-ordinate.
  // Uncomment different returns to see the effect
  function calcWave(t: number, x: number, y: number): number {
    const sx = Math.sin(x * constants.MOTION_F_X + t)
    const sy = Math.cos(y * constants.MOTION_F_Y + t)

    return Math.sin(sx + sy + t)
  }

  // Return an rgb color for a value between -1 and 1
  function calcColor(v: number): string {
    // magenta
    // const r = Math.round(normalize(v, 180)) + 75,
    //     g = Math.round(normalize(v, 16)),
    //     b = Math.round(normalize(v, 255)),
    //     a = 1;

    // lime green
    // base: 190, 242, 100
    const r = Math.round(20 + normalize(v, 170))
    const g = Math.round(normalize(v, 140) + 102)
    const b = Math.round(100 - normalize(v, 100))
    const a = 1

    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
  }

  // Main render method.  Draw the point grid with wavy shenanigans.
  function render(): void {
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Use the current timestamp as a modifier for our calculations
    const t = config.baseSpeed * (Date.now() + randomSeed)

    // Iterate the point grid and draw a circle at a specific size, color
    // and offset for each co-ordinate.
    for (let y = 0; y < POINT_ROWS; y++) {
      for (let x = 0; x < POINT_COLS; x++) {
        // Skip the first row so we have some vertical room for Y shifting
        // FIXME: do smarter row calculation upfront
        if (y == 0) continue

        // If truncate is enabled, only render the last (bottommost) row
        if (truncate && y !== POINT_ROWS - 1) continue

        let col: string
        let s: number
        let oy: number

        if (config.staticColor) {
          // Static grid - use fixed color and size
          col = config.staticColor
          s = constants.POINT_MIN_SIZE
          oy = 0
        } else {
          // Calculate a -1 .. 1 value for the current time and co-ord...
          const f = calcWave(t, x, y)
          // ...derive a colour, size and Y offset based on it...
          col = calcColor(f)
          s = constants.POINT_MIN_SIZE + normalize(f, POINT_RANGE)
          oy = normalize(f, constants.HEIGHT_VARIANCE)
        }

        // ...work out the actual pixel position on the canvas...
        const px =
          constants.POINT_SPACING + (constants.POINT_MIN_SIZE + constants.POINT_SPACING) * x
        const py =
          constants.POINT_SPACING +
          (constants.POINT_MIN_SIZE + constants.POINT_SPACING) * y -
          oy

        // ...and draw a circle at that size and color.
        ctx.beginPath()
        ctx.fillStyle = col
        ctx.arc(px, py, s, 0, R_360)
        ctx.fill()
      }
    }
  }

  return {
    render,
  }
}

/**
 * Preset configurations for different cycle states
 */
export const CYCLE_CONFIGS = {
  checked: {
    baseSpeed: 0.0003,
  },
  past: {
    baseSpeed: 0,
    staticColor: 'rgba(128, 128, 128, 1)',
  },
  future: {
    baseSpeed: 0,
    staticColor: 'rgba(64, 64, 64, 1)',
  },
} satisfies Record<string, PointGridConfig>
