import { buildActivityLabels } from '@/src/db/tagHistory'
import { makeTag } from '../support/factories'

// Neutral emoji fixtures; labels are neutral strings only.
const A = '🕯️'
const B = '🌊'

describe('buildActivityLabels', () => {
  it('keeps a previously-snapshotted label even after the tag is renamed', () => {
    const tags = [makeTag({ emoji: A, label: 'Renamed', isActive: true })]
    const result = buildActivityLabels([A], { [A]: 'Original' }, tags)
    expect(result).toEqual({ [A]: 'Original' })
  })

  it('snapshots a newly added emoji at its current label', () => {
    const tags = [makeTag({ emoji: A, label: 'Spark', isActive: true })]
    const result = buildActivityLabels([A], {}, tags)
    expect(result).toEqual({ [A]: 'Spark' })
  })

  it('drops an emoji that is no longer among the activities', () => {
    const tags = [
      makeTag({ emoji: A, label: 'Spark', isActive: true }),
      makeTag({ emoji: B, label: 'Waves', isActive: true }),
    ]
    const result = buildActivityLabels([A], { [A]: 'Spark', [B]: 'Waves' }, tags)
    expect(result).toEqual({ [A]: 'Spark' })
    expect(result).not.toHaveProperty(B)
  })

  it('omits an emoji that has no tag row at all (bare-glyph guard)', () => {
    const tags = [makeTag({ emoji: B, label: 'Waves', isActive: true })]
    const result = buildActivityLabels([A], {}, tags)
    expect(result).toEqual({})
    expect(result).not.toHaveProperty(A)
  })

  it('pins every activity of a legacy session at current labels on first touch', () => {
    const tags = [
      makeTag({ emoji: A, label: 'Spark', isActive: true }),
      makeTag({ emoji: B, label: 'Waves', isActive: true }),
    ]
    const result = buildActivityLabels([A, B], {}, tags)
    expect(result).toEqual({ [A]: 'Spark', [B]: 'Waves' })
  })

  it('uses a retired tag label when no active tag exists for the emoji', () => {
    const tags = [
      makeTag({
        emoji: A,
        label: 'Retired',
        isActive: false,
        deactivatedAt: '2026-04-04T00:00:00.000Z',
      }),
    ]
    const result = buildActivityLabels([A], {}, tags)
    expect(result).toEqual({ [A]: 'Retired' })
  })
})
