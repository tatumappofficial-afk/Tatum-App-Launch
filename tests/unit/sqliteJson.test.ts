import { parseJsonColumn, serializeJsonColumn } from '@/src/db/sqlite'

describe('serializeJsonColumn / parseJsonColumn', () => {
  it('round-trips objects, arrays, and scalars', () => {
    const cases: unknown[] = [
      { a: 1, b: ['x', 'y'], c: null },
      ['🕯️', '🌊'],
      { '🕯️': 'Candlelight' },
      42,
      'plain',
      true,
    ]
    for (const value of cases) {
      const serialized = serializeJsonColumn(value)
      expect(parseJsonColumn(serialized, null)).toEqual(value)
    }
  })

  it('returns the fallback for a null column value', () => {
    expect(parseJsonColumn(null, [])).toEqual([])
    expect(parseJsonColumn(null, { def: true })).toEqual({ def: true })
  })

  it('returns the fallback for an empty string', () => {
    // Empty string is falsy, so it short-circuits to the fallback before JSON.parse.
    expect(parseJsonColumn('', {})).toEqual({})
  })

  it('returns the fallback for malformed JSON', () => {
    const fallback = { safe: true }
    expect(parseJsonColumn('{not valid json', fallback)).toBe(fallback)
    expect(parseJsonColumn('[1, 2,', fallback)).toBe(fallback)
  })

  it('serializes with JSON.stringify semantics (undefined props dropped)', () => {
    expect(serializeJsonColumn({ a: 1, b: undefined })).toBe('{"a":1}')
  })
})
