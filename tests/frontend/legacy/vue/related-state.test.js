import { expect, it } from 'vitest'

import {
    canAddRelatedGroup,
    firstNewGroupIndex,
    isPersistedPrimary,
    normalizeRelatedGroups,
    normalizeRemovedGroups,
} from '../../../../resources/assets/js_owl/admin/form/related/related-state'

it('normalizes initial related groups without sharing mutable records', () => {
    const groups = normalizeRelatedGroups([
        { html: '<div>Saved</div>', index: 0, primary: 42 },
        { html: '<div>Retry</div>', index: 'new_8', primary: 'new_8' },
    ])

    expect(groups).toEqual([
        {
            html: '<div>Saved</div>',
            index: '0',
            key: 'initial:0:42',
            primary: '42',
        },
        {
            html: '<div>Retry</div>',
            index: 'new_8',
            key: 'initial:1:new_8',
            primary: 'new_8',
        },
    ])
    expect(groups.every(Object.isFrozen)).toBe(true)
})

it('allocates monotonic related indexes above group count and retried new keys', () => {
    const saved = normalizeRelatedGroups([{ html: '<div></div>', primary: 42 }])
    const retried = normalizeRelatedGroups([
        { html: '<div></div>', primary: 42 },
        { html: '<div></div>', primary: 'new_8' },
    ])

    expect(firstNewGroupIndex(saved)).toBe(2)
    expect(firstNewGroupIndex(retried)).toBe(9)
})

it('tracks related limits and only persisted primary keys as removals', () => {
    expect(canAddRelatedGroup(null, 10)).toBe(true)
    expect(canAddRelatedGroup(2, 1)).toBe(true)
    expect(canAddRelatedGroup(2, 2)).toBe(false)
    expect(isPersistedPrimary(0)).toBe(true)
    expect(isPersistedPrimary('42')).toBe(true)
    expect(isPersistedPrimary('new_2')).toBe(false)
    expect(isPersistedPrimary('new_retry')).toBe(false)
    expect(isPersistedPrimary('')).toBe(false)
    expect(normalizeRemovedGroups([42, '42', '7'])).toEqual(['42', '7'])
})

it('rejects malformed related group payloads', () => {
    expect(() => normalizeRelatedGroups({})).toThrow('must be an array')
    expect(() => normalizeRelatedGroups([null])).toThrow('must be an object')
    expect(() => normalizeRelatedGroups([{}])).toThrow('must contain HTML')
    expect(() => normalizeRemovedGroups(null)).toThrow('must be an array')
})
