export const TAB_SELECTOR = '[data-tab], [data-bs-toggle="tab"], [data-toggle="tab"]'
export const TAB_LIST_SELECTOR = '[data-tablist], [role="tablist"]'

export function findTab(root, target) {
    const tab = target?.closest?.(TAB_SELECTOR)

    return tab && root.contains(tab) ? tab : null
}

export function findTabList(tab) {
    return tab?.closest?.(TAB_LIST_SELECTOR) ?? null
}

export function tabsInList(tabList) {
    return [...tabList.querySelectorAll(TAB_SELECTOR)].filter((tab) => findTabList(tab) === tabList)
}

export function findTabPanel(tab) {
    const id = tabTargetId(tab)

    return id ? tab.ownerDocument.getElementById(id) : null
}

export function collectTabLists(root) {
    const lists = [...root.querySelectorAll(TAB_LIST_SELECTOR)]
    if (typeof root.matches === 'function' && root.matches(TAB_LIST_SELECTOR)) lists.unshift(root)

    return lists.filter((list) => tabsInList(list).length > 0)
}

export function tabTargetId(tab) {
    const controlled = tab.getAttribute('aria-controls')?.trim()
    if (controlled) return controlled

    const href = tab.getAttribute('href') ?? ''
    if (href.startsWith('#')) return href.slice(1)

    return sameDocumentHash(tab.ownerDocument, href)
}

function sameDocumentHash(document, href) {
    if (!href || !document?.defaultView) return ''

    try {
        const target = new document.defaultView.URL(href, document.baseURI)
        const current = document.defaultView.location
        if (target.origin !== current.origin || target.pathname !== current.pathname) return ''
        if (target.search !== current.search) return ''

        return target.hash.slice(1)
    } catch {
        return ''
    }
}

export function tabStateKey(pathname = '/') {
    const normalized = normalizeEditPath(pathname)

    return `Tabbed_${normalized}`
}

export function readTabState(storage, key) {
    if (!storage || !key) return {}

    try {
        const value = JSON.parse(storage.getItem(key) ?? '{}')

        return isRecord(value) ? value : {}
    } catch {
        return {}
    }
}

export function writeTabState(storage, key, state) {
    if (!storage || !key) return false

    try {
        storage.setItem(key, JSON.stringify(state))
        return true
    } catch {
        return false
    }
}

function normalizeEditPath(pathname) {
    const path = typeof pathname === 'string' && pathname ? pathname : '/'

    return path.search('edit') > 0 ? path.replace(/\d+\/edit$/, '') + 'edit' : path
}

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function mountTabs(root, options = {}) {
    assertRoot(root)
    const state = createTabsState(root, options)
    const click = (event) => handleClick(state, event)
    const keydown = (event) => handleKeydown(state, event)
    root.addEventListener('click', click)
    root.addEventListener('keydown', keydown)
    initializeTabs(state)

    return { destroy: () => destroyTabs(state, click, keydown) }
}

export function activateTab(tab, options = {}) {
    const tabList = findTabList(tab)
    const panel = findTabPanel(tab)
    if (!tabList || !panel || isDisabled(tab)) return false

    const previousTab = activeTab(tabList)
    const previousPanel = previousTab ? findTabPanel(previousTab) : null
    if (previousTab === tab) return false

    tabList.setAttribute('role', 'tablist')
    tabsInList(tabList).forEach((item) => setTabActive(item, findTabPanel(item), item === tab))
    publishChange(options.events, previousTab, previousPanel, tab, panel)

    return true
}

function createTabsState(root, options) {
    const stateEnabled = options.stateEnabled === true

    return {
        events: options.events,
        root,
        stateKey: stateEnabled ? tabStateKey(options.path) : null,
        storage: options.storage,
    }
}

function initializeTabs(state) {
    const lists = collectTabLists(state.root)
    lists.forEach(normalizeTabList)
    restoreTabState(state, lists)
}

function normalizeTabList(tabList) {
    const tabs = tabsInList(tabList)
    const selected = activeTab(tabList) ?? tabs[0]

    tabList.setAttribute('role', 'tablist')
    tabs.forEach((tab) => setTabActive(tab, findTabPanel(tab), tab === selected))
}

