import { describe, expect, it, vi } from 'vitest'

import { createCkeditor4Adapter } from '../../../../resources/js/shared/features/forms/wysiwyg/adapters/ckeditor4.js'
import { createCkeditor5Adapter } from '../../../../resources/js/shared/features/forms/wysiwyg/adapters/ckeditor5.js'
import { createSimpleMdeAdapter } from '../../../../resources/js/shared/features/forms/wysiwyg/adapters/simplemde.js'
import { createTinyMceAdapter } from '../../../../resources/js/shared/features/forms/wysiwyg/adapters/tinymce.js'

describe('synchronous WYSIWYG adapters', () => {
    it('binds CKEditor 4 and SimpleMDE to the existing textarea id', () => {
        const ckEditor = { destroy: vi.fn(), insertText: vi.fn(), resize: vi.fn() }
        const CKEDITOR = { replace: vi.fn(() => ckEditor) }
        const ck = createCkeditor4Adapter(CKEDITOR)
        const element = { id: 'markdown' }
        const document = { getElementById: vi.fn(() => element) }
        const simpleEditor = { codemirror: { replaceSelection: vi.fn() }, destroy: vi.fn() }
        const SimpleMDE = vi.fn(function () {
            return simpleEditor
        })
        const simple = createSimpleMdeAdapter(SimpleMDE, document)

        expect(ck.switchOn('content', { height: 200 })).toBe(ckEditor)
        expect(CKEDITOR.replace).toHaveBeenCalledWith('content', { height: 200 })
        ck.exec(ckEditor, 'changeHeight', 'content', 300)
        expect(ckEditor.resize).toHaveBeenCalledWith('100%', 300)
        expect(simple.switchOn('markdown', { spellChecker: false })).toBe(simpleEditor)
        simple.exec(simpleEditor, 'insert', 'markdown', 'hello')
        expect(simpleEditor.codemirror.replaceSelection).toHaveBeenCalledWith('hello')
    })
})

describe('asynchronous WYSIWYG adapters', () => {
    it('returns CKEditor 5 and TinyMCE promises for registry normalization', async () => {
        const ckEditor = { destroy: vi.fn() }
        const textarea = { id: 'body' }
        const document = { getElementById: vi.fn(() => textarea) }
        const ClassicEditor = { create: vi.fn(async () => ckEditor) }
        const ck = createCkeditor5Adapter(ClassicEditor, document)
        const tinyEditor = { insertContent: vi.fn(), remove: vi.fn() }
        const tinymce = { init: vi.fn(async () => [tinyEditor]) }
        const tiny = createTinyMceAdapter(tinymce)

        await expect(ck.switchOn('body', { language: 'en' })).resolves.toBe(ckEditor)
        expect(ClassicEditor.create).toHaveBeenCalledWith(textarea, { language: 'en' })
        await expect(tiny.switchOn('body', { menubar: false })).resolves.toEqual([tinyEditor])
        tiny.exec(tinyEditor, 'insert', 'body', '<p>Text</p>')
        expect(tinyEditor.insertContent).toHaveBeenCalledWith('<p>Text</p>')
        tiny.switchOff(tinyEditor)
        expect(tinyEditor.remove).toHaveBeenCalledOnce()
    })
})
