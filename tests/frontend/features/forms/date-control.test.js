import { expect, it, vi } from 'vitest'

import { componentMountSkipped } from '../../../../resources/frontend/core/lifecycle/component-lifecycle.js'
import {
    createDateControlDefinition,
    mountDateControl,
} from '../../../../resources/frontend/features/forms/date/date-control.js'

function control(overrides = {}) {
    const addon = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }
    const input = {
        closest: () => ({ querySelector: () => addon }),
        dataset: { dateFormat: 'DD.MM.YYYY', dateControl: 'date' },
        disabled: false,
        focus: vi.fn(),
        readOnly: false,
        value: '06.09.2026',
        ...overrides,
    }

    return { addon, input }
}

it('mounts one Air Datepicker, opens it from the addon and cleans up', () => {
    const { addon, input } = control()
    const picker = { destroy: vi.fn(), show: vi.fn() }
    const Datepicker = vi.fn(function Datepicker() {
        return picker
    })
    const instance = mountDateControl(input, Datepicker, {})
    const click = addon.addEventListener.mock.calls[0][1]
    const event = { preventDefault: vi.fn() }

    click(event)
    instance.destroy()

    expect(Datepicker).toHaveBeenCalledOnce()
    expect(input.focus).toHaveBeenCalledOnce()
    expect(picker.show).toHaveBeenCalledOnce()
    expect(picker.destroy).toHaveBeenCalledOnce()
    expect(addon.removeEventListener).toHaveBeenCalledWith('click', click)
})

it('leaves readonly and disabled controls native and unmounted', () => {
    const Datepicker = vi.fn()

    expect(mountDateControl(control({ readOnly: true }).input, Datepicker, {})).toBe(
        componentMountSkipped,
    )
    expect(mountDateControl(control({ disabled: true }).input, Datepicker, {})).toBe(
        componentMountSkipped,
    )
    expect(Datepicker).not.toHaveBeenCalled()
})

it('publishes a lifecycle definition with a precise behavior selector', () => {
    const definition = createDateControlDefinition(vi.fn(), {})

    expect(definition).toMatchObject({
        name: 'date-control',
        selector: 'input[data-date-control]',
    })
})
