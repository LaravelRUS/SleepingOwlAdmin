export const PAGE_JUMP_FEATURE = 'pageJump'

const DEFAULT_LABELS = Object.freeze({ label: 'Page' })

export function installPageJumpFeature(engine, options = {}) {
    if (typeof engine?.feature?.register !== 'function') {
        throw new TypeError('DataTables page jump requires the engine feature registry.')
    }

    const labels = { ...DEFAULT_LABELS, ...options.labels }
    engine.feature.register(PAGE_JUMP_FEATURE, (settings) =>
        createPageJumpControl(settings, labels),
    )
}

export function createPageJumpControl(settings, labels = DEFAULT_LABELS) {
    const document = settings.table.ownerDocument
    const api = settings.api
    const { control, input } = createPageJumpElements(document, labels.label)
    const sync = () => syncPageJump(api, control, input)
    const jump = () => jumpToPage(api, input, sync)

    bindPageJumpInput(input, jump)
    api.on('draw.soaPageJump', sync)
    api.one('destroy.soaPageJump', () => api.off('.soaPageJump'))
    sync()

    return control
}

function createPageJumpElements(document, label) {
    const control = document.createElement('label')
    const input = document.createElement('input')

    control.className = 'soa-dt-page-jump'
    control.hidden = true
    control.append(document.createTextNode(label), input)

    input.className = 'soa-dt-page-jump-input'
    input.type = 'number'
    input.min = '1'
    input.step = '1'
    input.inputMode = 'numeric'
    input.autocomplete = 'off'
    input.setAttribute('aria-label', label)

    return { control, input }
}

function syncPageJump(api, control, input) {
    const info = api.page.info()

    control.hidden = info.pages <= 1
    input.disabled = info.pages <= 1
    input.max = String(Math.max(info.pages, 1))
    input.value = info.pages > 0 ? String(info.page + 1) : ''
}

function jumpToPage(api, input, sync) {
    const info = api.page.info()
    const requestedPage = Number.parseInt(input.value, 10)

    if (!Number.isFinite(requestedPage) || info.pages === 0) return sync()

    const page = Math.min(Math.max(requestedPage, 1), info.pages) - 1
    if (page === info.page) {
        sync()
        return
    }

    api.page(page).draw('page')
}

function bindPageJumpInput(input, jump) {
    input.addEventListener('change', jump)
    input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return

        event.preventDefault()
        jump()
    })
}
