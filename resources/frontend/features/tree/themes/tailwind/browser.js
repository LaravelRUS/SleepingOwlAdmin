import { createTailwindTreeNotifications } from './notifications.js'

const TREE_SELECTOR = '[data-tree]'
const NOTIFICATION_SELECTOR = '[data-tree-notification]'

if (globalThis.document) installTailwindTreeNotifications(globalThis)

export function installTailwindTreeNotifications(target) {
    const root = requireEventTarget(target.document)
    const notifications = createTailwindTreeNotifications(notificationLabels(target.trans))
    const onChanged = (event) => notifications.success(notificationRegion(event))
    const onFailed = (event) => notifications.error(notificationRegion(event))

    root.addEventListener('tree:changed', onChanged)
    root.addEventListener('tree:failed', onFailed)

    return {
        destroy() {
            root.removeEventListener('tree:changed', onChanged)
            root.removeEventListener('tree:failed', onFailed)
        },
    }
}

function notificationRegion(event) {
    return event.target?.closest?.(TREE_SELECTOR)?.querySelector?.(NOTIFICATION_SELECTOR) ?? null
}

function notificationLabels(translate) {
    return {
        error: translated(translate, 'lang.table.error', 'Unable to save tree'),
        success: translated(translate, 'lang.tree.reorderCompleted', 'Tree order saved'),
    }
}

function translated(translate, key, fallback) {
    if (typeof translate !== 'function') return fallback

    const value = translate(key)

    return typeof value === 'string' && value !== key ? value : fallback
}

function requireEventTarget(root) {
    if (
        typeof root?.addEventListener !== 'function' ||
        typeof root?.removeEventListener !== 'function'
    ) {
        throw new TypeError('Tailwind tree notifications require a document event target.')
    }

    return root
}
