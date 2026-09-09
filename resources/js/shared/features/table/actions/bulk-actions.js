import { delegate } from '../../../../core/dom/listeners.js'
import {
    actionCallbackContext,
    findActionTable,
    selectedRowParameters,
    selectedRows,
} from './action-context.js'
import { actionRequestSettings, executeTableAction } from './action-request.js'

export function bindBulkActions(dependencies) {
    assertDependencies(dependencies)

    return delegate(
        dependencies.root,
        'submit',
        'form[data-type="display-actions"]',
        (event, form) => {
            event.preventDefault()
            void submitBulkAction(form, dependencies).catch((error) =>
                reportActionError(error, dependencies),
            )
        },
    )
}

async function submitBulkAction(form, dependencies) {
    const table = findActionTable(form, dependencies.tables)
    const select = form.querySelector('.sleepingOwlActionsStore')
    const option = select?.selectedOptions[0]

    if (!option || option.value === '0') {
        showSelectionError(dependencies, 'lang.table.no-action', 'lang.select.nothing')
        return
    }

    if (selectedRows(dependencies.tables, table).length === 0) {
        showSelectionError(dependencies, 'lang.select.nothing', 'lang.select.no_items')
        return
    }

    const confirmation = await dependencies.messages.confirm(
        dependencies.translate('lang.table.action-confirm'),
        null,
        form,
    )
    if (!confirmation?.value) {
        dependencies.events.fire('datatables::actions::cancel', form)
        return
    }

    await runBulkAction(form, table, select, option, dependencies)
}

function runBulkAction(form, table, select, option, dependencies) {
    const settings = actionRequestSettings(
        option.value,
        option.dataset.method,
        selectedRowParameters(dependencies.tables, table),
    )
    const context = actionCallbackContext(form, table, select)

    return executeTableAction({
        callbacks: (message) => dependencies.callbacks.bulk(message, context),
        events: dependencies.events,
        form,
        http: dependencies.http,
        notify: dependencies.notify,
        reload: () => dependencies.tables.reload(table),
        settings,
    }).then((message) => redirect(message, dependencies.location))
}

function showSelectionError(dependencies, title, text) {
    dependencies.notify({
        icon: 'error',
        text: dependencies.translate(text),
        timer: 5000,
        title: dependencies.translate(title),
    })
}

function redirect(message, location) {
    if (message.__redirect) {
        location.href = message.__redirect
    }
}

function reportActionError(error, dependencies) {
    dependencies.messages.error(dependencies.translate('lang.table.error'), error.message)
}

function assertDependencies(dependencies) {
    const required = [
        'callbacks',
        'events',
        'http',
        'location',
        'messages',
        'notify',
        'root',
        'tables',
    ]

    if (required.some((name) => !dependencies[name])) {
        throw new TypeError('Bulk actions require table, HTTP, event and UI dependencies.')
    }
    if (typeof dependencies.translate !== 'function') {
        throw new TypeError('Bulk actions require a translator.')
    }
}
