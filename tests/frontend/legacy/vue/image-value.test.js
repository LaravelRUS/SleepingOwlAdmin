import { describe, expect, it, vi } from 'vitest'

import {
    imagePreviewUrl,
    isBlobImageValue,
    normalizeImageValue,
} from '../../../../resources/js/shared/legacy/admin/form/image-value'

function preview(value, overrides = {}) {
    return imagePreviewUrl(value, {
        assetPrefix: 'https://cdn.example/',
        createUploadUrl: (path) => `/uploads/${path}`,
        useAssetPrefix: true,
        ...overrides,
    })
}

describe('image value', () => {
    it('normalizes empty and scalar form values', () => {
        expect(normalizeImageValue(null)).toBe('')
        expect(normalizeImageValue(undefined)).toBe('')
        expect(normalizeImageValue(42)).toBe('42')
    })

    it('keeps external and blob preview URLs unchanged', () => {
        expect(preview('https://images.example/avatar.png')).toBe(
            'https://images.example/avatar.png',
        )
        expect(preview('blob:preview')).toBe('blob:preview')
        expect(isBlobImageValue('blob:preview')).toBe(true)
        expect(isBlobImageValue('images/avatar.png')).toBe(false)
    })

    it('uses the configured asset prefix only for stored relative values', () => {
        const createUploadUrl = vi.fn((path) => `/uploads/${path}`)

        expect(preview('images/avatar.png', { createUploadUrl })).toBe(
            'https://cdn.example/images/avatar.png',
        )
        expect(preview('images/uploaded.png', { createUploadUrl, useAssetPrefix: false })).toBe(
            '/uploads/images/uploaded.png',
        )
        expect(createUploadUrl).toHaveBeenCalledOnce()
    })
})
