const TOOLTIP_TEMPLATE_SELECTOR = 'template[data-soa-tooltip-template]'
const TOOLTIP_POPUP_SELECTOR = '[data-soa-tooltip-popup]'
const TOOLTIP_CONTENT_SELECTOR = '[data-soa-tooltip-content]'

export function createTooltipElement(root, content, placement, id) {
    const tooltip = cloneTooltip(root) ?? createFallbackTooltip(root.ownerDocument)
    prepareTooltip(tooltip, content, placement, id)

    return tooltip
}

function cloneTooltip(root) {
    const template = root.querySelector?.(TOOLTIP_TEMPLATE_SELECTOR)
    const fragment = template?.content?.cloneNode?.(true)

    return fragment?.querySelector?.(TOOLTIP_POPUP_SELECTOR) ?? null
}

function createFallbackTooltip(document) {
    const tooltip = document.createElement('div')
    tooltip.dataset.soaTooltipPopup = ''

    return tooltip
}

function prepareTooltip(tooltip, content, placement, id) {
    tooltip.id = id
    tooltip.dataset.placement = placement
    tooltip.setAttribute('data-soa-tooltip-popup', '')
    tooltip.setAttribute('role', 'tooltip')
    findContentTarget(tooltip).textContent = content
}

function findContentTarget(tooltip) {
    if (tooltip.matches?.(TOOLTIP_CONTENT_SELECTOR)) return tooltip

    return tooltip.querySelector?.(TOOLTIP_CONTENT_SELECTOR) ?? tooltip
}
