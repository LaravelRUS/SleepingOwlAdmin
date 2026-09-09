import { installDropdowns } from './install-dropdowns.js'

if (globalThis.document) bootDropdowns(globalThis)

export function bootDropdowns(target) {
    const dropdowns = installDropdowns(target.Admin, { root: target.document })
    target.Admin.Dropdowns = dropdowns
    dropdowns.scan()

    return dropdowns
}
