import { collectLightboxGallery, findLightboxTrigger } from './lightbox-elements.js'

export function mountLightbox(root, factory, options = {}) {
    assertDependencies(root, factory)
    const state = { active: null, factory, options, root }
    const click = (event) => handleLightboxClick(state, event)
    root.addEventListener('click', click)

    return {
        destroy: () => destroyLightbox(state, click),
    }
}

function handleLightboxClick(state, event) {
    if (!shouldOpenLightbox(event)) return

    const trigger = findLightboxTrigger(state.root, event.target)
    if (!trigger) return

    const gallery = collectLightboxGallery(state.root, trigger)
    if (gallery.index < 0) return

    event.preventDefault()
    openLightbox(state, trigger, gallery)
}

function openLightbox(state, trigger, gallery) {
    disposeActive(state)
    const instance = state.factory({
        ...state.options,
        elements: gallery.elements,
        selector: null,
        startAt: gallery.index,
    })
    assertInstance(instance)
    state.active = instance
    instance.on?.('open', () => dispatchLightboxEvent(trigger, 'lightbox:opened', gallery))
    instance.on?.('close', () => closeLightbox(state, instance, trigger, gallery))
    instance.openAt(gallery.index)
}

function closeLightbox(state, instance, trigger, gallery) {
    if (state.active !== instance) return

    state.active = null
    dispatchLightboxEvent(trigger, 'lightbox:closed', gallery)
    instance.destroy()
}

function disposeActive(state) {
    state.active?.destroy()
    state.active = null
}

function destroyLightbox(state, click) {
    state.root.removeEventListener('click', click)
    disposeActive(state)
}

function dispatchLightboxEvent(trigger, name, gallery) {
    trigger.dispatchEvent(
        new globalThis.CustomEvent(name, {
            bubbles: true,
            detail: { index: gallery.index, size: gallery.elements.length, trigger },
        }),
    )
}

function shouldOpenLightbox(event) {
    return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
    )
}

function assertDependencies(root, factory) {
    if (typeof root?.addEventListener !== 'function' || typeof root?.contains !== 'function') {
        throw new TypeError('Lightbox requires a DOM query root.')
    }
    if (typeof factory !== 'function') throw new TypeError('Lightbox requires a driver factory.')
}

function assertInstance(instance) {
    if (typeof instance?.openAt !== 'function' || typeof instance?.destroy !== 'function') {
        throw new TypeError('Lightbox driver must provide openAt() and destroy().')
    }
}
