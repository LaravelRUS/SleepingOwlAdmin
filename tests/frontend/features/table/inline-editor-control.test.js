import { expect, it } from 'vitest'

import { bindInlineEditorControl } from '../../../../resources/frontend/features/table/editing/inline-editor-control.js'

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
