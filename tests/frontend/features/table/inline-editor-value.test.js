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
        expect(
            inlineEditorDisplayValue(
                {
                    displayHtml: true,
                    emptyText: 'None',
                    listLimit: 1,
                    listMore: 'and __count__ more',
                    options,
                    type: 'checklist',
                },
                ['1', '2'],
            ),
        ).toBe(
            '<span class="badge table-badge">Admin</span>\n' +
                '<span class="badge bg-white text-secondary">and 1 more</span>',
        )
    })

    it('updates submitted state and renders developer-owned checkbox markup', () => {
        const element = { dataset: {}, innerHTML: '', textContent: '' }
        const config = { displayHtml: true, emptyText: '<i>None</i>', options, type: 'checkbox' }

        applyInlineEditorValue(element, config, [])
        expect(element.dataset.value).toBe('')
        expect(element.innerHTML).toBe('<i>None</i>')
    })
})
