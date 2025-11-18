/**
 * Utility for conditionally joining CSS class names.
 * Similar to the popular 'classnames' or 'clsx' libraries.
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function classNames(...classes: ClassValue[]): string {
  const result: string[] = []

  for (const cls of classes) {
    if (!cls) continue

    if (typeof cls === 'string' || typeof cls === 'number') {
      result.push(String(cls))
    } else if (Array.isArray(cls)) {
      const nested = classNames(...cls)
      if (nested) result.push(nested)
    }
  }

  return result.join(' ')
}
