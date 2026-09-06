import { describe, expect, it } from 'vitest'

import {
    baseName,
    fileExtension,
    filePresentation,
    isImageExtension,
} from '../../../../resources/frontend/features/forms/files/files-values.js'

describe('files value parsing', () => {
    it('normalizes file names and extensions without changing public values', () => {
        expect(baseName('documents/archive.tar.gz')).toBe('archive.tar')
        expect(baseName('documents/readme')).toBe('readme')
        expect(fileExtension('images/PHOTO.JPEG?version=1')).toBe('jpeg')
        expect(fileExtension('documents/readme')).toBe('')
    })

    it('recognizes only the image formats supported by the legacy element', () => {
        expect(isImageExtension('svg')).toBe(true)
        expect(isImageExtension('webp')).toBe(true)
        expect(isImageExtension('pdf')).toBe(false)
    })
})

describe('files upload presentation', () => {
    it('builds an image presentation from the existing upload response', () => {
        expect(
            filePresentation({
                desc: 'Preview',
                original_name: 'Photo.JPG',
                path: '/uploads/photo.JPG',
                title: 'Photo',
                value: 'images/photo.JPG',
            }),
        ).toEqual({
            basename: 'photo',
            description: 'Preview',
            extension: '',
            image: true,
            originalName: 'Photo.JPG',
            src: 'images/photo.JPG',
            title: 'Photo',
            url: '/uploads/photo.JPG',
        })
    })

    it('keeps a non-image extension and validates the response value', () => {
        expect(filePresentation({ value: 'documents/manual.pdf' })).toMatchObject({
            extension: 'pdf',
            image: false,
            url: '/documents/manual.pdf',
        })
        expect(() => filePresentation({ path: '/missing-value' })).toThrow(
            'Uploaded file response value must be a non-empty string.',
        )
    })
})
