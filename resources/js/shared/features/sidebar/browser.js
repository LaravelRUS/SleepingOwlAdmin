import { installSidebar } from './install-sidebar.js'

if (globalThis.document) bootSidebar(globalThis)

export function bootSidebar(target) {
    const sidebar = installSidebar(target.Admin, { root: target.document })
    target.Admin.Sidebar = sidebar
    sidebar.scan()

    return sidebar
}
