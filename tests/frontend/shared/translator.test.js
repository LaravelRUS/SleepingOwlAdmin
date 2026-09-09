import { describe, expect, it } from 'vitest'

import { createTranslator } from '../../../resources/js/shared/compatibility/translator'

describe('compatibility translator', () => {
    const trans = createTranslator({
        lang: {
            greeting: 'Hello :name',
            saved: ':entity :identifier saved',
        },
    })

    it('resolves Laravel translations by dot notation', () => {
        expect(trans('lang.greeting', { name: 'Ada' })).toBe('Hello Ada')
    })

    it('keeps the public key fallback for missing translations', () => {
        expect(trans('lang.missing')).toBe('lang.missing')
    })

    it('preserves legacy colon parameter replacement', () => {
        expect(trans('lang.saved', { entity: 'User', identifier: 42 })).toBe('User 42 saved')
    })

    it('does not traverse inherited properties', () => {
        expect(trans('lang.toString')).toBe('lang.toString')
    })
})
