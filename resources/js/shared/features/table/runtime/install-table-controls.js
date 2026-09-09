import { bindBulkActions } from '../actions/bulk-actions.js'
import { bindFormActions } from '../actions/form-actions.js'
import { createNamedActionCallbacks } from '../actions/named-action-callbacks.js'
import { bindConfirmedControls } from '../controls/confirm-submit.js'
import { bindTableCheckboxes } from '../selection/checkbox-controls.js'

export const TABLE_CONTROLS_COMPONENT = 'table-controls'
export const TABLE_CONTROLS_SELECTOR = 'body'

const LEGACY_MODULES = [
    'display.actions',
    'display.actions_form',
    'display.columns.checkbox',
    'display.columns.control',
    'display.columns.tree_control',
]

export function installTableControls(admin, options) {
    const definition = createTableControlsDefinition(admin, options)
    const scan = (root = options.root) => admin.Components.scan(root, TABLE_CONTROLS_COMPONENT)

    admin.Components.register(definition)
    LEGACY_MODULES.forEach((name) => admin.Modules.register(name, () => scan()))

    return { definition, scan }
}

export function createTableControlsDefinition(admin, options) {
    assertOptions(admin, options)

    return {
        mount: (body) => mountTableControls(body, admin, options),
        name: TABLE_CONTROLS_COMPONENT,
        selector: TABLE_CONTROLS_SELECTOR,
    }
}

function mountTableControls(body, admin, options) {
    const callbacks = createNamedActionCallbacks(options.target)
    const actions = actionDependencies(body, admin, options, callbacks)
    const unbind = [
        bindBulkActions(actions),
        bindFormActions({ ...actions, FormData: options.FormData }),
        bindTableCheckboxes({ root: body, selectedRowClass: 'info' }),
        bindConfirmedControls(confirmedOptions(body, admin, options, 'table')),
        bindConfirmedControls(confirmedOptions(body, admin, options, '.dd3-content')),
    ]

    return () => unbind.reverse().forEach((remove) => remove())
}

function actionDependencies(root, admin, options, callbacks) {
    return {
        callbacks,
        events: admin.Events,
        http: admin.Http,
        location: options.location,
        messages: admin.Messages,
        notify: options.notify,
        root,
        tables: admin.Tables,
        translate: options.translate,
    }
}

function confirmedOptions(root, admin, options, containerSelector) {
    return {
        containerSelector,
        events: admin.Events,
        messages: admin.Messages,
        questions: options.questions,
        root,
    }
}

function assertOptions(admin, options) {
    if (!hasAdminServices(admin) || !hasBrowserDependencies(options)) {
        throw new TypeError('Table controls require lifecycle, UI and browser dependencies.')
    }
}

function hasAdminServices(admin) {
    const names = ['Components', 'Events', 'Http', 'Messages', 'Modules', 'Tables']

    return names.every((name) => Boolean(admin?.[name]))
}

function hasBrowserDependencies(options) {
    const names = ['FormData', 'location', 'questions', 'root', 'target']
    const callbacks = ['notify', 'translate']

    return (
        names.every((name) => Boolean(options?.[name])) &&
        callbacks.every((name) => typeof options?.[name] === 'function')
    )
}
