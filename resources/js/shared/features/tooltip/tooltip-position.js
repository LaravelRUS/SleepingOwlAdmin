const VIEWPORT_MARGIN = 4
const TOOLTIP_GAP = 8
const OPPOSITE_PLACEMENT = { bottom: 'top', left: 'right', right: 'left', top: 'bottom' }
const PLACEMENT_FITS = {
    bottom: (trigger, tooltip, viewport) =>
        viewport.height - trigger.bottom >= tooltip.height + TOOLTIP_GAP,
    left: (trigger, tooltip) => trigger.left >= tooltip.width + TOOLTIP_GAP,
    right: (trigger, tooltip, viewport) =>
        viewport.width - trigger.right >= tooltip.width + TOOLTIP_GAP,
    top: (trigger, tooltip) => trigger.top >= tooltip.height + TOOLTIP_GAP,
}

export function tooltipPosition(triggerRect, tooltipRect, requestedPlacement, viewport) {
    const placement = fittingPlacement(triggerRect, tooltipRect, requestedPlacement, viewport)
    const position = positionFor(triggerRect, tooltipRect, placement)

    return {
        placement,
        x: clamp(position.x, VIEWPORT_MARGIN, viewport.width - tooltipRect.width - VIEWPORT_MARGIN),
        y: clamp(
            position.y,
            VIEWPORT_MARGIN,
            viewport.height - tooltipRect.height - VIEWPORT_MARGIN,
        ),
    }
}

function fittingPlacement(trigger, tooltip, requested, viewport) {
    const placement = PLACEMENT_FITS[requested] ? requested : 'top'

    return PLACEMENT_FITS[placement](trigger, tooltip, viewport)
        ? placement
        : OPPOSITE_PLACEMENT[placement]
}

function positionFor(trigger, tooltip, placement) {
    const horizontalCenter = trigger.left + (trigger.width - tooltip.width) / 2
    const verticalCenter = trigger.top + (trigger.height - tooltip.height) / 2

    if (placement === 'bottom') return { x: horizontalCenter, y: trigger.bottom + TOOLTIP_GAP }
    if (placement === 'left')
        return { x: trigger.left - tooltip.width - TOOLTIP_GAP, y: verticalCenter }
    if (placement === 'right') return { x: trigger.right + TOOLTIP_GAP, y: verticalCenter }

    return { x: horizontalCenter, y: trigger.top - tooltip.height - TOOLTIP_GAP }
}

function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), Math.max(minimum, maximum))
}
