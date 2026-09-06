import { describe, expect, it } from 'vitest'

import {
    applyInlineEditorValue,
    inlineEditorDisplayValue,
    normalizeInlineEditorValue,
} from '../../../../resources/frontend/features/table/editing/inline-editor-value.js'

const options = [
    { value: '1', text: 'Admin' },
    { value: '2', text: 'Editor' },
]

describe('inline editor values', () => {
    it('normalizes lists and maps select labels', () => {
        expect(normalizeInlineEditorValue('1,2', 'checklist')).toEqual(['1', '2'])
        expect(inlineEditorDisplayValue({ emptyText: 'None', options, type: 'select' }, '2')).toBe(
            'Editor',
        )
        expect(
            inlineEditorDisplayValue({ emptyText: 'None', options, type: 'checklist' }, ['1', '2']),
        ).toBe('Admin, Editor')
    })

    it('updates submitted state and renders developer-owned checkbox markup', () => {
        const element = { dataset: {}, innerHTML: '', textContent: '' }
        const config = { displayHtml: true, emptyText: '<i>None</i>', options, type: 'checkbox' }

        applyInlineEditorValue(element, config, [])
        expect(element.dataset.value).toBe('')
        expect(element.innerHTML).toBe('<i>None</i>')
    })
})
