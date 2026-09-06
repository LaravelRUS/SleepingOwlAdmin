import {
    findTooltipTrigger,
    tooltipPlacement,
    tooltipText,
    TOOLTIP_TRIGGER_SELECTOR,
} from './tooltip-elements.js'
import { tooltipPosition } from './tooltip-position.js'

const ROOT_EVENT_NAMES = ['focusin', 'focusout', 'keydown', 'pointerout', 'pointerover']

export function mountTooltips(root) {
    assertRoot(root)
    const state = createState(root)
    const listeners = bindTooltipListeners(state)

    return {
        destroy: () => destroyTooltips(state, listeners),
        hide: () => hideTooltip(state),
        scan: (container = root) => scanTooltips(state, container),
    }
}

function createState(root) {
    return { current: null, nextId: 1, root, window: root.ownerDocument.defaultView }
}

function bindTooltipListeners(state) {
    const listeners = {
        focusin: (event) => startTooltip(state, event.target, 'focus'),
        focusout: (event) => handleFocusOut(state, event),
        keydown: (event) => handleKeydown(state, event),
        pointerout: (event) => handlePointerOut(state, event),
        pointerover: (event) => handlePointerOver(state, event),
        reposition: () => repositionTooltip(state),
    }
    ROOT_EVENT_NAMES.forEach((name) => state.root.addEventListener(name, listeners[name]))
    state.window.addEventListener('resize', listeners.reposition)
    state.window.addEventListener('scroll', listeners.reposition, true)

    return listeners
}

function handlePointerOver(state, event) {
    const trigger = findTooltipTrigger(state.root, event.target)
    if (trigger && !trigger.contains(event.relatedTarget)) startTooltip(state, trigger, 'pointer')
}

function handleFocusOut(state, event) {
    const trigger = findTooltipTrigger(state.root, event.target)
    if (trigger && !trigger.contains(event.relatedTarget)) stopTooltip(state, trigger, 'focus')
}

function handlePointerOut(state, event) {
    const trigger = findTooltipTrigger(state.root, event.target)
    if (trigger && !trigger.contains(event.relatedTarget)) stopTooltip(state, trigger, 'pointer')
}

function handleKeydown(state, event) {
    if (event.key !== 'Escape' || !state.current) return

    const trigger = state.current.trigger
    hideTooltip(state)
    trigger.focus?.()
}

function startTooltip(state, target, reason) {
    const trigger = findTooltipTrigger(state.root, target)
    if (!trigger || isDisabled(trigger)) return false
    if (state.current?.trigger === trigger) {
        state.current.reasons.add(reason)
        return true
    }

    return showTooltip(state, trigger, reason)
}

function stopTooltip(state, target, reason) {
    const trigger = findTooltipTrigger(state.root, target)
    if (!trigger || state.current?.trigger !== trigger) return

    state.current.reasons.delete(reason)
    if (state.current.reasons.size === 0) hideTooltip(state)
}

function showTooltip(state, trigger, reason) {
    const content = tooltipText(trigger)
    if (!content) return false

    hideTooltip(state)
    const tooltip = createTooltip(state, content, tooltipPlacement(trigger))
    const current = createCurrent(trigger, tooltip, reason)
    state.current = current
    trigger.ownerDocument.body.append(tooltip)
    applyOpenState(current)
    repositionTooltip(state)
    dispatchTooltipEvent(current, 'tooltip:shown')

    return true
}

function createTooltip(state, content, placement) {
    const tooltip = state.root.ownerDocument.createElement('div')
    tooltip.id = `soa-tooltip-${state.nextId++}`
    tooltip.dataset.soaTooltipPopup = ''
    tooltip.dataset.placement = placement
    tooltip.setAttribute('role', 'tooltip')
    tooltip.textContent = content

    return tooltip
}

function createCurrent(trigger, tooltip, reason) {
    return {
        describedBy: trigger.getAttribute('aria-describedby'),
        placement: tooltipPlacement(trigger),
        reasons: new Set([reason]),
        title: trigger.hasAttribute('title') ? trigger.getAttribute('title') : null,
        tooltip,
        trigger,
    }
}

function applyOpenState(current) {
    current.trigger.removeAttribute('title')
    current.trigger.dataset.soaTooltipOpen = ''
    current.trigger.setAttribute(
        'aria-describedby',
        [current.describedBy, current.tooltip.id].filter(Boolean).join(' '),
    )
}

function repositionTooltip(state) {
    const current = state.current
    if (!current) return
    if (!current.trigger.isConnected) return hideTooltip(state)

    const position = tooltipPosition(
        current.trigger.getBoundingClientRect(),
        current.tooltip.getBoundingClientRect(),
        current.placement,
        { height: state.window.innerHeight, width: state.window.innerWidth },
    )
    current.tooltip.dataset.placement = position.placement
    current.tooltip.style.left = `${Math.round(position.x)}px`
    current.tooltip.style.top = `${Math.round(position.y)}px`
}

function hideTooltip(state) {
    const current = state.current
    if (!current) return false

    state.current = null
    restoreTrigger(current)
    current.tooltip.remove()
    dispatchTooltipEvent(current, 'tooltip:hidden')

    return true
}

function restoreTrigger(current) {
    delete current.trigger.dataset.soaTooltipOpen
    restoreAttribute(current.trigger, 'aria-describedby', current.describedBy)
    restoreAttribute(current.trigger, 'title', current.title)
}

function restoreAttribute(element, name, value) {
    if (value === null) element.removeAttribute(name)
    else element.setAttribute(name, value)
}

function dispatchTooltipEvent(current, name) {
    current.trigger.dispatchEvent(
        new current.trigger.ownerDocument.defaultView.CustomEvent(name, {
            bubbles: true,
            detail: { tooltip: current.tooltip, trigger: current.trigger },
        }),
    )
}

function scanTooltips(state, container) {
    if (state.current && !state.current.trigger.isConnected) hideTooltip(state)

    return matchingTooltipCount(container)
}

function matchingTooltipCount(container) {
    const descendants = container.querySelectorAll?.(TOOLTIP_TRIGGER_SELECTOR)?.length ?? 0

    return descendants + (container.matches?.(TOOLTIP_TRIGGER_SELECTOR) ? 1 : 0)
}

function isDisabled(trigger) {
    return trigger.hasAttribute('disabled') || trigger.getAttribute('aria-disabled') === 'true'
}

function destroyTooltips(state, listeners) {
    hideTooltip(state)
    ROOT_EVENT_NAMES.forEach((name) => state.root.removeEventListener(name, listeners[name]))
    state.window.removeEventListener('resize', listeners.reposition)
    state.window.removeEventListener('scroll', listeners.reposition, true)
}

function assertRoot(root) {
    if (typeof root?.addEventListener !== 'function' || !root.ownerDocument) {
        throw new TypeError('Tooltips require a DOM root.')
    }
}
