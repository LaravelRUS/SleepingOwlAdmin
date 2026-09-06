import GLightbox from 'glightbox'

import { mountLightbox } from './lightbox.js'

export const LIGHTBOX_COMPONENT = 'lightbox'
export const LIGHTBOX_ROOT_SELECTOR = 'body'

export function installLightboxes(admin, options = {}) {
    assertAdmin(admin)
    const definition = createLightboxDefinition(options)
    admin.Components.register(definition)
    const scan = (root = options.root ?? globalThis.document) => {
        return admin.Components.scan(root, LIGHTBOX_COMPONENT)
    }

    admin.Modules?.register?.('lightbox', () => scan())

    return { definition, scan }
}

export function createLightboxDefinition(options = {}) {
    return {
        mount: (body) =>
            mountLightbox(body.ownerDocument, options.factory ?? GLightbox, options.driverOptions),
        name: LIGHTBOX_COMPONENT,
        selector: LIGHTBOX_ROOT_SELECTOR,
    }
}

function assertAdmin(admin) {
    assertFunction(admin?.Components, 'register', 'Lightbox requires Admin.Components.')
    assertFunction(admin?.Components, 'scan', 'Lightbox requires Admin.Components.')
}

function assertFunction(object, method, message) {
    if (typeof object?.[method] !== 'function') throw new TypeError(message)
}
