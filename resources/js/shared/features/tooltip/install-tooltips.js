import { mountTooltips } from './tooltips.js'

export const TOOLTIP_COMPONENT = 'tooltips'
export const TOOLTIP_ROOT_SELECTOR = 'body'

export function installTooltips(admin, options = {}) {
    assertAdmin(admin)
    let controller = null
    admin.Components.register({
        mount: (body) => {
            controller = mountTooltips(body)
            return { destroy: () => destroyController(controller) }
        },
        name: TOOLTIP_COMPONENT,
        selector: TOOLTIP_ROOT_SELECTOR,
    })

    return {
        hide: () => controller?.hide() ?? false,
        scan: (root = options.root ?? globalThis.document) => scan(admin, controller, root),
    }
}

function scan(admin, controller, root) {
    admin.Components.scan(root, TOOLTIP_COMPONENT)

    return controller?.scan(root) ?? 0
}

function destroyController(controller) {
    controller?.destroy()
}

function assertAdmin(admin) {
    if (typeof admin?.Components?.register !== 'function') {
        throw new TypeError('Tooltips require Admin.Components.')
    }
    if (typeof admin.Components.scan !== 'function') {
        throw new TypeError('Tooltips require Admin.Components.scan().')
    }
}
