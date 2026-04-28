// Default initials = first 2 characters of the first whitespace-separated
// token, uppercased. Used both when saving a new partner and when
// backfilling rows written by the old single-letter derivation.
export function deriveInitials(name: string): string {
  const firstWord = name.trim().split(/\s+/)[0] ?? ''
  return firstWord.slice(0, 2).toUpperCase()
}
