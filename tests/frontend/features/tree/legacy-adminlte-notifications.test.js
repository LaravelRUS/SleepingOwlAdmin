import { afterEach, describe, expect, it, vi } from 'vitest'

import { installLegacyTreeNotifications } from '../../../../resources/frontend/features/tree/themes/legacy-adminlte/browser.js'

describe('legacy AdminLTE tree notifications', () => {
    afterEach(() => vi.restoreAllMocks())

    it('maps native tree events to localized AdminLTE notification policy', () => {
        const fixture = notificationFixture()
        const installation = installLegacyTreeNotifications(fixture.target)

        fixture.document.dispatchEvent(new globalThis.Event('tree:changed'))
        fixture.document.dispatchEvent(failureEvent(new Error('request failed')))

        expect(fixture.swal.mixin).toHaveBeenCalledWith(
            expect.objectContaining({
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                toast: true,
            }),
        )
        expect(fixture.toast.fire).toHaveBeenCalledWith({
            icon: 'success',
            title: 'Item moved',
        })
        expect(fixture.messages.error).toHaveBeenCalledWith('Unable to reorder')

        installation.destroy()
        fixture.document.dispatchEvent(new globalThis.Event('tree:changed'))
        expect(fixture.toast.fire).toHaveBeenCalledOnce()
    })

    it('uses safe labels when the translator is not available', () => {
        const fixture = notificationFixture({ translate: undefined })
        const installation = installLegacyTreeNotifications(fixture.target)

        fixture.document.dispatchEvent(new globalThis.Event('tree:changed'))
        fixture.document.dispatchEvent(failureEvent())

        expect(fixture.toast.fire).toHaveBeenCalledWith({
            icon: 'success',
            title: 'Tree order saved',
        })
        expect(fixture.messages.error).toHaveBeenCalledWith('Unable to save tree')
        installation.destroy()
    })
})

function notificationFixture(options = {}) {
    const document = new globalThis.EventTarget()
    const messages = { error: vi.fn() }
    const toast = { fire: vi.fn() }
    const swal = {
        mixin: vi.fn(() => toast),
        resumeTimer: vi.fn(),
        stopTimer: vi.fn(),
    }
    const translations = {
        'lang.table.error': 'Unable to reorder',
        'lang.tree.reorderCompleted': 'Item moved',
    }

    return {
        document,
        messages,
        swal,
        target: {
            Admin: { Messages: messages },
            Swal: swal,
            document,
            trans: Object.hasOwn(options, 'translate')
                ? options.translate
                : (key) => translations[key] ?? key,
        },
        toast,
    }
}

function failureEvent(error) {
    const event = new globalThis.Event('tree:failed')
    Object.defineProperty(event, 'detail', { value: { error } })

    return event
}
