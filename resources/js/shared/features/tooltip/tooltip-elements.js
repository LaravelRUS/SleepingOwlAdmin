export const TOOLTIP_TRIGGER_SELECTOR = '[data-bs-toggle="tooltip"], [data-toggle="tooltip"]'

const PLACEMENTS = new Set(['top', 'right', 'bottom', 'left'])

export function findTooltipTrigger(root, target) {
    const trigger = target?.closest?.(TOOLTIP_TRIGGER_SELECTOR)

    return trigger && root.contains(trigger) ? trigger : null
}

export function tooltipText(trigger) {
    const candidates = [trigger.getAttribute('title'), trigger.getAttribute('data-original-title')]

    return candidates.find((value) => value?.trim())?.trim() ?? ''
}

export function tooltipPlacement(trigger) {
    const placement = trigger.getAttribute('data-placement') ?? 'top'

    return PLACEMENTS.has(placement) ? placement : 'top'
}
