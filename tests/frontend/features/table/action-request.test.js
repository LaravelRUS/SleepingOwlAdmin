import { expect, it, vi } from 'vitest'

import {
    actionRequestSettings,
    executeTableAction,
} from '../../../../resources/frontend/features/table/actions/action-request.js'

function dependencies(overrides = {}) {
    const message = { message: 'Updated', text: 'Done', type: 'success' }

    return {
        callbacks: vi.fn(),
        events: { fire: vi.fn() },
        form: {},
        http: { request: vi.fn(async () => ({ json: async () => message })) },
        message,
        notify: vi.fn(),
        reload: vi.fn(),
        settings: actionRequestSettings(
            '/actions',
            'POST',
            new globalThis.URLSearchParams({ id: '1' }),
        ),
        ...overrides,
    }
}

it('posts an encoded action then notifies, emits success and reloads through the registry', async () => {
    const fixture = dependencies()

    await executeTableAction(fixture)

    expect(fixture.http.request).toHaveBeenCalledWith('/actions', {
        body: 'id=1',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        method: 'POST',
    })
    expect(fixture.notify).toHaveBeenCalledWith({
        icon: 'success',
        text: 'Updated',
        timer: 5000,
        title: 'Done',
    })
    expect(fixture.callbacks).toHaveBeenCalledWith(fixture.message)
    expect(fixture.events.fire).toHaveBeenLastCalledWith(
        'datatables::actions::submitted',
        fixture.form,
    )
    expect(fixture.reload).toHaveBeenCalledOnce()
})

it('places encoded action data in the URL for a GET request', async () => {
    const fixture = dependencies({
        settings: actionRequestSettings(
            '/actions?scope=all',
            'GET',
            new globalThis.URLSearchParams({ id: '1' }),
        ),
    })

    await executeTableAction(fixture)

    expect(fixture.http.request).toHaveBeenCalledWith('/actions?scope=all&id=1', {
        method: 'GET',
    })
})

it('emits failure and does not reload after an unsuccessful request', async () => {
    const error = new Error('Network unavailable')
    const fixture = dependencies({ http: { request: vi.fn(async () => Promise.reject(error)) } })

    await expect(executeTableAction(fixture)).rejects.toBe(error)

    expect(fixture.events.fire).toHaveBeenLastCalledWith(
        'datatables::actions::failed',
        error,
        fixture.form,
    )
    expect(fixture.reload).not.toHaveBeenCalled()
})
