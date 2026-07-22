import { formatPartnerLabel } from '@/src/utils/partnerLabel'

describe('formatPartnerLabel', () => {
  it('returns an empty label for no partners', () => {
    expect(formatPartnerLabel([])).toBe('')
  })

  it('returns the single name unchanged', () => {
    expect(formatPartnerLabel(['Jordan'])).toBe('Jordan')
  })

  it('joins two names with an ampersand', () => {
    expect(formatPartnerLabel(['Jordan', 'Sam'])).toBe('Jordan & Sam')
  })

  it('summarizes three names with a "N more" suffix', () => {
    expect(formatPartnerLabel(['Jordan', 'Sam', 'Alex'])).toBe('Jordan, Sam & 1 more')
  })

  it('counts every extra partner beyond the first two', () => {
    expect(formatPartnerLabel(['Jordan', 'Sam', 'Alex', 'Quinn', 'Riley'])).toBe('Jordan, Sam & 3 more')
  })
})
