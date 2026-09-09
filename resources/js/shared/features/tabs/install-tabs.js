import { mountTabs } from './tabs.js'

export const TABS_COMPONENT = 'tabs'
export const TABS_ROOT_SELECTOR = 'body'

export function installTabs(admin, options = {}) {
    assertAdmin(admin)
    const definition = createTabsDefinition(admin, options)
    admin.Components.register(definition)
    const scan = (root = options.root ?? globalThis.document) => {
        return admin.Components.scan(root, TABS_COMPONENT)
    }

    admin.Modules?.register?.('storage.tabbed', () => scan())

    return { definition, scan }
}

export function createTabsDefinition(admin, options = {}) {
    return {
        mount: (body) => mountConfiguredTabs(admin, body, options),
        name: TABS_COMPONENT,
        selector: TABS_ROOT_SELECTOR,
    }
}

function mountConfiguredTabs(admin, body, options) {
    const view = body.ownerDocument.defaultView

    return mountTabs(body, {
        events: admin.Events,
        path: preferred(options.path, view?.location?.pathname),
        stateEnabled: preferred(options.stateEnabled, configuredTabState(admin)),
        storage: preferred(options.storage, view?.localStorage),
    })
}

function configuredTabState(admin) {
    return typeof admin.Config?.get === 'function'
        ? admin.Config.get('datatables_settings.state_tabs', false)
        : false
}

function preferred(value, fallback) {
    return value === undefined ? fallback : value
}

function assertAdmin(admin) {
    assertFunction(admin?.Components, 'register', 'Tabs require Admin.Components.')
    assertFunction(admin?.Components, 'scan', 'Tabs require Admin.Components.')
}

function assertFunction(object, method, message) {
    if (typeof object?.[method] !== 'function') throw new TypeError(message)
}
