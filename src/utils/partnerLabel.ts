// Joins a set of partner display names into a single label string.
// "Solo" is what we render when no partners are present (only happens at
// render boundaries — the stored partnerIds array is non-empty).
export function formatPartnerLabel(names: string[]): string {
  if (names.length === 0) return 'Solo'
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} & ${names[1]}`
  const [first, second, ...rest] = names
  return `${first}, ${second} & ${rest.length} more`
}
