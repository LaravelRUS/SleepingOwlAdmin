import { delegate } from '../../../core/dom/listeners.js'
import { submitPostForm } from '../../../core/dom/forms.js'

const BUTTON_SELECTOR = [
    '.form-buttons button.btn-delete',
    '.form-buttons button.btn-destroy',
    '.form-buttons button.btn-restore',
].join(', ')

export function bindFormButtons({ document, events, messages, questions, root, token }) {
    assertDependencies({ document, events, messages, questions, token })

    return delegate(root, 'click', BUTTON_SELECTOR, (event, button) => {
        void handleFormButton(event, button, { document, events, messages, questions, token })
    })
}

async function handleFormButton(event, button, dependencies) {
    event.preventDefault()

    const action = buttonAction(button, dependencies.questions)
    if (!action.question) {
        submitButtonAction(button, action, dependencies)
        return
    }

    const result = await dependencies.messages.confirm(action.question, null, button)
    if (!result?.value) {
        dependencies.events.fire('datatables::confirm::cancel', button)
        return
    }

    dependencies.events.fire('datatables::confirm::submitting', button)
    submitButtonAction(button, action, dependencies)
    dependencies.events.fire('datatables::confirm::submitted', button)
}

function submitButtonAction(button, action, { document, events, token }) {
    const parameters = { _token: token }

    if (action.method) {
        parameters._method = action.method
    }
    if (button.dataset.redirect !== undefined) {
        parameters._redirectBack = button.dataset.redirect
    }

    events.fire('datatables::confirm::submitting::data', parameters)
    const form = submitPostForm(document, button.dataset.url, parameters)
    events.fire('datatables::confirm::submitted::data', parameters)

    return form
}

function buttonAction(button, questions) {
    if (button.classList.contains('btn-delete')) {
        return { method: 'DELETE', question: questions.delete }
    }
    if (button.classList.contains('btn-destroy')) {
        return { method: 'DELETE', question: questions.destroy }
    }

    return { method: null, question: null }
}

function assertDependencies({ document, events, messages, questions, token }) {
    if (!document || typeof events?.fire !== 'function') {
        throw new TypeError('Form buttons require document and event bus dependencies.')
    }
    if (typeof messages?.confirm !== 'function') {
        throw new TypeError('Form buttons require a confirmation service.')
    }
    if (!questions || typeof token !== 'string') {
        throw new TypeError('Form buttons require questions and a CSRF token.')
    }
}
