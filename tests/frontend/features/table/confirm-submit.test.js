import { expect, it, vi } from 'vitest'

import { bindConfirmedControls } from '../../../../resources/js/shared/features/table/controls/confirm-submit.js'

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

function createButton(kind, form) {
    const button = {
        classList: { contains: (name) => name === `btn-${kind}` },
        closest: (selector) => (selector === 'form' ? form : button),
    }

    return button
}

function bindFixture(confirmResult = true) {
    const root = createRoot()
    const events = { fire: vi.fn() }
    const messages = { confirm: vi.fn(() => Promise.resolve({ value: confirmResult })) }
    bindConfirmedControls({
        containerSelector: 'table',
        events,
        messages,
        questions: { delete: 'Delete?', destroy: 'Destroy?' },
        root,
    })

    return { events, messages, root }
}

it('submits the closest form and emits native form arguments', async () => {
    const fixture = bindFixture()
    const form = { requestSubmit: vi.fn() }
    const button = createButton('destroy', form)
    const event = { preventDefault: vi.fn(), target: button }

    fixture.root.emit(event)
    await vi.waitFor(() => expect(form.requestSubmit).toHaveBeenCalledOnce())

    expect(fixture.messages.confirm).toHaveBeenCalledWith('Destroy?', null, button)
    expect(fixture.events.fire).toHaveBeenCalledWith(
        'datatables::confirm::submitting',
        form,
        'button.btn-destroy',
    )
    expect(fixture.events.fire).toHaveBeenCalledWith(
        'datatables::confirm::submitted',
        form,
        'button.btn-destroy',
    )
})

it('emits cancel without submitting the form', async () => {
    const fixture = bindFixture(false)
    const form = { requestSubmit: vi.fn() }
    const button = createButton('delete', form)

    fixture.root.emit({ preventDefault: vi.fn(), target: button })
    await vi.waitFor(() => expect(fixture.messages.confirm).toHaveBeenCalledOnce())

    expect(form.requestSubmit).not.toHaveBeenCalled()
    expect(fixture.events.fire).toHaveBeenCalledWith(
        'datatables::confirm::cancel',
        form,
        'button.btn-delete',
    )
})
