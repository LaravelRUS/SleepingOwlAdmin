export const FILTER_CONTROLS_FEATURE = 'filterControls'

const FILTER_CONTAINER_SELECTOR =
    '.display-filters[data-display="DisplayDatatablesAsync"][data-datatables-id]'

export function installFilterControlsFeature(engine) {
    if (typeof engine?.feature?.register !== 'function') {
        throw new TypeError('Table filter controls require the DataTables feature registry.')
    }

    engine.feature.register(FILTER_CONTROLS_FEATURE, createFilterControlsFeature)
}

export function configureFilterControls(table, options) {
    if (findTableFilterControlRoots(table).length === 0) return false

    const current = options.layout?.top2End
    const features = Array.isArray(current) ? current : [current]

    options.layout = {
        ...options.layout,
        top2End: [...features.filter((feature) => feature != null), FILTER_CONTROLS_FEATURE],
    }

    return true
}

export function createFilterControlsFeature(settings) {
    const controls = findTableFilterControlRoots(settings.table)
    if (controls.length === 0) return null

    const document = settings.table.ownerDocument
    const placements = controls.map((control) => preservePlacement(document, control))
    const feature = controls.length === 1 ? controls[0] : wrapControls(document, controls)

    settings.api.one('destroy.soaFilterControls', () => restorePlacements(placements))

    return feature
}

export function findTableFilterControlRoots(table) {
    const id = String(table.dataset.id)
    const containers = table.ownerDocument?.querySelectorAll?.(FILTER_CONTAINER_SELECTOR) ?? []
    const controls = [...containers]
        .filter((container) => container.dataset.datatablesId === id)
        .map(findFilterControlRoot)
        .filter(Boolean)

    return [...new Set(controls)]
}

export function findFilterControlRoot(container) {
    const execute = container.querySelector?.('#filters-exec')
    if (!execute) return null

    return (
        execute.closest?.('.btn-group') ??
        execute.closest?.('[data-type="control"]') ??
        execute.parentElement ??
        execute
    )
}

function preservePlacement(document, control) {
    const placeholder = document.createComment('SleepingOwl DataTables filter controls')
    const parent = control.parentNode

    parent.insertBefore(placeholder, control)

    return { control, placeholder }
}

function wrapControls(document, controls) {
    const wrapper = document.createElement('div')

    wrapper.className = 'soa-dt-filter-controls'
    wrapper.append(...controls)

    return wrapper
}

function restorePlacements(placements) {
    for (const { control, placeholder } of placements) {
        placeholder.parentNode?.replaceChild(control, placeholder)
    }
}
