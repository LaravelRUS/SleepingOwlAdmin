import { expect, it } from 'vitest'

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

it('reads the editable multiselect without focusing or clearing it externally', () => {
    const native = {
        value: 'published',
    }
    const element = {
        matches: () => true,
        querySelector: (selector) =>
            selector === '[data-inline-editor-select-native]' ? native : null,
    }
    const control = bindInlineEditorControl(element, {
        type: 'select',
        value: 'published',
    })

    expect(control.read()).toBe('published')
    expect(control.focusElement).toBe(element)
    expect(control.clear).toBeUndefined()
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

    const output = { textContent: '42', value: '42' }
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

    expect(range.value).toBe('0')
    expect(number.value).toBe('0')
    expect(output.value).toBe('0')
    expect(control.read()).toBe('0')

    range.value = '42'
    number.value = '42'
    control.clear()

    expect(range.value).toBe('0')
    expect(number.value).toBe('0')
    expect(output.value).toBe('0')
    expect(control.read()).toBe('0')
})
