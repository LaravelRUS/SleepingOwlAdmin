import { submitForm } from '../../../core/dom/forms.js'
import { delegate } from '../../../core/dom/listeners.js'

export function bindConfirmedControls({ containerSelector, events, messages, questions, root }) {
    assertDependencies({ events, messages, questions })

    return delegate(root, 'click', controlSelector(containerSelector), (event, button) => {
        void confirmControlSubmission(event, button, { events, messages, questions })
    })
}

async function confirmControlSubmission(event, button, dependencies) {
    event.preventDefault()

    const control = controlAction(button, dependencies.questions)
    const form = button.closest('form')
    if (!form) {
        throw new Error('Confirmed control button must belong to a form.')
    }

    const result = await dependencies.messages.confirm(control.question, null, button)
    if (!result?.value) {
        dependencies.events.fire('datatables::confirm::cancel', form, control.selector)
        return
    }

    dependencies.events.fire('datatables::confirm::submitting', form, control.selector)
    submitForm(form)
    dependencies.events.fire('datatables::confirm::submitted', form, control.selector)
}

function controlAction(button, questions) {
    if (button.classList.contains('btn-destroy')) {
        return { question: questions.destroy, selector: 'button.btn-destroy' }
    }

    return { question: questions.delete, selector: 'button.btn-delete' }
}

function controlSelector(containerSelector) {
    if (typeof containerSelector !== 'string' || containerSelector.length === 0) {
        throw new TypeError('Confirmed controls require a container selector.')
    }

    return [
        `${containerSelector} button.btn-delete`,
        `${containerSelector} button.btn-destroy`,
    ].join(', ')
}

function assertDependencies({ events, messages, questions }) {
    assertFunction(events?.fire, 'Confirmed controls require an event bus.')
    assertFunction(messages?.confirm, 'Confirmed controls require a confirmation service.')
    assertQuestion(questions?.delete, 'delete')
    assertQuestion(questions?.destroy, 'destroy')
}

function assertFunction(value, message) {
    if (typeof value !== 'function') {
        throw new TypeError(message)
    }
}

function assertQuestion(value, action) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new TypeError(`Confirmed controls require a ${action} question.`)
    }
}
