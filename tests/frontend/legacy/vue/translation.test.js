import { createApp } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import {
    createVueTranslation,
    installVueTranslation,
} from '../../../../resources/js/shared/vue/legacy/translation'
import { useTranslation } from '../../../../resources/js/shared/vue/legacy/use-translation'

describe('Vue translation injection', () => {
    it('provides a frozen app-local translator to the composable', () => {
        const translate = vi.fn((key, replacements) => `${key}:${replacements.name}`)
        const translation = createVueTranslation(translate)
        const app = installVueTranslation(createApp({}), translation)

        expect(app.runWithContext(useTranslation)).toBe(translation)
        expect(useInApp(app).trans('welcome', { name: 'Ada' })).toBe('welcome:Ada')
        expect(translate).toHaveBeenCalledWith('welcome', { name: 'Ada' })
        expect(Object.isFrozen(translation)).toBe(true)
    })

    it('does not leak translations between Vue apps', () => {
        const configured = createApp({})
        const unconfigured = createApp({})
        installVueTranslation(
            configured,
            createVueTranslation((key) => key),
        )

        expect(useInApp(configured).trans('ready')).toBe('ready')
        expect(() => useInApp(unconfigured)).toThrow('Injected Vue translation')
    })

    it('validates the translator and app provider boundaries', () => {
        expect(() => createVueTranslation(null)).toThrow('must be a function')
        expect(() => installVueTranslation({}, { trans: () => '' })).toThrow(
            'Vue app provide must be a function',
        )
        expect(() => installVueTranslation(createApp({}), {})).toThrow(
            'Injected Vue translation must be a function',
        )
    })
})

function useInApp(app) {
    return app.runWithContext(useTranslation)
}
