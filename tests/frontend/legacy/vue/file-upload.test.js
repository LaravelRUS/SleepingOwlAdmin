import { describe, expect, it, vi } from 'vitest'

import {
    createFileUpload,
    fileUploadOptions,
    responseErrors,
} from '../../../../resources/assets/js_owl/admin/form/file-upload'

function uploadConfig(overrides = {}) {
    return {
        csrfToken: 'csrf-token',
        fileTooBigText: 'Too large',
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

describe('file upload driver', () => {
    it('creates one upload instance with the bounded file options', () => {
        const element = { id: 'upload' }
        const Upload = vi.fn(function (target, options) {
            this.element = target
            this.options = options
        })

        const uploader = createFileUpload(Upload, element, uploadConfig())

        expect(Upload).toHaveBeenCalledOnce()
        expect(uploader.element).toBe(element)
        expect(uploader.options).toMatchObject({
            url: '/upload',
            method: 'POST',
            uploadMultiple: false,
            maxFilesize: 8,
            headers: { 'X-CSRF-TOKEN': 'csrf-token' },
        })
    })

    it('maps upload lifecycle callbacks without exposing vendor arguments', () => {
        const config = uploadConfig()
        const options = fileUploadOptions(config)
        const response = { value: 'documents/file.pdf' }

        options.sending()
        options.success({}, response)
        options.error({}, response)
        options.complete()

        expect(config.onSending).toHaveBeenCalledOnce()
        expect(config.onSuccess).toHaveBeenCalledWith(response)
        expect(config.onError).toHaveBeenCalledWith(response)
        expect(config.onComplete).toHaveBeenCalledOnce()
    })

    it('accepts only a server error array', () => {
        expect(responseErrors({ errors: ['Invalid file'] })).toEqual(['Invalid file'])
        expect(responseErrors({ errors: 'Invalid file' })).toEqual([])
        expect(responseErrors(null)).toEqual([])
    })
})
