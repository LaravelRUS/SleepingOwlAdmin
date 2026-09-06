import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..', '..', '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')

describe('WYSIWYG runtime boundary', () => {
    it('keeps public markers and API while removing jQuery scans', () => {
        const php = read('src/Form/Element/Wysiwyg.php')
        const wrapper = read('resources/assets/js_owl/admin/form/wysiwyg.js')
        const registry = read('resources/frontend/features/forms/wysiwyg/wysiwyg-registry.js')
        const simpleMde = read('resources/assets/js_owl/wysiwyg/simplemde.js')

        expect(php).toContain("'data-wysiwyg-editor'")
        expect(php).toContain("'data-wysiwyg-parameters'")
        expect(wrapper).toContain('installWysiwyg')
        expect(registry).toContain('wysiwyg:switchOn')
        expect(registry).toContain('wysiwyg:switchOff')
        expect([wrapper, simpleMde].join('\n')).not.toMatch(/\$\(|jQuery/)
    })
})
