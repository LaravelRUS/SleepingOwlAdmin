import { describe, expect, it } from 'vitest'

import {
    addImageValue,
    normalizeImagesValues,
    removeImageValue,
    reorderImageValues,
    replaceImageValue,
    serializeImagesValues,
} from '../../../../resources/assets/js_owl/admin/form/images-values'

describe('images values', () => {
    it('normalizes submitted scalar values and drops empty entries', () => {
        expect(normalizeImagesValues(null)).toEqual([])
        expect(normalizeImagesValues(['first.jpg', 42, null, ''])).toEqual(['first.jpg', '42'])
    })

    it('adds and replaces non-empty values without mutating the source', () => {
        const source = ['first.jpg', 'second.jpg']

        expect(addImageValue(source, 'third.jpg')).toEqual(['first.jpg', 'second.jpg', 'third.jpg'])
        expect(replaceImageValue(source, 0, 'updated.jpg')).toEqual(['updated.jpg', 'second.jpg'])
        expect(source).toEqual(['first.jpg', 'second.jpg'])
    })

    it('removes and reorders by index while ignoring invalid positions', () => {
        const source = ['first.jpg', 'second.jpg', 'third.jpg']

        expect(removeImageValue(source, 1)).toEqual(['first.jpg', 'third.jpg'])
        expect(reorderImageValues(source, 0, 2)).toEqual(['second.jpg', 'third.jpg', 'first.jpg'])
        expect(removeImageValue(source, 9)).toBe(source)
        expect(reorderImageValues(source, 0, 9)).toBe(source)
    })

    it('keeps the legacy comma-separated form contract', () => {
        expect(serializeImagesValues(['first.jpg', 'second.jpg'])).toBe('first.jpg,second.jpg')
    })
})
