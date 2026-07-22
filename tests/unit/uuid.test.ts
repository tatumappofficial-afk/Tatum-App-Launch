import { generateId } from '@/src/utils/uuid'

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('generateId', () => {
  it('produces a canonical UUID v4 shape', () => {
    expect(generateId()).toMatch(UUID_V4)
  })

  it('always sets the version nibble to 4', () => {
    for (let i = 0; i < 100; i++) {
      expect(generateId()[14]).toBe('4')
    }
  })

  it('always sets the variant nibble to one of 8, 9, a, b', () => {
    for (let i = 0; i < 100; i++) {
      expect(generateId()[19]).toMatch(/[89ab]/)
    }
  })

  it('is effectively unique across many draws', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 1000; i++) seen.add(generateId())
    expect(seen.size).toBe(1000)
  })
})
