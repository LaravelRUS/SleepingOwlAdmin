import { expect, it, vi } from 'vitest'

import { bindInlineEditorControl } from '../../../../resources/js/shared/features/table/editing/inline-editor-control.js'

function input() {
    return {
        dataset: {},
        removeAttribute() {},
        setAttribute() {},
        value: '',
    }
}

it.each(['date', 'datetime'])('marks inline %s controls to open only on click', (type) => {
    const element = input()

    bindInlineEditorControl(element, {
        dateFormat: 'DD.MM.YYYY',
        max: null,
        min: null,
        step: null,
        type,
        value: '07.09.2026',
    })

    expect(element.dataset).toMatchObject({
        dateControl: type,
        dateFormat: 'DD.MM.YYYY',
        dateShowEvent: 'click',
    })
})

it('clears scalar controls', () => {
    const element = input()
    element.dispatchEvent = () => {}
    const control = bindInlineEditorControl(element, {
        max: null,
        min: null,
        step: null,
        type: 'text',
        value: 'Draft',
    })

    control.clear()

    expect(control.read()).toBe('')
})

it('uses Tom Select for a popup editable select', () => {
    const native = {
        value: 'published',
    }
    const tomSelect = {
        clear: vi.fn(),
        destroy: vi.fn(),
        disable: vi.fn(),
        enable: vi.fn(),
        focus: vi.fn(),
        getValue: () => 'archived',
    }
    const createTomSelect = vi.fn(() => tomSelect)
    const element = {
        matches: () => true,
        querySelector: (selector) => {
            if (selector === '[data-inline-editor-select-native]') return native

            return null
        },
    }
    const control = bindInlineEditorControl(
        element,
        {
            mode: 'popup',
            type: 'select',
            value: 'published',
        },
        { createTomSelect },
    )

    expectTomSelectSettings(createTomSelect, native)
    expect(control.read()).toBe('archived')
    control.focusElement()
    expect(tomSelect.focus).toHaveBeenCalledOnce()
    control.clear()
    control.setDisabled(true)
    control.setDisabled(false)
    control.destroy()
    expectTomSelectLifecycle(tomSelect)
})

it('resets an editable range to zero when it is cleared', () => {
    const range = input()
    range.value = '42'
    range.addEventListener = () => {}
    range.removeEventListener = () => {}

    const number = input()
    number.value = '42'
    const numberListeners = {}
    number.addEventListener = (name, listener) => (numberListeners[name] = listener)
    number.removeEventListener = () => {}

    const output = { hidden: true, textContent: '42', value: '42' }
    const element = {
        querySelector: (selector) => {
            if (selector === '[data-inline-editor-range-input]') return range
            if (selector === '[data-inline-editor-range-number]') return number
            if (selector === '[data-inline-editor-range-output]') return output
            return null
        },
    }
    const control = bindInlineEditorControl(element, {
        max: '100',
        min: '0',
        step: '1',
        type: 'range',
        value: '42',
    })

    number.value = ''
    numberListeners.input()

    expectClearedRange(range, number, output)
    expect(control.read()).toBe('0')

    range.value = '42'
    number.value = '42'
    control.clear()

    expectClearedRange(range, number, output)
    expect(control.read()).toBe('0')
})

function expectClearedRange(range, number, output) {
    expect({
        hidden: output.hidden,
        number: number.value,
        output: output.value,
        range: range.value,
    }).toEqual({
        hidden: false,
        number: '0',
        output: '0',
        range: '0',
    })
}

function expectTomSelectSettings(createTomSelect, native) {
    expect(createTomSelect).toHaveBeenCalledWith(
        native,
        expect.objectContaining({
            allowEmptyOption: true,
            create: false,
            maxItems: 1,
            maxOptions: null,
        }),
    )
}

function expectTomSelectLifecycle(tomSelect) {
    expect(tomSelect.clear).toHaveBeenCalledOnce()
    expect(tomSelect.disable).toHaveBeenCalledOnce()
    expect(tomSelect.enable).toHaveBeenCalledOnce()
    expect(tomSelect.destroy).toHaveBeenCalledOnce()
}
