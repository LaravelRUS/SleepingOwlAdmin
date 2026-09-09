import { describe, expect, it, vi } from 'vitest'

import {
    createImageUpload,
    imageUploadError,
    imageUploadOptions,
    postPastedImage,
} from '../../../../resources/js/shared/legacy/admin/form/image-upload'

function uploadConfig(overrides = {}) {
    return {
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

describe('image upload driver', () => {
    it('creates one image-only upload instance', () => {
        const element = { id: 'upload' }
        const Upload = vi.fn(function (target, options) {
            this.element = target
            this.options = options
        })

        const uploader = createImageUpload(Upload, element, uploadConfig())

        expect(Upload).toHaveBeenCalledOnce()
        expect(uploader.element).toBe(element)
        expect(uploader.options).toMatchObject({
            acceptedFiles: 'image/*',
            headers: { 'X-CSRF-TOKEN': 'csrf-token' },
            maxFilesize: 8,
            method: 'POST',
            uploadMultiple: false,
            url: '/upload',
        })
    })

    it('maps upload lifecycle callbacks without vendor arguments', () => {
        const config = uploadConfig()
        const options = imageUploadOptions(config)
        const response = { value: 'images/avatar.png' }

        options.sending()
        options.success({}, response)
        options.error({}, response)
        options.complete()

        expect(config.onSending).toHaveBeenCalledOnce()
        expect(config.onSuccess).toHaveBeenCalledWith(response)
        expect(config.onError).toHaveBeenCalledWith(response)
        expect(config.onComplete).toHaveBeenCalledOnce()
    })
})

describe('pasted image transport', () => {
    it('posts through the provided HTTP client and parses JSON', async () => {
        const body = { multipart: true }
        const data = { path: '/images/pasted.png' }
        const response = { json: vi.fn(async () => data) }
        const http = { post: vi.fn(async () => response) }

        await expect(postPastedImage(http, '/upload', body)).resolves.toEqual(data)
        expect(http.post).toHaveBeenCalledWith('/upload', body)
    })
})

describe('pasted image errors', () => {
    it('extracts the first server validation error', async () => {
        const validation = await imageUploadError(
            {
                response: {
                    json: async () => ({ errors: ['Invalid image'], message: 'Validation' }),
                    status: 422,
                    statusText: 'Unprocessable Content',
                },
            },
            'Upload failed',
        )

        expect(validation).toEqual({ title: 'Validation', message: 'Invalid image' })
    })

    it('describes generic HTTP and network failures', async () => {
        const generic = await imageUploadError(
            {
                response: {
                    json: async () => ({ message: 'Server rejected upload' }),
                    status: 500,
                    statusText: 'Server Error',
                },
            },
            'Upload failed',
        )

        expect(generic).toEqual({
            title: 'Server Error (500)',
            message: 'Server rejected upload',
        })
        await expect(imageUploadError(new Error('Offline'), 'Upload failed')).resolves.toEqual({
            title: 'Upload failed',
            message: '',
        })
    })
})
