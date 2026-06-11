// Joins a set of partner display names into a single label string.
// Partner-less sessions (e.g. period logs) get an empty label — surfaces hide
// the name line entirely so the date and activity emojis move up. Returning
// "Solo" here would collide with the real Solo partner row (TAT-13).
export function formatPartnerLabel(names: string[]): string {
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} & ${names[1]}`
  const [first, second, ...rest] = names
  return `${first}, ${second} & ${rest.length} more`
}
