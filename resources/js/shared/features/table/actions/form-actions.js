import { delegate } from '../../../../core/dom/listeners.js'
import {
    actionCallbackContext,
    appendSelectedRows,
    findActionTable,
    formParameters,
} from './action-context.js'
import { actionRequestSettings, executeTableAction } from './action-request.js'

export function bindFormActions(dependencies) {
    assertDependencies(dependencies)

    return delegate(
        dependencies.root,
        'submit',
        '.display-actions-form-wrapper form',
        (event, form) => {
            event.preventDefault()
            void submitFormAction(form, dependencies).catch((error) =>
                reportActionError(error, dependencies),
            )
        },
    )
}

async function submitFormAction(form, dependencies) {
    if (readFlag(form, 'confirm', true)) {
        const confirmation = await dependencies.messages.confirm(
            dependencies.translate('lang.table.action-confirm'),
            null,
            form,
        )
        if (!confirmation?.value) {
            dependencies.events.fire('datatables::actions::cancel', form)
            return
        }
    }

    await runFormAction(form, dependencies)
}

function runFormAction(form, dependencies) {
    const table = findActionTable(form, dependencies.tables)
    const parameters = appendSelectedRows(
        formParameters(form, dependencies.FormData),
        dependencies.tables,
        table,
    )
    const settings = actionRequestSettings(
        form.getAttribute('action'),
        form.getAttribute('method'),
        parameters,
    )
    const context = actionCallbackContext(form, table)

    return executeTableAction({
        callbacks: (message) => dependencies.callbacks.form(message, context),
        events: dependencies.events,
        form,
        http: dependencies.http,
        notify: dependencies.notify,
        reload: () => dependencies.tables.reload(table),
        settings,
        showResult: readFlag(form, 'result', true),
        timeout: readTimeout(form),
    })
}

function readFlag(form, name, fallback) {
    const value = form.dataset[name]

    return value === undefined ? fallback : !['0', 'false'].includes(value.toLowerCase())
}

function readTimeout(form) {
    const timeout = Number(form.dataset.resultTimeout)

    return Number.isFinite(timeout) && timeout >= 0 ? timeout : 5000
}

function reportActionError(error, dependencies) {
    dependencies.messages.error(dependencies.translate('lang.table.error'), error.message)
}

function assertDependencies(dependencies) {
    const required = [
        'callbacks',
        'events',
        'FormData',
        'http',
        'messages',
        'notify',
        'root',
        'tables',
    ]

    if (required.some((name) => !dependencies[name])) {
        throw new TypeError('Form actions require table, HTTP, event and UI dependencies.')
    }
    if (typeof dependencies.translate !== 'function') {
        throw new TypeError('Form actions require a translator.')
    }
}
