import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..', '..', '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')

describe('files runtime boundary', () => {
    it('keeps the legacy HTML contract while replacing its runtime', () => {
        const view = read('resources/views/themes/legacy/default/form/element/files.blade.php')
        const wrapper = read('resources/assets/js_owl/admin/form/files.js')

        for (const marker of [
            'fileUploadMultiple',
            'files-group',
            'fileBrowse',
            'fileValue',
            'fileThumbnail',
            'data-id="file"',
        ]) {
            expect(view).toContain(marker)
        }
        expect(wrapper).toContain('installFiles')
        expect(wrapper).not.toMatch(/\$\(|jQuery|Flow/)
    })

    it('does not execute templates or depend on Flow.js', () => {
        const sources = [
            'resources/frontend/features/forms/files/files-controller.js',
            'resources/frontend/features/forms/files/files-template.js',
            'resources/frontend/features/forms/files/files-uploader.js',
            'resources/frontend/features/forms/files/files-values.js',
            'resources/frontend/features/forms/files/install-files.js',
        ].map(read)
        const packageJson = read('package.json')

        expect(sources.join('\n')).not.toMatch(/new Function|eval\(|\$\(|jQuery/)
        expect(packageJson).not.toContain('@flowjs/flow.js')
    })
})
