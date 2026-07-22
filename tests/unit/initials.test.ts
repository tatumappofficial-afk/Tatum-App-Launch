import { deriveInitials } from '@/src/utils/initials'

describe('deriveInitials', () => {
  it.each([
    ['multi-word name uses the first token', 'Jordan Reyes', 'JO'],
    ['single-word name uses first two chars', 'Alex', 'AL'],
    ['single-character name', 'A', 'A'],
    ['lowercase is uppercased', 'sam', 'SA'],
    ['leading/trailing whitespace is trimmed', '  quinn  ', 'QU'],
    ['collapses to first token only', 'mary jane watson', 'MA'],
  ])('%s', (_desc, input, expected) => {
    expect(deriveInitials(input)).toBe(expected)
  })

  it('returns an empty string for an empty name', () => {
    expect(deriveInitials('')).toBe('')
    expect(deriveInitials('   ')).toBe('')
  })

  it('handles a unicode first token', () => {
    // First two code units of the first token, uppercased (no-op for these).
    expect(deriveInitials('José Ramírez')).toBe('JO')
    expect(deriveInitials('Ø Åberg')).toBe('Ø')
  })
})
