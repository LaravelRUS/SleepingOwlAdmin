export const TABS_FEATURE_ID = 'tabs'

export {
    createTabsDefinition,
    installTabs,
    TABS_COMPONENT,
    TABS_ROOT_SELECTOR,
} from './install-tabs.js'
export {
    activateTab,
    collectTabLists,
    findTab,
    findTabList,
    findTabPanel,
    mountTabs,
    readTabState,
    tabsInList,
    tabStateKey,
    TAB_LIST_SELECTOR,
    TAB_SELECTOR,
    writeTabState,
} from './tabs.js'
