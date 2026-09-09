export function createDrawHook({ events, highlight, inlineEditor, lazyload, tooltips }) {
    assertHookDependencies(events, highlight, inlineEditor, lazyload, tooltips)

    return function drawHook() {
        events.fire('datatables::draw', this)
        inlineEditor()
        tooltips()
        lazyload()
        highlight(this)
    }
}

export function applyCreatedRowClass(row, data) {
    const metadata = Array.isArray(data) ? data.at(-1) : null
    const classes = metadata?.add_class?.trim().split(/\s+/).filter(Boolean) ?? []

    if (classes.length > 0) {
        row.classList.add(...classes)
    }
}

function assertHookDependencies(events, ...hooks) {
    if (typeof events?.fire !== 'function' || hooks.some((hook) => typeof hook !== 'function')) {
        throw new TypeError('Table draw hook requires an event bus and hook functions.')
    }
}
