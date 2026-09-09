import { describe, expect, it } from 'vitest'

import {
    normalizeSidebarPreference,
    readSidebarPreference,
    SIDEBAR_COLLAPSED,
    SIDEBAR_EXPANDED,
    writeSidebarPreference,
} from '../../../../resources/js/shared/features/sidebar/sidebar-storage.js'

describe('sidebar preference storage', () => {
    it('accepts only the two public body state classes', () => {
        expect(normalizeSidebarPreference(SIDEBAR_COLLAPSED)).toBe(SIDEBAR_COLLAPSED)
        expect(normalizeSidebarPreference(SIDEBAR_EXPANDED)).toBe(SIDEBAR_EXPANDED)
        expect(normalizeSidebarPreference('menu-open')).toBeNull()
        expect(normalizeSidebarPreference(null)).toBeNull()
    })

    it('reads and writes storage without exposing storage failures', () => {
        const values = new Map()
        const storage = {
            getItem: (key) => values.get(key),
            setItem: (key, value) => values.set(key, value),
        }
        const document = { cookie: '', location: { protocol: 'https:' } }

        expect(writeSidebarPreference(storage, document, SIDEBAR_COLLAPSED)).toBe(true)
        expect(readSidebarPreference(storage)).toBe(SIDEBAR_COLLAPSED)
        expect(document.cookie).toContain('sidebar-state=sidebar-collapse')
        expect(document.cookie).toContain('SameSite=Lax; Secure')
    })

    it('ignores unavailable storage and invalid values', () => {
        const storage = {
            getItem: () => {
                throw new Error('denied')
            },
        }

        expect(readSidebarPreference(storage)).toBeNull()
        expect(writeSidebarPreference(null, null, 'invalid')).toBe(false)
    })
})
