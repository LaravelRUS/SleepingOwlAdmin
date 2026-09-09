import { describe, expect, it, vi } from 'vitest'

import {
    createImagesUpload,
    imagesUploadOptions,
} from '../../../../resources/js/shared/legacy/admin/form/images-upload'

function uploadConfig(overrides = {}) {
    return {
        clickable: { id: 'browse' },
        csrfToken: 'csrf-token',
        fileTooBigText: 'Too large',
        invalidFileTypeText: 'Wrong type',
        maxFileSize: 8,
        onComplete: vi.fn(),
        onError: vi.fn(),
        onSending: vi.fn(),
        onSuccess: vi.fn(),
        responseErrorText: 'Upload failed',
        url: '/upload',
        ...overrides,
    }
}

describe('images upload driver', () => {
    it('uses the gallery as drop target and the explicit browse control', () => {
        const gallery = { id: 'gallery' }
        const Upload = vi.fn(function (target, options) {
            Object.assign(this, { options, target })
        })
        const config = uploadConfig()

        const uploader = createImagesUpload(Upload, gallery, config)

        expect(uploader.target).toBe(gallery)
        expect(uploader.options).toMatchObject({
            acceptedFiles: 'image/*',
            clickable: config.clickable,
            uploadMultiple: false,
        })
    })

    it('keeps each uploaded image response independent', () => {
        const config = uploadConfig()
        const options = imagesUploadOptions(config)
        const response = { value: 'images/new.jpg' }

        options.success({}, response)

        expect(config.onSuccess).toHaveBeenCalledWith(response)
    })
})
