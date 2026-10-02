/** Small, self-contained formatter also embedded in the isolated execution worker. */
export function serializeConsoleValue(value: unknown): string {
  if (typeof value === 'string') return value.slice(0, 2000)
  if (typeof value === 'undefined') return 'undefined'
  if (typeof value === 'bigint') return `${value}n`
  if (typeof value === 'symbol') return String(value)
  if (typeof value === 'function') return `[Function${value.name ? `: ${value.name}` : ''}]`
  if (value instanceof Error) return `${value.name}: ${value.message}`
  const seen = new WeakSet<object>()
  try {
    return (JSON.stringify(value, (_key, entry: unknown) => {
      if (typeof entry === 'bigint') return `${entry}n`
      if (typeof entry === 'undefined') return '[undefined]'
      if (typeof entry === 'function') return '[Function]'
      if (typeof entry === 'symbol') return String(entry)
      if (entry && typeof entry === 'object') {
        if (seen.has(entry)) return '[Circular]'
        seen.add(entry)
      }
      return entry
    }, 2) ?? String(value)).slice(0, 2000)
  } catch {
    try { return String(value).slice(0, 2000) }
    catch { return '[Unprintable value]' }
  }
}
