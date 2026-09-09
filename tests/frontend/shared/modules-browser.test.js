import { expect, it, vi } from 'vitest'

import { bootCompatibilityModules } from '../../../resources/js/shared/modules/browser.js'

it('boots legacy modules before the final idempotent component scan', () => {
    const calls = []
    const document = {}
    const target = {
        Admin: {
            Components: {
                scan: vi.fn((root) => {
                    calls.push(['scan', root])

                    return 3
                }),
            },
            Modules: {
                boot: vi.fn(() => calls.push(['boot'])),
            },
        },
        document,
    }

    expect(bootCompatibilityModules(target)).toBe(3)
    expect(calls).toEqual([['boot'], ['scan', document]])
})
