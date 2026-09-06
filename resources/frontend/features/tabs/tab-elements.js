export const TAB_SELECTOR = '[data-soa-tab], [data-toggle="tab"]'
export const TAB_LIST_SELECTOR = '[data-soa-tablist], [role="tablist"]'

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
