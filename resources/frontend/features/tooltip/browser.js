import { installTooltips } from './install-tooltips.js'

if (globalThis.document) bootTooltips(globalThis)

export function bootTooltips(target) {
    const tooltips = installTooltips(target.Admin, { root: target.document })
    target.Admin.Tooltips = tooltips
    tooltips.scan()
}
