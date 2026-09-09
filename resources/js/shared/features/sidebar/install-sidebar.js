import { mountSidebar } from './sidebars.js'

export const SIDEBAR_COMPONENT = 'sidebar-navigation'
export const SIDEBAR_ROOT_SELECTOR = 'body'

export function installSidebar(admin, options = {}) {
    assertAdmin(admin)
    let controller = null
    admin.Components.register({
        mount: (body) => {
            controller = mountSidebar(body, options)
            return { destroy: () => controller?.destroy() }
        },
        name: SIDEBAR_COMPONENT,
        selector: SIDEBAR_ROOT_SELECTOR,
    })

    return {
        collapse: (settings) => controller?.collapse(settings) ?? false,
        collapseItem: (context) => controller?.collapseItem(context) ?? false,
        expand: (settings) => controller?.expand(settings) ?? false,
        expandItem: (context) => controller?.expandItem(context) ?? false,
        scan: (root = options.root ?? globalThis.document) => scan(admin, controller, root),
        toggle: (settings) => controller?.toggle(settings) ?? false,
        toggleItem: (context) => controller?.toggleItem(context) ?? false,
    }
}

function scan(admin, controller, root) {
    admin.Components.scan(root, SIDEBAR_COMPONENT)

    return controller?.scan(root) ?? 0
}

function assertAdmin(admin) {
    if (typeof admin?.Components?.register !== 'function') {
        throw new TypeError('Sidebar requires Admin.Components.')
    }
    if (typeof admin.Components.scan !== 'function') {
        throw new TypeError('Sidebar requires Admin.Components.scan().')
    }
}
