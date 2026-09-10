const INSTALLATION = Symbol.for('sleepingowl.shared.features.scroll-controls')
const SCROLL_END_TOLERANCE = 10

export function installScrollControls(target = globalThis) {
    if (target[INSTALLATION]) return target[INSTALLATION]

    const document = target.document
    if (!document) return null

    const scrollTop = document.getElementById('scrolltotop')
    const scrollBottom = document.getElementById('scrolltobottom')

    if (!scrollTop && !scrollBottom) return null

    const update = () => updateControls(target, scrollTop, scrollBottom)
    const toTop = (event) => scrollPage(target, event, 0)
    const toBottom = (event) => scrollPage(target, event, pageMetrics(target).height)

    listen(scrollTop, 'click', toTop)
    listen(scrollBottom, 'click', toBottom)
    target.addEventListener('scroll', update, { passive: true })

    const controls = createControls(target, scrollTop, scrollBottom, update, toTop, toBottom)
    target[INSTALLATION] = controls
    update()

    return controls
}

export function pageMetrics(target) {
    const document = target.document
    const root = scrollRoot(document)

    return {
        height: Math.max(
            elementHeight(root),
            elementHeight(document.documentElement),
            elementHeight(document.body),
        ),
        top: root ? root.scrollTop : target.pageYOffset || 0,
        viewport: firstPositive(
            target.innerHeight,
            root?.clientHeight,
            document.documentElement?.clientHeight,
        ),
    }
}

function updateControls(target, scrollTop, scrollBottom) {
    const metrics = pageMetrics(target)

    toggleClass(scrollTop, 'show', metrics.top > metrics.viewport)
    toggleClass(
        scrollBottom,
        'hide',
        metrics.top + metrics.viewport + SCROLL_END_TOLERANCE >= metrics.height,
    )
}

function scrollPage(target, event, top) {
    event?.preventDefault()

    if (typeof target.scrollTo === 'function') {
        target.scrollTo({ behavior: 'smooth', left: 0, top })
        return
    }

    const root = scrollRoot(target.document)
    if (root) root.scrollTop = top
}

function createControls(target, scrollTop, scrollBottom, update, toTop, toBottom) {
    return {
        update,
        destroy() {
            unlisten(scrollTop, 'click', toTop)
            unlisten(scrollBottom, 'click', toBottom)
            target.removeEventListener('scroll', update)
            delete target[INSTALLATION]
        },
    }
}

function scrollRoot(document) {
    return document.scrollingElement || document.documentElement || document.body
}

function elementHeight(element) {
    return element ? element.scrollHeight : 0
}

function firstPositive(...values) {
    return values.find((value) => value > 0) || 0
}

function toggleClass(element, name, enabled) {
    if (element) element.classList.toggle(name, enabled)
}

function listen(element, type, listener) {
    if (element) element.addEventListener(type, listener)
}

function unlisten(element, type, listener) {
    if (element) element.removeEventListener(type, listener)
}

if (globalThis.document) installScrollControls(globalThis)
