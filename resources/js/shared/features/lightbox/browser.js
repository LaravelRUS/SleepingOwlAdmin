import { installLightboxes } from './install-lightboxes.js'

if (globalThis.document) bootLightboxes(globalThis)

export function bootLightboxes(target) {
    const lightboxes = installLightboxes(target.Admin, { root: target.document })
    target.Admin.Lightboxes = lightboxes
    lightboxes.scan()

    return lightboxes
}
