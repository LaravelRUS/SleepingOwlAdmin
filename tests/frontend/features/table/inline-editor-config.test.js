import { describe, expect, it } from 'vitest'

import { readInlineEditorConfig } from '../../../../resources/frontend/features/table/editing/inline-editor-config.js'

function element(dataset) {
    return { dataset }
}

describe('inline editor configuration', () => {
    it('reads typed options, values and bounded modes', () => {
        const config = readInlineEditorConfig(
            element({
                mode: 'inline',
                name: 'roles',
                options: '[{"value":1,"text":"Admin"}]',
                pk: '5',
                inlineEditor: 'checklist',
                listLimit: '1',
                listMore: 'and __count__ more',
                url: '/admin/users',
                value: '1, 2',
            }),
        )

        expect(config.mode).toBe('inline')
        expect(config.value).toEqual(['1', '2'])
        expect(config.options).toEqual([{ value: '1', text: 'Admin' }])
        expect(config.listLimit).toBe(1)
        expect(config.listMore).toBe('and __count__ more')
        expect(Object.isFrozen(config)).toBe(true)
    })
})

describe('inline editor referenced configuration', () => {
    it('reads options from an inert JSON script referenced by the host', () => {
        const script = {
            tagName: 'SCRIPT',
            textContent: '[{"value":"published","text":"Published"}]',
            type: 'application/json',
        }
        const host = element({
            name: 'status',
            pk: '5',
            inlineEditor: 'select',
            inlineEditorOptionsId: 'editor-options-5',
            url: '/admin/users',
            value: 'published',
        })
        host.ownerDocument = { getElementById: () => script }

        expect(readInlineEditorConfig(host).options).toEqual([
            { value: 'published', text: 'Published' },
        ])
    })

    it('defaults unknown modes to popup and rejects unknown types', () => {
        const base = { name: 'status', pk: '1', url: '/admin/users', value: 'draft' }
        expect(
            readInlineEditorConfig(element({ ...base, mode: 'drawer', inlineEditor: 'text' })).mode,
        ).toBe('popup')
        expect(() => readInlineEditorConfig(element({ ...base, inlineEditor: 'wysiwyg' }))).toThrow(
            'Unsupported inline editor type',
        )
    })
})