function restoreTabState(state, lists) {
    const stored = readTabState(state.storage, state.stateKey)
    Object.entries(stored).forEach(([index, target]) => {
        const list = lists[Number(index)]
        if (!list) return

        const tab = tabsInList(list).find((candidate) => tabTargetId(candidate) === target)
        if (tab) activateAndStore(state, tab)
    })
}

function handleClick(state, event) {
    if (!isPlainPrimaryClick(event)) return

    const tab = findTab(state.root, event.target)
    if (!tab || isDisabled(tab)) return

    event.preventDefault()
    event.stopPropagation()
    activateAndStore(state, tab)
}

function handleKeydown(state, event) {
    const tab = findTab(state.root, event.target)
    const tabList = tab && findTabList(tab)
    if (!tabList) return

    const target = keyboardTarget(tabsInList(tabList), tab, event.key)
    if (!target) return

    event.preventDefault()
    event.stopPropagation()
    target.focus()
    activateAndStore(state, target)
}

function activateAndStore(state, tab) {
    if (!activateTab(tab, { events: state.events })) return false

    persistTabState(state)
    return true
}

function persistTabState(state) {
    if (!state.stateKey) return

    const selected = Object.fromEntries(
        collectTabLists(state.root).map((list, index) => [
            index,
            tabTargetId(activeTab(list) ?? tabsInList(list)[0]),
        ]),
    )
    writeTabState(state.storage, state.stateKey, selected)
}

function activeTab(tabList) {
    return tabsInList(tabList).find(
        (tab) =>
            tab.getAttribute('aria-selected') === 'true' ||
            tab.classList.contains('active') ||
            tab.parentElement?.classList.contains('active'),
    )
}

function setTabActive(tab, panel, active) {
    tab.classList.toggle('active', active)
    if (tab.parentElement?.matches('li')) tab.parentElement.classList.toggle('active', active)
    tab.setAttribute('aria-selected', String(active))
    tab.setAttribute('role', 'tab')
    tab.tabIndex = active ? 0 : -1
    if (!panel) return

    panel.setAttribute('role', 'tabpanel')
    if (tab.id) panel.setAttribute('aria-labelledby', tab.id)
    panel.classList.toggle('active', active)
    panel.classList.toggle('show', active)
    panel.classList.toggle('in', active)
    panel.hidden = !active
}

function publishChange(events, previousTab, previousPanel, tab, panel) {
    if (previousTab) {
        dispatchTabEvent(previousTab, 'tab:hidden', previousPanel, tab)
        events?.fire?.('bootstrap::tab::hidden', tabTargetId(previousTab))
    }
    dispatchTabEvent(tab, 'tab:shown', panel, previousTab)
    events?.fire?.('bootstrap::tab::shown', tabTargetId(tab))
}

function dispatchTabEvent(tab, name, panel, relatedTab) {
    tab.dispatchEvent(
        new tab.ownerDocument.defaultView.CustomEvent(name, {
            bubbles: true,
            detail: { panel, relatedTab, tab },
        }),
    )
}

function keyboardTarget(tabs, current, key) {
    const enabled = tabs.filter((tab) => !isDisabled(tab))
    const index = enabled.indexOf(current)
    if (index < 0) return null
    if (key === 'Home') return enabled[0]
    if (key === 'End') return enabled.at(-1)
    if (key === 'ArrowRight' || key === 'ArrowDown') return enabled[(index + 1) % enabled.length]
    if (key === 'ArrowLeft' || key === 'ArrowUp')
        return enabled[(index - 1 + enabled.length) % enabled.length]

    return null
}

function isDisabled(tab) {
    return tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true'
}

function isPlainPrimaryClick(event) {
    return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
    )
}

function destroyTabs(state, click, keydown) {
    state.root.removeEventListener('click', click)
    state.root.removeEventListener('keydown', keydown)
}

function assertRoot(root) {
    if (typeof root?.addEventListener !== 'function' || typeof root?.contains !== 'function') {
        throw new TypeError('Tabs require a DOM query root.')
    }
}
