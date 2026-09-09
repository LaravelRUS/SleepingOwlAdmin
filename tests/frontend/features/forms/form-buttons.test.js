import { expect, it, vi } from 'vitest'

import { bindFormButtons } from '../../../../resources/js/shared/features/forms/actions/form-buttons.js'

function createRoot() {
    let listener

    return {
        addEventListener: vi.fn((_type, callback) => {
            listener = callback
        }),
        contains: () => true,
        emit: (event) => listener(event),
        removeEventListener: vi.fn(),
    }
}

function createDocument() {
    const body = { appendChild: vi.fn() }

    return {
        body,
        createElement: vi.fn((tagName) => ({
            appendChild: vi.fn(),
            children: [],
            requestSubmit: tagName === 'form' ? vi.fn() : undefined,
            setAttribute: vi.fn(),
        })),
    }
}

function createButton(kind, dataset = {}) {
    const button = {
        classList: { contains: (name) => name === `btn-${kind}` },
        closest: () => button,
        dataset,
    }

    return button
}

function bindFixture(overrides = {}) {
    const root = createRoot()
    const dependencies = {
        document: createDocument(),
        events: { fire: vi.fn() },
        messages: { confirm: vi.fn(() => Promise.resolve({ value: true })) },
        questions: { delete: 'Delete?', destroy: 'Destroy?' },
        root,
        token: 'csrf-token',
        ...overrides,
    }
    bindFormButtons(dependencies)

    return { ...dependencies, root }
}

it('confirms and submits delete form button data through native DOM', async () => {
    const fixture = bindFixture()
    const button = createButton('delete', { redirect: '/users', url: '/users/10' })
    const event = { preventDefault: vi.fn(), target: button }

    fixture.root.emit(event)
    await vi.waitFor(() => expect(fixture.document.body.appendChild).toHaveBeenCalledOnce())

    expect(event.preventDefault).toHaveBeenCalledOnce()
    expect(fixture.messages.confirm).toHaveBeenCalledWith('Delete?', null, button)
    expect(fixture.events.fire).toHaveBeenCalledWith('datatables::confirm::submitting', button)
    expect(fixture.events.fire).toHaveBeenCalledWith('datatables::confirm::submitting::data', {
        _method: 'DELETE',
        _redirectBack: '/users',
        _token: 'csrf-token',
    })
})

it('submits restore without confirmation and reports a cancelled destroy', async () => {
    const messages = { confirm: vi.fn(() => Promise.resolve({ value: false })) }
    const fixture = bindFixture({ messages })
    const restore = createButton('restore', { url: '/users/10/restore' })
    const destroy = createButton('destroy', { url: '/users/10' })

    fixture.root.emit({ preventDefault: vi.fn(), target: restore })
    fixture.root.emit({ preventDefault: vi.fn(), target: destroy })
    await vi.waitFor(() => expect(messages.confirm).toHaveBeenCalledOnce())

    expect(fixture.document.body.appendChild).toHaveBeenCalledOnce()
    expect(fixture.events.fire).toHaveBeenCalledWith('datatables::confirm::cancel', destroy)
})
