import { mountDropdowns } from './dropdowns.js'

export const DROPDOWN_COMPONENT = 'dropdowns'
export const DROPDOWN_ROOT_SELECTOR = 'body'

export function installDropdowns(admin, options = {}) {
    assertAdmin(admin)
    let controller = null
    admin.Components.register({
        mount: (body) => {
            controller = mountDropdowns(body)
            return { destroy: () => destroyController(controller) }
        },
        name: DROPDOWN_COMPONENT,
        selector: DROPDOWN_ROOT_SELECTOR,
    })

    return {
        close: (closeOptions) => controller?.close(closeOptions) ?? false,
        open: (toggle) => controller?.open(toggle) ?? false,
        scan: (root = options.root ?? globalThis.document) => scan(admin, controller, root),
        toggle: (toggle) => controller?.toggle(toggle) ?? false,
    }
}

function scan(admin, controller, root) {
    admin.Components.scan(root, DROPDOWN_COMPONENT)

    return controller?.scan(root) ?? 0
}

function destroyController(controller) {
    controller?.destroy()
}

function assertAdmin(admin) {
    if (typeof admin?.Components?.register !== 'function') {
        throw new TypeError('Dropdowns require Admin.Components.')
    }
    if (typeof admin.Components.scan !== 'function') {
        throw new TypeError('Dropdowns require Admin.Components.scan().')
    }
}
