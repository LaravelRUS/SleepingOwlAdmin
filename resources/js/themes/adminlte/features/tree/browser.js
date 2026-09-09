import { createLegacyTreeNotifications } from './notifications.js'

if (globalThis.document) installLegacyTreeNotifications(globalThis)

export function installLegacyTreeNotifications(target) {
    const root = requireEventTarget(target.document)
    const notifications = createLegacyTreeNotifications(
        target.Swal,
        target.Admin?.Messages,
        notificationLabels(target.trans),
    )
    const onChanged = () => notifications.success()
    const onFailed = (event) => notifications.error(event.detail?.error)

    root.addEventListener('tree:changed', onChanged)
    root.addEventListener('tree:failed', onFailed)

    return {
        destroy: () => removeListeners(root, { onChanged, onFailed }),
    }
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

function removeListeners(root, listeners) {
    root.removeEventListener('tree:changed', listeners.onChanged)
    root.removeEventListener('tree:failed', listeners.onFailed)
}

function requireEventTarget(root) {
    if (
        typeof root?.addEventListener !== 'function' ||
        typeof root?.removeEventListener !== 'function'
    ) {
        throw new TypeError('Legacy tree notifications require a document event target.')
    }

    return root
}
