import { expect, it, vi } from 'vitest'

import {
    destroyRelatedGroup,
    initializeRelatedGroup,
    relatedModuleNames,
} from '../../../../resources/assets/js_owl/admin/form/related/related-lifecycle'

it('initializes legacy adapters before scanning a dynamic related group', () => {
    const calls = []
    const element = { id: 'new-group' }
    const admin = {
        Components: { scan: vi.fn(() => calls.push('scan')) },
        Modules: { call: vi.fn((name) => calls.push(name)) },
    }

    initializeRelatedGroup(admin, element)

    expect(calls).toEqual([...relatedModuleNames, 'scan'])
    expect(admin.Components.scan).toHaveBeenCalledWith(element)
})

it('delegates teardown to the shared component lifecycle', () => {
    const element = { id: 'removed-group' }
    const destroy = vi.fn(() => 3)

    expect(destroyRelatedGroup({ Components: { destroy } }, element)).toBe(3)
    expect(destroy).toHaveBeenCalledWith(element)
})
