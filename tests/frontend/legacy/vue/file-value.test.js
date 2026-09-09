import { describe, expect, it, vi } from 'vitest'

import {
    fileDownloadUrl,
    normalizeFileValue,
} from '../../../../resources/js/shared/legacy/admin/form/file-value'

describe('file value', () => {
    it('normalizes empty and scalar values for the hidden form field', () => {
        expect(normalizeFileValue(null)).toBe('')
        expect(normalizeFileValue(undefined)).toBe('')
        expect(normalizeFileValue(42)).toBe('42')
    })

    it('keeps absolute URLs and resolves stored upload paths', () => {
        const createUploadUrl = vi.fn((path) => `/uploads/${path}`)

        expect(fileDownloadUrl('https://cdn.example/file.pdf', createUploadUrl)).toBe(
            'https://cdn.example/file.pdf',
        )
        expect(fileDownloadUrl('documents/file.pdf', createUploadUrl)).toBe(
            '/uploads/documents/file.pdf',
        )
        expect(createUploadUrl).toHaveBeenCalledOnce()
    })
})
