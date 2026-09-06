import { describe, expect, it, vi } from 'vitest'

import {
    createImagePasteBody,
    dataUrlToFile,
    readImagePasteBuffer,
    removeImagePasteBuffer,
} from '../../../../resources/assets/js_owl/admin/form/image-paste-buffer'

class FakeFile {
    constructor(parts, name, options) {
        Object.assign(this, { name, options, parts })
    }
}

class FakeFormData {
    constructor() {
        this.entries = []
    }

    append(...entry) {
        this.entries.push(entry)
    }
}

function pasteElement() {
    return {
        dataset: { ext: 'png' },
        name: 'blob:temporary',
        remove: vi.fn(),
        src: 'data:image/png;base64,QQ==',
    }
}

describe('image paste buffer', () => {
    it('reads extension and data URL from the shared paste element', () => {
        const element = pasteElement()
        const document = { getElementById: vi.fn(() => element) }

        expect(readImagePasteBuffer(document)).toEqual({
            dataUrl: element.src,
            extension: 'png',
        })
        expect(readImagePasteBuffer({ getElementById: () => null })).toBeNull()
    })

    it('creates a multipart body with a typed image file', () => {
        const body = createImagePasteBody(
            { dataUrl: 'data:image/png;base64,QQ==', extension: 'png' },
            {
                decode: () => 'A',
                FileType: FakeFile,
                FormDataType: FakeFormData,
                now: () => 123,
            },
        )

        const [field, file, filename] = body.entries[0]
        expect({ field, filename }).toEqual({ field: 'file', filename: '123.png' })
        expect(file).toMatchObject({ name: '123.png', options: { type: 'image/png' } })
        expect([...file.parts[0]]).toEqual([65])
    })

    it('rejects malformed data URLs', () => {
        expect(() =>
            dataUrlToFile('https://example.test/image.png', 'image.png', {
                FileType: FakeFile,
            }),
        ).toThrow('Invalid image data URL.')
    })

    it('revokes the object URL and removes the paste element', () => {
        const element = pasteElement()
        const revoke = vi.fn()

        expect(removeImagePasteBuffer({ getElementById: () => element }, revoke)).toBe(true)
        expect(revoke).toHaveBeenCalledWith('blob:temporary')
        expect(element.remove).toHaveBeenCalledOnce()
    })
})
