import { expect, it, vi } from 'vitest'

import {
    configureFilterControls,
    createFilterControlsFeature,
    FILTER_CONTROLS_FEATURE,
    installFilterControlsFeature,
} from '../../../../resources/frontend/features/table/filters/filter-controls-feature.js'

function fixture() {
    const control = { parentNode: null }
    const execute = {
        closest: vi.fn((selector) => (selector === '.btn-group' ? control : null)),
    }
    const container = {
        dataset: { datatablesId: 'orders' },
        querySelector: vi.fn(() => execute),
    }
    const parent = {
        insertBefore: vi.fn((placeholder) => {
            placeholder.parentNode = parent
        }),
        replaceChild: vi.fn(),
    }
    const document = {
        createComment: vi.fn(() => ({ parentNode: null })),
        querySelectorAll: vi.fn(() => [container]),
    }
    const table = { dataset: { id: 'orders' }, ownerDocument: document }

    control.parentNode = parent

    return { control, document, parent, table }
}

it('registers and places filter controls after page length in top2End', () => {
    const item = fixture()
    const register = vi.fn()
    const options = { layout: { top2End: 'pageLength' } }

    installFilterControlsFeature({ feature: { register } })

    expect(register).toHaveBeenCalledWith(FILTER_CONTROLS_FEATURE, createFilterControlsFeature)
    expect(configureFilterControls(item.table, options)).toBe(true)
    expect(options.layout.top2End).toEqual(['pageLength', FILTER_CONTROLS_FEATURE])
})

it('moves the original control into the feature and restores it on destroy', () => {
    const item = fixture()
    let destroy
    const settings = {
        api: { one: vi.fn((_event, listener) => (destroy = listener)) },
        table: item.table,
    }

    expect(createFilterControlsFeature(settings)).toBe(item.control)
    expect(item.parent.insertBefore).toHaveBeenCalledWith(expect.any(Object), item.control)
    expect(settings.api.one).toHaveBeenCalledWith('destroy.soaFilterControls', expect.any(Function))

    destroy()
    expect(item.parent.replaceChild).toHaveBeenCalledWith(item.control, expect.any(Object))
})
