export const TABS_FEATURE_ID = 'tabs'

export {
    createTabsDefinition,
    installTabs,
    TABS_COMPONENT,
    TABS_ROOT_SELECTOR,
} from './install-tabs.js'
export {
    collectTabLists,
    findTab,
    findTabList,
    findTabPanel,
    tabsInList,
    TAB_LIST_SELECTOR,
    TAB_SELECTOR,
} from './tab-elements.js'
export { readTabState, tabStateKey, writeTabState } from './tab-state.js'
export { activateTab, mountTabs } from './tabs.js'
