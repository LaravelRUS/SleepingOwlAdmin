import { expect, it, vi } from 'vitest'

import { createNamedActionCallbacks } from '../../../../resources/js/shared/features/table/actions/named-action-callbacks.js'

it('keeps the bulk callback name, argument order and message', () => {
    const callback = vi.fn()
    const root = { afterArchive: callback }
    const callbacks = createNamedActionCallbacks(root)
    const message = { __callback: 'afterArchive', status: 'ok' }
    const context = actionContext()

    callbacks.bulk(message, context)

    expect(callback).toHaveBeenCalledWith(
        context.wrapper,
        context.checkboxes,
        context.select,
        message,
    )
})

it('keeps the form callback name and two positional arguments', () => {
    const callback = vi.fn()
    const root = { afterUpdate: callback }
    const callbacks = createNamedActionCallbacks(root)
    const context = actionContext()

    callbacks.form({ __callback: 'afterUpdate' }, context)

    expect(callback).toHaveBeenCalledWith(context.wrapper, context.checkboxes)
})

it('ignores absent and unknown callback names without requiring jQuery', () => {
    const callbacks = createNamedActionCallbacks({})
    const context = actionContext()

    expect(() => callbacks.bulk({}, context)).not.toThrow()
    expect(() => callbacks.form({ __callback: 'missing' }, context)).not.toThrow()
})

function actionContext() {
    return {
        checkboxes: [{ checked: true }],
        select: { value: 'archive' },
        wrapper: { className: 'dataTables_wrapper' },
    }
}
