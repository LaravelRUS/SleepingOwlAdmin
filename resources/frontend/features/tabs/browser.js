import { installTabs } from './install-tabs.js'

if (globalThis.document) bootTabs(globalThis)

export function bootTabs(target) {
    const { scan } = installTabs(target.Admin, {
        path: target.location?.pathname,
        root: target.document,
        stateEnabled: target.GlobalConfig?.state_tabs === true,
        storage: target.localStorage,
    })
    scan()
}
