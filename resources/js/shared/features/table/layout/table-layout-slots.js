const LAYOUT_HOST_SELECTOR = '[data-admin-datatables-layout-slots][data-datatables-id]'
const LAYOUT_SLOT_ATTRIBUTE = 'data-admin-datatables-layout-slot'
const LAYOUT_POSITION_PATTERN = /^(?:top|bottom)[1-9][0-9]*(?:Start|End)?$/u

export function configureTableLayoutSlots(table, options) {
    const slots = findTableLayoutSlots(table)
    if (slots.length === 0) return false

    const placements = slots.map((slot) => preservePlacement(table.ownerDocument, slot))
    const restore = once(() => restorePlacements(placements))

    options.layout = { ...options.layout }

    for (const placement of placements) {
        const feature = createTableLayoutSlotFeature(placement.slot, restore)
        const current = options.layout[placement.position]
        const features = Array.isArray(current) ? current : [current]

        options.layout[placement.position] = [...features.filter((item) => item != null), feature]
    }

    return true
}

export function createTableLayoutSlotFeature(slot, restore) {
    return (settings) => {
        settings.api.one('destroy.soaLayoutSlots', restore)

        return slot
    }
}

export function findTableLayoutSlots(table) {
    const id = table?.dataset?.id
    if (!id) return []

    const hosts = table.ownerDocument?.querySelectorAll?.(LAYOUT_HOST_SELECTOR) ?? []

    return [...hosts]
        .filter((host) => host.dataset.datatablesId === String(id))
        .flatMap((host) => [...(host.children ?? [])])
        .filter((slot) => {
            const position = slot.getAttribute?.(LAYOUT_SLOT_ATTRIBUTE)

            return position !== null && LAYOUT_POSITION_PATTERN.test(position)
        })
}

export function isTableLayoutPosition(position) {
    return typeof position === 'string' && LAYOUT_POSITION_PATTERN.test(position)
}

function preservePlacement(document, slot) {
    const placeholder = document.createComment(
        `SleepingOwl DataTables layout slot: ${slot.getAttribute(LAYOUT_SLOT_ATTRIBUTE)}`,
    )
    const parent = slot.parentNode

    parent.insertBefore(placeholder, slot)

    return {
        placeholder,
        position: slot.getAttribute(LAYOUT_SLOT_ATTRIBUTE),
        slot,
    }
}

function restorePlacements(placements) {
    for (const { placeholder, slot } of placements) {
        placeholder.parentNode?.replaceChild(slot, placeholder)
    }
}

function once(callback) {
    let called = false

    return () => {
        if (called) return

        called = true
        callback()
    }
}
