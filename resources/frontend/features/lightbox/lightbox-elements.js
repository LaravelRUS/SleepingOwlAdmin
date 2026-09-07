export const LIGHTBOX_TRIGGER_SELECTOR = '[data-lightbox], [data-toggle="lightbox"]'

export function findLightboxTrigger(root, target) {
    const trigger = target?.closest?.(LIGHTBOX_TRIGGER_SELECTOR)

    return trigger && root.contains(trigger) ? trigger : null
}

export function collectLightboxGallery(root, selected) {
    const group = selected.dataset.gallery
    const triggers = group ? groupedTriggers(root, group) : [selected]
    const items = triggers.map(readLightboxItem).filter(Boolean)
    const index = items.findIndex(({ trigger }) => trigger === selected)

    return {
        elements: items.map(({ element }) => element),
        index,
        triggers: items.map(({ trigger }) => trigger),
    }
}

function groupedTriggers(root, group) {
    return [...root.querySelectorAll(LIGHTBOX_TRIGGER_SELECTOR)].filter(
        (trigger) => trigger.dataset.gallery === group,
    )
}

function readLightboxItem(trigger) {
    const href = trigger.href || trigger.getAttribute('href')
    if (!href) return null

    return {
        element: {
            alt: trigger.querySelector('img')?.getAttribute('alt') ?? '',
            href,
            title: escapeLightboxText(trigger.dataset.title ?? trigger.getAttribute('title') ?? ''),
            type: 'image',
        },
        trigger,
    }
}

export function escapeLightboxText(value) {
    const entities = { '"': '&quot;', '&': '&amp;', "'": '&#039;', '<': '&lt;', '>': '&gt;' }

    return String(value).replace(/[&<>"']/g, (character) => entities[character])
}
