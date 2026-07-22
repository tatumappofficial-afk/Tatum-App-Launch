import { currentTagLabel, findCurrentTagLabel, sessionTagLabel } from '@/src/utils/tagLabels'
import { makeEncounter, makeTag } from '../support/factories'

// A single emoji shared by every row in these tests. The label strings are
// neutral fixtures — real default tag labels are never restated here.
const EMOJI = '🕯️'

describe('findCurrentTagLabel', () => {
  it('returns null when no row matches the emoji', () => {
    const tags = [makeTag({ emoji: '🌊', label: 'Waves' })]
    expect(findCurrentTagLabel(EMOJI, tags)).toBeNull()
  })

  it('prefers an active tag over a retired one regardless of order', () => {
    const retired = makeTag({
      emoji: EMOJI,
      label: 'Retired',
      isActive: false,
      deactivatedAt: '2026-07-01T00:00:00.000Z',
    })
    const active = makeTag({ emoji: EMOJI, label: 'Active', isActive: true })
    expect(findCurrentTagLabel(EMOJI, [retired, active])).toBe('Active')
    expect(findCurrentTagLabel(EMOJI, [active, retired])).toBe('Active')
  })

  it('among multiple active rows picks the lowest sortOrder', () => {
    const high = makeTag({ emoji: EMOJI, label: 'High', isActive: true, sortOrder: 9 })
    const low = makeTag({ emoji: EMOJI, label: 'Low', isActive: true, sortOrder: 2 })
    expect(findCurrentTagLabel(EMOJI, [high, low])).toBe('Low')
    expect(findCurrentTagLabel(EMOJI, [low, high])).toBe('Low')
  })

  it('among retired-only rows picks the most recently deactivated', () => {
    const older = makeTag({
      emoji: EMOJI,
      label: 'Older',
      isActive: false,
      deactivatedAt: '2026-01-01T00:00:00.000Z',
    })
    const newer = makeTag({
      emoji: EMOJI,
      label: 'Newer',
      isActive: false,
      deactivatedAt: '2026-06-01T00:00:00.000Z',
    })
    expect(findCurrentTagLabel(EMOJI, [older, newer])).toBe('Newer')
    expect(findCurrentTagLabel(EMOJI, [newer, older])).toBe('Newer')
  })

  it('sorts a retired row with a missing deactivatedAt behind one that has it', () => {
    const stamped = makeTag({
      emoji: EMOJI,
      label: 'Stamped',
      isActive: false,
      deactivatedAt: '2026-01-01T00:00:00.000Z',
    })
    const unstamped = makeTag({
      emoji: EMOJI,
      label: 'Unstamped',
      isActive: false,
      deactivatedAt: null,
    })
    expect(findCurrentTagLabel(EMOJI, [stamped, unstamped])).toBe('Stamped')
    expect(findCurrentTagLabel(EMOJI, [unstamped, stamped])).toBe('Stamped')
  })

  it('breaks a deactivatedAt tie by lowest sortOrder', () => {
    const at = '2026-03-03T00:00:00.000Z'
    const high = makeTag({
      emoji: EMOJI,
      label: 'High',
      isActive: false,
      deactivatedAt: at,
      sortOrder: 8,
    })
    const low = makeTag({
      emoji: EMOJI,
      label: 'Low',
      isActive: false,
      deactivatedAt: at,
      sortOrder: 1,
    })
    expect(findCurrentTagLabel(EMOJI, [high, low])).toBe('Low')
    expect(findCurrentTagLabel(EMOJI, [low, high])).toBe('Low')
  })
})

describe('currentTagLabel', () => {
  it('resolves the active label like findCurrentTagLabel', () => {
    const tags = [makeTag({ emoji: EMOJI, label: 'Spark', isActive: true })]
    expect(currentTagLabel(EMOJI, tags)).toBe('Spark')
  })

  it('falls back to the bare emoji when no row matches', () => {
    expect(currentTagLabel(EMOJI, [])).toBe(EMOJI)
    expect(currentTagLabel(EMOJI, [makeTag({ emoji: '🌊', label: 'Waves' })])).toBe(EMOJI)
  })
})

describe('sessionTagLabel', () => {
  it('prefers the session snapshot over the current tag label', () => {
    const enc = makeEncounter({ activities: [EMOJI], activityLabels: { [EMOJI]: 'Snapshot' } })
    const tags = [makeTag({ emoji: EMOJI, label: 'Renamed', isActive: true })]
    expect(sessionTagLabel(enc, EMOJI, tags)).toBe('Snapshot')
  })

  it('falls back to the current label for a legacy session with no snapshot', () => {
    const enc = makeEncounter({ activities: [EMOJI], activityLabels: {} })
    const tags = [makeTag({ emoji: EMOJI, label: 'Current', isActive: true })]
    expect(sessionTagLabel(enc, EMOJI, tags)).toBe('Current')
  })

  it('resolves the retired label after a soft delete when no snapshot exists', () => {
    const enc = makeEncounter({ activities: [EMOJI], activityLabels: {} })
    const tags = [
      makeTag({
        emoji: EMOJI,
        label: 'Retired',
        isActive: false,
        deactivatedAt: '2026-05-05T00:00:00.000Z',
      }),
    ]
    expect(sessionTagLabel(enc, EMOJI, tags)).toBe('Retired')
  })
})
