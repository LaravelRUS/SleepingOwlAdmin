import { expect, it } from 'vitest'

import {
    readTabState,
    tabStateKey,
    writeTabState,
} from '../../../../resources/frontend/features/tabs/tab-state.js'

it('preserves the legacy tab storage key including edit route normalization', () => {
    expect(tabStateKey('/admin/users')).toBe('Tabbed_/admin/users')
    expect(tabStateKey('/admin/users/42/edit')).toBe('Tabbed_/admin/users/edit')
})

it('reads record state and ignores invalid or unavailable storage', () => {
    expect(readTabState(storageWith('{"0":"details"}'), 'tabs')).toEqual({ 0: 'details' })
    expect(readTabState(storageWith('[]'), 'tabs')).toEqual({})
    expect(readTabState(storageWith('{bad'), 'tabs')).toEqual({})
    expect(readTabState(null, 'tabs')).toEqual({})
})

it('writes state without clearing unrelated storage after a failure', () => {
    const values = new Map([['unrelated', 'keep']])
    const storage = {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
    }

    expect(writeTabState(storage, 'tabs', { 0: 'details' })).toBe(true)
    expect(values.get('tabs')).toBe('{"0":"details"}')
    expect(values.get('unrelated')).toBe('keep')
    expect(
        writeTabState(
            {
                setItem: () => {
                    throw new Error('quota')
                },
            },
            'tabs',
            {},
        ),
    ).toBe(false)
})

function storageWith(value) {
    return { getItem: () => value }
}
