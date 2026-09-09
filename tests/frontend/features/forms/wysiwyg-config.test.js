import { describe, expect, it, vi } from 'vitest'

import { componentMountSkipped } from '../../../../resources/js/core/lifecycle/component-lifecycle.js'
import {
    parseParameters,
    readWysiwygConfig,
} from '../../../../resources/js/shared/features/forms/wysiwyg/wysiwyg-config.js'
import { mountWysiwyg } from '../../../../resources/js/shared/features/forms/wysiwyg/wysiwyg-component.js'

function textarea(attributes = []) {
    const values = new Set(attributes)

    return {
        dataset: { wysiwygEditor: 'ckeditor', wysiwygParameters: '{"height":240}' },
        hasAttribute: (name) => values.has(name),
        id: 'article-body',
        removeAttribute: (name) => values.delete(name),
        setAttribute: (name) => values.add(name),
    }
}

describe('WYSIWYG component config', () => {
    it('reads the existing textarea data contract', () => {
        expect(readWysiwygConfig(textarea())).toEqual({
            editor: 'ckeditor',
            id: 'article-body',
            parameters: { height: 240 },
        })
        expect(parseParameters('')).toEqual([])
        expect(() => parseParameters('{')).toThrow()
    })

    it('marks mount once and switches the editor off during teardown', () => {
        const element = textarea()
        const registry = { switchOff: vi.fn(), switchOn: vi.fn() }
        const instance = mountWysiwyg(element, registry)

        expect(registry.switchOn).toHaveBeenCalledWith('article-body', 'ckeditor', {
            height: 240,
        })
        expect(mountWysiwyg(element, registry)).toBe(componentMountSkipped)
        instance.destroy()
        expect(registry.switchOff).toHaveBeenCalledWith('article-body')
        expect(element.hasAttribute('data-wysiwyg-inited')).toBe(false)
    })
})
